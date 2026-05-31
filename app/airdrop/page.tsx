'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import WalletModal from '@/components/WalletModal';
import VideoAdModal from '@/components/VideoAdModal';
import AdBanner from '@/components/AdBanner';
import { fetchFBiTBalance, fetchSolBalance, fetchSolanaStakingInfo, type SolanaStakingInfo } from '@/lib/solanaService';
import {
  submitRegistration, loadRegistration, genTxId,
  loadAdminConfig, DEFAULT_ADMIN_CONFIG, type AirdropAdminConfig, type AirdropRegistration,
} from '@/lib/airdropConfig';
import { useSiteConfig } from '@/lib/useSiteConfig';

export default function AirdropPage() {
  const { walletAddress, totalPoints, tasks, completeTask,
          dailyVideoCount, dailyVideoDate, watchVideoAd } = useAppStore();
  const [showWallet,     setShowWallet]     = useState(false);
  const [showVideoAd, setShowVideoAd] = useState(false);
  const [copied,        setCopied]        = useState(false);
  const [fetchingChain, setFetchingChain]   = useState(false);
  const [fbitBalance,   setFbitBalance]     = useState('0.000000');
  const [solBalance,    setSolBalance]      = useState('0.0000');
  const [stakingInfo,   setStakingInfo]     = useState<SolanaStakingInfo | null>(null);
  const [onChainPts,    setOnChainPts]      = useState(0);

  // Registration state
  const [registration,  setRegistration]  = useState<AirdropRegistration | null>(null);
  const [regLoading,    setRegLoading]    = useState(false);
  const [regError,      setRegError]      = useState('');

  // Start with SSR-safe defaults — same on server AND client during hydration
  const [cfg, setCfg] = useState<AirdropAdminConfig>(DEFAULT_ADMIN_CONFIG);

  // Live-polling server config — 60s auto refresh
  const { config: serverCfg } = useSiteConfig();

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setRegistration(loadRegistration());
    // After hydration: apply localStorage (client-only)
    setCfg(loadAdminConfig());
  }, []);

  // When server config arrives: apply live values
  useEffect(() => {
    if (!serverCfg) return;
    setCfg(prev => ({
      ...prev,
      totalPrize:    serverCfg.totalPrize,
      endDate:       serverCfg.endDate,
      maxWinners:    serverCfg.maxWinners,
      qualifyPoints: serverCfg.qualifyPoints,
      fbitPerPoint:  serverCfg.fbitPerPoint,
      badgeText:     serverCfg.badgeText,
      subtitle:      serverCfg.subtitle,
    }));
  }, [serverCfg]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const totalPts       = totalPoints + onChainPts;
  const progress       = Math.min(100, Math.round((totalPts / cfg.qualifyPoints) * 100));

  // eslint-disable-next-line react-hooks/purity
  const daysLeft   = Math.max(0, Math.ceil((new Date(cfg.endDate).getTime() - Date.now()) / 86_400_000));
  const badgeLabel = new Date() > new Date(cfg.endDate)
    ? '🎁 AIRDROP ENDED'
    : `🎁 AIRDROP LIVE — ${daysLeft} Day${daysLeft === 1 ? '' : 's'} Remaining`;
  const completedCount = tasks.filter(t => t.completed).length;

  // Daily video ad state — reset if date changed
  const today = new Date().toISOString().slice(0, 10);
  const todayVideoCount = dailyVideoDate === today ? dailyVideoCount : 0;
  const videoRemaining  = Math.max(0, 4 - todayVideoCount);
  const videoAdIds      = ['v1', 'v2', 'v3', 'v4'] as const;
  const progressRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    progressRef.current?.style.setProperty('--pw', `${progress}%`);
  }, [progress]);

  const referralLink = walletAddress
    ? `https://stake.futurebit.in/?ref=${walletAddress}`
    : null;

  function copyRef() {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Fetch all Solana on-chain data whenever wallet connects / changes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!walletAddress) {
      setOnChainPts(0);
      setFbitBalance('0.000000');
      setSolBalance('0.0000');
      setStakingInfo(null);
      return;
    }
    setFetchingChain(true);
    Promise.all([
      fetchFBiTBalance(walletAddress),
      fetchSolBalance(walletAddress),
      fetchSolanaStakingInfo(walletAddress),
    ]).then(([fbit, sol, staking]) => {
      setFbitBalance(fbit);
      setSolBalance(sol);
      setStakingInfo(staking);
      // Points: +30 for FBiT balance, +50 if staking on-chain
      let pts = parseFloat(fbit) > 0 ? 30 : 0;
      if (staking?.isStaker) pts += 50;
      setOnChainPts(pts);
    }).catch(() => {}).finally(() => setFetchingChain(false));
  }, [walletAddress]);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleRegister() {
    if (!walletAddress) return;
    setRegLoading(true);
    setRegError('');
    const reg: AirdropRegistration = {
      wallet:       walletAddress,
      points:       totalPts,
      fbitBalance,
      isStaker:     stakingInfo?.isStaker ?? false,
      stakeCount:   stakingInfo?.stakeCount ?? 0,
      totalStaked:  stakingInfo?.totalStaked ?? '0',
      referralLink: `https://stake.futurebit.in/?ref=${walletAddress}`,
      registeredAt: new Date().toISOString(),
      txId:         genTxId(),
    };
    const ok = await submitRegistration(reg);
    if (ok) {
      setRegistration(reg);
    } else {
      setRegError('Submission failed — saved locally. Please contact admin.');
      setRegistration(reg); // still show as registered locally
    }
    setRegLoading(false);
  }

  function handleTask(task: (typeof tasks)[0]) {
    if (task.completed) return;
    if (task.action === 'solana') { setShowWallet(true); return; }
    if (task.action === 'share')  { completeTask(task.id); return; }
    window.open(task.action, '_blank', 'noopener');
    setTimeout(() => completeTask(task.id), 1500);
  }

  function handleWatchVideoAd() {
    if (videoRemaining <= 0) return;
    setShowVideoAd(true);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

      {/* ── HEADER ── */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5 live-badge">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-neon" />
          {badgeLabel}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">
          FBiT Community <span className="text-neon-green">Airdrop</span>
        </h1>
        <p className="text-gray-400 text-lg mb-2">
          {cfg.subtitle} — <strong className="text-white">{cfg.totalPrize} Prize Pool!</strong>
        </p>
        <p className="text-gray-600 text-sm">Minimum {cfg.qualifyPoints} points required to qualify.</p>
      </div>

      {/* ── SOLANA WALLET + BONUS ── */}
      <div className="airdrop-onchain-card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-neon-green text-lg">◎</span>
          <h2 className="text-white font-bold">Bonus Points from Solana Wallet</h2>
          <span className="airdrop-bonus-badge ml-auto">AUTO</span>
        </div>

        {!walletAddress ? (
          <div>
            <p className="text-gray-400 text-sm mb-4">
              Connect your Phantom wallet —{' '}
              <strong className="text-white">your FBiT token balance will be checked for extra points!</strong>
            </p>
            <button type="button" onClick={() => setShowWallet(true)} className="btn-primary">
              👻 Connect Phantom Wallet
            </button>
            <p className="text-gray-600 text-xs mt-2">
              💡 Connect the wallet that holds your FBiT tokens
            </p>
          </div>
        ) : (
          <div>
            {/* Connected address */}
            <div className="flex items-center gap-2 mb-4 bg-white/3 rounded-xl px-3 py-2.5">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse-neon shrink-0" />
              <span className="text-gray-300 text-xs font-mono truncate flex-1">{walletAddress}</span>
              <span className="text-gray-500 text-xs shrink-0">◎ Solana</span>
            </div>

            {fetchingChain ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm py-2">
                <div className="jupiter-spinner jupiter-spinner-sm" />
                Fetching data from stake.futurebit.in...
              </div>
            ) : (
              <>
                {/* 4-stat grid — same data as stake.futurebit.in */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="airdrop-onchain-stat">
                    <p className="text-gray-500 text-xs">SOL Balance</p>
                    <p className="text-white font-bold text-sm">{solBalance}</p>
                    <p className="text-gray-500 text-xs">◎ Solana</p>
                  </div>
                  <div className="airdrop-onchain-stat">
                    <p className="text-gray-500 text-xs">FBiT Balance</p>
                    <p className="text-white font-bold text-sm">{fbitBalance}</p>
                    <p className="text-neon-green text-xs font-bold">
                      {parseFloat(fbitBalance) > 0 ? '+30 pts' : '+0 pts'}
                    </p>
                  </div>
                  <div className="airdrop-onchain-stat">
                    <p className="text-gray-500 text-xs">Stake Positions</p>
                    <p className="text-white font-bold text-sm">
                      {stakingInfo?.stakeCount ?? 0}
                    </p>
                    <p className="text-neon-green text-xs font-bold">
                      {stakingInfo?.isStaker ? '+50 pts' : '+0 pts'}
                    </p>
                  </div>
                  <div className="airdrop-onchain-stat">
                    <p className="text-gray-500 text-xs">Total Staked</p>
                    <p className="text-white font-bold text-sm">
                      {stakingInfo?.totalStaked ?? '0'} FBiT
                    </p>
                    <p className="text-gray-500 text-xs">on-chain</p>
                  </div>
                </div>

                {/* View on stake.futurebit.in — same wallet, full data */}
                <a
                  href={`https://stake.futurebit.in/?ref=${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 bg-white/3 border border-white/8 rounded-xl px-4 py-3 hover:bg-white/6 transition-all group"
                >
                  <div>
                    <p className="text-white text-sm font-semibold">
                      📊 View full data on stake.futurebit.in
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Same Phantom wallet → view referrals, rewards, and team tier
                    </p>
                  </div>
                  <span className="text-neon-green text-lg group-hover:translate-x-1 transition-transform shrink-0">→</span>
                </a>
              </>
            )}

            {onChainPts > 0 && (
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-gray-400 text-sm">Total On-Chain Bonus</span>
                <span className="text-2xl font-black text-neon-green">+{onChainPts} pts</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── TOTAL POINTS ── */}
      <div className="rounded-2xl p-6 mb-8 airdrop-points-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Points</p>
            <div className="flex items-end gap-3">
              <p className="text-4xl font-black text-neon-green">
                {totalPts}<span className="text-lg text-gray-500 ml-1">pts</span>
              </p>
              {onChainPts > 0 && (
                <div className="flex flex-col text-xs mb-1">
                  <span className="text-gray-500">Tasks: <span className="text-white">{totalPoints}</span></span>
                  <span className="text-gray-500">Solana: <span className="text-neon-green">+{onChainPts}</span></span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm mb-1">Tasks Done</p>
            <p className="text-2xl font-bold text-white">
              {completedCount}<span className="text-gray-500">/{tasks.length}</span>
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-2 flex justify-between text-xs text-gray-500">
          <span>Progress to qualify</span>
          <span className={totalPts >= cfg.qualifyPoints ? 'text-neon-green font-bold' : ''}>
            {totalPts >= cfg.qualifyPoints ? '✅ Qualified!' : `${totalPts}/${cfg.qualifyPoints} pts`}
          </span>
        </div>
        <div className="progress-bar h-3">
          <div ref={progressRef} className="progress-fill progress-fill-var h-3" />
        </div>

        {/* Referral link */}
        {referralLink && (
          <div className="mt-5 pt-5 border-t border-white/5">
            <p className="text-gray-400 text-sm mb-1">
              Your Referral Link
              <span className="text-gray-600 ml-1">(redirects to stake.futurebit.in!)</span>
            </p>
            <div className="flex gap-2">
              <div className="flex-1 bg-white/5 rounded-xl px-3 py-2.5 text-xs text-neon-green truncate border border-white/10 font-mono">
                {referralLink}
              </div>
              <button type="button" onClick={copyRef} className="btn-outline text-xs px-4 py-2 shrink-0">
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── TASK LIST ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">Points from Social Tasks</h2>
          <span className="text-gray-500 text-xs">Complete tasks, earn points!</span>
        </div>

        {/* Social tasks */}
        <div className="space-y-3 mb-4">
          {tasks.filter(t => !t.action.startsWith('video:')).map(task => (
            <div
              key={task.id}
              className={`task-item p-4 flex items-center gap-4 ${task.completed ? 'completed' : ''}`}
            >
              <div className="text-2xl shrink-0">{task.icon}</div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${task.completed ? 'text-neon-green' : 'text-white'}`}>
                  {task.label}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">+{task.points} points</p>
              </div>
              <div className="shrink-0">
                {task.completed ? (
                  <span className="text-neon-green text-lg">✅</span>
                ) : (
                  <button type="button" onClick={() => handleTask(task)} className="text-xs btn-outline py-1.5 px-3">
                    {task.action === 'solana' ? 'Connect' : 'Do Task'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Daily Video Ads ── */}
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 mt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white font-bold text-sm">📺 Watch Video Ads — Daily Bonus</p>
              <p className="text-gray-500 text-xs mt-0.5">+10 points per video · max 4 videos/day · resets at midnight</p>
            </div>
            <span className={`text-sm font-black ${videoRemaining > 0 ? 'text-purple-300' : 'text-gray-600'}`}>
              {todayVideoCount}/4 today
            </span>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-2 mb-4">
            {videoAdIds.map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all ${
                  i < todayVideoCount
                    ? 'bg-purple-400'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          {videoRemaining > 0 ? (
            <button
              type="button"
              onClick={handleWatchVideoAd}
              className="w-full py-3 rounded-xl font-bold text-sm border border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-colors"
            >
              ▶️ Watch Ad &amp; Claim +10 Points ({videoRemaining} remaining today)
            </button>
          ) : (
            <div className="text-center py-3 rounded-xl border border-white/5 bg-white/2">
              <p className="text-gray-500 text-sm">✅ All 4 videos watched today!</p>
              <p className="text-gray-600 text-xs mt-0.5">Come back tomorrow for +40 more points</p>
            </div>
          )}
        </div>
      </div>

      {/* ── BONUS GUIDE ── */}
      <div className="airdrop-bonus-guide mb-8">
        <h3 className="text-white font-bold mb-4">◎ Solana Bonus Points — How to Earn?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: '👻', label: 'Connect Phantom Wallet',   pts: '+25 pts',       detail: 'On your first wallet connection'       },
            { icon: '🪙', label: 'Hold FBiT Token',          pts: '+30 pts',       detail: 'FBiT balance > 0 in your Solana wallet'    },
            { icon: '🚀', label: 'Stake on Stake.FutureBit.in', pts: 'Bonus entry!', detail: 'Staking increases your airdrop eligibility' },
            { icon: '🤝', label: 'Share Your Referral Link', pts: 'Extra chances', detail: 'More referrals = bigger prize chance' },
          ].map(item => (
            <div key={item.label} className="airdrop-bonus-row">
              <span className="text-xl shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{item.label}</p>
                <p className="text-gray-500 text-xs">{item.detail}</p>
              </div>
              <span className="text-neon-green font-bold text-sm shrink-0">{item.pts}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <a
            href="https://stake.futurebit.in"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm inline-block"
          >
            🚀 Stake on Stake.FutureBit.in
          </a>
        </div>
      </div>

      {/* ── AD BANNER ── */}
      <AdBanner page="airdrop" className="my-6" />

      {/* ── PRIZE INFO ── */}
      <div className="rounded-2xl p-6 airdrop-prize-card">
        <h3 className="text-lg font-bold text-white mb-4">🏆 Prize Distribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { who: 'Top 100 by Points',  prize: '$500 FBiT split',  detail: '$5 each — Guaranteed'                    },
            { who: '500 Lucky Winners',  prize: '$4,500 FBiT split', detail: '$9 each — Random Draw'                  },
            { who: 'FBiT Holders (Sol)', prize: '$5,000 FBiT split', detail: 'Hold FBiT in your Solana wallet' },
          ].map(p => (
            <div key={p.who} className="bg-white/3 rounded-xl p-4 border border-white/5">
              <p className="text-gray-400 text-xs mb-1">{p.who}</p>
              <p className="text-neon-green font-bold">{p.prize}</p>
              <p className="text-gray-600 text-xs mt-1">{p.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── AIRDROP REGISTRATION ── */}
      <div className="mt-8">
        {/* Already registered */}
        {registration ? (
          <div className="rounded-2xl p-6 border border-neon-green/30 bg-neon-green/5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🎉</span>
              <div>
                <h3 className="text-white font-bold text-lg">Successfully Registered for Airdrop!</h3>
                <p className="text-neon-green text-sm">Registration ID: <span className="font-mono font-bold">{registration.txId}</span></p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Wallet',       val: `${registration.wallet.slice(0,6)}...${registration.wallet.slice(-4)}` },
                { label: 'Points',       val: `${registration.points} pts` },
                { label: 'FBiT Balance', val: `${registration.fbitBalance} FBiT` },
                { label: 'Registered',   val: new Date(registration.registeredAt).toLocaleDateString('en-IN') },
              ].map(s => (
                <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                  <p className="text-gray-500 text-xs">{s.label}</p>
                  <p className="text-white font-bold text-sm truncate">{s.val}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              ✅ Admin will send FBiT tokens to your wallet when the campaign ends.
              <br />
              💡 Save your registration ID: <span className="text-neon-green font-mono">{registration.txId}</span>
            </p>
          </div>

        /* Qualified but not registered */
        ) : totalPts >= cfg.qualifyPoints && walletAddress ? (
          <div className="rounded-2xl p-6 border border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🎁</span>
              <div>
                <h3 className="text-white font-bold text-lg">You&apos;re Qualified!</h3>
                <p className="text-yellow-400 text-sm font-semibold">{totalPts} pts ✅ — {cfg.qualifyPoints} required</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-5">
              Register now — FBiT tokens will be sent directly to your wallet when the campaign ends.
              <strong className="text-white"> Secure your spot!</strong>
            </p>

            {/* Wallet confirm box */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
              <p className="text-gray-500 text-xs mb-1">Airdrop will be sent to this wallet:</p>
              <p className="text-neon-green font-mono text-sm break-all">{walletAddress}</p>
              <p className="text-gray-600 text-xs mt-1">◎ Solana · Phantom Wallet</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5 text-center text-xs">
              <div className="bg-white/3 rounded-xl p-3">
                <p className="text-gray-500">Total Points</p>
                <p className="text-neon-green font-bold text-lg">{totalPts}</p>
              </div>
              <div className="bg-white/3 rounded-xl p-3">
                <p className="text-gray-500">FBiT Balance</p>
                <p className="text-white font-bold">{fbitBalance}</p>
              </div>
              <div className="bg-white/3 rounded-xl p-3">
                <p className="text-gray-500">Stake Positions</p>
                <p className="text-white font-bold">{stakingInfo?.stakeCount ?? 0}</p>
              </div>
            </div>

            {regError && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 mb-4">
                <p className="text-yellow-400 text-xs">{regError}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleRegister}
              disabled={regLoading}
              className="btn-primary w-full text-base py-3 disabled:opacity-60"
            >
              {regLoading ? '⏳ Registering...' : '🎁 Register for Airdrop'}
            </button>
            <p className="text-gray-600 text-xs text-center mt-2">
              No tokens will be deducted — only your wallet address is saved
            </p>
          </div>

        /* Not yet qualified */
        ) : walletAddress ? (
          <div className="rounded-2xl p-5 border border-white/8 bg-white/2 text-center">
            <p className="text-gray-400 text-sm mb-1">
              You need <strong className="text-white">{cfg.qualifyPoints - totalPts} more points</strong> to qualify
            </p>
            <p className="text-gray-600 text-xs">Complete tasks above or earn staking bonus</p>
          </div>

        /* No wallet */
        ) : (
          <div className="text-center">
            <p className="text-gray-400 mb-4">Connect your wallet to complete tasks!</p>
            <button type="button" onClick={() => setShowWallet(true)} className="btn-primary">
              👻 Connect Phantom Wallet
            </button>
          </div>
        )}
      </div>

      {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}

      {showVideoAd && (
        <VideoAdModal
          adId={videoAdIds[todayVideoCount] ?? 'v1'}
          label={`Video Ad ${todayVideoCount + 1} of 4`}
          points={10}
          onClaim={() => { watchVideoAd(); }}
          onClose={() => setShowVideoAd(false)}
        />
      )}
    </div>
  );
}
