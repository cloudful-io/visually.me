import type {
  FersPensionProjectionRow,
  MilitaryPensionProjectionRow,
  RetirementSavingsProjectionRow,
  SocialSecurityBenefitProjectionRow,
} from "financial-calcs";

import type { IncomeSourcesInput } from "./schema";

export type AnyProjectionRow =
  | FersPensionProjectionRow
  | MilitaryPensionProjectionRow
  | RetirementSavingsProjectionRow
  | SocialSecurityBenefitProjectionRow;

export type CombinedRow = {
  year: number;
  age: number;
  monthlyIncome: number;
  annualIncome: number;
  annualInvestmentBalance: number | null;
  sources: Record<string, number>;
  balances: Record<string, number>;
};

export type NormalizedSource = IncomeSourcesInput & {
  parsedData: any;
  label: string;
  mergedFields?: any | null;
  firstYear?: number | null;
};