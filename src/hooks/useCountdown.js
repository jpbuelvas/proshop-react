import { useState, useEffect, useMemo } from 'react';

export function useCountdown(dateStr = '2026-07-26') {
  const target = useMemo(() => new Date(`${dateStr}T00:00:00`), [dateStr]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const diff = Math.max(0, target - now);
  const pad = (n) => String(n).padStart(2, '0');

  return {
    d: pad(Math.floor(diff / 86400000)),
    h: pad(Math.floor((diff % 86400000) / 3600000)),
    m: pad(Math.floor((diff % 3600000) / 60000)),
    s: pad(Math.floor((diff % 60000) / 1000)),
  };
}
