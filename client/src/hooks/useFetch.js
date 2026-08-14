import { useCallback, useEffect, useState } from "react";

// Tiny reusable data-fetching hook: data / loading / error / refetch
export default function useFetch(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const run = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setData(await fn());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line

  useEffect(() => {
    run();
  }, [run]);

  return { data, loading, error, refetch: run };
}
