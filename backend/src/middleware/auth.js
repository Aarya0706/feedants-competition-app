const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

// Requires a valid Bearer token; attaches { id } to req.user.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next(new ApiError(401, 'Authentication required', 'UNAUTHENTICATED'));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub };
    next();
  } catch (err) {
    next(new ApiError(401, 'Invalid or expired token', 'UNAUTHENTICATED'));
  }
}

// Attaches req.user if a valid token is present, but never blocks the
// request. Used on GET /competitions/:id so the response can include
// user-specific fields (isRegistered, hasSubmitted) for logged-in users
// while still working for anonymous/public viewing.
function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub };
  } catch (err) {
    // ignore invalid token in optional mode
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
