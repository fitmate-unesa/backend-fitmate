require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in .env');
}

// Admin client with Service Role Key (bypasses RLS, allows admin auth ops)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/**
 * Create a Supabase client that runs DB queries as the authenticated user.
 * This is required when your tables have RLS policies like `auth.uid() = user_id`.
 */
const createSupabaseClient = (userJwt) => {
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${userJwt}`,
      },
    },
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

module.exports = { supabaseAdmin, createSupabaseClient };
