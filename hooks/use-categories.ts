import { useCallback, useEffect, useState } from "react";

export interface CategoryDto {
  id: string;
  name: string;
  _count?: { groups: number };
}

export function useCategories() {
  const [data, setData] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    const controller = new AbortController();
    try {
      const res = await fetch("/api/categories", { signal: controller.signal });
      if (!res.ok) throw new Error("Failed to fetch categories");
      const json = (await res.json()) as CategoryDto[];
      setData(json);
    } catch (err) {
      if ((err as Error).name !== "AbortError") setError((err as Error).message);
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const createCategory = useCallback(async (name: string) => {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to create category");
    const created = (await res.json()) as CategoryDto;
    setData((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    return created;
  }, []);

  return { categories: data, loading, error, refetch: fetchCategories, createCategory };
}


