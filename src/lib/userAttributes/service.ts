import { createClient } from "@/utils/supabase/server";
import { encryptForUser, decryptForUser } from "@/services/encryption-service";
import { UserAttributesInput, EncryptedUserAttributesRow } from "./schema";

export async function getUserAttributes(userId: string, spouse: boolean = false) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_attributes")
    .select("*")
    .eq("id", userId)
    .eq("spouse", spouse)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    spouse: data.spouse,
    birthYear: data.birth_year_enc
      ? Number(
          decryptForUser(userId, { key_version: data.key_version, ...data.birth_year_enc })
        )
      : null,

    targetRetirementAge: data.target_retirement_age_enc
      ? Number(
          decryptForUser(userId, { key_version: data.key_version, ...data.target_retirement_age_enc })
        )
      : null,

    startYear: data.start_year_enc
      ? Number(
          decryptForUser(userId, { key_version: data.key_version, ...data.start_year_enc })
        )
      : null,
    lifeExpectancyAge: data.life_expectancy_age_enc
      ? Number(
          decryptForUser(userId, { key_version: data.key_version, ...data.life_expectancy_age_enc })
        )
      : null,
  };
}

export async function upsertUserAttributes(
  userId: string,
  input: UserAttributesInput
) {
  const supabase = await createClient();
  const encrypted = {
    id: userId,
    spouse: input.spouse,
    birth_year_enc: input.birthYear != null ? encryptForUser(userId, String(input.birthYear)) : null,
    target_retirement_age_enc: input.targetRetirementAge != null ? encryptForUser(userId, String(input.targetRetirementAge)) : null,
    start_year_enc: input.startYear != null ? encryptForUser(userId, String(input.startYear)) : null,
    life_expectancy_age_enc: input.lifeExpectancyAge != null ? encryptForUser(userId, String(input.lifeExpectancyAge)) : null,
  };

  const { error } = await supabase.from("user_attributes").upsert(encrypted);
  console.log(error);
  if (error) throw error;
}
