import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

if (!isSupabaseConfigured) {
  console.info(
    '⚡ CHUG! Backend Notice: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured yet. Operating in local guest storage mode until keys are provided in .env.'
  );
}

// Client singleton using public anon key (safe for browser exposure with RLS)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
