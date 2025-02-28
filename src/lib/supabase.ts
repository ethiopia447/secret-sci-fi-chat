
import { createClient } from '@supabase/supabase-js';

// Use the project's Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://etkizhbvusbnqkzmngbi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0a2l6aGJ2dXNibnFrem1uZ2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MzE1NTAsImV4cCI6MjA1NjMwNzU1MH0.3EODfROW5Y5Fj6In4xOKODD04XTE0Q6_xbyItz9I69A';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
