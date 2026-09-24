const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const competitionRoutes = require('./routes/competitionRoutes');
const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Registration is the endpoint most exposed to bursty/concurrent traffic
// (a "last spots left" push notification, e.g.) so it gets a tighter,
// dedicated limiter in addition to the general one.
app.use(rateLimit({ windowMs: 60 * 1000, limit: 120 }));
app.use(
  '/api/competitions/:id/register',
  rateLimit({ windowMs: 60 * 1000, limit: 10, message: { error: { message: 'Too many attempts, slow down.' } } })
);

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

app.use('/api/auth', authRoutes);
app.use('/api/competitions', competitionRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
