import { useEffect, useState, useCallback } from "react";
import { UserAttributesInput } from "@/lib/userAttributes/schema";

export function useUserAttributes({
  spouse = false,
  lazy = false,
}: {
  spouse?: boolean;
  lazy?: boolean;
})
{
  const [data, setData] = useState<UserAttributesInput | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = `/api/user-attributes${spouse ? "?spouse=true" : ""}`;

  const fetchAttributes = useCallback(async () => {
    setLoading(true);

    const res = await fetch(API_URL);
    const json = await res.json();

    if (!json?.empty) {
      setData(json);
    } else {
      setData(null);
    }

    setLoading(false);
  }, [API_URL]);

  useEffect(() => {
    if (lazy) return;
    fetchAttributes();
  }, [lazy, fetchAttributes]);

  async function refresh() {
    await fetchAttributes();
  }

  async function save(attrs: UserAttributesInput) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...attrs,
        spouse,
      }),
    });

    if (!res.ok) throw new Error("Failed to save user attributes");

    await fetchAttributes();
  }

  async function remove() {
    const res = await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
        
    if (!res.ok) throw new Error("Failed to delete asset");
    await refresh();
  }

  const exists = !!data;

  return { data, save, refresh, remove, loading, spouse, exists };
}
