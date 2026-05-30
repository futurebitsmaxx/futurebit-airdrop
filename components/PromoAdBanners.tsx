'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAPY } from '@/lib/useAPY';

interface PromoBannerProps {
  variant?: 'hero' | 'inline' | 'floating' | 'strip';
}

/* ── Hero-size promo ad (homepage) ── */
export function HeroPromoBanner() {
  const { apy } = useAPY();
  return (
    <div className="promo-hero-banner">
      <div className="promo-hero-glow" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left */}
          <div>
            <span className="promo-badge">🔥 LIMITED TIME OFFER</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-3 leading-tight">
              FBiT Token Now<br />
              <span className="text-neon-green">Available on Jupiter!</span>
            </h2>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Swap FBiT on Solana's largest DEX. Direct liquidity, best rates, and zero slippage guarantee!
              <span className="text-neon-green font-semibold"> Swap now and start staking!</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/swap" className="btn-primary">
                🪐 Swap on Jupiter
              </Link>
              <Link href="/airdrop" className="btn-outline">
                Claim Airdrop
              </Link>
            </div>
          </div>

          {/* Right — stats chips */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '📈', label: 'Max APY', val: `${apy}%`, sub: 'On Polygon & Solana' },
              { icon: '💸', label: 'Prize Pool', val: '$22,500', sub: 'Across all campaigns' },
              { icon: '🪐', label: 'On Jupiter', val: 'LIVE', sub: 'Best swap rates' },
              { icon: '🤝', label: 'Referral Levels', val: '10 Deep', sub: 'Passive income network' },
            ].map(s => (
              <div key={s.label} className="promo-stat-chip">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xl font-black text-neon-green">{s.val}</div>
                <div className="text-white text-xs font-semibold">{s.label}</div>
                <div className="text-gray-600 text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Inline strip banner (between sections) ── */
export function StripPromoBanner({ variant = 'inline' }: PromoBannerProps) {
  const strips = {
    inline: {
      bg: 'promo-strip-green',
      icon: '🎁',
      text: 'Airdrop is still LIVE!',
      sub: 'Be among the first 5,000 — claim FREE FBiT tokens',
      cta: 'Claim Now',
      href: '/airdrop',
    },
    floating: {
      bg: 'promo-strip-purple',
      icon: '⚔️',
      text: 'Weekly Referral War — Week 1!',
      sub: 'Top 3 referrers win $500 + $300 + $150 FBiT every week',
      cta: 'See Leaderboard',
      href: '/leaderboard',
    },
    strip: {
      bg: 'promo-strip-gold',
      icon: '🪐',
      text: 'FBiT is now on Jupiter!',
      sub: 'Swap FBiT on Solana at the best rates — add liquidity',
      cta: 'Swap Now',
      href: '/swap',
    },
  };

  const s = strips[variant as keyof typeof strips] ?? strips.inline;

  return (
    <div className={`promo-strip ${s.bg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{s.icon}</span>
          <div>
            <span className="text-white font-bold text-sm">{s.text}</span>
            <span className="text-gray-300 text-xs ml-2 hidden sm:inline">{s.sub}</span>
          </div>
        </div>
        <Link href={s.href} className="btn-primary text-xs py-2 px-5 shrink-0 whitespace-nowrap">
          {s.cta} →
        </Link>
      </div>
    </div>
  );
}

/* ── Dismissible floating ad card (bottom-right) ── */
export function FloatingAdCard() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="floating-ad-card">
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="floating-ad-close"
      >
        ×
      </button>
      <div className="text-center p-5">
        <div className="text-4xl mb-2">🪐</div>
        <p className="text-white font-bold text-sm mb-1">FBiT on Jupiter!</p>
        <p className="text-gray-400 text-xs mb-3 leading-relaxed">
          Swap FBiT on Solana's #1 DEX. Best price, zero hassle!
        </p>
        <Link href="/swap" className="btn-primary text-xs py-2 px-4 block text-center">
          Swap FBiT Now
        </Link>
        <Link href="/airdrop" className="block text-center text-xs text-gray-500 hover:text-neon-green mt-2 transition-colors">
          Claim Airdrop →
        </Link>
      </div>
    </div>
  );
}

/* ── Ad grid: 3 small banner cards ── */
export function AdCardGrid() {
  const { apy } = useAPY();
  const ads = [
    {
      id: 'airdrop',
      icon: '🚀',
      title: '$10,000 FBiT Airdrop',
      body: 'Complete tasks, earn points, win prizes. Only 14 days left!',
      cta: 'Join Airdrop',
      href: '/airdrop',
      cls: 'ad-card-green',
    },
    {
      id: 'swap',
      icon: '🪐',
      title: 'FBiT Swap on Jupiter',
      body: 'Buy FBiT on Solana at the best rates. Directly from Jupiter DEX — fast & secure!',
      cta: 'Swap Now',
      href: '/swap',
      cls: 'ad-card-purple',
    },
    {
      id: 'stake',
      icon: '💎',
      title: `${apy}% APY Staking`,
      body: 'Stake $100+ and enter the $2,000 grand prize monthly lucky draw!',
      cta: 'Stake & Win',
      href: '/staking',
      cls: 'ad-card-gold',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {ads.map(ad => (
        <div key={ad.id} className={`ad-card ${ad.cls}`}>
          <div className="text-3xl mb-3">{ad.icon}</div>
          <h3 className="text-white font-bold text-sm mb-1.5">{ad.title}</h3>
          <p className="text-gray-400 text-xs leading-relaxed mb-4">{ad.body}</p>
          <Link href={ad.href} className="ad-card-btn">
            {ad.cta} →
          </Link>
        </div>
      ))}
    </div>
  );
}
