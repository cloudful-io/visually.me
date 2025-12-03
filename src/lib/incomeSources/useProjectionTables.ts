import { useMemo } from "react";
import type { NormalizedSource } from "./types";
import type { AnyProjectionRow } from "./types";
import { calculateFersPensionProjection, calculateFersPensionProjectionWithOverrides, calculateRetirementSavingsProjection, calculateSocialSecurityBenefitProjection } from "financial-calcs";

export function useProjectionTables(computedSources: NormalizedSource[] | null) {
  return useMemo(() => {
    if (!computedSources) return {} as Record<string, AnyProjectionRow[]>;
    const map: Record<string, AnyProjectionRow[]> = {};

    for (const src of computedSources) {
      if (!src.mergedFields || Object.values(src.mergedFields).some(v => v == null)) {
        map[src.id!] = [];
        continue;
      }
      try {
        let rows: AnyProjectionRow[] = [];
        switch (src.type) {
          case "fers-pension": rows = calculateFersPensionProjectionWithOverrides({
            ...src.mergedFields,
            yearOverrides: src.parsedData.yearOverrides ?? {}
          }); break;
          case "retirement-savings": rows = calculateRetirementSavingsProjection(src.mergedFields); break;
          case "social-security": rows = calculateSocialSecurityBenefitProjection(src.mergedFields); break;
          default: rows = [];
        }
        map[src.id!] = rows;
      } catch (err) {
        console.error("projection calc failed for", src.id, err);
        map[src.id!] = [];
      }
    }
    return map;
  }, [computedSources]);
}
