import { useCallback, useEffect, useMemo,  useState } from "react";
import { UserChildInput, UserChildRecord } from "./schema";

export function useUserChildren({ lazy = false }: { lazy?: boolean } = {}) {
  const [data, setData] = useState<UserChildRecord[] | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = "/api/user-children";

  const sortedData = useMemo(() => {
    if (!data) return null;

    return [...data].sort((a, b) =>
      (a.label ?? "").localeCompare(b.label ?? "")
    );
  }, [data]);

  const fetchChildren = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    const res = await fetch(API_URL);
    const json = await res.json();

    setData(json?.empty ? null : json);
    if (showLoading) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!lazy) {
      fetchChildren(true);
    }
  }, [lazy, fetchChildren]);

  const refresh = useCallback(async () => {
    await fetchChildren(false);
  }, [fetchChildren]);

  async function save(children: UserChildInput[]) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ children }),
    });

    if (!res.ok) throw new Error("Failed to save user children");
  }

  async function remove(childId?: string) {
    const url = childId
      ? `${API_URL}?id=${encodeURIComponent(childId)}`
      : API_URL;

    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to delete user children");
    await refresh();
  }

  const exists = !!data && data.length > 0;

  return { data: sortedData, save, refresh, remove, loading, exists };
}
