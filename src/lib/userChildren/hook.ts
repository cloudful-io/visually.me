import { useCallback, useEffect, useState } from "react";
import { UserChildInput, UserChildRecord } from "./schema";

export function useUserChildren({ lazy = false }: { lazy?: boolean } = {}) {
  const [data, setData] = useState<UserChildRecord[] | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = "/api/user-children";

  const fetchChildren = useCallback(async () => {
    setLoading(true);

    const res = await fetch(API_URL);
    const json = await res.json();

    setData(json?.empty ? null : json);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!lazy) {
      fetchChildren();
    }
  }, [lazy, fetchChildren]);

  async function refresh() {
    await fetchChildren();
  }

  async function save(children: UserChildInput[]) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ children }),
    });

    if (!res.ok) throw new Error("Failed to save user children");
    await fetchChildren();
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

  return { data, save, refresh, remove, loading, exists };
}
