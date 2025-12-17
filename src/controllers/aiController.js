const { getGeminiModel } = require('../config/gemini');

/**
 * Normalisasi error AI ke format standar
 * @param {any} err - Objek error
 * @returns {Object} Status dan pesan error
 */
function normalizeAiError(err) {
  const statusFromConfig = err?.statusCode;
  // Some errors from Google SDK contain status/code fields.
  const statusFromSdk = err?.status || err?.code || err?.response?.status;

  const status =
    Number(statusFromConfig) ||
    Number(statusFromSdk) ||
    (String(statusFromSdk) === 'RESOURCE_EXHAUSTED' ? 429 : null) ||
    500;

  const message =
    err?.message ||
    err?.details?.message ||
    (typeof err === 'string' ? err : 'Unknown AI error');

  // Convert "bad gateway" style issues to 502/503 when possible.
  const safeStatus =
    status === 401 || status === 403 || status === 400
      ? status
      : status === 429
        ? 429
        : status >= 500 && status <= 599
          ? status
          : 500;

  return { status: safeStatus, message };
}

/**
 * Menghasilkan konten AI dengan mekanisme retry sederhana
 * @param {Object} model - Model Gemini
 * @param {String} prompt - Prompt input
 * @returns {Promise<Object>} Hasil generateContent
 */
async function generateWithRetry(model, prompt) {
  try {
    return await model.generateContent(prompt);
  } catch (err) {
    const { status } = normalizeAiError(err);
    // Simple retry for transient errors
    if (status === 429 || status === 503 || status === 502) {
      await new Promise((r) => setTimeout(r, 600));
      return await model.generateContent(prompt);
    }
    throw err;
  }
}

/**
 * Handler endpoint Chat AI
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const prompt = `
      Kamu adalah asisten kesehatan yang ramah dan singkat.
      Jawab maksimal 3 paragraf. Bahasa: Indonesia santai namun sopan.

      Pertanyaan pengguna: ${message}
    `;

    const model = getGeminiModel();
    const result = await generateWithRetry(model, prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || !String(text).trim()) {
      return res.status(502).json({ error: 'AI returned empty response' });
    }

    res.json({ reply: text });
  } catch (err) {
    const normalized = normalizeAiError(err);
    console.error('Chat AI Error:', err);
    res.status(normalized.status).json({
      error: 'Failed to get AI response',
      details: normalized.message,
    });
  }
};
