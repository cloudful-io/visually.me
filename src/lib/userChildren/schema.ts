import { EncryptedField } from "@/services/encryption-service";

export interface UserChildInput {
  id?: string;
  label: string | null;
  birthYear: number | null;
  collegeStartYear: number | null;
  collegeEndYear: number | null;
  estimatedFirstYearTuition: number | null;
  tuitionInflationRate: number | null;
}

export interface UserChildRecord {
  id: string;
  label: string | null;
  birthYear: number | null;
  collegeStartYear: number | null;
  collegeEndYear: number | null;
  estimatedFirstYearTuition: number | null;
  tuitionInflationRate: number | null;
}

export interface EncryptedUserChildRow {
  id: string;
  owner_user_id: string;
  label_enc: EncryptedField | null;
  birth_year_enc: EncryptedField | null;
  college_start_year_enc: EncryptedField | null;
  college_end_year_enc: EncryptedField | null;
  estimated_first_year_tuition_enc: EncryptedField | null;
  tuition_inflation_rate_enc: EncryptedField | null;
}
