const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set. Copy .env.example to .env and configure it.');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    // Sensible pool size for a service expected to handle many concurrent requests.
    maxPoolSize: 50,
  });

  console.log(`[db] connected to ${mongoose.connection.name}`);

  mongoose.connection.on('error', (err) => {
    console.error('[db] connection error:', err.message);
  });
}

module.exports = connectDB;
