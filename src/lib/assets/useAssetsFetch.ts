import { useCallback, useEffect, useRef, useState } from "react";
import { AssetInput } from "./schema";
import type { AssetCategory, NormalizedAsset } from "./types"
const API_URL = "/api/assets";

export function useAssetsFetch({
  category,
  joint = true,
  lazy = false,
}: {
  category?: AssetCategory;
  joint?: boolean;
  lazy?: boolean;
})
 {
  const [data, setData] = useState<NormalizedAsset[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchIdRef = useRef(0);

  const normalize = useCallback((src: AssetInput): NormalizedAsset => {
    let parsed: any = {};
    let label = "(unknown)";
    try {
      parsed = JSON.parse(src.data || "{}");
      label = parsed?.label ?? "(unknown)";
    } catch {}
    return { ...src, parsedData: parsed, label, mergedFields: null, firstYear: null, firstAmount: null, currentAmount: null };
  }, []);

  const doFetch = useCallback(
    async (opts?: { signal?: AbortSignal }) => {
      const id = ++fetchIdRef.current;
      setLoading(true);
      try {
        const url = new URL(API_URL, window.location.origin);
        url.searchParams.set("category", category ?? "");
        url.searchParams.set("joint", String(joint));

        const res = await fetch(url.toString(), {
          signal: opts?.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        const normalized = (json || []).map(normalize);
        if (id === fetchIdRef.current) {
          setData(normalized);
          setLoading(false);
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          if (id === fetchIdRef.current) setData([]), setLoading(false);
          console.error("useAssetsFetch error", err);
        }
      }
    },
    [normalize, category, joint]
  );

  useEffect(() => {
    if (lazy) return setLoading(false);
    const controller = new AbortController();
    doFetch({ signal: controller.signal });
    return () => controller.abort();
  }, [doFetch, lazy]);

  const refresh = useCallback(async () => doFetch(), [doFetch]);

  const save = useCallback(
    async (source: AssetInput & { id?: string }) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(source),
      });
      if (!res.ok) throw new Error("Failed to save asset");
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      const res = await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete asset");
      await refresh();
    },
    [refresh]
  );

  return { data, loading, refresh, save, remove, setData };
}
