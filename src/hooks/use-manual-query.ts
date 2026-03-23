// hooks/use-manual-query.ts
import { useCallback, useState } from "react";
import { useQuery, UseQueryOptions, UseQueryResult, useQueryClient } from "@tanstack/react-query";

type ManualQueryMethods<TParams, TData> = {
  execute: (params: TParams) => Promise<TData>;
  isExecuting: boolean;
};

export type UseManualQueryResult<TData = unknown, TParams = any> = Omit<
  UseQueryResult<TData, Error>,
  "refetch"
> &
  ManualQueryMethods<TParams, TData>;

export default function useManualQuery<TData = unknown, TParams = any>(
  options: Omit<UseQueryOptions<TData, Error>, "enabled" | "queryFn" | "queryKey"> & {
    queryKey: any[];
    queryFn: (params: TParams) => Promise<TData>;
  },
): UseManualQueryResult<TData, TParams> {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentParams, setCurrentParams] = useState<TParams | null>(null);
  const queryClient = useQueryClient();

  const query = useQuery<TData, Error>({
    ...options,
    queryKey: [...options.queryKey, currentParams],
    queryFn: () => {
      if (!currentParams) {
        throw new Error("No params provided");
      }
      return options.queryFn(currentParams);
    },
    enabled: currentParams !== null,
    retry: options.retry ?? 1,
    staleTime: 0,
  });

  const execute = useCallback(
    async (params: TParams): Promise<TData> => {
      setIsExecuting(true);
      setCurrentParams(params);

      return new Promise((resolve, reject) => {
        // Subscribe to query state changes
        const unsubscribe = queryClient.getQueryCache().subscribe(() => {
          const state = queryClient.getQueryState<TData, Error>([...options.queryKey, params]);

          if (state?.status === "success") {
            unsubscribe();
            resolve(state.data as TData);
            setIsExecuting(false);
          } else if (state?.status === "error") {
            unsubscribe();
            reject(state.error);
            setIsExecuting(false);
          }
        });

        // Timeout after 30 seconds
        setTimeout(() => {
          unsubscribe();
          reject(new Error("Query timeout after 30 seconds"));
          setIsExecuting(false);
        }, 30000);
      });
    },
    [queryClient, options.queryKey],
  );

  // Create a new object without the refetch property
  const { refetch, ...queryWithoutRefetch } = query;

  return {
    ...queryWithoutRefetch,
    execute,
    isExecuting,
    isLoading: isExecuting || query.isLoading,
  } as UseManualQueryResult<TData, TParams>;
}
