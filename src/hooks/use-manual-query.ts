// hooks/use-manual-query.ts
import { useCallback, useState } from "react";
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

type ManualQueryMethods = {
  execute: () => Promise<any>;
  isLoading: boolean;
};

export type UseManualQueryResult<TData = unknown, TError = unknown> = UseQueryResult<TData, TError> &
  ManualQueryMethods;

export default function useManualQuery<TData = unknown, TError = unknown>(
  options: Omit<UseQueryOptions<TData, TError>, "enabled">,
): UseManualQueryResult<TData, TError> {
  const [enabled, setEnabled] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);

  const query = useQuery<TData, TError>({
    ...options,
    enabled: enabled,
  });

  const execute = useCallback(async (): Promise<TData | undefined> => {
    try {
      setManualLoading(true);
      setEnabled(true);

      await query.refetch();
      return query.data;
    } catch (error) {
      throw error;
    } finally {
      setManualLoading(false);
    }
  }, [query]);

  return {
    ...query,
    execute,
    isLoading: manualLoading || query.isLoading,
  } as UseManualQueryResult<TData, TError>;
}
