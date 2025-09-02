import { createClient } from '@/utils/supabase/server';

export async function getUser(email: string) {
  const supabase = await createClient(); // Correct: Await the promise
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Supabase Error:', error.message);
  }
  
  return data;
}
