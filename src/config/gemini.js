require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
// Default ke Gemini 2.5 (1.5 sudah deprecated/tidak disupport di beberapa akun/region).
const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

let _genAI = null;
let _model = null;
let _modelKey = null;

function _createHttpError(status, message, details) {
  const err = new Error(message);
  err.statusCode = status;
  if (details !== undefined) err.details = details;
  return err;
}

/**
 * Returns a cached Gemini model instance.
 * Throws a structured error when GEMINI_API_KEY is missing.
 */
function getGeminiModel() {
  if (!apiKey) {
    // On Vercel you MUST set GEMINI_API_KEY as an environment variable.
    throw _createHttpError(503, 'Gemini is not configured (missing GEMINI_API_KEY)');
  }

  const key = `${modelName}`;
  if (_model && _modelKey === key) return _model;

  _genAI = new GoogleGenerativeAI(apiKey);
  _model = _genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.4,
    },
  });
  _modelKey = key;
  return _model;
}

module.exports = { getGeminiModel };
