'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  JUPITER_SWAP_URL,
  JUPITER_TOKEN_URL,
  JUPITER_WATCHLIST,
  JUPITER_PRICE_API,
  TOKEN_INFO,
  SOL_MINT,
} from '@/lib/jupiterConfig';
import { StripPromoBanner } from '@/components/PromoAdBanners';

const JupiterTerminal = dynamic(() => import('@/components/JupiterTerminal'), {
  ssr: false,
  loading: () => (
    <div className="jupiter-loading-state jupiter-terminal-loading-height">
      <div className="jupiter-spinner" />
      <p className="text-gray-400 text-sm mt-4">Loading Jupiter Terminal...</p>
    </div>
  ),
});

// ─── Jupiter Price API types ──────────────────────────────────────────────────

interface JupiterPriceResponse {
  data: Record<string, {
    id:    string;
    price: string;
    extraInfo?: {
      quotedPrice?: {
        buyPrice:  string;
        sellPrice: string;
        buyAt:     number;
        sellAt:    number;
      };
      lastSwappedPrice?: {
        lastJupiterBuyPrice:  string;
        lastJupiterSellPrice: string;
        lastJupiterBuyAt:     number;
        lastJupiterSellAt:    number;
      };
      confidenceLevel?: 'high' | 'medium' | 'low';
    };
  }>;
}

interface FBiTPrice {
  price:       string;
  priceRaw:    number;
  buyPrice:    string;
  sellPrice:   string;
  spread:      string;
  confidence:  'high' | 'medium' | 'low' | 'unknown';
  updatedAt:   Date;
  source:      'price-api' | 'quote-api';
}

const QUOTE_API   = 'https://quote-api.jup.ag/v6/quote';
const SOL_LAMPORTS = 1_000_000_000; // 1 SOL

function fmtPrice(n: number): string {
  if (n === 0)     return '—';
  if (n < 0.0001)  return n.toExponential(2);
  if (n < 0.01)    return n.toFixed(6);
  if (n < 1)       return n.toFixed(4);
  return n.toFixed(2);
}

// ── Method 1: Jupiter Price API v2 ───────────────────────────────────────────
async function fetchViaPriceAPI(): Promise<FBiTPrice | null> {
  const res  = await fetch(JUPITER_PRICE_API, { cache: 'no-store' });
  const json = await res.json() as JupiterPriceResponse;
  const entry = json?.data?.[TOKEN_INFO.mint];
  if (!entry) return null;

  const priceRaw = parseFloat(entry.price);
  if (!priceRaw) return null;

  const buyRaw    = parseFloat(entry.extraInfo?.quotedPrice?.buyPrice  ?? entry.price);
  const sellRaw   = parseFloat(entry.extraInfo?.quotedPrice?.sellPrice ?? entry.price);
  const spreadPct = buyRaw > 0 ? ((buyRaw - sellRaw) / buyRaw) * 100 : 0;

  return {
    price:      '$' + fmtPrice(priceRaw),
    priceRaw,
    buyPrice:   '$' + fmtPrice(buyRaw),
    sellPrice:  '$' + fmtPrice(sellRaw),
    spread:     spreadPct.toFixed(2) + '%',
    confidence: entry.extraInfo?.confidenceLevel ?? 'unknown',
    updatedAt:  new Date(),
    source:     'price-api',
  };
}

// ── Method 2: Jupiter Quote API (swap simulation) ────────────────────────────
// Computes FBiT price by: (1) getting SOL/USD price, (2) quoting 1 SOL → FBiT
async function fetchViaQuoteAPI(): Promise<FBiTPrice | null> {
  // SOL price in USD
  const solRes  = await fetch(
    `https://api.jup.ag/price/v2?ids=${SOL_MINT}`,
    { cache: 'no-store' },
  );
  const solJson = await solRes.json() as JupiterPriceResponse;
  const solUSD  = parseFloat(solJson?.data?.[SOL_MINT]?.price ?? '0');
  if (!solUSD) return null;

  // Buy quote: 1 SOL → FBiT
  const buyRes  = await fetch(
    `${QUOTE_API}?inputMint=${SOL_MINT}&outputMint=${TOKEN_INFO.mint}&amount=${SOL_LAMPORTS}&slippageBps=50`,
    { cache: 'no-store' },
  );
  const buyQuote = await buyRes.json() as { outAmount?: string; priceImpactPct?: string };
  const fbitOut  = parseInt(buyQuote?.outAmount ?? '0');
  if (!fbitOut) return null;

  const fbitPerSol = fbitOut / Math.pow(10, TOKEN_INFO.decimals);
  const buyPriceRaw = solUSD / fbitPerSol;

  // Sell quote: same FBiT amount → SOL → USD
  let sellPriceRaw = buyPriceRaw;
  try {
    const sellRes  = await fetch(
      `${QUOTE_API}?inputMint=${TOKEN_INFO.mint}&outputMint=${SOL_MINT}&amount=${fbitOut}&slippageBps=50`,
      { cache: 'no-store' },
    );
    const sellQuote  = await sellRes.json() as { outAmount?: string };
    const solBack    = parseInt(sellQuote?.outAmount ?? '0') / SOL_LAMPORTS;
    if (solBack) sellPriceRaw = (solBack * solUSD) / fbitPerSol;
  } catch { /* use buy price for sell if quote fails */ }

  const spreadPct = buyPriceRaw > 0 ? ((buyPriceRaw - sellPriceRaw) / buyPriceRaw) * 100 : 0;

  return {
    price:      '$' + fmtPrice(buyPriceRaw),
    priceRaw:   buyPriceRaw,
    buyPrice:   '$' + fmtPrice(buyPriceRaw),
    sellPrice:  '$' + fmtPrice(sellPriceRaw),
    spread:     spreadPct.toFixed(2) + '%',
    confidence: 'medium',
    updatedAt:  new Date(),
    source:     'quote-api',
  };
}

