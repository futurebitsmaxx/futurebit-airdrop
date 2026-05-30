import { FBIT_MINT, SOL_MINT } from '@/lib/jupiterConfig';

export const runtime = 'nodejs';

interface PriceResult {
  price:      number;
  buyPrice:   number;
  sellPrice:  number;
  confidence: string;
  source:     string;
  ts:         number;
}

let cache: PriceResult | null = null;
const TTL = 30_000;

// ── Method 1: DexScreener (no API key, works for any Solana token) ────────────
async function fetchViaDexScreener(): Promise<PriceResult | null> {
  const res  = await fetch(
    `https://api.dexscreener.com/latest/dex/tokens/${FBIT_MINT}`,
    { cache: 'no-store' },
  );
  const json = await res.json() as { pairs?: { priceUsd?: string; priceNative?: string; liquidity?: { usd?: number } }[] };
  if (!json.pairs?.length) return null;

  // Pick pair with highest liquidity
  const best = json.pairs
    .filter(p => p.priceUsd)
    .sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];

  if (!best?.priceUsd) return null;
  const price = parseFloat(best.priceUsd);
  if (!price) return null;

  return { price, buyPrice: price, sellPrice: price * 0.998, confidence: 'high', source: 'dexscreener', ts: Date.now() };
}

// ── Method 2: Jupiter Price API v2 ───────────────────────────────────────────
async function fetchViaJupiterPrice(): Promise<PriceResult | null> {
  const url  = `https://api.jup.ag/price/v2?ids=${FBIT_MINT}&showExtraInfo=true`;
  const res  = await fetch(url, { cache: 'no-store' });
  const json = await res.json() as { data?: Record<string, { price?: string; extraInfo?: { quotedPrice?: { buyPrice?: string; sellPrice?: string }; confidenceLevel?: string } }> };
  const entry = json?.data?.[FBIT_MINT];
  if (!entry?.price) return null;

  const price     = parseFloat(entry.price);
  if (!price) return null;
  const buyPrice  = parseFloat(entry.extraInfo?.quotedPrice?.buyPrice  ?? entry.price);
  const sellPrice = parseFloat(entry.extraInfo?.quotedPrice?.sellPrice ?? entry.price);

  return { price, buyPrice, sellPrice, confidence: entry.extraInfo?.confidenceLevel ?? 'medium', source: 'jupiter-price', ts: Date.now() };
}

// ── Method 3: Jupiter Quote API (1 SOL → FBiT swap simulation) ───────────────
async function fetchViaQuoteAPI(): Promise<PriceResult | null> {
  const SOL_LAMPORTS = 1_000_000_000;

  const solRes  = await fetch(`https://api.jup.ag/price/v2?ids=${SOL_MINT}`, { cache: 'no-store' });
  const solJson = await solRes.json() as { data?: Record<string, { price?: string }> };
  const solUSD  = parseFloat(solJson?.data?.[SOL_MINT]?.price ?? '0');
  if (!solUSD) return null;

  const quoteRes  = await fetch(
    `https://quote-api.jup.ag/v6/quote?inputMint=${SOL_MINT}&outputMint=${FBIT_MINT}&amount=${SOL_LAMPORTS}&slippageBps=50`,
    { cache: 'no-store' },
  );
  const quote     = await quoteRes.json() as { outAmount?: string };
  const fbitOut   = parseInt(quote?.outAmount ?? '0');
  if (!fbitOut) return null;

  const fbitPerSol = fbitOut / 1_000_000;  // 6 decimals
  const price      = solUSD / fbitPerSol;

  return { price, buyPrice: price, sellPrice: price * 0.997, confidence: 'medium', source: 'jupiter-quote', ts: Date.now() };
}

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return Response.json({ ...cache, cached: true });
  }

  // Try all methods in order — first success wins
  const methods = [fetchViaDexScreener, fetchViaJupiterPrice, fetchViaQuoteAPI];
  for (const method of methods) {
    try {
      const result = await method();
      if (result && result.price > 0) {
        cache = result;
        return Response.json({ ...result, cached: false });
      }
    } catch { /* try next method */ }
  }

  return Response.json({ price: 0, buyPrice: 0, sellPrice: 0, confidence: 'unknown', source: 'unavailable', ts: Date.now(), cached: false });
}
