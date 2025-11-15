import { createClient } from "@/utils/supabase/server";
import { encryptForUser, decryptForUser } from "@/services/encryption-service";
import { IncomeSourcesInput, EncryptedIncomeSourcesRow } from "./schema";

// ----------------------------
// Fetch all income sources for a user
// ----------------------------
export async function getIncomeSources(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("income_sources")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  if (!data) return [];

  return data.map((row: EncryptedIncomeSourcesRow & { data_enc: any }) => ({
    id: row.id,
    type: row.type,
    data: row.data_enc ? JSON.parse(decryptForUser(userId, row.data_enc)) : null,
  }));
}

// ----------------------------
// Add or update an income source
// ----------------------------
export async function upsertIncomeSource(
  userId: string,
  input: IncomeSourcesInput,
  id?: string // optional, if updating an existing row
) {
  const supabase = await createClient();

  const encrypted = {
    user_id: userId,
    type: input.type,
    data_enc: encryptForUser(userId, JSON.stringify(input.data)),
  };

  const query = id
    ? supabase.from("income_sources").upsert({ ...encrypted, id })
    : supabase.from("income_sources").insert(encrypted);

  const { error } = await query;
  if (error) throw error;
}

// ----------------------------
// Delete an income source
// ----------------------------
export async function deleteIncomeSource(userId: string, id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("income_sources")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}
