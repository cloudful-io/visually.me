import { useUserAttributes } from "@/lib/userAttributes/hook";
import { useIncomeSourcesFetch } from "./useIncomeSourcesFetch";
import { useComputedSources } from "./useComputedSources";
import { useProjectionTables } from "./useProjectionTables";
import { useCombinedProjections } from "./useCombinedProjections";

export function useIncomeSources({ lazy = false } = {}) {
  
  const fetchLayer = useIncomeSourcesFetch({ lazy });

  const { data: attrs } = useUserAttributes();

  const computedSources = useComputedSources(fetchLayer.data, attrs);

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
