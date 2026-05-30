import { FBIT_MINT, SOL_MINT, JUPITER_PRICE_API } from '@/lib/jupiterConfig';

export const runtime = 'nodejs';

interface PriceResult {
  price:      number;   // USD per FBiT
  buyPrice:   number;
  sellPrice:  number;
  confidence: string;
  source:     string;
  ts:         number;
}

let cache: PriceResult | null = null;
const TTL = 30_000; // 30 seconds

interface JupPriceResponse {
  data: Record<string, {
    id:    string;
    price: string;
    extraInfo?: {
      quotedPrice?: { buyPrice: string; sellPrice: string };
      confidenceLevel?: 'high' | 'medium' | 'low';
    };
  }>;
}

async function fetchViaPriceAPI(): Promise<PriceResult | null> {
  const res  = await fetch(JUPITER_PRICE_API, { cache: 'no-store' });
  const json = await res.json() as JupPriceResponse;
  const entry = json?.data?.[FBIT_MINT];
  if (!entry) return null;

  const price     = parseFloat(entry.price);
  if (!price) return null;
  const buyPrice  = parseFloat(entry.extraInfo?.quotedPrice?.buyPrice  ?? entry.price);
  const sellPrice = parseFloat(entry.extraInfo?.quotedPrice?.sellPrice ?? entry.price);

  return { price, buyPrice, sellPrice, confidence: entry.extraInfo?.confidenceLevel ?? 'unknown', source: 'price-api', ts: Date.now() };
}

async function fetchViaQuoteAPI(): Promise<PriceResult | null> {
  const SOL_LAMPORTS = 1_000_000_000;

  const solRes   = await fetch(`https://api.jup.ag/price/v2?ids=${SOL_MINT}`, { cache: 'no-store' });
  const solJson  = await solRes.json() as JupPriceResponse;
  const solUSD   = parseFloat(solJson?.data?.[SOL_MINT]?.price ?? '0');
  if (!solUSD) return null;

  const buyRes   = await fetch(
    `https://quote-api.jup.ag/v6/quote?inputMint=${SOL_MINT}&outputMint=${FBIT_MINT}&amount=${SOL_LAMPORTS}&slippageBps=50`,
    { cache: 'no-store' },
  );
  const buyQuote = await buyRes.json() as { outAmount?: string };
  const fbitOut  = parseInt(buyQuote?.outAmount ?? '0');
  if (!fbitOut) return null;

  const fbitPerSol = fbitOut / 1_000_000; // 6 decimals
  const buyPrice   = solUSD / fbitPerSol;

  return { price: buyPrice, buyPrice, sellPrice: buyPrice, confidence: 'medium', source: 'quote-api', ts: Date.now() };
}

export async function GET() {
  if (cache && Date.now() - cache.ts < TTL) {
    return Response.json({ ...cache, cached: true });
  }
  try {
    let result = await fetchViaPriceAPI();
    if (!result) result = await fetchViaQuoteAPI();
    if (result) {
      cache = result;
      return Response.json({ ...result, cached: false });
    }
  } catch { /* fall through */ }

  return Response.json({ price: 0, buyPrice: 0, sellPrice: 0, confidence: 'unknown', source: 'fallback', ts: Date.now(), cached: false });
}
