import { useAssets } from "./useAssets";

export function useRealEstate({ lazy = false, joint = true } = {}) {
  return useAssets({
    category: "property",
    lazy,
    joint
  });
}
