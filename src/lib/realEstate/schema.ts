import { EncryptedField } from "@/services/encryption-service";

export interface RealEstateInput {
  id?: string;
  data: string;
}

export interface EncryptedRealEstateRow {
  id: string;
  user_id: string;

  data_enc: EncryptedField | null;
  created_at: string;
  updated_at: string;
}
