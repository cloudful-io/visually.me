import { useEffect, useState } from "react";
import { IncomeSourcesInput } from "@/lib/incomeSources/schema";

export function useIncomeSources({ lazy = false } = {}) {
  const [data, setData] = useState<IncomeSourcesInput[] | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = "/api/income-sources";

  // ----------------------------
  // Load data on mount (unless lazy)
  // ----------------------------
  useEffect(() => {
    if (lazy) return;

    fetch(API_URL)
      .then(res => res.json())
      .then(json => {
        setData(json || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lazy]);

  // ----------------------------
  // Refresh data
  // ----------------------------
  async function refresh() {
    setLoading(true);
    const res = await fetch(API_URL);
    const json = await res.json();
    setData(json || []);
    setLoading(false);
  }

  // ----------------------------
  // Save (insert or update)
  // ----------------------------
  async function save(source: IncomeSourcesInput & { id?: string }) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(source),
    });

    if (!res.ok) throw new Error("Failed to save income source");

    await refresh();
  }

  // ----------------------------
  // Delete
  // ----------------------------
  async function remove(id: string) {
    const res = await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) throw new Error("Failed to delete income source");

    await refresh();
  }

  return { data, save, remove, refresh, loading };
}
