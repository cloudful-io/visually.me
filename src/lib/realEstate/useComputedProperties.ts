import { useMemo } from "react";
import { NormalizedProperty } from "./types";
import {
  calculateRealEstatePropertyProjectionWithOverrides
} from "financial-calcs";

export function useComputedProperties(
  rawData: NormalizedProperty[] | null,
  userAttributes: any | undefined
) {
  return useMemo(() => {
    if (!rawData) return null;

    const currentYear = new Date().getFullYear();

    return rawData.map((property) => {
      const parsed = property.parsedData ?? {};
      let label = property.label ?? "(unknown)";
      let address = property.address ?? "";
      let mergedFields: any | null = null;
      let rows: any[] = [];
      try {
        /* Merge in user attributes where applicable */
        const base = {
          birthYear: userAttributes?.birthYear,
          startYear: userAttributes?.startYear,
          yearsToProject: userAttributes?.yearsToProject,
        };

        mergedFields = { ...parsed.fields, ...base };
        rows = calculateRealEstatePropertyProjectionWithOverrides({
            ...mergedFields,
            yearOverrides: property.parsedData.yearOverrides ?? {}
          });
      } catch { 
        mergedFields = null; 
      }

      return { ...property, label, address, mergedFields};
    });
  }, [rawData, userAttributes]);
}
