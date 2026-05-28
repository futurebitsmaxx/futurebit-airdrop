'use client';

import { useState } from 'react';
import Link from 'next/link';
import WalletModal from '@/components/WalletModal';
import { useAppStore } from '@/lib/store';

const steps = [
  {
    id: 1,
    icon: '📱',
    color: 'green',
    title: 'Install Phantom Wallet',
    subtitle: 'The first and most essential step',
    time: '2 min',
    content: {
      intro: 'To use FutureBit you need a Solana wallet. We recommend Phantom — it is the most popular and secure Solana wallet available.',
      steps: [
        { icon: '💻', text: 'Open Chrome browser and search for "Phantom wallet extension"' },
        { icon: '🔗', text: 'Install the extension from the official Phantom website (phantom.app)' },
        { icon: '📝', text: 'Click "Create New Wallet" and generate your 12-word seed phrase' },
        { icon: '🔐', text: 'Write your seed phrase OFFLINE and keep it in a safe place — this is your wallet backup' },
        { icon: '🔑', text: 'Set a strong password and complete the wallet setup' },
      ],
      warning: '⚠️ Never share your seed phrase (12 words) with anyone — not even the FutureBit team. It is your private key.',
      tip: '💡 Using mobile? Phantom is available on both iOS and Android — download from the App Store or Play Store.',
      alternatives: ['Backpack', 'Solflare'],
    },
  },
  {
    id: 2,
    icon: '◎',
    color: 'blue',
    title: 'Buy SOL (For Gas Fees)',
    subtitle: 'A small amount of SOL is needed for transactions',
    time: '5–15 min',
    content: {
      intro: 'Every transaction on the Solana blockchain requires SOL (gas fee). You will need SOL for staking, swapping, and claiming rewards.',
      steps: [
        { icon: '🏦', text: 'Create an account on any major exchange: Binance, CoinDCX, WazirX, or Coinbase' },
        { icon: '💳', text: 'Deposit funds via UPI, bank transfer, or card' },
        { icon: '🔄', text: 'Search for SOL and buy — minimum 0.1 SOL is enough for gas fees' },
        { icon: '📤', text: 'Copy your Phantom wallet address (click "Receive" inside the wallet)' },
        { icon: '💸', text: 'Withdraw SOL from the exchange to your Phantom wallet address' },
      ],
      warning: '⚠️ When withdrawing, always select the SOLANA network. Do not send on ERC-20 or BEP-20 — SOL will be lost.',
      tip: '💡 Just 0.05–0.1 SOL is enough to get started. Holding more SOL is optional.',
    },
  },
  {
    id: 3,
    icon: '🔗',
    color: 'green',
    title: 'Connect Wallet to FutureBit',
    subtitle: 'Activate your account — completely free!',
    time: '1 min',
    content: {
      intro: 'Your wallet is ready. Connect it to FutureBit and activate your account. It is completely FREE — no sign-up form, no email required.',
      steps: [
        { icon: '🌐', text: 'Open futurebit.in (or stake.futurebit.in) in your browser' },
        { icon: '🖱️', text: 'Click the "Connect Wallet" button at the top' },
        { icon: '👛', text: 'Select "Phantom" from the popup' },
        { icon: '✅', text: 'Approve "Connect" in the Phantom extension — no SOL will be spent' },
        { icon: '🎉', text: 'Connected! Your wallet address will appear in the top-right corner' },
      ],
      tip: '💡 After connecting your wallet, your airdrop dashboard activates and you automatically receive +30 points.',
    },
  },
  {
    id: 4,
    icon: '📋',
    color: 'purple',
    title: 'Complete Airdrop Tasks',
    subtitle: 'Earn points and win FREE FBiT',
    time: '10 min',
    content: {
      intro: 'Go to the Airdrop page and complete all tasks. More points = more FBiT. You need a minimum of 70 points to qualify.',
      tasks: [
        { icon: '👛', task: 'Connect Wallet',      pts: '+30', done: true  },
        { icon: '💬', task: 'Join Telegram',        pts: '+10', done: false },
        { icon: '🐦', task: 'Follow on Twitter',    pts: '+10', done: false },
        { icon: '🔁', task: 'Retweet Post',         pts: '+5',  done: false },
        { icon: '📸', task: 'Follow on Instagram',  pts: '+5',  done: false },
        { icon: '👥', task: 'Join Discord',          pts: '+5',  done: false },
        { icon: '🤝', task: 'Refer 1 Friend',        pts: '+20', done: false },
      ],
      formula: '100 points = 5 FBiT tokens',
      minPoints: 70,
      tip: '💡 Complete all tasks = 85+ points = 4+ FBiT minimum. Earn even more points through referrals!',
      warning: '⚠️ The airdrop is only for the first 5,000 members. Act fast!',
    },
  },
  {
    id: 5,
    icon: '🤝',
    color: 'orange',
    title: 'Share Your Referral Link',
    subtitle: 'Every referral = +20 points + passive income',
    time: '5 min',
    content: {
      intro: 'FutureBit\'s 10-level referral system gives you passive income whenever your network stakes. The bigger your network, the higher your earnings.',
      steps: [
        { icon: '🔗', text: 'Go to the Airdrop page and copy your unique link from the "Referral Link" section' },
        { icon: '📤', text: 'Share the link on WhatsApp groups, Telegram, Twitter, or with friends' },
        { icon: '💰', text: 'Each direct referral gives you +20 points in the airdrop' },
        { icon: '📊', text: 'When your referrals stake, you earn a 10% commission automatically' },
        { icon: '🌊', text: 'Commissions also apply from Level 2–10 referrals — your whole network earns for you' },
      ],
      commissions: [
        { level: 'Level 1', pct: '10%', desc: 'Direct referral' },
        { level: 'Level 2', pct: '5%',  desc: 'Referral of referral' },
        { level: 'Level 3', pct: '3%',  desc: '3rd generation' },
        { level: 'Level 4', pct: '2%',  desc: '4th generation' },
        { level: 'Level 5+', pct: '0.5–1%', desc: 'Deep network' },
      ],
      tip: '💡 Top 3 referrers win a WEEKLY $950 bonus prize! Keep checking the leaderboard.',
    },
  },
  {
    id: 6,
    icon: '🪐',
    color: 'purple',
    title: 'Buy FBiT Token (Jupiter Swap)',
    subtitle: 'Swap SOL to FBiT — optional but recommended',
    time: '3 min',
    content: {
      intro: 'If you want to start staking or need more FBiT, buy it on Jupiter DEX by swapping SOL. Jupiter is Solana\'s best DEX aggregator.',
      steps: [
        { icon: '🪐', text: 'Go to the Swap page — the Jupiter terminal will already be loaded' },
        { icon: '👛', text: 'Click "Connect Wallet" in the terminal (select Phantom)' },
        { icon: '💱', text: 'Input: SOL | Output: FBiT (already pre-selected)' },
        { icon: '💰', text: 'Enter the amount of FBiT you want — Jupiter finds the best price' },
        { icon: '✅', text: 'Click "Swap" and approve the transaction in Phantom' },
      ],
      warning: '⚠️ Jupiter may show "5 Warnings" — this is normal for newer tokens. Verify the FBiT mint address first: CuubBz...UGTu',
      tip: '💡 Try a small amount first (e.g., 0.01 SOL) — once the swap works correctly, proceed with more.',
    },
  },
  {
    id: 7,
    icon: '💎',
    color: 'green',
    title: 'Stake FBiT — Earn Rewards',
    subtitle: 'Up to 300% APY — put your FBiT to work',
    time: '5 min',
    content: {
      intro: 'Stake your FBiT tokens and earn staking rewards. The more you stake and the longer the lock period, the higher your APY.',
      tiers: [
        { name: 'Starter',  min: '100 FBiT',   lock: '30 days',  apy: '50–100%',  badge: '🥉' },
        { name: 'Silver',   min: '500 FBiT',   lock: '60 days',  apy: '100–150%', badge: '🥈' },
        { name: 'Gold',     min: '1,000 FBiT', lock: '90 days',  apy: '150–200%', badge: '🥇' },
        { name: 'Diamond',  min: '5,000 FBiT', lock: '180 days', apy: '200–300%', badge: '💎' },
      ],
      steps: [
        { icon: '💎', text: 'Go to the Stake page and select your tier' },
        { icon: '🔢', text: 'Enter the amount to stake (minimum 100 FBiT)' },
        { icon: '⏰', text: 'Confirm the lock period — tokens will be locked during this time' },
        { icon: '✅', text: 'Click "Stake Now" and approve in Phantom' },
        { icon: '📊', text: 'Track your rewards on the dashboard — they accumulate daily' },
      ],
      bonus: '🎰 Bonus: Stake $100+ and get entry into the Monthly Lucky Vault — $2,000 monthly prize pool!',
    },
  },
  {
    id: 8,
    icon: '🏆',
    color: 'orange',
    title: 'Track Progress & Claim Rewards',
    subtitle: 'Leaderboard, airdrop, and staking rewards',
    time: 'Ongoing',
    content: {
      intro: 'Congratulations! You are now fully active in the FutureBit ecosystem. Track your progress and claim rewards from all these places.',
      tracks: [
        { icon: '🎁', title: 'Airdrop Distribution',     desc: 'FBiT tokens will be transferred to your wallet after June 2026. You will be notified via Telegram.', href: '/airdrop', label: 'Check Airdrop' },
        { icon: '🏆', title: 'Weekly Referral Contest',  desc: 'Top 3 referrers win $950 every week. Check your rank on the leaderboard.', href: '/leaderboard', label: 'See Leaderboard' },
        { icon: '💎', title: 'Staking Rewards',          desc: 'Staking rewards accumulate daily. Use the claim button on your dashboard to withdraw.', href: '/stake', label: 'Stake Dashboard' },
        { icon: '⚔️', title: 'Trading Competition',      desc: 'Trade FBiT on Jupiter and rank among top traders — $5,000 prize pool.', href: '/competition', label: 'Join Competition' },
      ],
      tip: '💡 Check in daily — referral bonuses and staking rewards compound over time. The more active you are, the more you earn.',
    },
  },
];

