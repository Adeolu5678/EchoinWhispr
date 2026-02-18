'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface CancellableQueryResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isCancelled: boolean;
  refetch: () => void;
}

export interface CancellableQueryOptions<T> {
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
  retryDelay?: number;
}

export function useCancellableQuery<T>(
  queryFn: (signal: AbortSignal) => Promise<T>,
  deps: React.DependencyList = [],
  options: CancellableQueryOptions<T> = {}
): CancellableQueryResult<T> {
  const {
    enabled = true,
    onSuccess,
    onError,
    retryCount = 0,
    retryDelay = 1000,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryAttemptRef = useRef(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const executeQuery = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);
    setIsCancelled(false);
    setError(null);

    try {
      const result = await queryFn(abortController.signal);

      if (!mountedRef.current) return;
      if (abortController.signal.aborted) {
        setIsCancelled(true);
        setIsLoading(false);
        return;
      }

      setData(result);
      setError(null);
      retryAttemptRef.current = 0;
      onSuccess?.(result);
    } catch (err) {
      if (!mountedRef.current) return;
      if (err instanceof Error && err.name === 'AbortError') {
        setIsCancelled(true);
        setIsLoading(false);
        return;
      }

      const error = err instanceof Error ? err : new Error(String(err));
      
      if (retryAttemptRef.current < retryCount) {
        retryAttemptRef.current++;
        setTimeout(() => {
          if (mountedRef.current) {
            executeQuery();
          }
        }, retryDelay);
        return;
      }

      setError(error);
      onError?.(error);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, retryCount, retryDelay]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    executeQuery();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, executeQuery]);

  const refetch = useCallback(() => {
    retryAttemptRef.current = 0;
    executeQuery();
  }, [executeQuery]);

  return {
    data,
    error,
    isLoading,
    isCancelled,
    refetch,
  };
}

export function useCancellableFetch<T>(
  url: string | null,
  options: RequestInit & { enabled?: boolean; onSuccess?: (data: T) => void; onError?: (error: Error) => void } = {}
): CancellableQueryResult<T> {
  const { enabled = true, onSuccess, onError, ...fetchOptions } = options;

  const queryFn = useCallback(
    async (signal: AbortSignal): Promise<T> => {
      if (!url) {
        throw new Error('URL is required');
      }

      const response = await fetch(url, {
        ...fetchOptions,
        signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    },
    [url, JSON.stringify(fetchOptions)]
  );

  return useCancellableQuery(queryFn, [url, JSON.stringify(fetchOptions)], {
    enabled: enabled && !!url,
    onSuccess,
    onError,
  });
}

export function createCancellableRequest() {
  const abortController = new AbortController();
  
  return {
    signal: abortController.signal,
    abort: () => abortController.abort(),
    isAborted: () => abortController.signal.aborted,
  };
}
