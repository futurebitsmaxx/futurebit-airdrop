'use client';

import { useState, useEffect, useCallback } from 'react';

export interface FBiTPriceData {
  price:      number;
  buyPrice:   number;
  sellPrice:  number;
  confidence: string;
  source:     string;
  loading:    boolean;
}

const EMPTY: FBiTPriceData = { price: 0, buyPrice: 0, sellPrice: 0, confidence: 'unknown', source: '', loading: true };

export function useFBiTPrice(refreshMs = 30_000): FBiTPriceData {
  const [data, setData] = useState<FBiTPriceData>(EMPTY);

  const load = useCallback(() => {
    fetch('/api/fbit-price')
      .then(r => r.json())
      .then((d: Omit<FBiTPriceData, 'loading'>) => setData({ ...d, loading: false }))
      .catch(() => setData(prev => ({ ...prev, loading: false })));
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, refreshMs);
    return () => clearInterval(id);
  }, [load, refreshMs]);

  return data;
}

export function fmtUSD(n: number): string {
  if (n === 0)     return '—';
  if (n < 0.0001)  return '$' + n.toExponential(2);
  if (n < 0.01)    return '$' + n.toFixed(6);
  if (n < 1)       return '$' + n.toFixed(4);
  return '$' + n.toFixed(2);
}
