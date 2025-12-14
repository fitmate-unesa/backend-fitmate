require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key in .env');
  // We don't exit process here to allow partial functionality if needed, 
  // but usually you should.
}

// Admin-ish client (no user session). Note:
// - If SUPABASE_KEY is an anon key, DB operations will be subject to RLS and
//   will FAIL unless you pass a user JWT per request.
// - If SUPABASE_KEY is a service_role key, DB operations bypass RLS (use with care).
const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
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
