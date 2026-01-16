import {
  calculateFersPensionProjectionWithOverrides,
  calculateMilitaryPensionProjectionWithOverrides,
  calculateRetirementSavingsProjectionWithOverrides,
  calculateSocialSecurityBenefitProjectionWithOverrides,
  calculateRealEstatePropertyProjectionWithOverrides,
} from "financial-calcs";
import { AssetCategory, NormalizedAsset } from "./types";
import { AnyProjectionRow } from "./types";
import type { CalculatorId } from "../calculators/registry";

type ComputeArgs = {
  asset: NormalizedAsset;
  userAttributes: any;
  currentYear: number;
};

type ProjectionFn = (input: any) => any[];

export function computeIncomeAsset(
  projectionFn: ProjectionFn,
  amountKey: string,
  options?: {
    additionalMergedFields?: (userAttributes: any) => Record<string, any>;
  }
) {
  return ({ asset, userAttributes, currentYear }: ComputeArgs) => {
    const parsed = asset.parsedData ?? {};
    const baseMergedFields = getBaseMergedFields(userAttributes);
    const mergedFields = {
      ...parsed.fields,
      ...baseMergedFields,
      ...(options?.additionalMergedFields?.(userAttributes) ?? {}),
    };

    const baseFieldsReady = Object.values(baseMergedFields).every(
      v => v !== undefined
    );
    try {
      if (baseFieldsReady) {
        const rows = projectionFn({
          ...mergedFields,
          yearOverrides: asset.parsedData.yearOverrides ?? {},
        });

        const firstRow = rows.find(r => (r[amountKey] ?? 0) > 0);
        const firstYear = firstRow?.year ?? null;
        const firstAmount = firstRow?.[amountKey] ?? null;

        const currentAmount =
          firstYear && currentYear >= firstYear
            ? rows.find(r => r.year === currentYear)?.[amountKey] ?? firstAmount
            : null;

        return { mergedFields, firstYear, firstAmount, currentAmount, rows };
      }
      else {
        return { mergedFields, firstYear: null, firstAmount: null, currentAmount: null, rows: [] };
      }
    } 
    catch (err) {
      console.error("Projection failed for", asset.id, err);
      return { mergedFields, firstYear: null, firstAmount: null, currentAmount: null, rows: [] };
    }
  };
}

export function computeRealEstateAsset(
  projectionFn: ProjectionFn
) {
  return ({ asset, userAttributes, currentYear }: ComputeArgs) => {
    const parsed = asset.parsedData ?? {};

    const mergedFields = {
      ...parsed.fields,
      ...getBaseMergedFields(userAttributes),    
    };

    const rows = projectionFn({
      ...mergedFields,
      yearOverrides: asset.parsedData.yearOverrides ?? {},
    });

    return { mergedFields, firstYear: null, firstAmount: null, currentAmount: null, rows };
  };
}

function getBaseMergedFields(userAttributes: any) {
  return {
    birthYear: userAttributes?.birthYear,
    startYear: userAttributes?.startYear,
    lifeExpectancyAge: userAttributes?.lifeExpectancyAge,
  };
}

export interface AssetDefinition<FormValues = any, Row = any, Context = any> {
  category: AssetCategory;
  calculatorId?: CalculatorId;

  // Optional capabilities
  projection?: ProjectionFn;
  compute?: (args: ComputeArgs) => {
    mergedFields: any;
    firstYear: number | null;
    firstAmount: number | null;
    currentAmount: number | null;
    rows?: AnyProjectionRow[];
  };
  incomeKey?: string | string[];
  balanceKey?: string;
}

export const assetRegistry: Record<string, AssetDefinition> = {
  "fers-pension": {
    category: "income-source",
    calculatorId: "fers-pension",
    projection: calculateFersPensionProjectionWithOverrides,
    compute: computeIncomeAsset(
      calculateFersPensionProjectionWithOverrides,
      "pension",
      {
        additionalMergedFields: ua => ({ retirementAge: ua?.targetRetirementAge }),
      }
    ),
    incomeKey: ["pension", "salary"],
  },

  "military-pension": {
    category: "income-source",
    calculatorId: "military-pension",
    projection: calculateMilitaryPensionProjectionWithOverrides,
    compute: computeIncomeAsset(
      calculateMilitaryPensionProjectionWithOverrides,
      "pension"
    ),
    incomeKey: "pension",
  },

  "retirement-savings": {
    category: "income-source",
    calculatorId: "retirement-savings",
    projection: calculateRetirementSavingsProjectionWithOverrides,
    compute: computeIncomeAsset(
      calculateRetirementSavingsProjectionWithOverrides,
      "annualWithdraw"
    ),
    incomeKey: "annualWithdraw",
    balanceKey: "endingBalance",
  },

  "social-security": {
    category: "income-source",
    calculatorId: "social-security",
    projection: calculateSocialSecurityBenefitProjectionWithOverrides,
    compute: computeIncomeAsset(
      calculateSocialSecurityBenefitProjectionWithOverrides,
      "annualBenefit"
    ),
    incomeKey: "annualBenefit",
  },

  "real-estate": {
    category: "property",
    projection: calculateRealEstatePropertyProjectionWithOverrides,
    compute: computeRealEstateAsset(
      calculateRealEstatePropertyProjectionWithOverrides
    ),
    incomeKey: "annualIncome",
  },
};


