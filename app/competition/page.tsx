'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import WalletModal from '@/components/WalletModal';
import AdBanner from '@/components/AdBanner';
import {
  COMP_CONFIG, PRIZE_TIERS, COMP_RULES,
  loadCompReg, submitCompReg, genCompTxId,
  loadCompAdminConfig, DEFAULT_COMP_ADMIN_CONFIG, type CompAdminConfig, type CompRegistration,
} from '@/lib/competitionConfig';

// ── Countdown hook ─────────────────────────────────────────────────────────────
function useCountdown(targetIso: string) {
  const calc = () => {
    const diff = new Date(targetIso).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
    const s = Math.floor(diff / 1000);
    return {
      days:    Math.floor(s / 86400),
      hours:   Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
      ended:   false,
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIso]);
  return time;
}

export default function CompetitionPage() {
  const { walletAddress } = useAppStore();
  const [showWallet,  setShowWallet]  = useState(false);
  const [registration, setReg]        = useState<CompRegistration | null>(null);
  const [regLoading,  setRegLoading]  = useState(false);
  const [activeTab,   setActiveTab]   = useState<'board' | 'prizes' | 'rules' | 'howto'>('board');
  const [copiedLink,  setCopiedLink]  = useState(false);
  const [cfg,         setCfg]         = useState<CompAdminConfig>(DEFAULT_COMP_ADMIN_CONFIG);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setReg(loadCompReg());
    setCfg(loadCompAdminConfig());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Use admin config dates; fall back to COMP_CONFIG constants
  const startIso = cfg.startDate ? cfg.startDate + 'T00:00:00Z' : COMP_CONFIG.startDate;
  const endIso   = cfg.endDate   ? cfg.endDate   + 'T23:59:59Z' : COMP_CONFIG.endDate;

  const started = new Date() >= new Date(startIso);
  const ended   = new Date() > new Date(endIso);
  const countdown = useCountdown(started ? endIso : startIso);

  async function handleRegister() {
    if (!walletAddress) return;
    setRegLoading(true);
    const reg: CompRegistration = {
      wallet:       walletAddress,
      registeredAt: new Date().toISOString(),
      txId:         genCompTxId(),
    };
    await submitCompReg(reg);
    setReg(reg);
    setRegLoading(false);
  }

  const timeLabel   = started ? 'Competition Ends In' : 'Competition Starts In';
  const statusBadge = ended ? '🔴 ENDED' : started ? '🟢 LIVE' : '🟡 UPCOMING';

  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden">
        <div className="comp-hero-bg" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-8">

          {/* Badge + Title */}
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-4 live-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse-neon" />
              {statusBadge} — {cfg.season}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">
              FBiT <span className="comp-gradient-text">Trading Championship</span>
            </h1>
            <p className="text-gray-400 text-lg mb-1">
              Trade the most FBiT — <strong className="text-white">{cfg.totalPrize} Prize Pool!</strong>
            </p>
            <p className="text-gray-600 text-sm">Trade SOL/FBiT on Jupiter · ${cfg.minVolume} minimum volume required</p>
          </div>

          {/* Countdown */}
          {!ended && (
            <div className="max-w-lg mx-auto mb-8">
              <p className="text-center text-gray-500 text-xs mb-3">{timeLabel}</p>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { val: countdown.days,    label: 'Days'    },
                  { val: countdown.hours,   label: 'Hours'   },
                  { val: countdown.minutes, label: 'Minutes' },
                  { val: countdown.seconds, label: 'Seconds' },
                ].map(({ val, label }) => (
                  <div key={label} className="comp-countdown-box">
                    <span className="comp-countdown-num">{String(val).padStart(2, '0')}</span>
                    <span className="text-gray-500 text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'Prize Pool',    val: cfg.totalPrize,                icon: '💰' },
              { label: 'Participants',  val: 'Open for all',                icon: '👥' },
              { label: 'Trading Pair', val: 'SOL/FBiT on Jupiter', icon: '📊' },
              { label: 'Season',       val: cfg.season,           icon: '🏆' },
            ].map(s => (
              <div key={s.label} className="comp-stat-card text-center">
                <span className="text-xl mb-1 block">{s.icon}</span>
                <p className="text-white font-bold text-sm">{s.val}</p>
                <p className="text-gray-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 mt-8">

        {/* ── REGISTRATION CARD ── */}
        {registration ? (
          <div className="rounded-2xl p-6 border border-neon-green/30 bg-neon-green/5 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-3xl">✅</span>
                <div>
                  <p className="text-white font-bold">You&apos;re Registered!</p>
                  <p className="text-gray-400 text-sm">ID: <span className="font-mono text-neon-green">{registration.txId}</span></p>
                </div>
              </div>
              <div className="flex gap-3">
                <a href={COMP_CONFIG.jupiterUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                  🪐 Trade on Jupiter →
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(COMP_CONFIG.jupiterUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="btn-outline text-sm"
                >
                  {copiedLink ? '✅' : '📋'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="comp-register-card mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex-1">
                <h2 className="text-white font-bold text-xl mb-1">🏆 Join the Competition</h2>
                <p className="text-gray-400 text-sm">
                  Connect wallet → Register → Trade FBiT on Jupiter → Win prizes!
                </p>
              </div>
              {!walletAddress ? (
                <button type="button" onClick={() => setShowWallet(true)} className="btn-primary shrink-0 text-base py-3 px-6">
                  👻 Connect Phantom
                </button>
              ) : (
                <div className="flex flex-col gap-2 shrink-0">
                  <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                    <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse-neon" />
                    <span className="text-gray-300 text-xs font-mono">{walletAddress.slice(0,6)}...{walletAddress.slice(-4)}</span>
                  </div>
                  <button type="button" onClick={handleRegister} disabled={regLoading || ended}
                    className="btn-primary text-sm py-2.5 disabled:opacity-60">
                    {regLoading ? '⏳ Registering...' : ended ? '⏰ Competition Over' : '🚀 Register & Start Trading'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TABS ── */}
        <div className="stake-tab-bar mb-6">
          {([
            { id: 'board',  label: '🏆 Leaderboard'   },
            { id: 'prizes', label: '💰 Prizes'         },
            { id: 'howto',  label: '📖 How to Trade' },
            { id: 'rules',  label: '📋 Rules'          },
          ] as { id: typeof activeTab; label: string }[]).map(t => (
            <button key={t.id} type="button" onClick={() => setActiveTab(t.id)}
              className={`stake-tab-btn ${activeTab === t.id ? 'stake-tab-btn--active' : ''}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ TAB: LEADERBOARD ══ */}
        {activeTab === 'board' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-sm">Live rankings · Jupiter SOL/FBiT volume</p>
            </div>

            {/* Top 3 podium — live data shows here after competition ends */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { label: '🥇 1st Place', prize: PRIZE_TIERS[0].prize, cls: 'comp-podium-1' },
                { label: '🥈 2nd Place', prize: PRIZE_TIERS[1].prize, cls: 'comp-podium-2' },
                { label: '🥉 3rd Place', prize: PRIZE_TIERS[2].prize, cls: 'comp-podium-3' },
              ].map(p => (
                <div key={p.label} className={`comp-podium-card text-center ${p.cls}`}>
                  <p className="text-white font-semibold text-sm">{p.label}</p>
                  <p className="text-gray-500 text-xs mt-1">Not yet decided</p>
                  <div className="comp-prize-badge mt-2">{p.prize}</div>
                </div>
              ))}
            </div>

            {/* Empty state */}
            <div className="stake-wallet-card text-center py-12">
              <div className="text-5xl mb-4">🏁</div>
              {started ? (
                <>
                  <p className="text-white font-bold text-lg mb-2">No trades recorded yet</p>
                  <p className="text-gray-400 text-sm mb-2">Competition is live — trade SOL/FBiT on Jupiter to appear here</p>
                </>
              ) : (
                <>
                  <p className="text-white font-bold text-lg mb-2">Competition starts on {new Date(startIso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-gray-400 text-sm mb-2">
                    Starts in {countdown.days > 0 ? `${countdown.days}d ` : ''}{String(countdown.hours).padStart(2,'0')}h {String(countdown.minutes).padStart(2,'0')}m
                  </p>
                </>
              )}
              <p className="text-gray-600 text-xs">
                Trade SOL/FBiT on Jupiter during the competition period to appear here.
              </p>
            </div>
          </div>
        )}

        {/* ══ TAB: PRIZES ══ */}
        {activeTab === 'prizes' && (
          <div className="space-y-5">
            <div className="comp-register-card text-center">
              <p className="text-4xl mb-2">💰</p>
              <h2 className="text-white font-bold text-2xl mb-1">{cfg.totalPrize}</h2>
              <p className="text-gray-400">Total Prize Pool — Competition starts {cfg.startDate}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PRIZE_TIERS.map((tier, i) => (
                <div key={tier.rank}
                  className={`rounded-2xl p-5 border text-center transition-all hover:scale-105 ${
                    i === 0 ? 'border-yellow-400/40 bg-yellow-400/5' :
                    i === 1 ? 'border-gray-400/40 bg-gray-400/5'    :
                    i === 2 ? 'border-orange-400/40 bg-orange-400/5' :
                    'border-white/8 bg-white/2'
                  }`}>
                  <p className="text-2xl mb-2">{['🥇','🥈','🥉','🎖️','🎗️','🎲'][i]}</p>
                  <p className="text-gray-400 text-sm font-semibold">{tier.rank}</p>
                  <p className={`font-black text-xl mt-1 ${
                    i === 0 ? 'text-yellow-400' :
                    i === 1 ? 'text-gray-300'   :
                    i === 2 ? 'text-orange-400' :
                    'text-neon-green'
                  }`}>{tier.prize}</p>
                  <p className="text-gray-500 text-xs mt-1">{tier.extra}</p>
                </div>
              ))}
            </div>

            <div className="stake-team-explain-card">
              <h3 className="text-white font-bold mb-3">💡 How Will Prizes Be Distributed?</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {[
                  'Final leaderboard announced 48 hours after competition ends',
                  'FBiT tokens sent directly to top traders\' wallets',
                  'Lucky draw randomly selects from 50+ qualified traders',
                  'Distribution is publicly verifiable on Solana blockchain',
                ].map(item => (
                  <li key={item} className="flex gap-2">
                    <span className="text-neon-green shrink-0">✦</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ══ TAB: HOW TO TRADE ══ */}
        {activeTab === 'howto' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { n: '1', icon: '👻', title: 'Connect Phantom',        desc: 'Connect your Phantom wallet using the "Register" button above' },
                { n: '2', icon: '📝', title: 'Register for Competition', desc: 'Register in one click — your wallet address will be saved' },
                { n: '3', icon: '🪐', title: 'Go to Jupiter',           desc: 'Use the "Trade Now" button to go to Jupiter — swap SOL to FBiT' },
                { n: '4', icon: '🔁', title: 'Keep Trading',            desc: 'More volume = higher rank — trade for one full month!' },
              ].map(step => (
                <div key={step.n} className="comp-howto-card">
                  <div className="comp-howto-num">{step.n}</div>
                  <div className="text-3xl mb-3">{step.icon}</div>
                  <h3 className="text-white font-bold text-sm mb-1">{step.title}</h3>
                  <p className="text-gray-500 text-xs">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="comp-register-card">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-1">🪐 FBiT Jupiter Trading Link</h3>
                  <p className="text-gray-400 text-sm">SOL → FBiT direct swap — highest liquidity, best price</p>
                  <code className="text-xs text-neon-green font-mono mt-2 block truncate">{COMP_CONFIG.jupiterUrl}</code>
                </div>
                <a href={COMP_CONFIG.jupiterUrl} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">
                  🚀 Trade on Jupiter →
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: '📊', title: 'How is Volume Counted?',   body: 'Every SOL↔FBiT swap on Jupiter is counted — buy + sell volume combined.' },
                { icon: '⏰', title: 'Trading Hours',             body: '24/7 — trade anytime during the competition period. Only on-chain confirmed transactions count.' },
                { icon: '💡', title: 'Strategy Tips',             body: 'Regular small trades ≥ one large trade (less slippage). DCA strategy works best for volume.' },
              ].map(card => (
                <div key={card.title} className="stake-team-explain-card">
                  <p className="text-2xl mb-2">{card.icon}</p>
                  <h3 className="text-white font-bold text-sm mb-1">{card.title}</h3>
                  <p className="text-gray-400 text-xs">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TAB: RULES ══ */}
        {activeTab === 'rules' && (
          <div className="space-y-5">
            <div className="stake-wallet-card">
              <h2 className="text-white font-bold text-lg mb-4">📋 Competition Rules</h2>
              <div className="space-y-3">
                {COMP_RULES.map(r => (
                  <div key={r.rule} className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
                    <span className="text-xl shrink-0">{r.icon}</span>
                    <p className="text-gray-300 text-sm">{r.rule}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="comp-register-card">
                <h3 className="text-white font-bold mb-3">📅 Competition Dates</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Start</span>
                    <span className="text-white font-bold">{new Date(cfg.startDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">End</span>
                    <span className="text-white font-bold">{new Date(cfg.endDate).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Results</span>
                    <span className="text-neon-green font-bold">48h after end</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Min Volume</span>
                    <span className="text-white font-bold">${cfg.minVolume} USD</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-500/8 border border-red-500/20 rounded-2xl p-5">
                <h3 className="text-red-400 font-bold mb-3">❌ Disqualification</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  {[
                    'Wash trading (sending tokens to yourself)',
                    'Bot or automated trading scripts',
                    'Multiple wallets per person',
                    'Artificially inflating volume',
                  ].map(item => (
                    <li key={item} className="flex gap-2">
                      <span className="text-red-400 shrink-0">✗</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <AdBanner page="competition" />
      </div>

      {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
    </div>
  );
}
