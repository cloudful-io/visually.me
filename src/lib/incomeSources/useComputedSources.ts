import { useMemo } from "react";
import { NormalizedSource } from "./types";
import {
  calculateFersPensionProjectionWithOverrides,
  calculateMilitaryPensionProjectionWithOverrides,
  calculateRetirementSavingsProjectionWithOverrides,
  calculateSocialSecurityBenefitProjectionWithOverrides,
} from "financial-calcs";

export function useComputedSources(
  rawData: NormalizedSource[] | null,
  userAttributes: any | undefined
) {
  return useMemo(() => {
    if (!rawData) return null;

    const currentYear = new Date().getFullYear();

    return rawData.map((src) => {
      const parsed = src.parsedData ?? {};
      let label = src.label ?? "(unknown)";
      let mergedFields: any | null = null;
      let firstYear: number | null = null;
      let firstAmount: number | null = null;
      let currentAmount: number | null = null;
      let rows: any[] = [];
      try {
        /* Merge in user attributes where applicable */
        const base = {
          birthYear: userAttributes?.birthYear,
          startYear: userAttributes?.startYear,
          yearsToProject: userAttributes?.yearsToProject,
        };

        const getRowByYear = (year: number) =>
          rows.find((r) => r.year === year);

        if (src.type === "fers-pension") {
          mergedFields = { ...parsed.fields, ...base, retirementAge: userAttributes?.targetRetirementAge };
          rows = rows = calculateFersPensionProjectionWithOverrides({
            ...mergedFields,
            yearOverrides: src.parsedData.yearOverrides ?? {}
          });
          const firstRow = rows.find((r) => (r.pension ?? 0) > 0);
          firstYear = firstRow?.year ?? null;
          firstAmount = firstRow?.pension ?? null;

          if (firstYear && currentYear >= firstYear) {
            currentAmount = getRowByYear(currentYear)?.pension ?? firstAmount;
          }
        }
        else if (src.type === "military-pension") {
          mergedFields = { ...parsed.fields, ...base };
          rows = calculateMilitaryPensionProjectionWithOverrides({
            ...mergedFields,
            yearOverrides: src.parsedData.yearOverrides ?? {}
          });
          const firstRow = rows.find((r) => (r.pension ?? 0) > 0);
          firstYear = firstRow?.year ?? null;
          firstAmount = firstRow?.pension ?? null;

          if (firstYear && currentYear >= firstYear) {
            currentAmount = getRowByYear(currentYear)?.pension ?? firstAmount;
          }
        }
        else if (src.type === "retirement-savings") {
          mergedFields = { ...parsed.fields, ...base };
          rows = calculateRetirementSavingsProjectionWithOverrides({
            ...mergedFields,
            yearOverrides: src.parsedData.yearOverrides ?? {}
          });
          const firstRow = rows.find((r) => (r.annualWithdraw ?? 0) > 0);
          firstYear = firstRow?.year ?? null;
          firstAmount = firstRow?.annualWithdraw ?? null;

          if (firstYear && currentYear >= firstYear) {
            currentAmount =
              getRowByYear(currentYear)?.annualWithdraw ?? firstAmount;
          }
        }
        else if (src.type === "social-security") {
          mergedFields = { ...parsed.fields, ...base };
          rows = calculateSocialSecurityBenefitProjectionWithOverrides({
            ...mergedFields,
            yearOverrides: src.parsedData.yearOverrides ?? {}
          });
          const firstRow = rows.find((r) => (r.annualBenefit ?? 0) > 0);
          firstYear = firstRow?.year ?? null;
          firstAmount = firstRow?.annualBenefit ?? null;

          if (firstYear && currentYear >= firstYear) {
            currentAmount =
              getRowByYear(currentYear)?.annualBenefit ?? firstAmount;
          }
        }
      } catch { 
        mergedFields = null; 
        firstYear = null;
        firstAmount = null;
        currentAmount = null;
      }

      return { ...src, label, mergedFields, firstYear, firstAmount, currentAmount};
    });
  }, [rawData, userAttributes]);
}
