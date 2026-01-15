import type {
  FersPensionProjectionRow,
  MilitaryPensionProjectionRow,
  RetirementSavingsProjectionRow,
  SocialSecurityBenefitProjectionRow,
  RealEstatePropertyProjectionRow
} from "financial-calcs";

import type { AssetInput } from "./schema";

export const ASSET_CATEGORIES = [
  "income-source",
  "property",
  "college-savings",
] as const;

export type AssetCategory = typeof ASSET_CATEGORIES[number];

export function isAssetCategory(v: unknown): v is AssetCategory {
  return typeof v === "string" && ASSET_CATEGORIES.includes(v as AssetCategory);
}

export type AnyProjectionRow =
  | FersPensionProjectionRow
  | MilitaryPensionProjectionRow
  | RetirementSavingsProjectionRow
  | SocialSecurityBenefitProjectionRow
  | RealEstatePropertyProjectionRow;

export type CombinedRow = {
  year: number;
  age: number;
  monthlyIncome: number;
  annualIncome: number;
  annualInvestmentBalance?: number | null;
  monthlyExpense?: number | null;
  annualExpense?: number | null;
  annualNetCashFlow?: number | null;
  sources: Record<string, number>;
  balances: Record<string, number>;
};

export type NormalizedAsset = AssetInput & {
  parsedData: any;
  label: string;
  address?: string | null;        // used for real-estate property
  mergedFields?: any | null;
  firstYear?: number | null;      // used for income-source
  firstAmount?: number | null;    // used for income-source
  currentAmount?: number | null;  // used for income-source
  rows?: AnyProjectionRow[];
};