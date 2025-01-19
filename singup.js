import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://YOUR_SUPABASE_URL', 'YOUR_ANON_KEY');

async function signUp(email, password) {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    console.error('Error signing up:', error.message);
  } else {
    console.log('User signed up:', user);
  }
}


