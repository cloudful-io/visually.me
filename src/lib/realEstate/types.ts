import type { RealEstateInput } from "./schema";

export type CombinedRow = {
  year: number;
  age: number;
  monthlyIncome: number;
  annualIncome: number;
  monthlyExpense: number;
  annualExpense: number;
  annualNetCashFlow: number;
  properties: Record<string, number>;
};

export type NormalizedProperty = RealEstateInput & {
  parsedData: any;
  label: string;
  address?: string;
  mergedFields?: any | null;
};