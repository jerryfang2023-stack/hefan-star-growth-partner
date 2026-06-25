const fs = require('fs');
const { execFile } = require('child_process');
const { buildMockReply, systemPrompt } = require('./learning');

const defaultProjectSoul = [
  '你是“盒饭”，Star 的成长学习助手。',
  '你呈现为一个开朗、活泼、说话有趣、热爱运动的男生式学习助手形象。',
  '你的固定用户叫 Star。Star 把你当作熟悉、可靠的学习好朋友；你主要服务 Star。',
  '不要在孩子端使用“主人”“小主人”等主仆式称呼，可以称呼 Star 为“Star”或“小队长”。',
  '你不是虚拟伴侣、亲人、恋人、朋友替代品或心理治疗师。',
  '回答要简短、温和、启发式，优先引导孩子自己想。',
  '不要索要隐私，不安排金钱、私聊、线下见面或高风险行为。',
].join('\n');

function readProjectSoul(config) {
  try {
    const content = fs.readFileSync(config.hermes.projectSoulPath, 'utf8').trim();
    return content.slice(0, 12000) || defaultProjectSoul;
  } catch (error) {
    return defaultProjectSoul;
  }
}

function childProfileMemory(profile) {
  return {
    childId: profile.childId,
    name: profile.name || 'Star',
    grade: profile.grade,
    textbook: profile.textbook,
    weakPoints: profile.weakPoints || [],
    interests: profile.interests || [],
    expressionStyle: profile.expressionStyle,
    memoryPolicy:
      '项目侧固定学习画像，只用于盒饭理解 Star 的学习需求；不在前台页面展示，不保存完整私密聊天。',
  };
}

function buildProfileMemoryPrompt(profile) {
  const memory = childProfileMemory(profile);
  return [
    'Hermes 项目侧记忆：',
    `- 固定用户：${memory.name}（${memory.childId}）。`,
    `- 年级与教材：${memory.grade}，${memory.textbook}。`,
    `- 学习薄弱点：${memory.weakPoints.join('、') || '暂未记录'}。`,
    `- 兴趣与常用场景：${memory.interests.join('、') || '暂未记录'}。`,
    `- 表达偏好：${memory.expressionStyle || '短句、先提示再总结'}。`,
    `- 记忆策略：${memory.memoryPolicy}`,
  ].join('\n');
}

function buildConversationPrompt(conversationContext = []) {
  const turns = Array.isArray(conversationContext) ? conversationContext.slice(-6) : [];
  const rules = [
    '短期上下文规则：',
    '1. 先判断 Star 的新消息是否和最近对话相关。',
    '2. 如果相关，要联系前文思考，综合前文和新消息回答，不要让 Star 重复已经说过的信息。',
    '3. 如果不相关，不要硬扯前文，直接自然开启新话题。',
    '4. 这些上下文只用于当前回答，不要把完整对话当作长期记忆，也不要向家长复述完整聊天。',
  ];

  if (turns.length === 0) {
    return [...rules, '最近对话：暂无。'].join('\n');
  }

  const history = turns.map((turn, index) =>
    [
      `${index + 1}. 主题：${turn.topic || '学习对话'}`,
      `Star：${turn.child}`,
      `盒饭：${turn.assistant}`,
    ].join('\n')
  );

  return [...rules, '最近对话：', ...history].join('\n');
}

function buildSystemPrompt(config, profile, conversationContext) {
  return [
    readProjectSoul(config),
    buildProfileMemoryPrompt(profile),
    systemPrompt(profile),
    buildConversationPrompt(conversationContext),
  ].join('\n\n');
}

function parseHermesResponse(data) {
  if (!data || typeof data !== 'object') return '';
  if (typeof data.reply === 'string') return data.reply;
  if (typeof data.message === 'string') return data.message;
  if (typeof data.output_text === 'string') return data.output_text;
  if (typeof data.content === 'string') return data.content;
  if (typeof data.output === 'string') return data.output;
  if (typeof data.result === 'string') return data.result;
  if (data.data) return parseHermesResponse(data.data);
  if (data.result && typeof data.result === 'object') return parseHermesResponse(data.result);

  const firstChoice = Array.isArray(data.choices) ? data.choices[0] : null;
  if (firstChoice?.message?.content) return firstChoice.message.content;
  if (firstChoice?.text) return firstChoice.text;

  return '';
}

