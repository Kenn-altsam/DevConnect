const express = require('express');
const cors = require('cors');
const path = require('path');
const contactRoutes = require('./routes/contactRoutes');

function getCorsOrigins() {
  const origins = (process.env.CORS_ORIGIN || '*')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  return origins.includes('*') ? '*' : origins;
}

const app = express();
const frontendRoot = path.resolve(__dirname, '..', '..');

app.use(cors({ origin: getCorsOrigins() }));
app.use(express.json({ limit: '1mb' }));
app.use(express.static(frontendRoot));

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Backend is running.' });
});

app.use('/api', contactRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

module.exports = app;
