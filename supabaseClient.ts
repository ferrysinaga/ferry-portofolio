import { createClient } from '@supabase/supabase-js';

// Kodenya sekarang akan otomatis menarik data dari file .env secara diam-diam
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);