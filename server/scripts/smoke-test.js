process.env.HERMES_MOCK = process.env.HERMES_MOCK || 'true';
process.env.PORT = process.env.PORT || '3101';

const http = require('http');
const { createRequestHandler } = require('../src/app');

const port = Number.parseInt(process.env.PORT, 10);
const baseUrl = `http://127.0.0.1:${port}`;

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${path} failed: ${response.status} ${JSON.stringify(body)}`);
  }

  return body;
}

async function main() {
  const server = http.createServer(createRequestHandler());

  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));

  try {
    const ready = await request('/ready');
    const chat = await request('/api/chat', {
      method: 'POST',
      headers: { 'x-role': 'child' },
      body: JSON.stringify({
        message: '分数应用题总是不会，可以先给我一个提示吗？',
      }),
    });
    const parentSummary = await request('/api/parent-summary', {
      headers: { 'x-role': 'parent' },
    });

    if (!chat.answer || !chat.safety || chat.provider !== 'hermes-mock') {
      throw new Error('Chat response did not include the expected mock learning reply.');
    }

    process.stdout.write(
      JSON.stringify(
        {
          ready,
          answer: chat.answer,
          provider: chat.provider,
          parentSummary: parentSummary.summary,
        },
        null,
        2
      ) + '\n'
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exit(1);
});
