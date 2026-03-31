import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../lib/formatters";

interface AsyncDataState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  reload: () => void;
}

/**
 * Hook for fetching async data with loading/error states.
 * Eliminates the repeated try/catch/setLoading/setError pattern across pages.
 *
 * @param fetcher - async function that returns data
 * @param options
 * @param options.errorMessage - fallback error message
 * @param options.enabled - whether to fetch (default: true)
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  options: {
    errorMessage?: string;
    enabled?: boolean;
  } = {},
): AsyncDataState<T> {
  const { errorMessage = "Не удалось загрузить данные", enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(getErrorMessage(err, errorMessage));
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher]);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    void load();
  }, [enabled, load]);

  return { data, error, isLoading, reload: load };
}
