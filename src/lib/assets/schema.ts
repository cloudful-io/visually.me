import { EncryptedField } from "@/services/encryption-service";

export interface AssetInput {
  id?: string;
  asset_type: 
    | "fers-pension"
    | "military-pension"
    | "social-security"
    | "retirement-savings"
    | "real-estate"
    | "college-savings";
  data: any;
}

export interface AssetRow {
  id: string;
  owner_user_id: string;
  asset_type: AssetInput["asset_type"];
  data: any;
  created_at: string;
  updated_at: string;
}

export interface EncryptedAssetRow {
  id: string;
  owner_user_id: string;
  asset_type: AssetInput["asset_type"];
  data_enc: EncryptedField;
  created_at: string;
  updated_at: string;
}

// For per-user access to content key
export interface AssetKeyRow {
  id: string;
  asset_id: string;
  user_id: string;
  key_enc: EncryptedField;
  created_at: string;
}
