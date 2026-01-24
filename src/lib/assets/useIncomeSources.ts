import { useAssets } from "./useAssets";

export function useIncomeSources({ lazy = false, joint = true } = {}) {
  return useAssets({
    category: "income-source",
    lazy,
    joint
  });
}