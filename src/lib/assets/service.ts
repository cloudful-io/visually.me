import { createClient } from "@/utils/supabase/server";
import { encryptForUser, decryptForUser, wrapContentKeyForUser, unwrapContentKeyForUser, decryptWithKey, encryptWithKey, EncryptedField } from "@/services/encryption-service";
import { AssetInput, EncryptedAssetRow, AssetRow, AssetKeyRow } from "./schema";
import { incomeSourceRegistry, IncomeSourceId } from "../incomeSources/registry";
import { realEstateRegistry, RealEstateId } from "../realEstate/registry";
import crypto from "crypto";

export const incomeAssetTypes = Object.keys(
  incomeSourceRegistry
) as IncomeSourceId[];

export const realEstateAssetTypes = Object.keys(
  realEstateRegistry
) as RealEstateId[];

export async function getIncomeAssets(userId: string) {
  const assets = await getAssets(userId);

  return assets.filter(
    (asset): asset is AssetRow =>
      incomeAssetTypes.includes(asset.asset_type as IncomeSourceId)
  );
}

export async function getRealEstateAssets(userId: string) {
  const assets = await getAssets(userId);

  return assets.filter(
    (asset): asset is AssetRow =>
      realEstateAssetTypes.includes(asset.asset_type as RealEstateId)
  );
}

// ----------------------------
// Fetch a single asset by ID for a given user
// ----------------------------
export async function getAssetById(userId: string, assetId: string) {
  const supabase = await createClient();

  // 1. Get the wrapped content key for this user
  const { data: keyRow, error: keyError } = await supabase
    .from("asset_keys")
    .select("*")
    .eq("asset_id", assetId)
    .eq("user_id", userId)
    .single();

  if (keyError) throw keyError;
  if (!keyRow) return null;

  const contentKey = unwrapContentKeyForUser(userId, keyRow.key_enc);

  // 2. Fetch the asset
  const { data: assetRow, error: assetError } = await supabase
    .from("assets")
    .select("*")
    .eq("id", assetId)
    .single();

  if (assetError) throw assetError;
  if (!assetRow) return null;

  // 3. Decrypt
  const decryptedData = decryptWithKey(contentKey, assetRow.data_enc);

  return {
    id: assetRow.id,
    owner_user_id: assetRow.owner_user_id,
    asset_type: assetRow.asset_type,
    data: JSON.parse(decryptedData),
    created_at: assetRow.created_at,
    updated_at: assetRow.updated_at,
  };
}

// ----------------------------
// Fetch all assets for a user
// ----------------------------
export async function getAssets(userId: string) {
  const supabase = await createClient();

  // 1. Get all asset keys for this user
  const { data: keyRows, error: keyError } = await supabase
    .from("asset_keys")
    .select("*")
    .eq("user_id", userId);

  if (keyError) throw keyError;
  if (!keyRows || keyRows.length === 0) return [];

  const assetIds = keyRows.map(k => k.asset_id);

  // 2. Fetch all assets in a single query
  const { data: assetRows, error: assetError } = await supabase
    .from("assets")
    .select("*")
    .in("id", assetIds);

  if (assetError) throw assetError;
  if (!assetRows || assetRows.length === 0) return [];

  // 3. Decrypt all assets in parallel
  const assets = await Promise.all(
    assetRows.map(async asset => {
      const keyRow = keyRows.find(k => k.asset_id === asset.id)!;
      const contentKey = unwrapContentKeyForUser(userId, keyRow.key_enc);
      const decryptedData = decryptWithKey(contentKey, asset.data_enc);

      return {
        id: asset.id,
        owner_user_id: asset.owner_user_id,
        asset_type: asset.asset_type,
        data: JSON.parse(decryptedData),
        created_at: asset.created_at,
        updated_at: asset.updated_at,
      };
    })
  );

  return assets;
}

 export async function upsertAsset(
  userId: string,
  input: AssetInput,
  assetId?: string
) {
  const supabase = await createClient();

  let contentKey: Buffer;

  if (assetId) {
    //  FETCH existing wrapped key
    const { data: keyRow, error } = await supabase
      .from("asset_keys")
      .select("key_enc")
      .eq("asset_id", assetId)
      .eq("user_id", userId)
      .single();

    if (error || !keyRow) {
      throw new Error("Missing asset key");
    }

    contentKey = unwrapContentKeyForUser(userId, keyRow.key_enc);
  } else {
    // New asset → generate new key
    contentKey = crypto.randomBytes(32);
  }

  // Encrypt
  const plaintext = JSON.stringify(input.data);
  const data_enc = encryptWithKey(contentKey, plaintext);

  // Upsert asset
  const { data, error: assetError } = await supabase
    .from("assets")
    .upsert({
      id: assetId,
      owner_user_id: userId,
      asset_type: input.asset_type,
      data_enc,
    })
    .select()
    .single();

  if (assetError) throw assetError;

  // Only insert key if new asset
  if (!assetId) {
    const wrappedKey = wrapContentKeyForUser(userId, contentKey);

    await supabase.from("asset_keys").insert({
      asset_id: data.id,
      user_id: userId,
      key_enc: wrappedKey,
    });
  }
}


// ----------------------------
// Delete an asset
// ----------------------------
export async function deleteAsset(userId: string, assetId: string) {
  const supabase = await createClient();

  // Ensure user has access
  const { data: keyRow, error } = await supabase
    .from("asset_keys")
    .select("*")
    .eq("asset_id", assetId)
    .eq("user_id", userId)
    .single();

  if (error || !keyRow) throw new Error("Asset not found or access denied");

  // Delete asset_keys first
  await supabase.from("asset_keys").delete().eq("asset_id", assetId);

  // Delete asset
  const { error: assetError } = await supabase.from("assets").delete().eq("id", assetId);
  if (assetError) throw assetError;
}
