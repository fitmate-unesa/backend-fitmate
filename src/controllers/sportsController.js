// DB operations must be executed using req.supabase (user-scoped client) to satisfy RLS.
const { getGeminiModel } = require('../config/gemini');

/**
 * Ekstrak array JSON pertama dari teks (untuk membersihkan output AI)
 * @param {String} text - Teks dari AI
 * @returns {String|null} String JSON array
 */
function extractFirstJsonArray(text) {
  if (!text) return null;
  const cleaned = String(text).replace(/```json/g, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start === -1 || end === -1 || end <= start) return null;
  return cleaned.slice(start, end + 1);
}

/**
 * Membuat rencana olahraga 7 hari menggunakan AI
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
exports.generatePlan = async (req, res) => {
  try {
    const { goal, height, weight } = req.body;
    const user_id = req.user.id;

    if (!goal || typeof goal !== 'string') {
      return res.status(400).json({ error: 'Field "goal" is required' });
    }
    if (height === undefined || height === null || Number.isNaN(Number(height))) {
      return res.status(400).json({ error: 'Field "height" is required and must be a number' });
    }
    if (weight === undefined || weight === null || Number.isNaN(Number(weight))) {
      return res.status(400).json({ error: 'Field "weight" is required and must be a number' });
    }

    const prompt = `
      Saya seorang pengguna dengan data fisik:
      Tinggi: ${height} cm
      Berat: ${weight} kg
      Target: ${goal} (misal: bulking, cutting, maintenance)

      Buatkan rencana olahraga 7 hari yang spesifik.
      Output HARUS berupa JSON Array of Objects, di mana setiap object mewakili 1 hari.
      Struktur:
      [
        {
          "day": "Senin",
          "focus": "Upper Body",
          "exercises": [
            "Push Up 3x12",
            "Pull Up 3x8"
          ],
          "duration_minutes": 45
        },
        ...
      ]
      
      Hanya JSON valid, tanpa teks lain.
    `;

    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up JSON
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    let planData;
    try {
      const jsonArray = extractFirstJsonArray(text) ?? text;
      planData = JSON.parse(jsonArray);
    } catch (e) {
      // Fallback or retry logic could go here
      return res.status(502).json({ error: 'Failed to parse AI response', raw: text });
    }

    // Save to database
    const { data, error } = await req.supabase
      .from('sports_plans')
      .insert([
        {
          user_id,
          goal,
          current_height: Number(height),
          current_weight: Number(weight),
          plan_data: planData
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);

  } catch (err) {
    console.error('Generate Plan Error:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Mengambil riwayat rencana olahraga
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
exports.getPlans = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { data, error } = await req.supabase
      .from('sports_plans')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
