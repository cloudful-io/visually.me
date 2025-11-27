import { useMemo } from "react";
import { useUserAttributes } from "@/lib/userAttributes/hook";
import { useIncomeSourcesFetch } from "./useIncomeSourcesFetch";
import { useComputedSources } from "./useComputedSources";
import { useProjectionTables } from "./useProjectionTables";
import { useCombinedProjections } from "./useCombinedProjections";

export function useIncomeSources({ lazy = false } = {}) {
  
  const fetchLayer = useIncomeSourcesFetch({ lazy });

  const { data: attrs } = useUserAttributes();

  /* Sort income sources by label */
  const sortedData = useMemo(() => {
    if (!fetchLayer.data) return fetchLayer.data;
    return [...fetchLayer.data].sort((a, b) =>
      (a.label ?? "").localeCompare(b.label ?? "")
    );
  }, [fetchLayer.data]);

  const computedSources = useComputedSources(sortedData, attrs);

  const projectionTables = useProjectionTables(computedSources);

  const {
    getAllProjectionTables,
    getCombinedProjection,
    getCombinedChartRows,
  } = useCombinedProjections(computedSources, projectionTables);

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
    computedSources,
    projectionTables,
    getAllProjectionTables,
    getCombinedProjection,
    getCombinedChartRows,
  };
}
