import { EncryptedField } from "@/services/encryption-service";

export interface UserAttributesInput {
  birthYear: number | null;
  targetRetirementAge: number | null;
  startYear: number | null;
  lifeExpectancyAge: number | null;
}

export interface EncryptedUserAttributesRow {
  id: string;

  birth_year_enc: EncryptedField | null;
  target_retirement_age_enc: EncryptedField | null;
  start_year_enc: EncryptedField | null;
  life_expectancy_age_enc: EncryptedField | null;
}
