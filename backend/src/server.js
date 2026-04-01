const express = require('express');
const cors = require('cors');
const { port, frontendOrigin, modelMode } = require('./config');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

app.use(cors({ origin: frontendOrigin === '*' ? true : frontendOrigin }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'behavioral-rate-limiter-backend',
    modelMode,
    timestamp: Date.now(),
  });
});

app.use('/api', eventRoutes);

app.use((err, _req, res, _next) => {
  res.status(500).json({
    error: 'Internal server error',
    detail: String(err.message || err),
  });
});

app.listen(port, () => {
  console.log(`Behavioral backend listening on port ${port}`);
});
