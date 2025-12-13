import { createClient } from "@/utils/supabase/server";
import { encryptForUser, decryptForUser } from "@/services/encryption-service";
import { RealEstateInput, EncryptedRealEstateRow } from "./schema";

// ----------------------------
// Fetch a specific real estate property by ID
// ----------------------------
export async function getRealEstateById(userId: string, id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("real_estate")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  if (!data) return null;

  return decryptRow(data, userId);
}

// ----------------------------
// Fetch all real estate properties for a user
// ----------------------------
export async function getRealEstates(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("real_estate")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  if (!data) return [];

  return data.map(row => decryptRow(row, userId));
}

// ----------------------------
// Add or update a real estate property
// ----------------------------
export async function upsertRealEstate(
  userId: string,
  input: RealEstateInput,
  id?: string // optional, if updating an existing row
) {
  const supabase = await createClient();

  const encrypted = {
    user_id: userId,
    data_enc: encryptForUser(userId, JSON.stringify(input.data)),
  };

  const query = id
    ? supabase.from("real_estate").upsert({ ...encrypted, id })
    : supabase.from("real_estate").insert(encrypted);

  const { error } = await query;
  if (error) throw error;
}

// ----------------------------
// Delete a real estate property
// ----------------------------
export async function deleteRealEstate(userId: string, id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("real_estate")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

function decryptRow(row: EncryptedRealEstateRow, userId: string) {
  return {
    id: row.id,
    data: row.data_enc
      ? JSON.parse(decryptForUser(userId, row.data_enc))
      : null,
  };
}
