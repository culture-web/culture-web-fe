const backendUri = import.meta.env.VITE_BACKEND_URI || 'http://localhost:3001/api';

if (!import.meta.env.VITE_BACKEND_URI) {
  console.warn('VITE_BACKEND_URI environment variable is not set, defaulting to http://localhost:3001/api');
}

const BACKEND_URI = backendUri;

// Supabase configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://rzokzctxdqagnmhqhrqd.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';
const hasPlaceholderSupabaseConfig =
  String(SUPABASE_URL || '').includes('placeholder.supabase.co')
  || String(SUPABASE_ANON_KEY || '').includes('placeholder-anon-key');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
  console.error('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
}

if (hasPlaceholderSupabaseConfig) {
  console.error('Invalid Supabase environment variables detected');
  console.error('VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are still placeholder values');
}

export const EMAIL_API_KEY = process.env.VITE_EMAIL_API_KEY;

export default BACKEND_URI;
