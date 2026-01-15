import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import {
  decryptForUser,
  encryptWithKey,
  wrapContentKeyForUser,
} from "@/services/encryption-service";

// Admin client (service role)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function migrate() {
  // 1. Fetch all income sources
  const { data: sources, error } = await supabase
    .from("income_sources")
    .select("*");

  if (error) throw error;

  for (const src of sources) {
    const userId = src.user_id;

    // 2. Decrypt old data
    const plaintext = decryptForUser(userId, src.data_enc);

    // 3. Generate new content key
    const contentKey = crypto.randomBytes(32);

    // 4. Encrypt with content key
    const data_enc = encryptWithKey(contentKey, plaintext);

    // 5. Insert asset
    const { data: asset, error: assetError } = await supabase
      .from("assets")
      .insert({
        owner_user_id: userId,
        asset_type: mapIncomeTypeToAssetType(src.type),
        data_enc,
        created_at: src.created_at,
        updated_at: src.updated_at,
      })
      .select()
      .single();

    if (assetError) throw assetError;

    // 6. Wrap content key
    const wrappedKey = wrapContentKeyForUser(userId, contentKey);

    await supabase.from("asset_keys").insert({
      asset_id: asset.id,
      user_id: userId,
      key_enc: wrappedKey,
    });

    console.log(`Migrated income source ${src.id}`);
  }

  console.log("Migration complete");
}

function mapIncomeTypeToAssetType(type: string) {
  switch (type) {
    case "fers-pension":
      return "fers-pension";
    case "military-pension":
      return "military-pension";
    case "social-security":
      return "social-security";
    case "retirement-savings":
      return "retirement-savings";
    default:
      throw new Error(`Unknown income type: ${type}`);
  }
}

migrate().catch(console.error);
