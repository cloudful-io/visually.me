import { useCallback, useEffect, useRef, useState } from "react";
import { IncomeSourcesInput } from "@/lib/incomeSources/schema";
import type { NormalizedSource } from "./types";
const API_URL = "/api/income-sources";

export function useIncomeSourcesFetch({ lazy = false } = {}) {
  const [data, setData] = useState<NormalizedSource[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchIdRef = useRef(0);

  const normalize = useCallback((src: IncomeSourcesInput): NormalizedSource => {
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
          console.error("useIncomeSourcesFetch error", err);
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
    async (source: IncomeSourcesInput & { id?: string }) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(source),
      });
      if (!res.ok) throw new Error("Failed to save income source");
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
      if (!res.ok) throw new Error("Failed to delete income source");
      await refresh();
    },
    [refresh]
  );

  return { data, loading, refresh, save, remove, setData };
}
