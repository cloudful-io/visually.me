import { useAssets } from "./useAssets";

export function useRealEstate({ lazy = false } = {}) {
  return useAssets({
    category: "property",
    lazy,
  });
}
