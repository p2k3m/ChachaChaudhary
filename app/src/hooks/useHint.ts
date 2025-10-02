import { useCallback, useState } from 'react';
import { environment } from '../config/environment';
import { useGameStore } from '../state/gameStore';

interface HintResponse {
  hint: string;
  source: 'cache' | 'llm';
}

const HINT_CACHE_KEY = 'missing-mangoes-hint-cache';

type HintCache = Record<string, HintResponse>;

const readCache = (): HintCache => {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(HINT_CACHE_KEY);
    return raw ? (JSON.parse(raw) as HintCache) : {};
  } catch (error) {
    console.error('Failed to parse hint cache', error);
    return {};
  }
};

const writeCache = (cache: HintCache) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(HINT_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to store hint cache', error);
  }
};

export const useHint = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<HintResponse | null>(null);
  const markHintUsed = useGameStore((state) => state.markHintUsed);

  const requestHint = useCallback(
    async (context: Record<string, unknown>) => {
      setLoading(true);
      setError(null);
      const cacheKey = JSON.stringify(context);
      const cache = readCache();

      if (cache[cacheKey]) {
        setResponse(cache[cacheKey]);
        markHintUsed();
        setLoading(false);
        return cache[cacheKey];
      }

      try {
        const result = await fetch(`${environment.hintApiBase}/hint`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            context,
            locale: navigator.language,
            episode: 'missing-mangoes-phase-1'
          })
        });

        if (!result.ok) {
          const payload = await result.json().catch(() => null);
          throw new Error(
            payload?.message ??
              `Hint service responded with status ${result.status}. Ensure the Lambda is deployed and API Gateway URL is correct.`
          );
        }

        const payload = (await result.json()) as HintResponse;
        cache[cacheKey] = payload;
        writeCache(cache);
        setResponse(payload);
        markHintUsed();
        return payload;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error requesting hint.';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [markHintUsed]
  );

  return {
    loading,
    error,
    response,
    requestHint
  };
};
