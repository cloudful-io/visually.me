import { EncryptedField } from "@/services/encryption-service";

export interface IncomeSourcesInput {
  id?: string;
  type: string;
  data: string;
}

export interface EncryptedIncomeSourcesRow {
  id: string;
  user_id: string;

  type: string;
  data_enc: EncryptedField | null;
  created_at: string;
  updated_at: string;
}
