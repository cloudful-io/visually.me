import { useCallback, useEffect, useRef, useState } from "react";
import { RealEstateInput } from "@/lib/realEstate/schema";
import type { NormalizedProperty } from "./types";
const API_URL = "/api/real-estate";

export function useRealEstateFetch({ lazy = false } = {}) {
  const [data, setData] = useState<NormalizedProperty[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchIdRef = useRef(0);

  const normalize = useCallback((src: RealEstateInput): NormalizedProperty => {
    let parsed: any = {};
    let label = "(unknown)";
    let address = "";

    try {
      parsed = JSON.parse(src.data || "{}");
      label = parsed?.label ?? "(unknown)";
      address = parsed?.address ?? "";
    } catch {}
    return { ...src, parsedData: parsed, label, address, mergedFields: null };
  }, []);

  const doFetch = useCallback(
    async (opts?: { signal?: AbortSignal }) => {
      const id = ++fetchIdRef.current;
      setLoading(true);
      try {
        const res = await fetch(API_URL, { signal: opts?.signal });
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
          console.error("useRealEstateFetch error", err);
        }
      }
    },
    [normalize]
  );

  useEffect(() => {
    if (lazy) return setLoading(false);
    const controller = new AbortController();
    doFetch({ signal: controller.signal });
    return () => controller.abort();
  }, [doFetch, lazy]);

  const refresh = useCallback(async () => doFetch(), [doFetch]);

  const save = useCallback(
    async (property: RealEstateInput & { id?: string }) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(property),
      });
      if (!res.ok) throw new Error("Failed to save real estate property");
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
      if (!res.ok) throw new Error("Failed to delete real estate property");
      await refresh();
    },
    [refresh]
  );

  return { data, loading, refresh, save, remove, setData };
}
