import { useEffect, useState } from "react";
import { UserAttributesInput } from "@/lib/userAttributes/schema";

export function useUserAttributes({ lazy = false } = {}) {
  const [data, setData] = useState<UserAttributesInput | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = "/api/user-attributes";

  useEffect(() => {
    if (lazy) return;
    fetch(API_URL)
      .then(res => res.json())
      .then(json => {
        if (!json.empty) setData(json);
        setLoading(false);
      });
  }, [lazy]);

  async function refresh() {
    setLoading(true);
    const res = await fetch("/api/user-attributes");
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  async function save(attrs: UserAttributesInput) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attrs),
    });

    if (!res.ok) throw new Error("Failed to save user attributes");

    await refresh();
  }

  return { data, save, refresh, loading };
}
