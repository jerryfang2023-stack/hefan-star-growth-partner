const fs = require('fs');
const path = require('path');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.resolve(__dirname, '../../.env'));
loadEnvFile(path.resolve(process.cwd(), '.env'));

function intEnv(name, fallback) {
  const value = process.env[name];
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid integer env var: ${name}`);
  }

  return parsed;
}

function boolEnv(name, fallback) {
  const value = process.env[name];
  if (!value) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function listEnv(name) {
  const value = process.env[name] || '';
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function projectPathEnv(name, fallback) {
  const value = process.env[name] || fallback;
  return path.isAbsolute(value) ? value : path.resolve(__dirname, '../..', value);
}

const blockedHermesTools = new Set([
  'terminal',
  'shell',
  'filesystem',
  'file_system',
  'browser',
  'web_browser',
  'arbitrary_web',
]);

const allowedHermesTools = listEnv('HERMES_ALLOWED_TOOLS').filter(
  (tool) => !blockedHermesTools.has(tool.toLowerCase())
);

const config = {
  port: intEnv('PORT', 3001),
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: listEnv('ALLOWED_ORIGINS'),
  dailyLimitMinutes: intEnv('DEFAULT_DAILY_LIMIT_MINUTES', 25),
  hermes: {
    mock: boolEnv('HERMES_MOCK', true),
    apiMode: process.env.HERMES_API_MODE || 'chat',
    apiUrl: process.env.HERMES_API_URL || '',
    apiKey: process.env.HERMES_API_KEY || '',
    agentId: process.env.HERMES_AGENT_ID || '',
    model: process.env.HERMES_MODEL || 'learning-coach',
    projectSoulPath: projectPathEnv(
      'HERMES_PROJECT_SOUL_PATH',
      'server/prompts/star-growth-soul.md'
    ),
    allowedTools: allowedHermesTools,
    timeoutMs: intEnv('HERMES_TIMEOUT_MS', 15000),
    localCli: {
      command: process.env.HERMES_LOCAL_CLI_COMMAND || 'hermes',
      model: process.env.HERMES_LOCAL_CLI_MODEL || '',
      provider: process.env.HERMES_LOCAL_CLI_PROVIDER || '',
      toolsets: process.env.HERMES_LOCAL_CLI_TOOLSETS || 'clarify',
      timeoutMs: intEnv('HERMES_LOCAL_CLI_TIMEOUT_MS', 60000),
    },
  },
};

if (!['chat', 'agent', 'local-cli'].includes(config.hermes.apiMode)) {
  throw new Error('HERMES_API_MODE must be chat, agent, or local-cli');
}

if (
  !config.hermes.mock &&
  config.hermes.apiMode !== 'local-cli' &&
  (!config.hermes.apiUrl || !config.hermes.apiKey)
) {
  throw new Error('HERMES_API_URL and HERMES_API_KEY are required when HERMES_MOCK=false');
}

if (!config.hermes.mock && config.hermes.apiMode === 'agent' && !config.hermes.agentId) {
  throw new Error('HERMES_AGENT_ID is required when HERMES_API_MODE=agent');
}

module.exports = { config };
