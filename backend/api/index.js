const mongoose = require('mongoose');
const app = require('../src/app');
const connectDB = require('../src/config/db');

// Reuse the DB connection across warm invocations
let connecting = null;

module.exports = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      if (!connecting) connecting = connectDB().finally(() => (connecting = null));
      await connecting;
    }
  } catch (err) {
    console.error('[db] connect failed:', err.message);
    return res.status(500).json({ error: { message: 'Database connection failed' } });
  }
  return app(req, res);
};