import { useMemo } from "react";
import type { NormalizedProperty } from "./types";
import { calculateRealEstatePropertyProjectionWithOverrides, RealEstatePropertyProjectionRow } from "financial-calcs";

export function useProjectionTables(computedProperties: NormalizedProperty[] | null) {
  return useMemo(() => {
    if (!computedProperties) return {} as Record<string, RealEstatePropertyProjectionRow[]>;
    const map: Record<string, RealEstatePropertyProjectionRow[]> = {};

    for (const property of computedProperties) {
      if (!property.mergedFields || Object.values(property.mergedFields).some(v => v == null)) {
        map[property.id!] = [];
        continue;
      }
      try {
        let rows: RealEstatePropertyProjectionRow[] = [];
        rows = calculateRealEstatePropertyProjectionWithOverrides({
            ...property.mergedFields,
            yearOverrides: property.parsedData.yearOverrides ?? {}
          });
        map[property.id!] = rows;
      } catch (err) {
        console.error("projection calc failed for", property.id, err);
        map[property.id!] = [];
      }
    }
    return map;
  }, [computedProperties]);
}
