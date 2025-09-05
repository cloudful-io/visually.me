import { createClient } from '@/utils/supabase/server';

type UserInput = {
  email: string;
  fullName: string;
  onboardingComplete?: boolean;
};

type UserProfileInput = {
  userId: string; // UUID
  birthYear: number;
  retirementAge: number;
};

export async function getUser(email: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Supabase Error (getUser):', error.message);
  }
  
  return data;
}

export async function getOrCreateOrUpdateUser(user: UserInput) {
  const supabase = await createClient();

  // Build the payload conditionally
  const payload: any = {
    email: user.email,
    full_name: user.fullName,
  };

  if (user.onboardingComplete !== undefined) {
    payload.onboarding_complete = user.onboardingComplete;
  }

  const { data, error } = await supabase
    .from('users')
    .upsert(payload, { onConflict: "email" })
    .select()
    .single();

  if (error) {
    console.error('Supabase Upsert Error (getOrCreateOrUpdateUser):', error.message);
    throw error;
  }

  return data;
}

export async function getOrCreateOrUpdateUserProfile(profile: UserProfileInput) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(
      {
        user_id: profile.userId,
        birth_year: profile.birthYear,
        retirement_age: profile.retirementAge
      },
      { onConflict: 'user_id' } // tells Supabase to use `user_id` as the unique key
    )
    .select()
    .single();

  if (error) {
    console.error('Supabase Upsert Error (getOrCreateOrUpdateUserProfile):', error.message);
    throw error;
  }

  return data;
}