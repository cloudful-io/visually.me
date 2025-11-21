import { EncryptedField } from "@/services/encryption-service";

export interface UserAttributesInput {
  birthYear: number | null;
  targetRetirementAge: number | null;
  startYear: number | null;
  yearsToProject: number | null;
}

export interface EncryptedUserAttributesRow {
  id: string;

  birth_year_enc: EncryptedField | null;
  target_retirement_age_enc: EncryptedField | null;
  start_year_enc: EncryptedField | null;
  years_to_project_enc: EncryptedField | null;
}
