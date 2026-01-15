import { useAssets } from "./useAssets";

export function useIncomeSources({ lazy = false } = {}) {
  return useAssets({
    category: "income-source",
    lazy,
  });
}