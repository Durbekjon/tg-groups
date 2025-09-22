import { useCallback, useEffect, useState } from "react";

export interface GroupDto {
  id: string;
  name: string;
  telegramLink: string;
  categoryId: string;
}

export function useGroups(categoryId?: string) {
  const [data, setData] = useState<GroupDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = useCallback(async () => {
    if (!categoryId) {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    try {
      const url = new URL("/api/groups", window.location.origin);
      url.searchParams.set("categoryId", categoryId);
      const res = await fetch(url.toString(), { signal: controller.signal });
      if (!res.ok) throw new Error("Failed to fetch groups");
      const json = (await res.json()) as GroupDto[];
      setData(json);
    } catch (err) {
      if ((err as Error).name !== "AbortError") setError((err as Error).message);
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  }, [categoryId]);

  useEffect(() => {
    void fetchGroups();
  }, [fetchGroups]);

  const createGroup = useCallback(
    async (input: { name: string; telegramLink: string; categoryId: string }) => {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create group");
      const created = (await res.json()) as GroupDto;
      setData((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  return { groups: data, loading, error, refetch: fetchGroups, createGroup };
}


