import { useMemo } from "react";
import { NormalizedAsset } from "./types";
import { assetRegistry } from "./registry";

export function useComputedAssets(
  rawData: NormalizedAsset[] | null,
  userAttributes: {
    primary?: any;
    spouse?: any;
  }
) {
  return useMemo(() => {
    if (!rawData) return null;

    const currentYear = new Date().getFullYear();

    return rawData.map((asset) => {
      const def = assetRegistry[asset.asset_type];
      
      const attrsForAsset =
        asset.spouse && userAttributes.spouse
          ? userAttributes.spouse
          : userAttributes.primary;
          
      if (!def?.compute) {
        return {
          ...asset,
          mergedFields: asset.mergedFields ?? null,
          firstYear: asset.firstYear ?? null,
          firstAmount: asset.firstAmount ?? null,
          currentAmount: asset.currentAmount ?? null,
          rows: asset.rows ?? [],
        };
      }

      try {
        const result = def.compute({
          asset,
          userAttributes: attrsForAsset,
          currentYear,
        });

        return {
          ...asset,
          ...result,
        };
      } catch (err) {
        console.error("compute failed for", asset.id, err);
        return {
          ...asset,
          mergedFields: null,
          firstYear: null,
          firstAmount: null,
          currentAmount: null,
          rows: []
        };
      }
    });
  }, [rawData, userAttributes]);
}