import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jhzsgtgdzezpzucpgtli.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpoenNndGdkemV6cHp1Y3BndGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNzAxMjcsImV4cCI6MjA0OTg0NjEyN30.Qh7lAXzeWnOF18zBrrh3Bkn3HhefXFdg232Y-K3lCgY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});