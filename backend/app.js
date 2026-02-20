require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const symptomRoutes = require('./routes/symptomRoutes');
const riskRoutes = require('./routes/riskRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const movementRoutes = require('./routes/movementRoutes');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, req.body || '');
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/movements', movementRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

module.exports = app;
