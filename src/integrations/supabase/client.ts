import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jhzsgtgdzezpzucpgtli.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoenNndGdkemV6cHp1Y3BndGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI2NTg4MDAsImV4cCI6MjAxODIzNDgwMH0.qDlZHVxi3XAhQXGnHMXcrxYHAoLPEOXRF9kA-_9Y-Ow';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});