const colorMap = {
  green:  { border: 'rgba(0,255,136,0.2)',   bg: 'rgba(0,255,136,0.06)',   text: '#00ff88',  num: 'rgba(0,255,136,0.15)'   },
  blue:   { border: 'rgba(0,212,255,0.2)',   bg: 'rgba(0,212,255,0.06)',   text: '#00d4ff',  num: 'rgba(0,212,255,0.15)'   },
  purple: { border: 'rgba(168,85,247,0.2)',  bg: 'rgba(168,85,247,0.06)',  text: '#a855f7',  num: 'rgba(168,85,247,0.15)'  },
  orange: { border: 'rgba(251,146,60,0.2)',  bg: 'rgba(251,146,60,0.06)',  text: '#fb923c',  num: 'rgba(251,146,60,0.15)'  },
};

export default function GuidePage() {
  const { walletAddress } = useAppStore();
  const [showWallet, setShowWallet] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5 live-badge">
            🚀 COMPLETE BEGINNER GUIDE
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            How to Join <span className="text-neon-green">FutureBit?</span>
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            8 simple steps — from wallet setup to claiming rewards, everything explained!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-2">
            {!walletAddress ? (
              <button type="button" onClick={() => setShowWallet(true)} className="btn-primary text-base">
                Get Started — Connect Wallet 🚀
              </button>
            ) : (
              <Link href="/airdrop" className="btn-primary text-base">
                Airdrop Tasks Dekho →
              </Link>
            )}
            <Link href="/guide/pdf" target="_blank" rel="noopener noreferrer"
              className="btn-outline text-sm flex items-center gap-2">
              📄 Beginner Guide PDF
            </Link>
            <Link href="/marketing/pdf" target="_blank" rel="noopener noreferrer"
              className="btn-outline text-sm flex items-center gap-2">
              📊 Marketing Plan PDF
            </Link>
          </div>
          <p className="text-gray-600 text-xs">Share both PDFs with friends — help others understand the platform!</p>
        </div>

        {/* ── Progress bar ── */}
        <div className="mb-12 p-4 rounded-2xl overflow-x-auto" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-gray-500 text-xs mb-4 text-center">All 8 Steps — Click to jump</p>
          <div className="flex items-center min-w-max mx-auto gap-0">
            {steps.map((s, i) => {
              const c = colorMap[s.color as keyof typeof colorMap];
              return (
                <div key={s.id} className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveStep(s.id === activeStep ? null : s.id);
                      document.getElementById(`step-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    className="flex flex-col items-center gap-1 px-3 group"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold transition-all group-hover:scale-110"
                      style={{ background: c.num, border: `1.5px solid ${c.border}`, color: c.text }}
                    >
                      {s.icon}
                    </div>
                    <span className="text-gray-600 text-xs whitespace-nowrap" style={{ color: c.text, opacity: 0.7 }}>
                      {s.id}
                    </span>
                  </button>
                  {i < steps.length - 1 && (
                    <div className="w-6 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Steps ── */}
        <div className="space-y-6">
          {steps.map((step) => {
            const c = colorMap[step.color as keyof typeof colorMap];
            const d = step.content;

            return (
              <div
                key={step.id}
                id={`step-${step.id}`}
                className="rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${c.border}`, background: c.bg }}
              >
                {/* Step header */}
                <div className="flex items-center gap-4 p-5 pb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: c.num, border: `1px solid ${c.border}` }}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: c.num, color: c.text }}>
                        Step {step.id}
                      </span>
                      <span className="text-xs text-gray-600">⏱ {step.time}</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-white mt-1">{step.title}</h2>
                    <p className="text-sm" style={{ color: c.text, opacity: 0.8 }}>{step.subtitle}</p>
                  </div>
                </div>

                {/* Step body */}
                <div className="px-5 pb-6">
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">{d.intro}</p>

                  {/* Regular steps list */}
                  {'steps' in d && d.steps && (
                    <ol className="space-y-3 mb-5">
                      {d.steps.map((s, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                            style={{ background: c.num, color: c.text }}
                          >
                            {i + 1}
                          </div>
                          <span className="text-gray-300 text-sm leading-relaxed">
                            <span className="mr-1.5">{s.icon}</span>{s.text}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}

                  {/* Airdrop tasks table */}
                  {'tasks' in d && d.tasks && (
                    <div className="mb-5">
                      <div className="space-y-2 mb-4">
                        {d.tasks.map((t) => (
                          <div
                            key={t.task}
                            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                          >
                            <div className="flex items-center gap-2">
                              <span>{t.icon}</span>
                              <span className="text-gray-300 text-sm">{t.task}</span>
                              {t.done && <span className="text-xs text-neon-green bg-neon-green/10 px-1.5 py-0.5 rounded">auto ✓</span>}
                            </div>
                            <span className="font-bold text-sm shrink-0" style={{ color: c.text }}>{t.pts} pts</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.15)' }}>
                        <p className="text-neon-green font-bold text-sm">🧮 {d.formula}</p>
                        <p className="text-gray-500 text-xs mt-0.5">Minimum {d.minPoints} points required to qualify</p>
                      </div>
                    </div>
                  )}

                  {/* Staking tiers */}
                  {'tiers' in d && d.tiers && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                      {d.tiers.map((t) => (
                        <div key={t.name} className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <div className="text-xl mb-1">{t.badge}</div>
                          <div className="text-white text-xs font-bold mb-1">{t.name}</div>
                          <div className="text-gray-500 text-xs mb-1">{t.min}</div>
                          <div className="text-gray-500 text-xs mb-1">{t.lock}</div>
                          <div className="font-bold text-xs" style={{ color: c.text }}>{t.apy} APY</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Referral commissions */}
                  {'commissions' in d && d.commissions && (
                    <div className="mb-5 overflow-x-auto">
                      <table className="w-full text-sm">
                        <tbody>
                          {d.commissions.map((com) => (
                            <tr key={com.level} className="border-b border-white/5">
                              <td className="py-2 pr-4 text-xs font-bold" style={{ color: c.text }}>{com.level}</td>
                              <td className="py-2 pr-4 text-gray-400 text-xs">{com.desc}</td>
                              <td className="py-2 text-white font-bold text-xs">{com.pct}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Track rewards cards */}
                  {'tracks' in d && d.tracks && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                      {d.tracks.map((t) => (
                        <Link key={t.title} href={t.href}
                          className="flex flex-col gap-1.5 p-4 rounded-xl transition-all hover:scale-[1.02]"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{t.icon}</span>
                            <span className="text-white text-sm font-bold">{t.title}</span>
                          </div>
                          <p className="text-gray-500 text-xs leading-relaxed">{t.desc}</p>
                          <span className="text-xs font-bold mt-1" style={{ color: c.text }}>{t.label} →</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Wallet alternatives */}
                  {'alternatives' in d && d.alternatives && (
                    <div className="mb-4">
                      <p className="text-gray-500 text-xs mb-2">Alternative wallets (also supported):</p>
                      <div className="flex gap-2">
                        {d.alternatives.map((a) => (
                          <span key={a} className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Staking bonus */}
                  {'bonus' in d && d.bonus && (
                    <div className="p-3 rounded-xl mb-4" style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.15)' }}>
                      <p className="text-orange-400 text-sm">{d.bonus}</p>
                    </div>
                  )}

                  {/* Warning */}
                  {'warning' in d && d.warning && (
                    <div className="p-3 rounded-xl mb-4 bg-yellow-500/10 border border-yellow-500/20">
                      <p className="text-yellow-400 text-xs">{d.warning}</p>
                    </div>
                  )}

                  {/* Tip */}
                  {'tip' in d && d.tip && (
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <p className="text-gray-400 text-xs">{d.tip}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Final CTA ── */}
        <div className="mt-12 cta-banner text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Get Started Now!
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Connect wallet, complete tasks, refer friends — and earn FBiT tokens. Only 5,000 spots available!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {walletAddress ? (
              <>
                <Link href="/airdrop"     className="btn-primary">🎁 Go to Airdrop Tasks</Link>
                <Link href="/stake"       className="btn-outline">💎 Stake FBiT</Link>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setShowWallet(true)} className="btn-primary">
                  Connect Wallet — It&apos;s Free!
                </button>
                <Link href="/airdrop" className="btn-outline">View Tasks First</Link>
              </>
            )}
          </div>
        </div>

        {/* ── Bottom links ── */}
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/guide/pdf" target="_blank" className="text-neon-green hover:underline">📄 PDF Download</Link>
          <Link href="/docs"    className="text-gray-500 hover:text-neon-green transition-colors">Full Docs →</Link>
          <Link href="/terms"   className="text-gray-500 hover:text-neon-green transition-colors">Terms</Link>
          <Link href="/privacy" className="text-gray-500 hover:text-neon-green transition-colors">Privacy</Link>
        </div>
      </div>

      {showWallet && <WalletModal onClose={() => setShowWallet(false)} />}
    </div>
  );
}
