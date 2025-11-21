import { createClient } from "@/utils/supabase/server";
import { encryptForUser, decryptForUser } from "@/services/encryption-service";
import { UserAttributesInput, EncryptedUserAttributesRow } from "./schema";

export async function getUserAttributes(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_attributes")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
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
    yearsToProject: data.years_to_project_enc
      ? Number(
          decryptForUser(userId, { key_version: data.key_version, ...data.years_to_project_enc })
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
    birth_year_enc: input.birthYear != null ? encryptForUser(userId, String(input.birthYear)) : null,
    target_retirement_age_enc: input.targetRetirementAge != null ? encryptForUser(userId, String(input.targetRetirementAge)) : null,
    start_year_enc: input.startYear != null ? encryptForUser(userId, String(input.startYear)) : null,
    years_to_project_enc: input.yearsToProject != null ? encryptForUser(userId, String(input.yearsToProject)) : null,
  };

  const { error } = await supabase.from("user_attributes").upsert(encrypted);
  if (error) throw error;
}
