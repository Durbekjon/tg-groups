import { useCallback, useEffect, useState } from "react";

export function useVisitors() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCount = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/visitors");
      if (!res.ok) throw new Error("Failed to fetch visitors");
      const json = (await res.json()) as { count: number };
      setCount(json.count);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCount();
  }, [fetchCount]);

  return { count, loading, refetch: fetchCount };
}


