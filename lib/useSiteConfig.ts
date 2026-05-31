'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SiteConfig } from '@/app/api/site-config/route';

const POLL_INTERVAL_MS = 60_000; // re-fetch every 60 seconds

export function useSiteConfig() {
  const [config,    setConfig]    = useState<SiteConfig | null>(null);
  const [lastFetch, setLastFetch] = useState(0);
  const [changed,   setChanged]   = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/site-config', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json() as SiteConfig;
      setConfig(prev => {
        // Detect change in key fields — trigger animation signal
        if (prev && prev.totalPrize !== data.totalPrize) {
          setChanged(true);
          setTimeout(() => setChanged(false), 2000);
        }
        return data;
      });
      setLastFetch(Date.now());
    } catch { /* keep previous value */ }
  }, []);

  // First fetch on mount
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void fetchConfig(); }, [fetchConfig]);

  // Poll every 60 seconds
  useEffect(() => {
    const id = setInterval(() => void fetchConfig(), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchConfig]);

  return { config, lastFetch, prizeChanged: changed };
}
