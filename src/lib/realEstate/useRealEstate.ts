import { useMemo } from "react";
import { useUserAttributes } from "@/lib/userAttributes/hook";
import { useRealEstateFetch } from "./useRealEstateFetch";
import { useComputedProperties } from "./useComputedProperties";
import { useProjectionTables } from "./useProjectionTables";
import { useCombinedProjections } from "./useCombinedProjections";

export function useRealEstate({ lazy = false } = {}) {
  
  const fetchLayer = useRealEstateFetch({ lazy });

  const { data: attrs } = useUserAttributes();

  /* Sort properties by label */
  const sortedData = useMemo(() => {
    if (!fetchLayer.data) return fetchLayer.data;
    return [...fetchLayer.data].sort((a, b) =>
      (a.label ?? "").localeCompare(b.label ?? "")
    );
  }, [fetchLayer.data]);

  const computedProperties = useComputedProperties(sortedData, attrs);

  const projectionTables = useProjectionTables(computedProperties);

  const {
    getAllProjectionTables,
    getCombinedProjection,
    getCombinedChartRows,
  } = useCombinedProjections(computedProperties, projectionTables);

  // ----------------------------
  // Public API
  // ----------------------------
  return {
    data: fetchLayer.data,
    loading: fetchLayer.loading,
    save: fetchLayer.save,
    remove: fetchLayer.remove,
    refresh: fetchLayer.refresh,
    setData: fetchLayer.setData,
    computedProperties,
    projectionTables,
    getAllProjectionTables,
    getCombinedProjection,
    getCombinedChartRows,
  };
}
