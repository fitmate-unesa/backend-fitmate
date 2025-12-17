// DB operations must be executed using req.supabase (user-scoped client) to satisfy RLS.

/**
 * Menyimpan data lari baru
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
exports.saveRun = async (req, res) => {
  try {
    const {
      duration_seconds,
      distance_meters,
      calories_burned,
      pace_seconds_per_km,
      route_path,
      image_url
    } = req.body;

    const user_id = req.user.id;

    const { data, error } = await req.supabase
      .from('run_logs')
      .insert([
        {
          user_id,
          duration_seconds,
          distance_meters,
          calories_burned,
          pace_seconds_per_km,
          route_path, // Expecting JSON array of coordinates
          image_url
        }
      ])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Save Run Error:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Mengambil riwayat lari pengguna
 * @param {Object} req - Request Express
 * @param {Object} res - Response Express
 */
exports.getRuns = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { data, error } = await req.supabase
      .from('run_logs')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
