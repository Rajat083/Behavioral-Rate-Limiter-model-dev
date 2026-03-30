const dotenv = require('dotenv');

dotenv.config();

function asNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

module.exports = {
  port: asNumber(process.env.PORT, 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || '*',
  modelMode: process.env.MODEL_MODE || 'heuristic',
  pythonInferenceUrl: process.env.PYTHON_INFERENCE_URL || 'http://127.0.0.1:8000/predict',
  maxEventsPerUser: asNumber(process.env.MAX_EVENTS_PER_USER, 500),
};