// ── Main fetcher — tries Price API first, falls back to Quote API ─────────────
async function fetchJupiterPrice(): Promise<FBiTPrice | null> {
  try {
    const priceData = await fetchViaPriceAPI();
    if (priceData) return priceData;
  } catch { /* fall through */ }

  try {
    return await fetchViaQuoteAPI();
  } catch {
    return null;
  }
}

const CONFIDENCE_STYLE: Record<string, string> = {
  high:    'text-neon-green',
  medium:  'text-yellow-400',
  low:     'text-red-400',
  unknown: 'text-gray-500',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function SwapPage() {
  const [followed,    setFollowed]  = useState(false);
  const [watchlisted, setWatch]     = useState(false);
  const [copyTip,     setCopyTip]   = useState(false);
  const [price,       setPrice]     = useState<FBiTPrice | null>(null);
  const [loading,     setLoading]   = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchJupiterPrice();
      setPrice(data);
      setLoading(false);
    }
    load();
    const timer = setInterval(load, 30_000);
    return () => clearInterval(timer);
  }, []);

  const copyMint = () => {
    navigator.clipboard.writeText(TOKEN_INFO.mint);
    setCopyTip(true);
    setTimeout(() => setCopyTip(false), 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6 text-center">
        <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5 swap-badge">
          🪐 NOW LIVE ON JUPITER DEX
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">
          FBiT Token <span className="text-neon-purple">Swap</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Buy &amp; sell FBiT on Solana&apos;s <strong className="text-white">#1 DEX</strong> — best rates, instant settlement!
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ── Left sidebar ── */}
          <div className="xl:col-span-1 space-y-5">

            {/* Token Price Card */}
            <div className="swap-token-card rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="swap-token-logo">F</div>
                <div>
                  <p className="text-white font-bold text-lg">FBiT</p>
                  <p className="text-gray-500 text-xs">FutureBit Token · Solana</p>
                </div>
                {/* Live indicator */}
                <div className="ml-auto flex items-center gap-1.5 text-xs text-neon-green font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-neon" />
                  LIVE
                </div>
              </div>

              {/* Current price */}
              <div className="mb-4">
                <p className="text-gray-500 text-xs mb-1">Jupiter Price</p>
                {loading ? (
                  <div className="flex items-center gap-2 h-9">
                    <div className="jupiter-spinner jupiter-spinner-sm" />
                    <span className="text-gray-500 text-sm">Fetching...</span>
                  </div>
                ) : (
                  <p className="text-3xl font-black text-white">
                    {price?.price ?? '—'}
                  </p>
                )}
              </div>

              {/* Buy / Sell / Spread */}
              <div className="swap-stat-row mb-4">
                <div className="swap-stat">
                  <span className="text-gray-500 text-xs">Buy Quote</span>
                  <span className="text-neon-green font-bold text-sm">
                    {loading ? '...' : (price?.buyPrice ?? '—')}
                  </span>
                </div>
                <div className="swap-stat">
                  <span className="text-gray-500 text-xs">Sell Quote</span>
                  <span className="text-red-400 font-bold text-sm">
                    {loading ? '...' : (price?.sellPrice ?? '—')}
                  </span>
                </div>
              </div>

              {/* Spread + Confidence */}
              <div className="flex items-center justify-between mb-5 bg-white/3 rounded-xl px-3 py-2.5">
                <div>
                  <p className="text-gray-500 text-xs">Bid-Ask Spread</p>
                  <p className="text-white font-semibold text-sm">
                    {loading ? '...' : (price?.spread ?? '—')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">Price Confidence</p>
                  <p className={`font-bold text-sm capitalize ${CONFIDENCE_STYLE[price?.confidence ?? 'unknown']}`}>
                    {loading ? '...' : (price?.confidence ?? '—')}
                  </p>
                </div>
              </div>

              {/* Last updated */}
              {price?.updatedAt && (
                <p className="text-gray-600 text-xs mb-4 text-right">
                  🪐 {price.source === 'quote-api' ? 'Jupiter Quote API' : 'Jupiter Price API'}
                  {' · '}{price.updatedAt.toLocaleTimeString('en-IN')} · auto 30s
                </p>
              )}

              {/* Mint address */}
              <div className="mb-5">
                <p className="text-gray-500 text-xs mb-1.5">Token Mint Address</p>
                <div className="swap-mint-box">
                  <span className="text-xs text-gray-400 truncate flex-1 font-mono">
                    {TOKEN_INFO.mint}
                  </span>
                  <button type="button" onClick={copyMint} className="swap-copy-btn shrink-0">
                    {copyTip ? '✅' : '📋'}
                  </button>
                </div>
              </div>

              {/* Follow section */}
              <div className="follow-section">
                <p className="text-white font-bold text-sm mb-3 text-center">
                  🪐 Follow FBiT on Jupiter
                </p>
                <button
                  type="button"
                  onClick={() => { setFollowed(true); window.open(JUPITER_TOKEN_URL, '_blank', 'noopener'); }}
                  className={`follow-btn w-full mb-2 ${followed ? 'follow-btn--active' : ''}`}
                >
                  {followed ? '✅ Followed on Jupiter!' : '🔔 Follow FBiT Token'}
                </button>
                <button
                  type="button"
                  onClick={() => { setWatch(true); window.open(JUPITER_WATCHLIST, '_blank', 'noopener'); }}
                  className={`watchlist-btn w-full mb-2 ${watchlisted ? 'watchlist-btn--active' : ''}`}
                >
                  {watchlisted ? '⭐ Added to Watchlist!' : '⭐ Add to Watchlist'}
                </button>
                <a
                  href={JUPITER_SWAP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="jupiter-direct-btn block w-full text-center"
                >
                  🔗 View Directly on Jupiter.ag
                </a>
              </div>
            </div>

            {/* Why FBiT */}
            <div className="swap-why-card rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4">💡 Why Buy FBiT?</h3>
              <ul className="space-y-2.5">
                {[
                  { icon: '📈', text: '300% APY staking rewards' },
                  { icon: '🤝', text: '10-level referral passive income' },
                  { icon: '🎰', text: 'Monthly $2,000 lucky draw tickets' },
                  { icon: '◎',  text: 'Solana mainnet — on-chain transparent' },
                  { icon: '🔒', text: 'Real smart contract, auditable' },
                  { icon: '🚀', text: 'Growing 5,000+ member community' },
                ].map(item => (
                  <li key={item.text} className="flex items-center gap-2.5 text-sm text-gray-400">
                    <span className="text-base">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick links */}
            <div className="swap-links-card rounded-2xl p-5">
              <h3 className="text-white font-bold mb-3 text-sm">🔗 Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: 'View on Solscan',    href: `https://solscan.io/token/${TOKEN_INFO.mint}`, icon: '🔍' },
                  { label: 'Jupiter Token Page', href: JUPITER_TOKEN_URL,                             icon: '🪐' },
                  { label: 'Add to Watchlist',   href: JUPITER_WATCHLIST,                             icon: '⭐' },
                  { label: 'FBiT Airdrop Page',  href: '/airdrop', icon: '🎁', internal: true },
                  { label: 'Staking Dashboard',  href: '/stake',   icon: '💎', internal: true },
                ].map(link =>
                  link.internal
                    ? <Link key={link.label} href={link.href} className="swap-quick-link">
                        <span>{link.icon}</span><span>{link.label}</span>
                        <span className="ml-auto text-gray-600">→</span>
                      </Link>
                    : <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="swap-quick-link">
                        <span>{link.icon}</span><span>{link.label}</span>
                        <span className="ml-auto text-gray-600">↗</span>
                      </a>
                )}
              </div>
            </div>
          </div>

          {/* ── Right — Jupiter Terminal ── */}
          <div className="xl:col-span-2 space-y-5">

            <div className="swap-header-bar rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div>
                <p className="text-white font-bold">SOL → FBiT Swap</p>
                <p className="text-gray-500 text-xs mt-0.5">Jupiter aggregator — best route across all Solana DEXs</p>
              </div>
              <a href={JUPITER_SWAP_URL} target="_blank" rel="noopener noreferrer" className="btn-outline text-xs py-2 px-4 shrink-0">
                🔗 Open in Jupiter
              </a>
            </div>

            <div className="swap-terminal-wrap rounded-2xl overflow-hidden">
              <JupiterTerminal mode="integrated" />
            </div>

            <div className="swap-guide-card rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4">📖 How to Swap FBiT — Step by Step</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { step: '1', title: 'Connect Phantom Wallet', desc: 'Click "Connect Wallet" at the top and select Phantom.' },
                  { step: '2', title: 'Enter SOL or USDC',      desc: 'Enter the amount of FBiT you want — Jupiter finds the best rate.' },
                  { step: '3', title: 'Preview the Route',      desc: 'Jupiter automatically selects the best swap route — check slippage.' },
                  { step: '4', title: 'Confirm the Swap',       desc: 'Approve the transaction in your wallet — FBiT arrives in seconds!' },
                ].map(s => (
                  <div key={s.step} className="swap-guide-step">
                    <div className="swap-guide-num">{s.step}</div>
                    <div>
                      <p className="text-white text-sm font-semibold">{s.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <StripPromoBanner variant="inline" />
        </div>
      </div>
    </div>
  );
}
