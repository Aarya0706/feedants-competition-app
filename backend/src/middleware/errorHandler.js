const ApiError = require('../utils/ApiError');

function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`, 'NOT_FOUND'));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: { message: err.message, code: err.code } });
  }

  // Mongoose duplicate key (e.g. double registration race that slipped past
  // the app-level check) -> surface as a clean 409 instead of a 500.
  if (err.code === 11000) {
    return res.status(409).json({
      error: { message: 'You are already registered for this competition.', code: 'ALREADY_REGISTERED' },
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: { message: err.message, code: 'VALIDATION_ERROR' } });
  }

  console.error(err);
  return res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } });
}

module.exports = { notFound, errorHandler };
