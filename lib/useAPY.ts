'use client';

import { useState, useEffect } from 'react';
import { STAKING_PARAMS } from './contractConfig';

export const APY_OVERRIDE_KEY = 'fbit-admin-apy';

interface APYResult {
  apy:     number;
  loading: boolean;
}

export function useAPY(): APYResult {
  const [apy,     setApy]     = useState<number>(STAKING_PARAMS.baseApyMax);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check admin localStorage override first (instant, no network)
    try {
      const raw = localStorage.getItem(APY_OVERRIDE_KEY);
      if (raw) {
        const val = Number(JSON.parse(raw));
        if (Number.isFinite(val) && val >= 1 && val <= 9999) {
          setApy(val);
          setLoading(false);
          return;
        }
      }
    } catch { /* fall through to API */ }

    // 2. Fetch live from Solana program via server route
    let cancelled = false;
    fetch('/api/apy')
      .then(r => r.json())
      .then(data => {
        if (!cancelled) setApy(data.apy ?? STAKING_PARAMS.baseApyMax);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { apy, loading };
}
