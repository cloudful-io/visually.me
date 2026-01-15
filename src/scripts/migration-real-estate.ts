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
  // 1. Fetch all real estate
  const { data: properties, error } = await supabase
    .from("real_estate")
    .select("*");

  if (error) throw error;

  for (const property of properties) {
    const userId = property.user_id;

    // 2. Decrypt old data
    const plaintext = decryptForUser(userId, property.data_enc);

    // 3. Generate new content key
    const contentKey = crypto.randomBytes(32);

    // 4. Encrypt with content key
    const data_enc = encryptWithKey(contentKey, plaintext);

    // 5. Insert asset
    const { data: asset, error: assetError } = await supabase
      .from("assets")
      .insert({
        owner_user_id: userId,
        asset_type: "real-estate",
        data_enc,
        created_at: property.created_at,
        updated_at: property.updated_at,
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

    console.log(`Migrated real estate ${property.id}`);
  }

  console.log("Migration complete");
}

migrate().catch(console.error);
