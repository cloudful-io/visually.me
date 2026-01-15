import { useMemo } from "react";
import type { NormalizedAsset } from "./types";
import type { AnyProjectionRow } from "./types";

export function useProjectionTables(computedAssets: NormalizedAsset[] | null) {
  return useMemo(() => {
    if (!computedAssets) return {} as Record<string, AnyProjectionRow[]>;

    const map: Record<string, AnyProjectionRow[]> = {};

    for (const asset of computedAssets) {
      map[asset.id!] = asset.rows ?? [];
    }

    return map;
  }, [computedAssets]);
}