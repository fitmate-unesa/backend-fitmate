const { supabaseAdmin, createSupabaseClient } = require('../config/supabase');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const parts = authHeader.split(' ');
    const token = parts.length === 2 ? parts[1] : null;
    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      console.error('Auth error:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    // Attach a user-scoped supabase client so DB queries are evaluated under RLS
    req.supabase = createSupabaseClient(token);
    next();
  } catch (err) {
    console.error('Middleware error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authenticate;
