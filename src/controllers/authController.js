const { supabaseAdmin } = require('../config/supabase');

/**
 * Mendaftarkan pengguna baru
 * @param {Object} req - Objek request Express
 * @param {Object} res - Objek response Express
 */
exports.register = async (req, res) => {
  const { email, password, full_name } = req.body;

  try {
    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
        },
      },
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ message: 'User registered successfully', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Login pengguna
 * @param {Object} req - Objek request Express
 * @param {Object} res - Objek response Express
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }


    res.json({ message: 'Login successful', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Memperbarui profil pengguna
 * @param {Object} req - Objek request Express
 * @param {Object} res - Objek response Express
 */
exports.updateProfile = async (req, res) => {
  const { first_name, last_name, password } = req.body;
  const userId = req.user.id;

  try {
    const updates = {
      user_metadata: {
        first_name,
        last_name,
        full_name: `${first_name} ${last_name}`.trim(),
      },
    };

    if (password) {
      updates.password = password;
    }

    // Use admin client (requires SUPABASE_SERVICE_ROLE_KEY in .env)
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      updates
    );

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Profile updated successfully', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
