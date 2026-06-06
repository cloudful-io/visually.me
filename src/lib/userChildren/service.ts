import { createClient } from "@/utils/supabase/server";
import { decryptForUser, encryptForUser } from "@/services/encryption-service";
import crypto from "crypto";
import { EncryptedUserChildRow, UserChildInput, UserChildRecord } from "./schema";

export async function getUserChildren(userId: string): Promise<UserChildRecord[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_children")
    .select("*")
    .eq("owner_user_id", userId)

  if (error) throw error;
  if (!data || data.length === 0) return [];

  return data.map((row: EncryptedUserChildRow) => ({
    id: row.id,
    label: row.label_enc ? decryptForUser(userId, row.label_enc) : null,
    birthYear: row.birth_year_enc
      ? Number(decryptForUser(userId, row.birth_year_enc))
      : null,
    collegeStartYear: row.college_start_year_enc
      ? Number(decryptForUser(userId, row.college_start_year_enc))
      : null,
    collegeEndYear: row.college_end_year_enc
      ? Number(decryptForUser(userId, row.college_end_year_enc))
      : null,
    estimatedFirstYearTuition: row.estimated_first_year_tuition_enc
      ? Number(decryptForUser(userId, row.estimated_first_year_tuition_enc))
      : null,
    tuitionInflationRate: row.tuition_inflation_rate_enc
      ? Number(decryptForUser(userId, row.tuition_inflation_rate_enc))
      : null,
  }));
}

export async function upsertUserChildren(
  userId: string,
  input: { children: UserChildInput[] }
) {
  const supabase = await createClient();

  const rows = (input.children ?? []).map((child) => ({
    id: child.id ?? crypto.randomUUID(),
    owner_user_id: userId,
    label_enc: child.label != null ? encryptForUser(userId, child.label) : null,
    birth_year_enc:
      child.birthYear != null
        ? encryptForUser(userId, String(child.birthYear))
        : null,
    college_start_year_enc:
      child.collegeStartYear != null
        ? encryptForUser(userId, String(child.collegeStartYear))
        : null,
    college_end_year_enc:
      child.collegeEndYear != null
        ? encryptForUser(userId, String(child.collegeEndYear))
        : null,
    estimated_first_year_tuition_enc:
      child.estimatedFirstYearTuition != null
        ? encryptForUser(userId, String(child.estimatedFirstYearTuition))
        : null,
    tuition_inflation_rate_enc:
      child.tuitionInflationRate != null
        ? encryptForUser(userId, String(child.tuitionInflationRate))
        : null,
  }));

  const { error } = await supabase
    .from("user_children")
    .upsert(rows, { onConflict: "id" });

  if (error) throw error;
}

export async function deleteUserChild(userId: string, childId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("user_children")
    .delete()
    .eq("id", childId)
    .eq("owner_user_id", userId);

  if (error) throw error;
}

export async function deleteUserChildren(userId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("user_children")
    .delete()
    .eq("owner_user_id", userId);

  if (error) throw error;
}
