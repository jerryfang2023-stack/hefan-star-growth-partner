const http = require('http');
const { config } = require('./config');
const { createRequestHandler } = require('./app');

const server = http.createServer(createRequestHandler());

server.listen(config.port, '0.0.0.0', () => {
  process.stdout.write(
    JSON.stringify({
      level: 'info',
      message: 'learning coach adapter started',
      port: config.port,
      hermesMode: config.hermes.mock ? 'mock' : config.hermes.apiMode,
    }) + '\n'
  );
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
