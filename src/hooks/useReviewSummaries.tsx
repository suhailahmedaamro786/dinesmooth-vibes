import { useEffect, useState } from "react";
import { fetchReviewSummaries, type ReviewSummary } from "@/lib/reviews";

let cache: Map<string, ReviewSummary> | null = null;
const listeners = new Set<(m: Map<string, ReviewSummary>) => void>();

async function refresh() {
  cache = await fetchReviewSummaries();
  listeners.forEach((l) => l(cache!));
}

export function useReviewSummaries() {
  const [map, setMap] = useState<Map<string, ReviewSummary>>(cache ?? new Map());

  useEffect(() => {
    listeners.add(setMap);
    if (!cache) refresh();
    return () => { listeners.delete(setMap); };
  }, []);

  return { map, refresh };
}
