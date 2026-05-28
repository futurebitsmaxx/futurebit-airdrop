'use client';

import { useEffect } from 'react';

const TOKEN_MINT = 'CuubBzUTnQ4H2D2fHJCVWGEUEod2fJzq4nAPwfx8UGTu';
const SITE_URL   = 'https://stake.futurebit.in';

const steps = [
  {
    num: '01', icon: '📱', title: 'Install Phantom Wallet',
    items: [
      'Go to phantom.app and install the Chrome extension',
      'Click "Create New Wallet" — you will receive a 12-word seed phrase',
      'Write your seed phrase OFFLINE and store it safely (never share it)',
      'Set a strong password — setup complete!',
    ],
    tip: 'Alternative wallets: Backpack or Solflare also work',
    warn: 'NEVER share your seed phrase — not even with the FutureBit team!',
  },
  {
    num: '02', icon: '◎', title: 'Buy SOL (For Gas Fees)',
    items: [
      'Create an account on Binance, Coinbase, or any major exchange',
      'Deposit funds via bank transfer or card',
      'Buy SOL — minimum 0.1 SOL is enough for gas fees',
      'Copy your Phantom wallet address (Receive button)',
      'Withdraw from exchange to your wallet using the SOLANA NETWORK',
    ],
    tip: 'Only 0.05–0.1 SOL is needed to get started',
    warn: 'Always select the Solana network — do NOT withdraw on ERC-20/BEP-20!',
  },
  {
    num: '03', icon: '🔗', title: 'Connect Wallet on FutureBit',
    items: [
      'Open stake.futurebit.in',
      'Click the "Connect Wallet" button',
      'Select Phantom in the popup',
      'Click "Connect" in Phantom — it is FREE, no SOL required',
      'Done! Your wallet address will appear top-right — +30 points auto credited',
    ],
    tip: 'Your airdrop dashboard activates as soon as you connect',
  },
  {
    num: '04', icon: '📋', title: 'Complete Airdrop Tasks (Earn Points)',
    items: [
      'Go to the Airdrop page',
      'Join the Telegram group (+10 pts)',
      'Follow on Twitter/X (+10 pts)',
      'Retweet the launch post (+5 pts)',
      'Follow on Instagram (+5 pts)',
      'Join Discord (+5 pts)',
      'Refer a friend (+20 pts per referral)',
    ],
    tip: 'Formula: 100 Points = 5 FBiT | Minimum 70 points required to qualify',
    warn: 'Only the first 5,000 members will qualify!',
  },
  {
    num: '05', icon: '🤝', title: 'Share Your Referral Link (Passive Income)',
    items: [
      'Copy your unique referral link from the Airdrop page',
      'Share it on WhatsApp groups, Telegram, Twitter',
      'Each direct referral = +20 airdrop points + 10% staking commission',
      'Earn commission up to 10 levels deep — your entire network earns together',
    ],
    tip: 'Top 3 referrers win a WEEKLY $950 bonus prize!',
  },
  {
    num: '06', icon: '🪐', title: 'Swap SOL to FBiT on Jupiter DEX',
    items: [
      'Go to the Swap page — the Jupiter terminal will load',
      'Connect your Phantom wallet in the terminal',
      'Input: SOL | Output: FBiT (already pre-set)',
      'Enter the amount — Jupiter finds the best route automatically',
      'Click "Swap" and approve in Phantom',
    ],
    tip: '"5 Warnings" is normal for new tokens — always verify the mint address',
  },
  {
    num: '07', icon: '💎', title: 'Stake FBiT — Earn Rewards',
    items: [
      'Go to the Stake page and choose your tier',
      'Starter: 100 FBiT, 30 days, 50–100% APY',
      'Silver: 500 FBiT, 60 days, 100–150% APY',
      'Gold: 1,000 FBiT, 90 days, 150–200% APY',
      'Diamond: 5,000 FBiT, 180 days, 200–300% APY',
      'Enter amount → click "Stake Now" → approve in Phantom',
    ],
    tip: 'Stake $100+ to get automatic entry into the Monthly Lucky Vault ($2,000 draw)!',
  },
  {
    num: '08', icon: '🏆', title: 'Track and Claim Your Rewards',
    items: [
      'Airdrop: FBiT tokens will be transferred to your wallet after June 2026',
      'Weekly Contest: Top 3 referrers win the $950 weekly prize',
      'Staking: Daily rewards accumulate — withdraw using the claim button',
      'Trading Competition: Trade FBiT on Jupiter to win from the $5,000 prize pool',
    ],
    tip: 'Stay active on all platforms — compound earnings grow over time!',
  },
];

