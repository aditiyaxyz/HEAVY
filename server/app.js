// server/app.js - express app (CommonJS)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Global rate limiting (basic)
const rateLimit = require('express-rate-limit');
app.use(rateLimit({ windowMs: 60 * 1000, max: 300 })); // 300 requests/min per IP

// MongoDB connection
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/heavy';
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

// Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({ message: 'Server error' });
});

module.exports = app;
