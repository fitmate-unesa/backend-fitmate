// DB operations must be executed using req.supabase (user-scoped client) to satisfy RLS.
const { getGeminiModel } = require('../config/gemini');

/**
 * Normalisasi error ke format standar
 * @param {any} err - Objek error
 * @returns {Object} Status dan pesan error
 */
function normalizeAiError(err) {
  const statusFromConfig = err?.statusCode;
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
 * Menghasilkan konten AI dengan retry
 * @param {Object} model - Model Gemini
 * @param {String} prompt - Prompt
 * @returns {Promise<Object>} Hasil generateContent
 */
async function generateWithRetry(model, prompt) {
  try {
    return await model.generateContent(prompt);
  } catch (err) {
    const { status } = normalizeAiError(err);
    if (status === 429 || status === 503 || status === 502) {
      await new Promise((r) => setTimeout(r, 600));
      return await model.generateContent(prompt);
    }
    throw err;
  }
}

// Save a food log (scan or manual result)
/**
 * Menyimpan log makanan (hasil scan atau manual)
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
exports.saveFoodLog = async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat, fiber, source, confidence, image_url } = req.body;
    const user_id = req.user.id;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Field "name" is required' });
    }
    if (calories === undefined || calories === null || Number.isNaN(Number(calories))) {
      return res.status(400).json({ error: 'Field "calories" is required and must be a number' });
    }

    const { data, error } = await req.supabase
      .from('food_logs')
      .insert([
        {
          user_id,
          name,
          calories: Number(calories),
          protein,
          carbs,
          fat,
          fiber,
          source,
          confidence,
          image_url
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Save Food Log Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get food history
/**
 * Mengambil riwayat makanan pengguna
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
exports.getFoodHistory = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data, error } = await req.supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Estimate nutrition from text (Manual Entry)
/**
 * Estimasi nutrisi dari teks input manual
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
exports.estimateNutrition = async (req, res) => {
  try {
    const { name, grams } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Field "name" is required' });
    }
    if (grams === undefined || grams === null || Number.isNaN(Number(grams)) || Number(grams) <= 0) {
      return res.status(400).json({ error: 'Field "grams" is required and must be > 0' });
    }

    const prompt = `
      Saya ingin informasi gizi makanan berikut:
      Nama: "${name}"
      Berat: ${grams} gram

      Berikan estimasi nutrisi TOTAL untuk porsi tersebut (BUKAN per 100g).

      Balas HANYA dalam format JSON valid, tanpa teks lain, dengan struktur persis seperti ini:
      {
        "calories": 0,
        "protein_g": 0,
        "carbs_g": 0,
        "fat_g": 0,
        "fiber_g": 0,
        "summary": "kalimat singkat dan menarik dalam bahasa Indonesia untuk menjelaskan porsi dan kualitas gizinya"
      }
    `;

    const model = getGeminiModel();
    const result = await generateWithRetry(model, prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up JSON string if markdown code blocks are used
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Try to extract the first JSON object in case the model adds extra text
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      return res.status(502).json({ error: 'AI returned non-JSON output', raw: text });
    }
    const candidate = text.slice(start, end + 1);
    let json;
    try {
      json = JSON.parse(candidate);
    } catch (parseErr) {
      return res.status(502).json({
        error: 'AI returned invalid JSON',
        parse_error: parseErr.message,
        raw: text,
      });
    }

    res.json(json);
  } catch (err) {
    console.error('Estimate Nutrition Error:', err);
    const normalized = normalizeAiError(err);
    res.status(normalized.status).json({
      error: 'Failed to estimate nutrition',
      details: normalized.message,
    });
  }
};
