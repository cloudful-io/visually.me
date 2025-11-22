import { useMemo } from "react";
import { NormalizedSource } from "./types";

export function useComputedSources(
  rawData: NormalizedSource[] | null,
  attrs: any | undefined
) {
  return useMemo(() => {
    if (!rawData) return null;

    return rawData.map((src) => {
      const parsed = src.parsedData ?? {};
      let label = src.label ?? "(unknown)";
      let mergedFields: any | null = null;
      try {
        const base = {
          birthYear: attrs?.birthYear,
          startYear: attrs?.startYear,
          yearsToProject: attrs?.yearsToProject,
        };
        if (src.type === "fers-pension") mergedFields = { ...parsed.fields, ...base, retirementAge: attrs?.targetRetirementAge };
        else if (src.type === "retirement-savings") mergedFields = { ...parsed.fields, ...base, withdrawStartAge: attrs?.targetRetirementAge };
        else if (src.type === "social-security") mergedFields = { ...parsed.fields, ...base };
      } catch { mergedFields = null; }

      return { ...src, label, mergedFields, firstYear: src.firstYear ?? null };
    });
  }, [rawData, attrs]);
}
