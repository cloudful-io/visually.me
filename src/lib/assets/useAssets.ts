import { useMemo } from "react";
import { useUserAttributes } from "@/lib/userAttributes/hook";
import { useAssetsFetch } from "./useAssetsFetch";
import { useComputedAssets } from "./useComputedAssets";
import { useProjectionTables } from "./useProjectionTables";
import { useCombinedProjections } from "./useCombinedProjections";
import { AssetCategory } from "./types";

type UseAssetsOptions = {
  category?: AssetCategory;
  lazy?: boolean;
};

export function useAssets({ category, lazy = false }: UseAssetsOptions = {}) {
  
  const { data, loading, save, remove, refresh, setData } = useAssetsFetch({ category, lazy });
  const { data: attrs } = useUserAttributes({spouse: false});
  const { data: spouseAttrs, exists: hasSpouse } = useUserAttributes({spouse: true});

  const sortedData = useMemo(() => {
    if (!data) return data;
    return [...data].sort((a, b) =>
      (a.label ?? "").localeCompare(b.label ?? "")
    );
  }, [data]);

  const computedAssets = useComputedAssets(
    sortedData, 
    {
      primary: attrs,
      spouse: hasSpouse ? spouseAttrs : undefined,
    }
  );

  const projectionTables = useProjectionTables(computedAssets);

  const {
    getAllProjectionTables,
    getCombinedProjection,
    getCombinedChartRows,
  } = useCombinedProjections(computedAssets);

  // ----------------------------
  // Public API
  // ----------------------------
  return {
    data,
    loading,
    save,
    remove,
    refresh,
    setData,
    computedAssets,
    projectionTables,
    getAllProjectionTables,
    getCombinedProjection,
    getCombinedChartRows,
  };
}
