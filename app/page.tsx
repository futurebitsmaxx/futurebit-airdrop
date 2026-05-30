'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { loadLeaderboardAdminConfig, DEFAULT_LB_ADMIN_CONFIG } from '@/lib/store';
import WalletModal from '@/components/WalletModal';
import { HeroPromoBanner, StripPromoBanner, AdCardGrid } from '@/components/PromoAdBanners';
import { loadAdminConfig, DEFAULT_ADMIN_CONFIG, loadVaultAdminConfig, DEFAULT_VAULT_ADMIN_CONFIG } from '@/lib/airdropConfig';
import { useAPY } from '@/lib/useAPY';

export default function HomePage() {
  const { walletAddress, totalPoints } = useAppStore();
  const [showWallet, setShowWallet] = useState(false);
  const { apy, loading: apyLoading } = useAPY();

  const [airdropCfg, setAirdropCfg] = useState(DEFAULT_ADMIN_CONFIG);
  const [vaultCfg,   setVaultCfg]   = useState(DEFAULT_VAULT_ADMIN_CONFIG);
  const [lbCfg,      setLbCfg]      = useState(DEFAULT_LB_ADMIN_CONFIG);

  useEffect(() => {
    setAirdropCfg(loadAdminConfig());
    setVaultCfg(loadVaultAdminConfig());
    setLbCfg(loadLeaderboardAdminConfig());
  }, []);

  const campaigns = [
    {
      id: 'airdrop',
      title: 'FBiT Community Airdrop',
      subtitle: 'First 5,000 members get FREE FBiT!',
      description: `Complete tasks, connect wallets, refer friends — earn points and win from the ${airdropCfg.totalPrize} prize pool.`,
      prize: airdropCfg.totalPrize,
      badge: '🎁 LIVE',
      href: '/airdrop',
      icon: '🚀',
    },
    {
      id: 'leaderboard',
      title: 'Top 3 Referrers Contest',
      subtitle: 'New WINNER every week!',
      description: 'Use the 10-level referral system. Drive your network to stake and climb the leaderboard every week.',
      prize: lbCfg.weeklyPrize + ' Weekly',
      badge: `⚔️ WEEK ${lbCfg.currentWeek}`,
      href: '/leaderboard',
      icon: '🏆',
    },
    {
      id: 'staking',
      title: 'Staking Lucky Vault',
      subtitle: 'Stake & enter the monthly lucky draw!',
      description: `Stake $${vaultCfg.minStake}+ for 30 days to enter the monthly lucky draw. More stake = more lottery tickets.`,
      prize: vaultCfg.monthlyPrize + ' Monthly',
      badge: `🎰 ${vaultCfg.isOpen ? 'OPEN' : 'CLOSED'}`,
      href: '/staking',
      icon: '💎',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-8 live-badge">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-neon" />
          Mainnet Live on Solana
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          <span className="text-white">Future</span>
          <span className="hero-title-gradient">Bit</span>
          <br />
          <span className="text-white text-3xl sm:text-5xl lg:text-6xl">Staking Mainnet</span>
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-4">
          Solana DeFi staking with{' '}
          <span className="text-neon-green font-bold">up to {apyLoading ? '...' : `${apy}%`} APY</span>, a 10-level
          referral system, and massive airdrop rewards.
        </p>
        <p className="text-gray-500 text-base mb-10">Solana ✦ 100% On-Chain ✦ FBiT Token</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {walletAddress ? (
            <div className="flex items-center gap-3">
              <Link href="/airdrop" className="btn-primary">
                Claim Airdrop Rewards →
              </Link>
              <div className="points-chip">
                <span className="text-neon-green font-bold">{totalPoints}</span>
                <span className="text-gray-400 text-sm">points</span>
              </div>
            </div>
          ) : (
            <>
              <button type="button" onClick={() => setShowWallet(true)} className="btn-primary text-base">
                Connect Wallet &amp; Start Earning
              </button>
              <Link href="/airdrop" className="btn-outline text-base">
                View Airdrop Tasks
              </Link>
            </>
          )}
        </div>

        <div className="absolute top-20 left-10 text-4xl opacity-20 animate-float hidden lg:block">◎</div>
        <div className="absolute top-32 right-16 text-3xl opacity-15 animate-float [animation-delay:1s] hidden lg:block">⬡</div>
        <div className="absolute bottom-10 left-20 text-2xl opacity-10 animate-float [animation-delay:2s] hidden lg:block">💎</div>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Max APY',          value: apyLoading ? '...' : `${apy}%`, icon: '📈' },
            { label: 'Total Prize Pool', value: '$22,500',                       icon: '💰' },
            { label: 'Network',          value: 'Solana',                        icon: '◎'  },
            { label: 'Referral Levels',  value: '10 Levels',                     icon: '🤝' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-neon-green">{stat.value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Campaign Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Active <span className="text-neon-green">Campaigns</span>
          </h2>
          <p className="text-gray-500">Three ways to earn — Airdrop, Referral, and Staking!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {campaigns.map(c => (
            <Link key={c.id} href={c.href} className={`group campaign-card`} data-id={c.id}>
              <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full mb-4 campaign-badge" data-id={c.id}>
                {c.badge}
              </span>

              <div className="text-4xl mb-4">{c.icon}</div>
              <h3 className="text-xl font-bold text-white mb-1">{c.title}</h3>
              <p className="text-xs font-medium mb-3 campaign-subtitle" data-id={c.id}>{c.subtitle}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{c.description}</p>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-600 mb-0.5">Prize Pool</div>
                  <div className="text-lg font-bold campaign-prize" data-id={c.id}>{c.prize}</div>
                </div>
                <span className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all text-xl">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Jupiter Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <StripPromoBanner variant="strip" />
      </section>

      {/* Hero Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
        <HeroPromoBanner />
      </section>

      {/* Ad Card Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-xl font-bold text-white mb-5">🔥 Hot Right Now</h2>
        <AdCardGrid />
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-20">
        <div className="how-it-works-card">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
            Get Started in 3 Simple Steps 🚀
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { step: '01', icon: '🔗', title: 'Connect Your Wallet', desc: 'Connect Phantom, Backpack or Solflare wallet on Solana — completely free!' },
              { step: '02', icon: '📋', title: 'Complete Tasks', desc: 'Join Telegram, follow Twitter, refer friends — earn points.' },
              { step: '03', icon: '💰', title: 'Claim Your Rewards', desc: 'Win FBiT tokens via airdrop, weekly contest, or staking lucky draw!' },
            ].map(item => (
              <div key={item.step} className="relative">
                <div className="step-number">{item.step}</div>
                <div className="text-3xl mb-3 -mt-6">{item.icon}</div>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/guide" className="btn-outline text-sm">
              📖 View Step-by-Step Complete Guide →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="cta-banner">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Join Today —{' '}
            <span className="text-neon-green">Only 5,000 Spots Available!</span>
          </h2>
          <p className="text-gray-400 mb-8">
            Connect your wallet and secure your FBiT tokens before the airdrop closes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {walletAddress ? (
              <Link href="/airdrop" className="btn-primary">View Your Tasks →</Link>
            ) : (
              <button type="button" onClick={() => setShowWallet(true)} className="btn-primary">
                Connect Wallet — It&apos;s Free!
              </button>
            )}
            <Link href="/leaderboard" className="btn-outline">See Leaderboard</Link>
          </div>
        </div>
      </section>

      {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
    </div>
  );
}
