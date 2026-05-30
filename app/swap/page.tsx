'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  JUPITER_SWAP_URL,
  JUPITER_TOKEN_URL,
  JUPITER_WATCHLIST,
  TOKEN_INFO,
} from '@/lib/jupiterConfig';
import { StripPromoBanner } from '@/components/PromoAdBanners';
import { useFBiTPrice, fmtUSD } from '@/lib/useFBiTPrice';

const JupiterTerminal = dynamic(() => import('@/components/JupiterTerminal'), {
  ssr: false,
  loading: () => (
    <div className="jupiter-loading-state jupiter-terminal-loading-height">
      <div className="jupiter-spinner" />
      <p className="text-gray-400 text-sm mt-4">Loading Jupiter Terminal...</p>
    </div>
  ),
});

const CONFIDENCE_STYLE: Record<string, string> = {
  high:    'text-neon-green',
  medium:  'text-yellow-400',
  low:     'text-red-400',
  unknown: 'text-gray-500',
};

export default function SwapPage() {
  const [followed,    setFollowed]  = useState(false);
  const [watchlisted, setWatch]     = useState(false);
  const [copyTip,     setCopyTip]   = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const priceData = useFBiTPrice(30_000);

  // Track last-updated timestamp whenever price changes
  useEffect(() => {
    if (!priceData.loading && priceData.price > 0) {
      setLastUpdated(new Date());
    }
  }, [priceData.price, priceData.loading]);

  const spreadPct = priceData.buyPrice > 0
    ? ((priceData.buyPrice - priceData.sellPrice) / priceData.buyPrice) * 100
    : 0;

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
                <div className="ml-auto flex items-center gap-1.5 text-xs text-neon-green font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-neon" />
                  LIVE
                </div>
              </div>

              {/* Current price */}
              <div className="mb-4">
                <p className="text-gray-500 text-xs mb-1">FBiT Price (USD)</p>
                {priceData.loading ? (
                  <div className="flex items-center gap-2 h-9">
                    <div className="jupiter-spinner jupiter-spinner-sm" />
                    <span className="text-gray-500 text-sm">Fetching...</span>
                  </div>
                ) : (
                  <p className="text-3xl font-black text-white">
                    {priceData.price > 0 ? fmtUSD(priceData.price) : '—'}
                  </p>
                )}
              </div>

              {/* Buy / Sell */}
              <div className="swap-stat-row mb-4">
                <div className="swap-stat">
                  <span className="text-gray-500 text-xs">Buy Quote</span>
                  <span className="text-neon-green font-bold text-sm">
                    {priceData.loading ? '...' : (priceData.buyPrice > 0 ? fmtUSD(priceData.buyPrice) : '—')}
                  </span>
                </div>
                <div className="swap-stat">
                  <span className="text-gray-500 text-xs">Sell Quote</span>
                  <span className="text-red-400 font-bold text-sm">
                    {priceData.loading ? '...' : (priceData.sellPrice > 0 ? fmtUSD(priceData.sellPrice) : '—')}
                  </span>
                </div>
              </div>

              {/* Spread + Confidence */}
              <div className="flex items-center justify-between mb-5 bg-white/3 rounded-xl px-3 py-2.5">
                <div>
                  <p className="text-gray-500 text-xs">Bid-Ask Spread</p>
                  <p className="text-white font-semibold text-sm">
                    {priceData.loading ? '...' : spreadPct > 0 ? spreadPct.toFixed(2) + '%' : '—'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">Price Confidence</p>
                  <p className={`font-bold text-sm capitalize ${CONFIDENCE_STYLE[priceData.confidence]}`}>
                    {priceData.loading ? '...' : (priceData.confidence || '—')}
                  </p>
                </div>
              </div>

              {/* Last updated */}
              {lastUpdated && (
                <p className="text-gray-600 text-xs mb-4 text-right">
                  🪐 {priceData.source === 'dexscreener' ? 'DexScreener' : priceData.source === 'jupiter-quote' ? 'Jupiter Quote' : 'Jupiter Price'}
                  {' · '}{lastUpdated.toLocaleTimeString('en-IN')} · auto 30s
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
                  { icon: '📈', text: 'Up to 300% APY staking rewards' },
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
              <div className="flex items-center gap-3">
                {priceData.price > 0 && (
                  <span className="text-xs font-bold text-neon-green bg-neon-green/10 border border-neon-green/20 px-3 py-1.5 rounded-lg">
                    1 FBiT = {fmtUSD(priceData.price)}
                  </span>
                )}
                <a href={JUPITER_SWAP_URL} target="_blank" rel="noopener noreferrer" className="btn-outline text-xs py-2 px-4 shrink-0">
                  🔗 Open in Jupiter
                </a>
              </div>
            </div>

            <div className="swap-terminal-wrap rounded-2xl overflow-hidden">
              <JupiterTerminal mode="integrated" />
            </div>

            <div className="swap-guide-card rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4">📖 How to Swap FBiT — Step by Step</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { step: '1', title: 'Connect Phantom Wallet', desc: 'Click "Connect Wallet" at the top and select Phantom.' },
                  { step: '2', title: 'Enter Amount',            desc: 'Enter how much SOL you want to spend — Jupiter finds the best rate.' },
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