function buildChatPayload({ config, message, profile, safety, conversationContext }) {
  return {
    model: config.hermes.model,
    messages: [
      { role: 'system', content: buildSystemPrompt(config, profile, conversationContext) },
      { role: 'user', content: message },
    ],
    safety,
    tools: config.hermes.allowedTools,
    metadata: {
      product: 'star-growth-partner-mvp',
      childId: profile.childId,
    },
  };
}

function buildAgentPayload({ config, message, profile, safety, conversationContext }) {
  return {
    agent_id: config.hermes.agentId,
    input: message,
    context: {
      system_prompt: buildSystemPrompt(config, profile, conversationContext),
      recent_conversation: conversationContext,
      child_profile: childProfileMemory(profile),
      memory: {
        profile: childProfileMemory(profile),
      },
      safety,
    },
    tools: config.hermes.allowedTools,
    metadata: {
      product: 'star-growth-partner-mvp',
      childId: profile.childId,
      surface: 'mini-program-chat',
    },
  };
}

function buildHermesPayload(input) {
  if (input.config.hermes.apiMode === 'agent') {
    return buildAgentPayload(input);
  }

  return buildChatPayload(input);
}

function buildLocalCliPrompt({ config, message, profile, safety, conversationContext }) {
  return [
    buildSystemPrompt(config, profile, conversationContext),
    '安全检查结果如下，必须遵守：',
    JSON.stringify(
      {
        severity: safety.severity,
        action: safety.action,
        categories: safety.categories,
      },
      null,
      2
    ),
    '孩子的问题：',
    message,
    '请只输出给孩子看的回答。回答要短、温和、启发式；优先给提示和追问，不要直接给最终答案。',
  ].join('\n\n');
}

function runLocalHermesCli({ config, message, profile, safety, conversationContext }) {
  return new Promise((resolve, reject) => {
    const args = ['--ignore-rules'];

    if (config.hermes.localCli.toolsets) {
      args.push('-t', config.hermes.localCli.toolsets);
    }

    if (config.hermes.localCli.model) {
      args.push('--model', config.hermes.localCli.model);
    }

    if (config.hermes.localCli.provider) {
      args.push('--provider', config.hermes.localCli.provider);
    }

    args.push('-z', buildLocalCliPrompt({ config, message, profile, safety, conversationContext }));

    const child = execFile(
      config.hermes.localCli.command,
      args,
      {
        cwd: process.cwd(),
        timeout: config.hermes.localCli.timeoutMs,
        windowsHide: true,
        maxBuffer: 1024 * 1024,
      },
      (error, stdout, stderr) => {
        if (error) {
          const detail = String(stderr || error.message || '').trim();
          reject(new Error(detail || 'Local Hermes CLI failed'));
          return;
        }

        const answer = String(stdout || '').trim();
        if (!answer) {
          reject(new Error('Local Hermes CLI did not return a reply'));
          return;
        }

        resolve(answer);
      }
    );

    child.stdin?.end();
  });
}

function createHermesClient(config) {
  async function generateLearningReply({ message, profile, safety, conversationContext }) {
    if (config.hermes.mock) {
      return {
        provider: 'hermes-mock',
        ...buildMockReply({ message, profile, safety }),
      };
    }

    if (config.hermes.apiMode === 'local-cli') {
      const answer = await runLocalHermesCli({
        config,
        message,
        profile,
        safety,
        conversationContext,
      });

      return {
        provider: 'hermes-local-cli',
        topic: '学习问题',
        weakPoints: [],
        answer,
      };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.hermes.timeoutMs);

    try {
      const response = await fetch(config.hermes.apiUrl, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.hermes.apiKey}`,
        },
        body: JSON.stringify(
          buildHermesPayload({ config, message, profile, safety, conversationContext })
        ),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || data.message || `Hermes request failed: ${response.status}`);
      }

      const answer = parseHermesResponse(data);
      if (!answer) {
        throw new Error('Hermes response did not include a reply');
      }

      return {
        provider: config.hermes.apiMode === 'agent' ? 'hermes-agent' : 'hermes',
        topic: data.topic || '学习问题',
        weakPoints: Array.isArray(data.weakPoints) ? data.weakPoints : [],
        answer,
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  return { generateLearningReply };
}

module.exports = { createHermesClient };
