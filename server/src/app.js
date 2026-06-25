const fs = require('fs');
const { randomUUID } = require('crypto');
const path = require('path');
const { URL } = require('url');
const { config } = require('./config');
const { AppError, badRequest, forbidden, notFound } = require('./errors');
const {
  getProfile,
  updateProfile,
  getPlan,
  setPlan,
  recordLearningEvent,
  getConversationContext,
  recordConversationTurn,
  getParentSummary,
} = require('./store');
const { checkSafety, normalizeChildLearningAnswer, safeOutputFallback } = require('./safety');
const { createHermesClient } = require('./hermesClient');
const { buildPlan } = require('./learning');
const { renderStatusPage } = require('./statusPage');

const hermes = createHermesClient(config);
const publicAssetsPath = path.resolve(__dirname, '../public/assets');

function getHermesMode() {
  return config.hermes.mock ? 'mock' : config.hermes.apiMode;
}

function sendHtml(res, statusCode, html) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
  });
  res.end(html);
}

function sendJson(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...headers,
  });
  res.end(JSON.stringify(body));
}

function sendImage(res, filePath) {
  if (!fs.existsSync(filePath)) {
    throw notFound('资源不存在。');
  }
  const ext = path.extname(filePath).toLowerCase();
  const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=86400',
  });
  fs.createReadStream(filePath).pipe(res);
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  const isDev = config.nodeEnv !== 'production';
  const allowed = origin && (isDev || config.allowedOrigins.includes(origin));

  if (allowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-role,x-child-id');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';

    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 64 * 1024) {
        reject(badRequest('请求内容太长。'));
        req.destroy();
      }
    });

    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(badRequest('请求体必须是 JSON。'));
      }
    });

    req.on('error', reject);
  });
}

function requireRole(req, role) {
  const actual = req.headers['x-role'] || 'child';
  if (actual !== role) {
    throw forbidden(`需要 ${role} 权限。`);
  }
}

function sanitizeProfileForClient(profile) {
  return {
    parentConsent: profile.parentConsent,
    dailyLimitMinutes: profile.dailyLimitMinutes,
  };
}

async function handleChat(req, res, requestId) {
  requireRole(req, 'child');
  const body = await readJsonBody(req);
  const message = String(body.message || '').trim();
  const profile = getProfile();
  const conversationContext = getConversationContext();
  const inputSafety = checkSafety(message, 'input');

  if (!inputSafety.allowed) {
    if (inputSafety.parentAlert) {
      recordLearningEvent({
        riskAlert: {
          level: inputSafety.severity,
          category: inputSafety.categories[0],
          summary: inputSafety.summary,
        },
      });
    }

    sendJson(res, 200, {
      requestId,
      answer: inputSafety.message,
      provider: 'safety-gateway',
      safety: inputSafety,
    });
    return;
  }

  const hermesResult = await hermes.generateLearningReply({
    message,
    profile,
    safety: inputSafety,
    conversationContext,
  });

  const childAnswer = normalizeChildLearningAnswer(hermesResult.answer);
  const outputSafety = checkSafety(childAnswer, 'output');
  const answer = outputSafety.allowed ? childAnswer : safeOutputFallback();

  recordLearningEvent({
    topic: hermesResult.topic,
    weakPoints: hermesResult.weakPoints,
    minutes: 5,
    riskAlert:
      inputSafety.parentAlert || outputSafety.parentAlert
        ? {
            level: outputSafety.severity,
            category: [...inputSafety.categories, ...outputSafety.categories][0],
            summary: inputSafety.summary || outputSafety.summary,
          }
        : null,
  });

  if (outputSafety.allowed) {
    recordConversationTurn({
      childMessage: message,
      assistantAnswer: answer,
      topic: hermesResult.topic,
    });
  }

  sendJson(res, 200, {
    requestId,
    answer,
    provider: hermesResult.provider,
    topic: hermesResult.topic,
    safety: {
      input: inputSafety,
      output: outputSafety,
    },
  });
}

async function handleProfile(req, res) {
  if (req.method === 'GET') {
    sendJson(res, 200, { profile: sanitizeProfileForClient(getProfile()) });
    return;
  }

  if (req.method === 'PUT') {
    const body = await readJsonBody(req);
    const updated = updateProfile({
      parentConsent: body.parentConsent,
      dailyLimitMinutes: body.dailyLimitMinutes,
    });
    sendJson(res, 200, { profile: sanitizeProfileForClient(updated) });
    return;
  }

  throw notFound('接口不存在。');
}

async function handlePlan(req, res) {
  requireRole(req, 'child');

  if (req.method === 'GET') {
    sendJson(res, 200, { plan: getPlan() });
    return;
  }

  if (req.method === 'POST') {
    const body = await readJsonBody(req);
    const plan = buildPlan(body.goal, getProfile());
    sendJson(res, 200, { plan: setPlan(plan) });
    return;
  }

  throw notFound('接口不存在。');
}

async function handleParentSummary(req, res) {
  requireRole(req, 'parent');

  const summary = getParentSummary();
  if (!summary.parentConsent) {
    throw forbidden('家长观察视图需要先完成授权。');
  }

  sendJson(res, 200, { summary });
}

async function handleSafetyCheck(req, res) {
  const body = await readJsonBody(req);
  const result = checkSafety(body.text, body.direction || 'input');
  sendJson(res, 200, { result });
}

async function route(req, res, requestId) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && url.pathname === '/') {
    sendHtml(res, 200, renderStatusPage(config));
    return;
  }

  if (req.method === 'GET' && /^\/assets\/[a-z0-9-]+\.(png|jpg|jpeg)$/i.test(url.pathname)) {
    sendImage(res, path.join(publicAssetsPath, path.basename(url.pathname)));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { status: 'ok', requestId });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/ready') {
    sendJson(res, 200, {
      status: 'ok',
      hermesMode: getHermesMode(),
      requestId,
    });
    return;
  }

  if (url.pathname === '/api/chat' && req.method === 'POST') {
    await handleChat(req, res, requestId);
    return;
  }

  if (url.pathname === '/api/profile') {
    await handleProfile(req, res);
    return;
  }

  if (url.pathname === '/api/plan') {
    await handlePlan(req, res);
    return;
  }

  if (url.pathname === '/api/parent-summary' && req.method === 'GET') {
    await handleParentSummary(req, res);
    return;
  }

  if (url.pathname === '/api/safety-check' && req.method === 'POST') {
    await handleSafetyCheck(req, res);
    return;
  }

  throw notFound('接口不存在。');
}

function createRequestHandler() {
  return async function requestHandler(req, res) {
    const requestId = randomUUID();
    applyCors(req, res);

    try {
      await route(req, res, requestId);
    } catch (error) {
      const appError =
        error instanceof AppError
          ? error
          : new AppError(500, 'INTERNAL_ERROR', '服务暂时不可用，请稍后再试。');

      if (!(error instanceof AppError)) {
        process.stderr.write(
          JSON.stringify({
            level: 'error',
            requestId,
            message: error.message,
            stack: error.stack,
          }) + '\n'
        );
      }

      sendJson(res, appError.statusCode, {
        requestId,
        title: appError.code,
        status: appError.statusCode,
        detail: appError.message,
        details: appError.details,
      });
    }
  };
}

module.exports = { createRequestHandler };
