class AppError extends Error {
  constructor(statusCode, code, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
  }
}

function badRequest(message, details) {
  return new AppError(400, 'BAD_REQUEST', message, details);
}

function forbidden(message) {
  return new AppError(403, 'FORBIDDEN', message);
}

function notFound(message) {
  return new AppError(404, 'NOT_FOUND', message);
}

module.exports = {
  AppError,
  badRequest,
  forbidden,
  notFound,
};