const benefits = [
  { icon: '📈', title: '300% APY Staking',          desc: 'Stake FBiT and earn up to 300% APY — on Solana, the fastest blockchain' },
  { icon: '🎁', title: '$10,000 Airdrop Pool',       desc: 'FREE FBiT tokens for the first 5,000 members — just complete the tasks' },
  { icon: '🤝', title: '10-Level Referral Income',   desc: 'Build your network — earn passive commission up to 10 levels deep' },
  { icon: '🎰', title: 'Monthly $2,000 Lucky Draw',  desc: 'Stake $100+ for automatic entry into the monthly lucky draw' },
  { icon: '⚔️', title: '$5,000 Trading Contest',     desc: 'Trade FBiT on Jupiter and compete with top traders for prizes' },
  { icon: '🏆', title: '$950 Weekly Referral Prize', desc: 'Top 3 referrers every week win a bonus prize' },
  { icon: '🪐', title: 'Jupiter DEX Listed',          desc: 'FBiT is available on Solana\'s #1 DEX — buy/sell anytime' },
  { icon: '◎', title: '100% On-Chain Transparent',   desc: 'Everything verifiable on the Solana blockchain — no hidden fees' },
];

export default function GuidePdfPage() {
  useEffect(() => {
    document.title = 'FutureBit — Complete User Guide PDF';
  }, []);

  const handlePrint = () => window.print();

  return (
    <>
      {/* ── Print-only global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

        .pdf-root * { box-sizing: border-box; }
        .pdf-root {
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
          background: #fff;
          color: #1a1a2e;
          line-height: 1.6;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        /* ── No-print bar ── */
        .no-print-bar {
          position: fixed; top: 0; left: 0; right: 0;
          background: #050a0f; border-bottom: 1px solid #00ff88;
          padding: 12px 24px; display: flex; align-items: center;
          justify-content: space-between; z-index: 9999;
        }
        .no-print-bar p   { color: #9ca3af; font-size: 13px; margin: 0; }
        .no-print-bar button {
          background: linear-gradient(135deg, #00ff88, #00d4ff);
          color: #050a0f; font-weight: 700; font-size: 14px;
          border: none; padding: 9px 22px; border-radius: 8px;
          cursor: pointer; letter-spacing: 0.3px;
        }
        .no-print-bar a {
          color: #6b7280; font-size: 13px; text-decoration: none; margin-left: 16px;
        }
        .no-print-bar a:hover { color: #00ff88; }

        /* ── Page content ── */
        .pdf-content {
          max-width: 794px; /* A4 width px */
          margin: 0 auto;
          padding: 72px 40px 40px; /* top leaves space for no-print bar */
        }

        /* ── Cover ── */
        .pdf-cover {
          background: linear-gradient(135deg, #050a0f 0%, #0d1520 60%, #0a1a10 100%);
          border-radius: 16px;
          padding: 56px 48px;
          margin-bottom: 32px;
          text-align: center;
          page-break-after: always;
        }
        .pdf-logo {
          display: inline-block;
          width: 80px; height: 80px; margin-bottom: 20px;
        }
        .pdf-logo img { width: 80px; height: 80px; border-radius: 50%; }
        .pdf-cover h1 { color: #fff; font-size: 42px; font-weight: 900; margin: 0 0 6px; letter-spacing: -1px; }
        .pdf-cover h1 span { color: #00ff88; }
        .pdf-cover .tagline { color: #00d4ff; font-size: 18px; font-weight: 600; margin: 0 0 24px; }
        .pdf-cover .subtitle { color: #9ca3af; font-size: 14px; max-width: 480px; margin: 0 auto 32px; line-height: 1.7; }
        .pdf-badge {
          display: inline-block; background: rgba(0,255,136,0.15);
          border: 1px solid rgba(0,255,136,0.3); color: #00ff88;
          font-size: 12px; font-weight: 700; padding: 6px 16px;
          border-radius: 100px; margin: 4px;
        }
        .pdf-cover .url { color: #6b7280; font-size: 12px; margin-top: 24px; }
        .pdf-cover .url span { color: #00ff88; }

        /* ── Section headers ── */
        .pdf-section-title {
          display: flex; align-items: center; gap: 10px;
          font-size: 22px; font-weight: 800; color: #1a1a2e;
          border-left: 4px solid #00ff88;
          padding-left: 14px; margin: 36px 0 20px;
        }
        .pdf-section-title span { font-size: 24px; }

        /* ── Benefits grid ── */
        .pdf-benefits {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 14px; margin-bottom: 36px;
          page-break-after: always;
        }
        .pdf-benefit {
          background: #f8fffe; border: 1px solid #d1fae5;
          border-left: 4px solid #00ff88;
          border-radius: 10px; padding: 14px 16px;
        }
        .pdf-benefit .b-head { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
        .pdf-benefit .b-icon { font-size: 20px; }
        .pdf-benefit .b-title { font-size: 13px; font-weight: 700; color: #065f46; }
        .pdf-benefit .b-desc  { font-size: 12px; color: #4b5563; line-height: 1.5; }

        /* ── Step cards ── */
        .pdf-step {
          border: 1px solid #e5e7eb; border-radius: 12px;
          margin-bottom: 20px; overflow: hidden;
          page-break-inside: avoid;
        }
        .pdf-step-header {
          display: flex; align-items: center; gap: 14px;
          background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
          padding: 14px 20px; border-bottom: 1px solid #d1fae5;
        }
        .pdf-step-num {
          width: 40px; height: 40px; border-radius: 10px; shrink: 0;
          background: linear-gradient(135deg, #00ff88, #00d4ff);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 900; color: #050a0f; flex-shrink: 0;
        }
        .pdf-step-icon { font-size: 24px; }
        .pdf-step-title { font-size: 16px; font-weight: 800; color: #064e3b; }
        .pdf-step-body  { padding: 16px 20px; }
        .pdf-step-list  { margin: 0 0 10px; padding: 0; list-style: none; }
        .pdf-step-list li {
          display: flex; gap: 8px; align-items: flex-start;
          font-size: 13px; color: #374151; margin-bottom: 6px; line-height: 1.5;
        }
        .pdf-step-list li::before {
          content: '→'; color: #059669; font-weight: 700;
          flex-shrink: 0; margin-top: 1px;
        }
        .pdf-tip {
          background: #f0fdf4; border: 1px solid #a7f3d0;
          border-radius: 8px; padding: 8px 12px;
          font-size: 12px; color: #065f46; margin-top: 8px;
        }
        .pdf-warn {
          background: #fffbeb; border: 1px solid #fcd34d;
          border-radius: 8px; padding: 8px 12px;
          font-size: 12px; color: #92400e; margin-top: 6px;
        }

        /* ── Earnings table ── */
        .pdf-table { width: 100%; border-collapse: collapse; margin-bottom: 28px; font-size: 13px; }
        .pdf-table th {
          background: #064e3b; color: #fff; padding: 10px 14px;
          text-align: left; font-size: 12px; font-weight: 700;
        }
        .pdf-table td { padding: 9px 14px; border-bottom: 1px solid #e5e7eb; color: #374151; }
        .pdf-table tr:nth-child(even) td { background: #f9fafb; }
        .pdf-table .green { color: #059669; font-weight: 700; }

        /* ── Token info ── */
        .pdf-token-box {
          background: #f0fdf4; border: 1px solid #a7f3d0;
          border-radius: 12px; padding: 20px; margin-bottom: 28px;
        }
        .pdf-token-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-top: 14px; }
        .pdf-token-item { text-align: center; }
        .pdf-token-item .t-label { font-size: 11px; color: #6b7280; margin-bottom: 2px; }
        .pdf-token-item .t-value { font-size: 14px; font-weight: 700; color: #065f46; }
        .pdf-mint { font-family: monospace; font-size: 11px; color: #374151; word-break: break-all; margin-top: 10px; background:#fff; padding:8px 12px; border-radius:6px; border:1px solid #d1d5db; }

        /* ── Security tips ── */
        .pdf-security { margin-bottom: 28px; }
        .pdf-security-item {
          display: flex; gap: 12px; padding: 12px 14px;
          border-bottom: 1px solid #f3f4f6;
          align-items: flex-start; font-size: 13px;
        }
        .pdf-security-item .s-icon { font-size: 18px; flex-shrink: 0; }
        .pdf-security-item .s-text { color: #374151; line-height: 1.5; }
        .pdf-security-item .s-text strong { color: #991b1b; }

        /* ── Footer ── */
        .pdf-footer {
          background: #050a0f; border-radius: 12px;
          padding: 28px 32px; text-align: center; margin-top: 32px;
        }
        .pdf-footer h3 { color: #fff; font-size: 18px; font-weight: 800; margin: 0 0 8px; }
        .pdf-footer .f-sub { color: #9ca3af; font-size: 13px; margin: 0 0 16px; }
        .pdf-footer .f-links { display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; }
        .pdf-footer .f-link { color: #00ff88; font-size: 13px; font-weight: 600; }
        .pdf-footer .f-copy { color: #4b5563; font-size: 11px; margin-top: 16px; }
        .pdf-disclaimer {
          background: #fffbeb; border: 1px solid #fcd34d;
          border-radius: 8px; padding: 12px 16px;
          font-size: 11px; color: #78350f; margin-top: 20px; line-height: 1.6;
        }

        /* ── Print media ── */
        @media print {
          /* Hide everything except the PDF content */
          body * { visibility: hidden !important; }
          .pdf-root { visibility: visible !important; position: absolute; top: 0; left: 0; right: 0; margin: 0; padding: 0; }
          .pdf-root * { visibility: visible !important; }

          /* Hide the download bar */
          .no-print-bar { display: none !important; }

          /* PDF layout adjustments */
          .pdf-content  { padding: 0 32px; max-width: 100%; }
          .pdf-cover    { border-radius: 0; margin: 0 -32px 0; border-bottom: 3px solid #00ff88; }
          body          { margin: 0; }
          .pdf-root     { font-size: 13px; }
        }
      `}</style>

      <div className="pdf-root">

        {/* ── Top bar (hidden on print) ── */}
        <div className="no-print-bar">
          <div>
            <p>📄 FutureBit Complete Guide — PDF is ready. Click the button to download.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button type="button" onClick={handlePrint}>⬇ Download PDF</button>
            <a href="/guide">← Back to Guide</a>
          </div>
        </div>

        <div className="pdf-content">

          {/* ══════════ COVER PAGE ══════════ */}
          <div className="pdf-cover">
            <div className="pdf-logo"><img src="/logo.png" alt="FutureBit" /></div>
            <h1>Future<span>Bit</span></h1>
            <p className="tagline">Solana DeFi Staking Platform</p>
            <p className="subtitle">
              The complete guide to joining FutureBit — from wallet setup to
              claiming rewards, everything explained step by step!
            </p>
            <div>
              <span className="pdf-badge">🎁 $10,000 Airdrop</span>
              <span className="pdf-badge">💎 300% APY Staking</span>
              <span className="pdf-badge">🤝 10-Level Referral</span>
              <span className="pdf-badge">🪐 Jupiter DEX Listed</span>
              <span className="pdf-badge">🏆 $5,000 Trading Prize</span>
            </div>
            <p className="url">Official Website: <span>{SITE_URL}</span> · Solana Mainnet · June 2026</p>
          </div>

          {/* ══════════ BENEFITS ══════════ */}
          <div className="pdf-section-title">
            <span>💰</span> What You Get From FutureBit (Key Benefits)
          </div>

          <div className="pdf-benefits">
            {benefits.map(b => (
              <div key={b.title} className="pdf-benefit">
                <div className="b-head">
                  <span className="b-icon">{b.icon}</span>
                  <span className="b-title">{b.title}</span>
                </div>
                <p className="b-desc">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* ══════════ EARNING TABLE ══════════ */}
          <div className="pdf-section-title">
            <span>📊</span> Full Earnings Breakdown
          </div>

          <table className="pdf-table">
            <thead>
              <tr>
                <th>Earning Source</th>
                <th>Amount / Rate</th>
                <th>When You Receive It</th>
                <th>Requirements</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['FBiT Airdrop',           '$10,000 pool',       'Distributed June 2026',          'Min 70 points, wallet connected'],
                ['Staking Rewards',        '50–300% APY',        'Accumulates daily',              'Min 100 FBiT staked'],
                ['Direct Referral Bonus',  '10% commission',     'Instant when referral stakes',   'Share your referral link'],
                ['Deep Referral (L2-L10)', '0.5–5% per level',   'Automatic via smart contract',   'Active network required'],
                ['Weekly Referral Contest','$950 weekly prize',   'Every week',                     'Finish in top 3 referrers'],
                ['Lucky Vault Draw',       '$2,000+ monthly',    'Every month',                    '$100+ stake, 30+ days'],
                ['Trading Competition',    '$5,000 prize pool',  'After competition ends',         'Trade FBiT on Jupiter'],
                ['Airdrop Referral Points','+20 pts per referral','Instant',                       'Friend joins airdrop'],
              ].map(([src, amt, time, req]) => (
                <tr key={src}>
                  <td><strong>{src}</strong></td>
                  <td className="green">{amt}</td>
                  <td>{time}</td>
                  <td style={{ fontSize: '11px' }}>{req}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ══════════ STEP BY STEP GUIDE ══════════ */}
          <div className="pdf-section-title">
            <span>🚀</span> Step-by-Step Guide — How to Join FutureBit
          </div>

          {steps.map(step => (
            <div key={step.num} className="pdf-step">
              <div className="pdf-step-header">
                <div className="pdf-step-num">#{step.num}</div>
                <span className="pdf-step-icon">{step.icon}</span>
                <span className="pdf-step-title">{step.title}</span>
              </div>
              <div className="pdf-step-body">
                <ul className="pdf-step-list">
                  {step.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                {step.tip  && <div className="pdf-tip">💡 {step.tip}</div>}
                {step.warn && <div className="pdf-warn">⚠️ {step.warn}</div>}
              </div>
            </div>
          ))}

          {/* ══════════ TOKEN INFO ══════════ */}
          <div className="pdf-section-title">
            <span>🪙</span> FBiT Token Information
          </div>

          <div className="pdf-token-box">
            <p style={{ margin: 0, fontWeight: 700, color: '#065f46', fontSize: 14 }}>FutureBit Token (FBiT) — Solana SPL Token</p>
            <div className="pdf-token-grid">
              {[
                ['Network',  'Solana'],
                ['Symbol',   'FBiT'],
                ['Decimals', '6'],
                ['DEX',      'Jupiter'],
              ].map(([label, value]) => (
                <div key={label} className="pdf-token-item">
                  <div className="t-label">{label}</div>
                  <div className="t-value">{value}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '10px 0 4px' }}>Token Mint Address (Verify before buying!):</p>
            <div className="pdf-mint">{TOKEN_MINT}</div>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: '8px 0 0' }}>
              Verify on Solscan: solscan.io/token/{TOKEN_MINT.slice(0,12)}...
              · Jupiter: jup.ag/tokens/{TOKEN_MINT.slice(0,12)}...
            </p>
          </div>

          {/* ══════════ SECURITY TIPS ══════════ */}
          <div className="pdf-section-title">
            <span>🔒</span> Security Tips — How to Stay Safe from Scams
          </div>

          <div className="pdf-security">
            {[
              { icon: '🚫', text: '<strong>NEVER SHARE YOUR SEED PHRASE</strong> — no genuine platform, support agent, or admin will ever ask for your 12-word recovery phrase.' },
              { icon: '🔗', text: '<strong>Verify the URL</strong> — the official site is only <strong>stake.futurebit.in</strong> or <strong>futurebit.in</strong>. Watch out for typosquatting (futur3bit, futureblt, etc.).' },
              { icon: '📢', text: '<strong>Official channels only</strong> — the FutureBit team only communicates through official Telegram and Twitter. Beware of fake accounts.' },
              { icon: '💰', text: '<strong>Never send SOL to "verify" anything</strong> — any claim that you must send SOL to activate your wallet is a 100% scam.' },
              { icon: '🔍', text: '<strong>Verify the token mint address</strong> — before buying FBiT, confirm the mint address on Solscan: CuubBz...UGTu' },
              { icon: '📱', text: '<strong>Use a hardware wallet</strong> — for large holdings, use a Ledger hardware wallet together with Phantom.' },
            ].map((item, i) => (
              <div key={i} className="pdf-security-item">
                <span className="s-icon">{item.icon}</span>
                <span className="s-text" dangerouslySetInnerHTML={{ __html: item.text }} />
              </div>
            ))}
          </div>

          {/* ══════════ DISCLAIMER ══════════ */}
          <div className="pdf-disclaimer">
            <strong>⚠️ Risk Disclaimer:</strong> FutureBit is a DeFi platform. Cryptocurrency and DeFi carry significant financial risk. APY rates are variable and not guaranteed. You may lose some or all of your staked assets. Only invest what you can afford to lose entirely. This is not financial advice — consult your advisors. Smart contracts may contain bugs. The regulatory environment may change. Past performance is not a guarantee of future results.
          </div>

          {/* ══════════ FOOTER ══════════ */}
          <div className="pdf-footer">
            <h3>FutureBit — Get Started Now! 🚀</h3>
            <p className="f-sub">Connect your wallet, complete tasks, refer friends — earn FBiT tokens</p>
            <div className="f-links">
              <span className="f-link">🌐 {SITE_URL}</span>
              <span className="f-link">🎁 /airdrop</span>
              <span className="f-link">💎 /stake</span>
              <span className="f-link">🪐 /swap</span>
              <span className="f-link">📖 /guide</span>
            </div>
            <p className="f-copy">© 2026 FutureBit · Solana Mainnet · All rights reserved · Terms: {SITE_URL}/terms · Privacy: {SITE_URL}/privacy</p>
          </div>

        </div>{/* end pdf-content */}
      </div>{/* end pdf-root */}
    </>
  );
}
