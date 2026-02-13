const backendUri = process.env.VITE_BACKEND_URI;

if (!backendUri) {
  process.exit(1);
}

const BACKEND_URI = backendUri;

// Supabase configuration
export const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
  console.error('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
}

export const EMAIL_API_KEY = process.env.VITE_EMAIL_API_KEY;

export default BACKEND_URI;
