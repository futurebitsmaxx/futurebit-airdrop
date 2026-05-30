'use client';

import { useState, useEffect } from 'react';
import { STAKING_PARAMS } from './contractConfig';

interface APYResult {
  apy: number;
  loading: boolean;
}

export function useAPY(): APYResult {
  const [apy, setApy] = useState<number>(STAKING_PARAMS.baseApyMax);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/apy')
      .then(r => r.json())
      .then(data => { if (!cancelled) setApy(data.apy ?? STAKING_PARAMS.baseApyMax); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { apy, loading };
}
