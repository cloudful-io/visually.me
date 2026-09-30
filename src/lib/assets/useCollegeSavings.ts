import { useAssets } from "./useAssets";

export function useCollegeSavings({ lazy = false, joint = true } = {}) {
  return useAssets({
    category: "college-savings",
    lazy,
    joint
  });
}