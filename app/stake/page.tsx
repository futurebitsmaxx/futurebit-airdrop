'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { REFERRAL_LEVELS, TEAM_TIERS, SOLANA } from '@/lib/contractConfig';
import { useAppStore } from '@/lib/store';
import { fetchSolBalance, fetchFBiTBalance, fetchSolanaStakingInfo, type SolanaStakingInfo } from '@/lib/solanaService';
import WalletModal from '@/components/WalletModal';

type Tab = 'stake' | 'referral' | 'team';

function short(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function StakePageInner() {
  const params   = useSearchParams();
  const refParam = params.get('ref') ?? '';

  const { walletAddress, disconnectWallet } = useAppStore();
  const [showWallet,  setShowWallet]  = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [tab,          setTab]          = useState<Tab>('stake');
  const [copied,       setCopied]       = useState(false);
  const [solBalance,   setSolBalance]   = useState('0.0000');
  const [fbitBalance,  setFbitBalance]  = useState('0.000000');
  const [stakingInfo,  setStakingInfo]  = useState<SolanaStakingInfo | null>(null);

  const tierProgressRef = useRef<HTMLDivElement>(null);

  const referralLink = walletAddress
    ? `https://stake.futurebit.in/?ref=${walletAddress}`
    : null;

  // Fetch Solana balances + staking info when wallet connects / changes
  useEffect(() => {
    if (!walletAddress) {
      setSolBalance('0.0000');
      setFbitBalance('0.000000');
      setStakingInfo(null);
      return;
    }
    setLoading(true);
    Promise.all([
      fetchSolBalance(walletAddress),
      fetchFBiTBalance(walletAddress),
      fetchSolanaStakingInfo(walletAddress),
    ])
      .then(([sol, fbit, staking]) => {
        setSolBalance(sol);
        setFbitBalance(fbit);
        setStakingInfo(staking);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [walletAddress]);

  // Keep tier progress bar width via CSS custom property (no inline style)
  useEffect(() => {
    tierProgressRef.current?.style.setProperty('--pw', '0%');
  }, []);

  function copyRef() {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function refreshBalances() {
    if (!walletAddress) return;
    setLoading(true);
    Promise.all([
      fetchSolBalance(walletAddress),
      fetchFBiTBalance(walletAddress),
      fetchSolanaStakingInfo(walletAddress),
    ])
      .then(([sol, fbit, staking]) => {
        setSolBalance(sol);
        setFbitBalance(fbit);
        setStakingInfo(staking);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  return (
    <div className="min-h-screen">

      {/* ── HEADER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="stake-live-badge">🟢 MAINNET LIVE</span>
              <span className="stake-contract-badge">◎ Solana · {short(SOLANA.programId)}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              FBiT <span className="text-neon-green">Staking Dashboard</span>
            </h1>
            {refParam && (
              <p className="text-xs text-neon-green mt-1">
                🤝 Referred by: {short(refParam)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* ── LEFT: Wallet sidebar ── */}
          <div className="xl:col-span-1 space-y-4">

            {/* Wallet card */}
            <div className="stake-wallet-card">
              {!walletAddress ? (
                <div className="text-center py-2">
                  <p className="text-white font-bold mb-1">Connect Wallet</p>
                  <p className="text-gray-500 text-xs mb-4">◎ Solana (Phantom)</p>
                  <button type="button" onClick={() => setShowWallet(true)}
                    className="btn-primary w-full text-sm py-2.5">
                    👻 Connect Phantom
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse-neon" />
                    <span className="text-white font-bold text-sm">Connected</span>
                    <button type="button" onClick={disconnectWallet}
                      className="ml-auto text-xs text-gray-500 hover:text-red-400 transition-colors">
                      Disconnect
                    </button>
                  </div>
                  <div className="stake-address-box mb-3">
                    <span className="text-gray-400 text-xs font-mono truncate">{walletAddress}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="stake-balance-chip">
                      <span className="text-gray-500 text-xs">SOL</span>
                      <span className="text-neon-green font-bold">{loading ? '…' : solBalance}</span>
                    </div>
                    <div className="stake-balance-chip">
                      <span className="text-gray-500 text-xs">FBiT</span>
                      <span className="text-neon-green font-bold">{loading ? '…' : fbitBalance}</span>
                    </div>
                  </div>
                  <button type="button" onClick={refreshBalances} disabled={loading}
                    className="mt-3 w-full text-xs text-gray-500 hover:text-white py-1 transition-colors">
                    {loading ? '⏳ Loading…' : '🔄 Refresh'}
                  </button>
                </div>
              )}
            </div>

            {/* Quick links */}
            <div className="stake-links-card">
              <p className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wide">Links</p>
              <div className="space-y-1">
                <a href="https://stake.futurebit.in" target="_blank" rel="noopener noreferrer" className="stake-ext-link">
                  🔗 stake.futurebit.in ↗
                </a>
                <a href={`https://explorer.solana.com/address/${SOLANA.tokenMint}`} target="_blank" rel="noopener noreferrer" className="stake-ext-link">
                  🪙 FBiT Token ↗
                </a>
                <a href={`https://explorer.solana.com/address/${SOLANA.programId}`} target="_blank" rel="noopener noreferrer" className="stake-ext-link">
                  📋 Staking Program ↗
                </a>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Tabs ── */}
          <div className="xl:col-span-3">
            <div className="stake-tab-bar mb-6">
              {([
                { id: 'stake',    label: '💎 Stake'  },
                { id: 'referral', label: '🤝 Referral'    },
                { id: 'team',     label: '🏆 Team Bonus'  },
              ] as { id: Tab; label: string }[]).map(t => (
                <button key={t.id} type="button" onClick={() => setTab(t.id)}
                  className={`stake-tab-btn ${tab === t.id ? 'stake-tab-btn--active' : ''}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* ══ TAB: STAKE ══ */}
            {tab === 'stake' && (
              <div className="space-y-5">

                {/* Redirect CTA */}
                <div className="stake-redirect-card">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <h2 className="text-white font-bold text-lg mb-1">◎ Stake on Solana</h2>
                      <p className="text-gray-400 text-sm">
                        Stake, claim, and compound — directly on the FutureBit platform.
                        {walletAddress && ' Your wallet address will be passed automatically.'}
                      </p>
                    </div>
                    <a
                      href={walletAddress ? `https://stake.futurebit.in/?ref=${walletAddress}` : 'https://stake.futurebit.in'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary whitespace-nowrap shrink-0 text-center"
                    >
                      🚀 Open Stake.FutureBit.in
                    </a>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
                    <div className="stake-info-chip">Lock Period<br /><span className="text-white font-bold text-sm">30 Days</span></div>
                    <div className="stake-info-chip">Claim Every<br /><span className="text-white font-bold text-sm">6 Hours</span></div>
                    <div className="stake-info-chip">Max APY<br /><span className="text-neon-green font-bold text-sm">300%</span></div>
                  </div>
                </div>

                {/* Balance / connect prompt */}
                {!walletAddress ? (
                  <div className="stake-empty-state">
                    <div className="text-4xl mb-2">👻</div>
                    <p className="text-gray-400 text-sm mb-4">
                      Connect Phantom wallet — stake.futurebit.in data will also appear here!
                    </p>
                    <button type="button" onClick={() => setShowWallet(true)} className="btn-primary text-sm">
                      👻 Connect Phantom
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* On-chain stats — same wallet, same data as stake.futurebit.in */}
                    <div className="stake-wallet-card">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-bold">◎ Your Staking Data</h3>
                        {loading && <span className="text-gray-500 text-xs">Fetching...</span>}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        <div className="stake-balance-chip">
                          <span className="text-gray-500 text-xs">SOL Balance</span>
                          <span className="text-neon-green font-bold">{loading ? '…' : solBalance}</span>
                        </div>
                        <div className="stake-balance-chip">
                          <span className="text-gray-500 text-xs">FBiT Balance</span>
                          <span className="text-neon-green font-bold">{loading ? '…' : fbitBalance}</span>
                        </div>
                        <div className="stake-balance-chip">
                          <span className="text-gray-500 text-xs">Stake Positions</span>
                          <span className="text-neon-green font-bold">
                            {loading ? '…' : (stakingInfo?.stakeCount ?? 0)}
                          </span>
                        </div>
                        <div className="stake-balance-chip">
                          <span className="text-gray-500 text-xs">Total Staked</span>
                          <span className="text-neon-green font-bold">
                            {loading ? '…' : (stakingInfo?.totalStaked ?? '0')} FBiT
                          </span>
                        </div>
                      </div>

                      {/* View full data on stake.futurebit.in */}
                      <a
                        href={`https://stake.futurebit.in/?ref=${walletAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 bg-white/3 border border-neon-green/15 rounded-xl px-4 py-3 hover:bg-white/6 hover:border-neon-green/30 transition-all group"
                      >
                        <div>
                          <p className="text-white text-sm font-semibold">
                            📊 View full account on stake.futurebit.in
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            Same Phantom wallet auto-connects → view referrals, rewards, team tier, history
                          </p>
                        </div>
                        <span className="text-neon-green text-xl group-hover:translate-x-1 transition-transform shrink-0">→</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ══ TAB: REFERRAL ══ */}
            {tab === 'referral' && (
              <div className="space-y-5">
                <div className="stake-ref-card">
                  <h2 className="text-white font-bold text-lg mb-2">🤝 Your Referral Link</h2>
                  <p className="text-gray-400 text-sm mb-4">
                    Share this link — when anyone stakes through it, you earn{' '}
                    <strong className="text-white">commission up to 10 levels</strong> automatically!
                  </p>

                  {referralLink ? (
                    <>
                      <div className="flex gap-2 mb-4">
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-neon-green truncate font-mono">
                          {referralLink}
                        </div>
                        <button type="button" onClick={copyRef} className="btn-outline text-xs px-4 shrink-0">
                          {copied ? '✅ Copied!' : '📋 Copy'}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { label: 'WhatsApp', icon: '💬', href: `https://wa.me/?text=Stake on FutureBit and earn 300% APY! ${referralLink}` },
                          { label: 'Telegram', icon: '✈️', href: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=FutureBit Staking — 300% APY!` },
                          { label: 'Twitter/X', icon: '𝕏',  href: `https://twitter.com/intent/tweet?text=Stake on FutureBit — 300% APY!&url=${encodeURIComponent(referralLink)}` },
                        ].map(s => (
                          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="stake-share-btn">
                            {s.icon} Share on {s.label}
                          </a>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="bg-white/3 border border-white/6 rounded-xl p-4 text-center">
                      <p className="text-gray-500 text-sm mb-3">Connect your wallet to get your referral link</p>
                      <button type="button" onClick={() => setShowWallet(true)} className="btn-primary text-sm">
                        👻 Connect Phantom
                      </button>
                    </div>
                  )}
                </div>

                {/* 10-level commission table */}
                <div className="stake-ref-levels-card">
                  <h3 className="text-white font-bold mb-4">💰 10-Level Commission Structure</h3>
                  <div className="space-y-2">
                    {REFERRAL_LEVELS.map(lvl => {
                      const pct = (lvl.bps / 800) * 100;
                      return (
                        <div key={lvl.level} className="flex items-center gap-3 py-2 px-3 rounded-xl stake-ref-level-row">
                          <div className="w-7 h-7 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-xs font-bold text-neon-green shrink-0">
                            L{lvl.level}
                          </div>
                          <div className="flex-1">
                            <div className="progress-bar h-1.5">
                              <div
                                ref={el => { el?.style.setProperty('--pw', `${pct}%`); }}
                                className="progress-fill progress-fill-var h-1.5"
                              />
                            </div>
                          </div>
                          <span className="text-neon-green font-bold text-sm shrink-0">{lvl.pct}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ══ TAB: TEAM BONUS ══ */}
            {tab === 'team' && (
              <div className="space-y-5">
                <div className="stake-tier-current-card text-center py-4">
                  <p className="text-4xl mb-2">🏆</p>
                  <p className="text-white font-bold text-lg">Team Volume Bonus</p>
                  <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
                    Total staked amount across your 10-level network = "Team Volume".
                    Bigger team = bigger APY bonus — automatic on-chain!
                  </p>
                </div>

                <div className="stake-tiers-card">
                  <h3 className="text-white font-bold mb-4">🏆 All Team Target Tiers</h3>
                  <div className="space-y-2">
                    {TEAM_TIERS.map(tier => (
                      <div key={tier.tier} className="stake-tier-row">
                        <span className="text-xl">{tier.icon}</span>
                        <div className="flex-1 min-w-0 ml-3">
                          <span className="text-white font-bold text-sm">{tier.name}</span>
                          <p className="text-gray-500 text-xs">Min: {tier.minTeamStaked.toLocaleString()} WFBIT</p>
                        </div>
                        <p className={`font-bold text-sm shrink-0 tier-color-${tier.tier}`}>
                          {tier.bonusPct}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="stake-team-explain-card">
                  <h3 className="text-white font-bold mb-3">💡 How Does Team Bonus Work?</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {[
                      'Total staked across your 10-level network = "Team Volume"',
                      'When team volume crosses a tier minimum, bonus is applied automatically',
                      'Bonus is added to your APY only — from the on-chain contract',
                      'More team staking = higher tier = bigger bonus!',
                    ].map(item => (
                      <li key={item} className="flex gap-2">
                        <span className="text-neon-green shrink-0">✦</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
    </div>
  );
}

export default function StakePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="jupiter-spinner" />
      </div>
    }>
      <StakePageInner />
    </Suspense>
  );
}
