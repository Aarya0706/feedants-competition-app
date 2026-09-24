const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, 'name, email and password are required', 'VALIDATION_ERROR');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new ApiError(409, 'Email already registered', 'EMAIL_TAKEN');

  const passwordHash = await User.hashPassword(password);
  const referralCode = crypto.randomBytes(4).toString('hex');

  const user = await User.create({ name, email, passwordHash, referralCode });
  res.status(201).json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email } });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }
  res.json({ token: signToken(user), user: { id: user._id, name: user.name, email: user.email } });
});

module.exports = { signup, login };
