"use client";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export default function useManualQuery<T>(options: {
  queryKey: QueryKey;
  queryFn: () => Promise<T>;
  enabled: boolean;
}) {
  const [shouldFetch, setShouldFetch] = useState(false);

  const query = useQuery<T>({
    queryKey: options.queryKey,
    queryFn: options.queryFn,
    enabled: shouldFetch,
    // Retry configuration if needed
    retry: 1,
  });

  const trigger = useCallback(() => {
    setShouldFetch(true);
  }, []);

  const reset = useCallback(() => {
    setShouldFetch(false);
  }, []);

  return {
    ...query,
    trigger,
    reset,
    isTriggered: shouldFetch,
  };
}
