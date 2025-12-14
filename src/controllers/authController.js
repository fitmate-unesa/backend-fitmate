const { supabaseAdmin } = require('../config/supabase');

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
