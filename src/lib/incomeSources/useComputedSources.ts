import { useMemo } from "react";
import { NormalizedSource } from "./types";
import {
  calculateFersPensionProjection,
  calculateMilitaryPensionProjection,
  calculateRetirementSavingsProjection,
  calculateSocialSecurityBenefitProjection,
} from "financial-calcs";

export function useComputedSources(
  rawData: NormalizedSource[] | null,
  userAttributes: any | undefined
) {
  return useMemo(() => {
    if (!rawData) return null;

    return rawData.map((src) => {
      const parsed = src.parsedData ?? {};
      let label = src.label ?? "(unknown)";
      let mergedFields: any | null = null;
      let firstYear: number | null = null;
      let rows: any[] = [];
      try {
        /* Merge in user attributes where applicable */
        const base = {
          birthYear: userAttributes?.birthYear,
          startYear: userAttributes?.startYear,
          yearsToProject: userAttributes?.yearsToProject,
        };
        if (src.type === "fers-pension") {
          mergedFields = { ...parsed.fields, ...base, retirementAge: userAttributes?.targetRetirementAge };
          rows = calculateFersPensionProjection(mergedFields);
          firstYear = rows.find((r) => (r.pension ?? 0) > 0)?.year ?? null;
        }
        else if (src.type === "military-pension") {
          mergedFields = { ...parsed.fields, ...base };
          rows = calculateMilitaryPensionProjection(mergedFields);
          firstYear = rows.find((r) => (r.pension ?? 0) > 0)?.year ?? null;
        }
        else if (src.type === "retirement-savings") {
          mergedFields = { ...parsed.fields, ...base };
          rows = calculateRetirementSavingsProjection(mergedFields);
          firstYear = rows.find((r) => (r.annualWithdraw ?? 0) > 0)?.year ?? null;
        }
        else if (src.type === "social-security") {
          mergedFields = { ...parsed.fields, ...base };
          rows = calculateSocialSecurityBenefitProjection(mergedFields);
          firstYear = rows.find((r) => (r.annualBenefit ?? 0) > 0)?.year ?? null;
        }
      } catch { mergedFields = null; }

      return { ...src, label, mergedFields, firstYear};
    });
  }, [rawData, userAttributes]);
}
