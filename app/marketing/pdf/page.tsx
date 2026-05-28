'use client';

import { useEffect } from 'react';

const SITE  = 'stake.futurebit.in';
const MINT  = 'CuubBzUTnQ4H2D2fHJCVWGEUEod2fJzq4nAPwfx8UGTu';
const YEAR  = '2026';

/* ─── helpers ─────────────────────────────────────── */
function PgHeader({ page, title }: { page: number; title: string }) {
  return (
    <div className="pg-header">
      <div className="pg-header-left">
        <span className="pg-logo"><img src="/logo.png" alt="FutureBit" /></span>
        <span className="pg-brand">Future<span>Bit</span></span>
      </div>
      <div className="pg-header-center">{title}</div>
      <div className="pg-header-right">Page {page} / 10</div>
    </div>
  );
}
function PgFooter({ page }: { page: number }) {
  return (
    <div className="pg-footer">
      <span>{SITE}</span>
      <span>© {YEAR} FutureBit · Solana Mainnet · Confidential Marketing Document</span>
      <span>Pg {page}</span>
    </div>
  );
}
function SectionTitle({ icon, text }: { icon: string; text: string }) {
  return <div className="sec-title"><span>{icon}</span>{text}</div>;
}
function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return <span className="tag" style={{ background: color + '22', border: `1px solid ${color}55`, color }}>{children}</span>;
}
function Row({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <tr>
      <td>{label}</td>
      <td className="green bold">{value}</td>
      {sub && <td className="gray small">{sub}</td>}
    </tr>
  );
}

export default function MarketingPdf() {
  useEffect(() => { document.title = 'FutureBit — User Marketing Plan 2026'; }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap');

        *{box-sizing:border-box;margin:0;padding:0}
        body{
          background:#050a0f;
          font-family:'Inter','Segoe UI',Arial,sans-serif;
          -webkit-print-color-adjust:exact;
          print-color-adjust:exact;
          color:#d1d5db;
        }

        /* ── No-print bar ── */
        .npbar{position:fixed;top:0;left:0;right:0;background:#050a0f;border-bottom:2px solid #00ff88;
          padding:10px 24px;display:flex;align-items:center;justify-content:space-between;z-index:9999}
        .npbar p{color:#9ca3af;font-size:13px}
        .npbar button{background:linear-gradient(135deg,#00ff88,#00d4ff);color:#050a0f;font-weight:800;
          font-size:14px;border:none;padding:9px 22px;border-radius:8px;cursor:pointer}
        .npbar a{color:#6b7280;font-size:13px;text-decoration:none;margin-left:16px}
        .npbar a:hover{color:#00ff88}

        /* ── Document wrapper ── */
        .doc{max-width:794px;margin:56px auto 40px;padding:0}

        /* ── Page ── */
        .page{
          background:#0d1520;
          border:1px solid rgba(255,255,255,0.06);
          width:100%;min-height:1123px;
          margin-bottom:20px;padding:0;
          box-shadow:0 4px 32px rgba(0,0,0,0.5);
          position:relative;display:flex;flex-direction:column;
          page-break-after:always;
          overflow:hidden;
        }
        .page-body{flex:1;padding:28px 40px 20px}

        /* ── Header / footer ── */
        .pg-header{
          display:flex;align-items:center;justify-content:space-between;
          background:#080f1a;border-bottom:1px solid rgba(0,255,136,0.15);
          padding:12px 24px;
        }
        .pg-header-left{display:flex;align-items:center;gap:8px}
        .pg-logo{
          width:28px;height:28px;border-radius:50%;overflow:hidden;
          display:flex;align-items:center;justify-content:center;
        }
        .pg-logo img{width:28px;height:28px;border-radius:50%;}
        .pg-brand{font-weight:700;font-size:14px;color:#fff}
        .pg-brand span{color:#00ff88}
        .pg-header-center{font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.5px}
        .pg-header-right{font-size:11px;color:#4b5563}
        .pg-footer{
          display:flex;justify-content:space-between;
          background:#080f1a;border-top:1px solid rgba(255,255,255,0.05);
          padding:8px 24px;font-size:10px;color:#4b5563;
        }

        /* ── Cover page ── */
        .cover-body{
          flex:1;
          background:linear-gradient(160deg,#050a0f 0%,#0d1520 55%,#051a0a 100%);
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          text-align:center;padding:48px 40px;
          position:relative;overflow:hidden;
        }
        .cover-body::before{
          content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse at 30% 40%,rgba(0,255,136,0.08) 0%,transparent 60%),
                      radial-gradient(ellipse at 70% 60%,rgba(0,212,255,0.06) 0%,transparent 60%);
        }
        .cover-logo{
          width:96px;height:96px;border-radius:50%;
          overflow:hidden;margin-bottom:24px;position:relative;
        }
        .cover-logo img{width:96px;height:96px;border-radius:50%;}
        .cover-label{font-size:12px;font-weight:700;letter-spacing:2px;color:#00d4ff;text-transform:uppercase;margin-bottom:12px;position:relative}
        .cover-h1{font-size:48px;font-weight:900;color:#fff;letter-spacing:-1.5px;line-height:1.1;margin-bottom:8px;position:relative}
        .cover-h1 span{color:#00ff88}
        .cover-sub{font-size:18px;font-weight:600;color:#00d4ff;margin-bottom:20px;position:relative}
        .cover-desc{font-size:14px;color:#9ca3af;max-width:500px;line-height:1.7;margin-bottom:32px;position:relative}
        .cover-badges{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:36px;position:relative}
        .cbadge{background:rgba(0,255,136,0.12);border:1px solid rgba(0,255,136,0.25);color:#00ff88;font-size:12px;font-weight:700;padding:6px 14px;border-radius:100px}
        .cover-meta{position:relative;border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;width:100%;display:flex;justify-content:center;gap:40px}
        .cover-meta-item{text-align:center}
        .cover-meta-item .m-val{font-size:22px;font-weight:900;color:#00ff88}
        .cover-meta-item .m-lbl{font-size:11px;color:#6b7280;margin-top:2px}

        /* ── Section title ── */
        .sec-title{
          display:flex;align-items:center;gap:10px;
          font-size:19px;font-weight:800;color:#ffffff;
          border-left:4px solid #00ff88;padding-left:14px;
          margin:0 0 18px;
        }
        .sec-title span{font-size:21px}

        /* ── Cards ── */
        .card-grid{display:grid;gap:10px;margin-bottom:20px}
        .card-grid-2{grid-template-columns:1fr 1fr}
        .card-grid-3{grid-template-columns:1fr 1fr 1fr}
        .card{
          background:rgba(0,255,136,0.04);
          border:1px solid rgba(0,255,136,0.12);
          border-left:4px solid #00ff88;
          border-radius:10px;padding:13px 15px;
        }
        .card-orange{background:rgba(249,115,22,0.05);border-color:rgba(249,115,22,0.15);border-left-color:#f97316}
        .card-blue  {background:rgba(59,130,246,0.05);border-color:rgba(59,130,246,0.15);border-left-color:#3b82f6}
        .card-purple{background:rgba(139,92,246,0.05);border-color:rgba(139,92,246,0.15);border-left-color:#8b5cf6}
        .card-red   {background:rgba(239,68,68,0.05); border-color:rgba(239,68,68,0.15); border-left-color:#ef4444}
        .card h4{font-size:13px;font-weight:700;color:#00ff88;margin-bottom:5px}
        .card-orange h4{color:#fb923c}
        .card-blue   h4{color:#60a5fa}
        .card-purple h4{color:#a78bfa}
        .card-red    h4{color:#f87171}
        .card p,.card li{font-size:12px;color:#9ca3af;line-height:1.55}
        .card ul{padding-left:14px;margin-top:4px}
        .card-icon{font-size:22px;margin-bottom:6px}
        .card-val{font-size:20px;font-weight:900;color:#00ff88;margin-bottom:2px}
        .card-orange .card-val{color:#fb923c}
        .card-blue   .card-val{color:#60a5fa}
        .card-purple .card-val{color:#a78bfa}

        /* ── Tables ── */
        table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px}
        th{background:rgba(0,255,136,0.1);color:#00ff88;padding:9px 12px;text-align:left;font-size:11px;font-weight:700;border-bottom:1px solid rgba(0,255,136,0.2)}
        td{padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.05);color:#d1d5db;vertical-align:top}
        tr:nth-child(even) td{background:rgba(255,255,255,0.02)}
        .green{color:#00ff88}.bold{font-weight:700}.gray{color:#6b7280}.small{font-size:11px}
        th.c,td.c{text-align:center}
        .highlight-row td{background:rgba(0,255,136,0.07)!important;color:#fff;font-weight:700}

        /* ── Tag ── */
        .tag{font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px;display:inline-block;margin:2px}

        /* ── Income bar ── */
        .inc-bar-wrap{margin-bottom:14px}
        .inc-bar-label{display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px}
        .inc-bar-label .lbl{color:#d1d5db;font-weight:600}
        .inc-bar-label .val{color:#00ff88;font-weight:700}
        .inc-bar-bg{background:rgba(255,255,255,0.08);border-radius:100px;height:10px}
        .inc-bar-fill{height:10px;border-radius:100px;background:linear-gradient(90deg,#00ff88,#00d4ff)}

        /* ── LP Flow ── */
        .lp-flow{display:flex;align-items:stretch;gap:0;margin:16px 0}
        .lp-box{
          flex:1;background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.12);
          border-radius:10px;padding:14px 12px;text-align:center;font-size:12px;
        }
        .lp-box h5{font-size:13px;font-weight:700;color:#00ff88;margin-bottom:6px}
        .lp-box p{color:#9ca3af;font-size:11px;line-height:1.5}
        .lp-arrow{display:flex;align-items:center;justify-content:center;padding:0 8px;font-size:20px;color:#00ff88;font-weight:900}

        /* ── Timeline ── */
        .timeline{position:relative;padding-left:28px;margin-bottom:16px}
        .timeline::before{content:'';position:absolute;left:8px;top:0;bottom:0;width:2px;background:rgba(0,255,136,0.2)}
        .tl-item{position:relative;margin-bottom:16px}
        .tl-dot{
          position:absolute;left:-24px;top:3px;
          width:16px;height:16px;border-radius:50%;
          background:#00ff88;border:2px solid #0d1520;
          box-shadow:0 0 0 2px rgba(0,255,136,0.4);
          display:flex;align-items:center;justify-content:center;
        }
        .tl-dot span{font-size:9px;font-weight:900;color:#050a0f}
        .tl-head{font-size:13px;font-weight:700;color:#fff;margin-bottom:4px}
        .tl-body{font-size:12px;color:#9ca3af;line-height:1.5}

        /* ── Pyramid ── */
        .pyramid{margin:12px 0 16px}
        .pyr-row{display:flex;justify-content:center;margin-bottom:6px}
        .pyr-box{padding:8px 16px;border-radius:8px;text-align:center;font-size:11px;font-weight:700;color:#fff}

        /* ── Tip / warn / info boxes ── */
        .warn-box{
          background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);
          border-radius:8px;padding:10px 14px;font-size:12px;color:#fbbf24;margin-top:10px;
        }
        .tip-box{
          background:rgba(0,255,136,0.05);border:1px solid rgba(0,255,136,0.15);
          border-radius:8px;padding:10px 14px;font-size:12px;color:#00ff88;margin-top:10px;
        }
        .info-box{
          background:rgba(96,165,250,0.06);border:1px solid rgba(96,165,250,0.18);
          border-radius:8px;padding:10px 14px;font-size:12px;color:#60a5fa;margin-top:10px;
        }

        /* ── Inline paragraph text ── */
        p{color:#9ca3af}
        strong{color:#e5e7eb}

        /* ── Print ── */
        @media print{
          /* Hide everything except PDF content */
          body *{visibility:hidden!important}
          .doc{visibility:visible!important;position:absolute;top:0;left:0;right:0;margin:0;padding:0}
          .doc *{visibility:visible!important}

          /* Hide download bar */
          .npbar{display:none!important}

          /* PDF layout */
          body{background:#050a0f;margin:0}
          .doc{margin:0;max-width:100%}
          .page{box-shadow:none;margin-bottom:0;min-height:auto;border:none}
        }
      `}</style>

      {/* ── No-print bar ── */}
      <div className="npbar">
        <p>📊 FutureBit User Marketing Plan — 10-Page PDF ready. Print → Save as PDF.</p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button type="button" onClick={() => window.print()}>⬇ Download PDF</button>
          <a href="/guide">← Back to Guide</a>
          <a href="/guide/pdf" style={{ marginLeft: 12 }}>Beginner PDF</a>
        </div>
      </div>

      <div className="doc">

        {/* ══════════════════════════════════════════════
            PAGE 1 — COVER
        ══════════════════════════════════════════════ */}
        <div className="page">
          <div className="cover-body">
            <div className="cover-logo"><img src="/logo.png" alt="FutureBit" /></div>
            <div className="cover-label">Official User Marketing Plan · {YEAR}</div>
            <h1 className="cover-h1">Future<span>Bit</span></h1>
            <div className="cover-sub">Solana DeFi — Earn, Grow & Lead</div>
            <p className="cover-desc">
              Your complete business plan for FutureBit — how to earn, how to build a team,
              how to grow your referral network, and how to contribute to the token
              ecosystem as a Liquidity Provider. Read it, understand it, and get started.
            </p>
            <div className="cover-badges">
              <span className="cbadge">🎁 $10,000 Airdrop</span>
              <span className="cbadge">💎 300% APY Staking</span>
              <span className="cbadge">🤝 10-Level Referral</span>
              <span className="cbadge">🪐 Jupiter DEX LP</span>
              <span className="cbadge">🏆 $5,000 Trading Prize</span>
              <span className="cbadge">🎰 $2,000 Lucky Draw</span>
            </div>
            <div className="cover-meta">
              {[
                { val: '$22,500+', lbl: 'Total Prize Pool' },
                { val: '300% APY', lbl: 'Max Staking Yield' },
                { val: '10 Levels', lbl: 'Referral Depth' },
                { val: '5,000', lbl: 'Airdrop Spots' },
              ].map(m => (
                <div key={m.lbl} className="cover-meta-item">
                  <div className="m-val">{m.val}</div>
                  <div className="m-lbl">{m.lbl}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="pg-footer">
            <span>{SITE}</span>
            <span>© {YEAR} FutureBit · Solana Mainnet · Confidential Marketing Document</span>
            <span>Cover</span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            PAGE 2 — EXECUTIVE SUMMARY + PLATFORM OVERVIEW
        ══════════════════════════════════════════════ */}
        <div className="page">
          <PgHeader page={2} title="Executive Summary & Platform Overview" />
          <div className="page-body">
            <SectionTitle icon="📌" text="Executive Summary" />
            <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.7, marginBottom: 18 }}>
              FutureBit is a <strong>Solana-based DeFi staking ecosystem</strong> that gives users
              <strong> 5 different income streams</strong> — staking, referrals, airdrop,
              trading competition, and LP rewards. It is a complete income system where
              <strong> everyone from beginners to advanced users</strong> can participate.
            </p>

            <div className="card-grid card-grid-3" style={{ marginBottom: 20 }}>
              {[
                { icon: '🌐', title: 'Network', val: 'Solana Mainnet', desc: '65,000 TPS — fastest blockchain, near-zero gas fees' },
                { icon: '🪙', title: 'Token', val: 'FBiT', desc: 'Native utility token — staking, referral, LP, governance' },
                { icon: '🪐', title: 'DEX', val: 'Jupiter', desc: 'Solana ka #1 DEX aggregator — best swap rates guaranteed' },
              ].map(c => (
                <div key={c.title} className="card" style={{ textAlign: 'center' }}>
                  <div className="card-icon">{c.icon}</div>
                  <div className="card-val">{c.val}</div>
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>

            <SectionTitle icon="🎯" text="5 Income Streams — One Platform, 5 Ways to Earn" />
            <table>
              <thead><tr><th>#</th><th>Income Source</th><th>Potential Earnings</th><th>Difficulty</th><th>Requirements</th></tr></thead>
              <tbody>
                {[
                  ['1','FBiT Token Staking','50–300% APY','Easy','Min 100 FBiT, lock 30–180 days'],
                  ['2','10-Level Referral','Unlimited (% based)','Medium','Build active team network'],
                  ['3','Airdrop Rewards','Share of $10,000 pool','Very Easy','Complete tasks, min 70 pts'],
                  ['4','LP Provider Fees','0.25% per swap + rewards','Advanced','Provide SOL+FBiT liquidity'],
                  ['5','Trading Competition','Up to $5,000 prize','Medium','Active FBiT trading on Jupiter'],
                ].map(r => (
                  <tr key={r[0]}><td className="bold">{r[0]}</td><td>{r[1]}</td><td className="green bold">{r[2]}</td><td>{r[3]}</td><td className="small gray">{r[4]}</td></tr>
                ))}
              </tbody>
            </table>

            <div className="card-grid card-grid-2">
              <div className="tip-box">
                💡 <strong>Smart Strategy:</strong> Use all 5 income streams together. Staking for base income, referrals for passive income, LP for trading fees — three layers of earnings!
              </div>
              <div className="info-box">
                ℹ️ <strong>Why Solana?</strong> Solana is 100x faster than Ethereum and gas fees are practically zero — under $0.001 per transaction.
              </div>
            </div>
          </div>
          <PgFooter page={2} />
        </div>

        {/* ══════════════════════════════════════════════
            PAGE 3 — COMPLETE BENEFITS BREAKDOWN
        ══════════════════════════════════════════════ */}
        <div className="page">
          <PgHeader page={3} title="Complete Benefits Breakdown" />
          <div className="page-body">
            <SectionTitle icon="💰" text="What Every User Can Earn" />

            <div className="card-grid card-grid-2" style={{ marginBottom: 18 }}>
              {[
                { cls: '', icon: '📈', val: 'Up to 300%', title: 'Annual Staking APY', desc: 'Stake FBiT and get up to 3x return per year. At Diamond tier, $1,000 staked = $3,000 return annually. Compounds daily.' },
                { cls: 'card-orange', icon: '🎁', val: '$10,000', title: 'Airdrop Prize Pool', desc: 'Free FBiT distributed to the first 5,000 users. Complete tasks, earn points. 100 pts = 5 FBiT. Minimum 70 pts required.' },
                { cls: 'card-blue', icon: '🤝', val: '∞ Unlimited', title: 'Referral Passive Income', desc: 'Earn commission up to 10 levels deep. Your network earns while you sleep. 10% commission on Level 1 when your referral stakes.' },
                { cls: 'card-purple', icon: '🎰', val: '$2,000+', title: 'Monthly Lucky Draw', desc: 'Stake $100+ FBiT for automatic lottery entry. More stake = more tickets. Winner announced every month.' },
                { cls: 'card-orange', icon: '🏆', val: '$950/week', title: 'Referral Contest Prize', desc: 'Top 3 referrers win cash prizes every week. 1st: $500, 2nd: $300, 3rd: $150. Resets weekly — a new chance each week.' },
                { cls: 'card-blue', icon: '⚔️', val: '$5,000', title: 'Trading Competition', desc: 'Trade FBiT on Jupiter and win prizes. Reach the top of the leaderboard. Monthly competition cycle.' },
              ].map(c => (
                <div key={c.title} className={`card ${c.cls}`}>
                  <div className="card-icon">{c.icon}</div>
                  <div className="card-val">{c.val}</div>
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>

            <SectionTitle icon="📊" text="Staking Tiers — APY Comparison" />
            <table>
              <thead><tr><th>Tier</th><th>Minimum FBiT</th><th>Lock Period</th><th>APY Range</th><th>$1,000 Investment → Annual Return</th></tr></thead>
              <tbody>
                {[
                  ['🥉 Starter','100 FBiT','30 days','50–100% APY','$500–$1,000'],
                  ['🥈 Silver','500 FBiT','60 days','100–150% APY','$1,000–$1,500'],
                  ['🥇 Gold','1,000 FBiT','90 days','150–200% APY','$1,500–$2,000'],
                  ['💎 Diamond','5,000 FBiT','180 days','200–300% APY','$2,000–$3,000'],
                ].map((r, i) => (
                  <tr key={r[0]} className={i === 3 ? 'highlight-row' : ''}>
                    <td className="bold">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td>
                    <td className="green bold">{r[3]}</td><td className="green bold">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="warn-box">⚠️ APY rates are variable — they depend on smart contract parameters. These are estimates, not guarantees. Invest wisely.</div>
          </div>
          <PgFooter page={3} />
        </div>

        {/* ══════════════════════════════════════════════
            PAGE 4 — REFERRAL SYSTEM DEEP DIVE
        ══════════════════════════════════════════════ */}
        <div className="page">
          <PgHeader page={4} title="10-Level Referral System — Deep Dive" />
          <div className="page-body">
            <SectionTitle icon="🤝" text="10-Level Referral — Full System Explained" />

            <p style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1.6, marginBottom: 16 }}>
              FutureBit&apos;s referral system is different from traditional MLM — it runs on a
              <strong> transparent smart contract</strong>. When your referral stakes FBiT,
              you receive commission automatically — no manual claim needed.
            </p>

            {/* Commission table */}
            <table style={{ marginBottom: 18 }}>
              <thead>
                <tr><th>Level</th><th>Relationship</th><th>Commission</th><th>Example: Referral Stakes $1,000 → Your Earnings</th></tr>
              </thead>
              <tbody>
                {[
                  ['L1','Your direct referral','10%','$100 per $1,000 staked'],
                  ['L2','Referral\'s referral','5%','$50 per $1,000 staked'],
                  ['L3','3rd generation','3%','$30 per $1,000 staked'],
                  ['L4','4th generation','2%','$20 per $1,000 staked'],
                  ['L5','5th generation','1%','$10 per $1,000 staked'],
                  ['L6','6th generation','0.5%','$5 per $1,000 staked'],
                  ['L7','7th generation','0.5%','$5 per $1,000 staked'],
                  ['L8','8th generation','0.5%','$5 per $1,000 staked'],
                  ['L9','9th generation','0.5%','$5 per $1,000 staked'],
                  ['L10','10th generation','0.5%','$5 per $1,000 staked'],
                ].map((r, i) => (
                  <tr key={r[0]} className={i === 0 ? 'highlight-row' : ''}>
                    <td className="bold green">{r[0]}</td><td>{r[1]}</td>
                    <td className="bold">{r[2]}</td><td className="green small">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <SectionTitle icon="🔢" text="Network Growth Calculator — 3×3 Model" />
            <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>
              If you refer just <strong>3 people</strong>, and each of them also refers 3, your network across 10 levels becomes:
            </p>

            <div className="pyramid">
              {[
                { label: 'You (L0)', count: '1 person', color: '#064e3b', width: '20%' },
                { label: 'L1: 3 direct', count: '3 people', color: '#065f46', width: '28%' },
                { label: 'L2: 3×3 = 9', count: '9 people', color: '#047857', width: '36%' },
                { label: 'L3: 27', count: '27 people', color: '#059669', width: '44%' },
                { label: 'L4: 81', count: '81 people', color: '#10b981', width: '52%' },
                { label: 'L5+: 243–59,049', count: '243+ people', color: '#34d399', width: '65%' },
              ].map(p => (
                <div key={p.label} className="pyr-row">
                  <div className="pyr-box" style={{ background: p.color, width: p.width }}>
                    {p.label} · {p.count}
                  </div>
                </div>
              ))}
            </div>

            <div className="tip-box">
              💡 <strong>Power of 3:</strong> With just 3 people in L1 who each refer 3 more,
              your network reaches <strong>363 people</strong> by Level 5. If everyone stakes $500,
              your annual passive income from referral commissions alone could be <strong>$3,000–$5,000+</strong>!
            </div>
          </div>
          <PgFooter page={4} />
        </div>

        {/* ══════════════════════════════════════════════
            PAGE 5 — TEAM BUILDING TARGETS
        ══════════════════════════════════════════════ */}
        <div className="page">
          <PgHeader page={5} title="Team Building Targets & Growth Strategy" />
          <div className="page-body">
            <SectionTitle icon="🎯" text="Monthly Team Building Targets" />

            <table style={{ marginBottom: 20 }}>
              <thead>
                <tr><th>Month</th><th>Target</th><th>Your Team Size</th><th>Est. Monthly Commission</th><th>Key Action</th></tr>
              </thead>
              <tbody>
                {[
                  ['Month 1','5 Direct Referrals','5 members','$250–$500','Start with your close circle'],
                  ['Month 2','3 more + L2 grows','20+ members','$500–$1,500','Share in WhatsApp & Telegram groups'],
                  ['Month 3','Team = 50+ active','50 members','$1,500–$3,000','Create YouTube/Instagram content'],
                  ['Month 4','L3 growth unlocks','150+ members','$3,000–$8,000','Train your team leaders'],
                  ['Month 5','Passive mode','300+ members','$8,000–$15,000','Deep network compounds automatically'],
                  ['Month 6','Diamond Leader','500+ members','$15,000+','Full passive income stream active'],
                ].map((r, i) => (
                  <tr key={r[0]} className={i >= 4 ? 'highlight-row' : ''}>
                    <td className="bold">{r[0]}</td><td>{r[1]}</td>
                    <td className="green bold">{r[2]}</td><td className="green bold">{r[3]}</td>
                    <td className="small">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <SectionTitle icon="📣" text="Referral Sharing Strategy — Where and How" />
            <div className="card-grid card-grid-2">
              {[
                { cls: '', icon: '💬', title: 'WhatsApp Groups', items: ['Join investment communities','Share earnings screenshots','Airdrop is free — easy entry point for friends'] },
                { cls: 'card-orange', icon: '📱', title: 'Telegram Channels', items: ['Post in crypto channels','Create your own Telegram group for your downline','Share updates directly with your team'] },
                { cls: 'card-blue', icon: '🐦', title: 'Twitter/X', items: ['Post daily crypto updates','Engage through FutureBit mentions','Viral thread: "I earned $X on FutureBit"'] },
                { cls: 'card-purple', icon: '📹', title: 'YouTube / Instagram', items: ['Create tutorial videos','Share earnings proof','Put referral link in bio'] },
              ].map(c => (
                <div key={c.title} className={`card ${c.cls}`}>
                  <div className="card-icon">{c.icon}</div>
                  <h4>{c.title}</h4>
                  <ul>{c.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
                </div>
              ))}
            </div>

            <SectionTitle icon="🏅" text="Weekly Referral Contest — $950 Weekly Prize" />
            <table>
              <thead><tr><th>Rank</th><th>Prize</th><th>Target (Referrals/Week)</th><th>Strategy</th></tr></thead>
              <tbody>
                {[
                  ['🥇 1st Place','$500 FBiT','25–50 referrals','Daily content + active WhatsApp outreach'],
                  ['🥈 2nd Place','$300 FBiT','15–25 referrals','Weekly Telegram posts + group sharing'],
                  ['🥉 3rd Place','$150 FBiT','10–15 referrals','Personal network conversion focus'],
                ].map(r => (
                  <tr key={r[0]}><td className="bold">{r[0]}</td><td className="green bold">{r[1]}</td><td>{r[2]}</td><td className="small">{r[3]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <PgFooter page={5} />
        </div>

        {/* ══════════════════════════════════════════════
            PAGE 6 — LP PROVIDER ROLE (PART 1)
        ══════════════════════════════════════════════ */}
        <div className="page">
          <PgHeader page={6} title="Liquidity Provider (LP) — Role & Basics" />
          <div className="page-body">
            <SectionTitle icon="🌊" text="What Is a Liquidity Provider (LP)?" />

            <p style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.7, marginBottom: 16 }}>
              A <strong>Liquidity Provider (LP)</strong> is someone who deposits tokens into a DEX (decentralized exchange)
              so that other users can swap easily. When you become an LP,
              you deposit both FBiT and SOL into a <strong>liquidity pool</strong> —
              and in return you earn <strong>trading fees + LP rewards</strong>.
            </p>

            {/* Flow diagram */}
            <div className="lp-flow">
              <div className="lp-box">
                <h5>👤 You (LP Provider)</h5>
                <p>Deposit your SOL + FBiT into the pool</p>
              </div>
              <div className="lp-arrow">→</div>
              <div className="lp-box" style={{ background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.2)' }}>
                <h5 style={{ color: '#60a5fa' }}>🏊 Liquidity Pool</h5>
                <p>FBiT-SOL pool on Jupiter/Raydium/Orca</p>
              </div>
              <div className="lp-arrow">→</div>
              <div className="lp-box" style={{ background: 'rgba(139,92,246,0.06)', borderColor: 'rgba(139,92,246,0.2)' }}>
                <h5 style={{ color: '#a78bfa' }}>🔄 Traders</h5>
                <p>Buy/sell FBiT from the pool</p>
              </div>
              <div className="lp-arrow">→</div>
              <div className="lp-box" style={{ background: 'rgba(249,115,22,0.06)', borderColor: 'rgba(249,115,22,0.2)' }}>
                <h5 style={{ color: '#fb923c' }}>💰 Your Fees</h5>
                <p>You earn 0.25% on every swap</p>
              </div>
            </div>

            <SectionTitle icon="⚙️" text="How LP Providing Works" />
            <div className="card-grid card-grid-2" style={{ marginBottom: 16 }}>
              {[
                { cls: '', icon: '1️⃣', title: 'Deposit Tokens Into the Pool', desc: 'Deposit equal value of SOL and FBiT into a liquidity pool. Example: $500 SOL + $500 FBiT = $1,000 total liquidity. You receive LP tokens as proof of deposit.' },
                { cls: 'card-blue', icon: '2️⃣', title: 'Earn Trading Fees', desc: 'Every time a user swaps FBiT, a 0.25% fee is charged. This fee is distributed to all LPs proportional to their share. More liquidity = larger fee share.' },
                { cls: 'card-orange', icon: '3️⃣', title: 'Collect LP Rewards', desc: 'The FutureBit protocol also gives LP providers extra FBiT rewards as an incentive to maintain liquidity. These are separate from staking rewards.' },
                { cls: 'card-purple', icon: '4️⃣', title: 'Withdraw Liquidity Anytime', desc: 'When you want, burn your LP tokens and get back your original SOL + FBiT (minus any impermanent loss). No mandatory lock period — fully flexible.' },
              ].map(c => (
                <div key={c.title} className={`card ${c.cls}`}>
                  <div className="card-icon">{c.icon}</div>
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>

            <SectionTitle icon="📐" text="LP vs Staking — What Is the Difference?" />
            <table>
              <thead><tr><th>Feature</th><th>Staking</th><th>LP Provider</th></tr></thead>
              <tbody>
                {[
                  ['Tokens Required','FBiT only','FBiT + SOL (equal value)'],
                  ['Income Source','Fixed APY rewards','Trading fees + LP rewards'],
                  ['Risk Level','Market price risk only','Market risk + Impermanent Loss'],
                  ['Liquidity','Lock period (30–180 days)','Usually flexible'],
                  ['Complexity','Easy (beginner friendly)','Advanced (DeFi knowledge needed)'],
                  ['Earnings Type','Predictable APY','Variable (volume dependent)'],
                ].map(r => (
                  <tr key={r[0]}><td className="bold">{r[0]}</td><td className="green">{r[1]}</td><td className="small" style={{color:'#a78bfa'}}>{r[2]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <PgFooter page={6} />
        </div>

        {/* ══════════════════════════════════════════════
            PAGE 7 — LP BENEFITS, RISKS & STRATEGY
        ══════════════════════════════════════════════ */}
        <div className="page">
          <PgHeader page={7} title="LP Provider — Benefits, Risks & How to Benefit" />
          <div className="page-body">
            <SectionTitle icon="✅" text="Benefits of Being an LP Provider" />
            <div className="card-grid card-grid-2" style={{ marginBottom: 18 }}>
              {[
                { cls: '', icon: '💸', title: 'Trading Fees (Passive)', desc: 'Earn 0.25% on every swap in the FBiT-SOL pool — 24/7, automatic. Higher volume = more fees. During high-volume periods, earning 1–5% daily is possible.' },
                { cls: 'card-blue', icon: '🎁', title: 'Extra LP Incentive Rewards', desc: 'The FutureBit protocol gives LP providers additional FBiT token rewards as a special incentive. These are separate from staking APY — a double dip!' },
                { cls: 'card-orange', icon: '📈', title: 'Token Price Support', desc: 'By providing liquidity, you help support FBiT token price. More liquidity = more price stability = better token appreciation potential. Your investment grows too.' },
                { cls: 'card-purple', icon: '🌐', title: 'Ecosystem Contribution', desc: 'LP providers are the backbone of the FutureBit ecosystem. Your liquidity ensures users can always buy/sell FBiT — building trust and adoption.' },
                { cls: '', icon: '🔓', title: 'No Long Lock Period', desc: 'Unlike staking, LP positions are usually flexible. You can withdraw your liquidity at any time. This is a more flexible income stream.' },
                { cls: 'card-orange', icon: '🏆', title: 'LP Leaderboard Bonus', desc: 'Top LP providers receive special recognition and bonus rewards. More liquidity = more platform rewards and visibility.' },
              ].map(c => (
                <div key={c.title} className={`card ${c.cls}`}>
                  <div className="card-icon">{c.icon}</div>
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>

            <SectionTitle icon="⚠️" text="Impermanent Loss — What You Need to Know" />
            <div className="card card-red" style={{ marginBottom: 16 }}>
              <p><strong>Impermanent Loss (IL)</strong> occurs when the price ratio of tokens in the pool changes from the time of deposit. Example:</p>
              <br />
              <table style={{ marginTop: 8 }}>
                <thead><tr><th>Scenario</th><th>You Deposited</th><th>You Receive Back</th><th>IL Loss</th></tr></thead>
                <tbody>
                  {[
                    ['No price change','$500 SOL + $500 FBiT','$500 SOL + $500 FBiT','0% (No Loss)'],
                    ['FBiT 2x up','$500 SOL + $500 FBiT','~$580 SOL + ~$420 FBiT','~5.7% vs HODLing'],
                    ['FBiT 5x up','$500 SOL + $500 FBiT','~$670 SOL + ~$335 FBiT','~25% vs HODLing'],
                  ].map(r => (
                    <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td>
                      <td style={{ color: r[3].startsWith('0') ? '#059669' : '#dc2626', fontWeight: 700 }}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="tip-box">
              💡 <strong>How to reduce IL risk:</strong> Trading fees + LP rewards can offset IL when volume is high. LP is most profitable during low-volatility periods. Only provide LP if you plan to hold long-term.
            </div>
          </div>
          <PgFooter page={7} />
        </div>

        {/* ══════════════════════════════════════════════
            PAGE 8 — LP STEP-BY-STEP + INCOME PROJECTION
        ══════════════════════════════════════════════ */}
        <div className="page">
          <PgHeader page={8} title="How to Become an LP Provider — Step by Step + Income Projection" />
          <div className="page-body">
            <SectionTitle icon="🚀" text="How to Become an LP Provider — Step by Step" />

            <div className="timeline" style={{ marginBottom: 24 }}>
              {[
                { num: '1', head: 'Get Your FBiT and SOL Ready', body: 'You need equal values of both tokens. Example: $500 worth of SOL and $500 worth of FBiT. Use the Swap page to buy FBiT (SOL to FBiT).' },
                { num: '2', head: 'Open Raydium or Orca', body: 'Go to raydium.io or orca.so. Navigate to the "Liquidity" or "Pools" section. Search for the FBiT-SOL pool and click "Add Liquidity".' },
                { num: '3', head: 'Enter the Amount', body: 'Enter how much SOL + FBiT you want to deposit. The platform will automatically calculate the correct ratio. Minimum recommended: $100 worth each.' },
                { num: '4', head: 'Approve the Transaction', body: 'Approve the "Add Liquidity" transaction in Phantom wallet. A small SOL gas fee will be charged. LP tokens will appear in your wallet.' },
                { num: '5', head: 'Track Your Rewards', body: 'View your position on the Raydium/Orca dashboard — accumulated fees and rewards are shown in real time. Claim any time.' },
                { num: '6', head: 'Compound or Withdraw', body: 'Compound earned fees back into the pool (for higher returns) or withdraw and bank them. The strategy is yours to choose.' },
              ].map(t => (
                <div key={t.num} className="tl-item">
                  <div className="tl-dot"><span>{t.num}</span></div>
                  <div className="tl-head">{t.head}</div>
                  <div className="tl-body">{t.body}</div>
                </div>
              ))}
            </div>

            <SectionTitle icon="💹" text="LP Income Projection — Monthly Estimate" />
            <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
              (Assumption: 0.25% fee per swap, moderate trading volume, fees + LP rewards combined)
            </p>
            {[
              { label: '$500 LP Position (Beginner)', val: '$15–$50/month', pct: 20 },
              { label: '$2,000 LP Position (Intermediate)', val: '$60–$200/month', pct: 40 },
              { label: '$5,000 LP Position (Advanced)', val: '$150–$500/month', pct: 65 },
              { label: '$10,000 LP Position (Pro)', val: '$300–$1,000/month', pct: 85 },
            ].map(b => (
              <div key={b.label} className="inc-bar-wrap">
                <div className="inc-bar-label">
                  <span className="lbl">{b.label}</span>
                  <span className="val">{b.val}</span>
                </div>
                <div className="inc-bar-bg">
                  <div className="inc-bar-fill" style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}

            <div className="warn-box" style={{ marginTop: 12 }}>
              ⚠️ LP income is variable and depends on actual trading volume. These are estimates only. Impermanent loss can reduce returns. Always do your own research before becoming an LP.
            </div>
          </div>
          <PgFooter page={8} />
        </div>

        {/* ══════════════════════════════════════════════
            PAGE 9 — 90-DAY ACTION PLAN
        ══════════════════════════════════════════════ */}
        <div className="page">
          <PgHeader page={9} title="90-Day Action Plan — Your Roadmap" />
          <div className="page-body">
            <SectionTitle icon="📅" text="90-Day Step-by-Step Roadmap to Passive Income" />

            <div className="card-grid card-grid-3" style={{ marginBottom: 20 }}>
              {/* Month 1 */}
              <div className="card card-blue">
                <div className="card-icon">📆</div>
                <h4 style={{ fontSize: 14 }}>Month 1 — Foundation</h4>
                <ul style={{ marginTop: 8 }}>
                  {[
                    'Week 1: Set up Phantom wallet + buy SOL',
                    'Week 1: Connect to FutureBit + complete airdrop tasks',
                    'Week 2: Target 5 direct referrals',
                    'Week 2: Purchase FBiT tokens (100+ FBiT)',
                    'Week 3: Start Starter staking tier',
                    'Week 3: Share referral link on WhatsApp/Telegram',
                    'Week 4: Complete 10 total referrals',
                    'Week 4: Track progress on your dashboard',
                  ].map((it, i) => <li key={i} style={{ fontSize: 11, marginBottom: 4 }}>{it}</li>)}
                </ul>
                <div style={{ marginTop: 10, padding: '6px 10px', background: 'rgba(59,130,246,0.1)', borderRadius: 6, fontSize: 11, color: '#60a5fa', fontWeight: 700 }}>
                  Target: $200–500/mo referral income
                </div>
              </div>

              {/* Month 2 */}
              <div className="card">
                <div className="card-icon">📆</div>
                <h4 style={{ fontSize: 14 }}>Month 2 — Scale Up</h4>
                <ul style={{ marginTop: 8 }}>
                  {[
                    'Week 5: Upgrade FBiT stake → Silver tier',
                    'Week 5: Follow up with your L2 network',
                    'Week 6: Start YouTube/Reel content creation',
                    'Week 6: Target 25+ total referrals',
                    'Week 7: Register for the trading competition',
                    'Week 7: Stake $100+ for Lucky Vault entry',
                    'Week 8: Consider an LP position (advanced)',
                    'Week 8: Aim for top 10 in the weekly contest',
                  ].map((it, i) => <li key={i} style={{ fontSize: 11, marginBottom: 4 }}>{it}</li>)}
                </ul>
                <div style={{ marginTop: 10, padding: '6px 10px', background: 'rgba(0,255,136,0.08)', borderRadius: 6, fontSize: 11, color: '#00ff88', fontWeight: 700 }}>
                  Target: $1,000–3,000/mo combined income
                </div>
              </div>

              {/* Month 3 */}
              <div className="card card-orange">
                <div className="card-icon">📆</div>
                <h4 style={{ fontSize: 14 }}>Month 3 — Passive Mode</h4>
                <ul style={{ marginTop: 8 }}>
                  {[
                    'Week 9: Target Diamond staking tier',
                    'Week 9: Reach 50+ active network members',
                    'Week 10: Set up LP position (FBiT + SOL)',
                    'Week 10: Track L3 network earnings',
                    'Week 11: Build a consistent content creation system',
                    'Week 11: Win the weekly top 3 referrer contest',
                    'Week 12: Claim airdrop distribution',
                    'Week 12: Plan your next 90 days',
                  ].map((it, i) => <li key={i} style={{ fontSize: 11, marginBottom: 4 }}>{it}</li>)}
                </ul>
                <div style={{ marginTop: 10, padding: '6px 10px', background: 'rgba(249,115,22,0.1)', borderRadius: 6, fontSize: 11, color: '#fb923c', fontWeight: 700 }}>
                  Target: $5,000–15,000/mo passive income
                </div>
              </div>
            </div>

            <SectionTitle icon="💰" text="Combined Income Projection — All Streams Together" />
            <table>
              <thead>
                <tr><th>Income Stream</th><th>Month 1</th><th>Month 2</th><th>Month 3</th><th>Month 6</th></tr>
              </thead>
              <tbody>
                {[
                  ['Staking Rewards (APY)','$50–100','$150–300','$300–600','$800–1,500'],
                  ['Direct Referral Commission','$150–300','$400–800','$800–1,500','$2,000–5,000'],
                  ['Deep Network (L2–L10)','$0–50','$100–300','$500–1,500','$3,000–8,000'],
                  ['LP Trading Fees','—','—','$50–200','$300–1,000'],
                  ['Weekly Contest Bonus','—','$150–500','$500–950','$950/week'],
                  ['Airdrop (one-time)','Points earning','Points earning','Claim in June','Distributed'],
                ].map(r => (
                  <tr key={r[0]}><td>{r[0]}</td>
                    {r.slice(1).map((v, i) => <td key={i} className={v.startsWith('$') ? 'green small' : 'gray small'}>{v}</td>)}
                  </tr>
                ))}
                <tr className="highlight-row">
                  <td className="bold">TOTAL ESTIMATE</td>
                  <td className="green bold">$200–450/mo</td>
                  <td className="green bold">$800–1,900/mo</td>
                  <td className="green bold">$2,150–4,750/mo</td>
                  <td className="green bold">$7,050–15,500/mo</td>
                </tr>
              </tbody>
            </table>
            <div className="warn-box">⚠️ These are best-case estimate projections — actual results depend on token price, market conditions, and network activity. Invest wisely.</div>
          </div>
          <PgFooter page={9} />
        </div>

        {/* ══════════════════════════════════════════════
            PAGE 10 — CONCLUSION + CONTACT + DISCLAIMER
        ══════════════════════════════════════════════ */}
        <div className="page">
          <PgHeader page={10} title="Conclusion, Contact & Legal Disclaimer" />
          <div className="page-body">
            <SectionTitle icon="🎯" text="Key Takeaways — Remember These" />
            <div className="card-grid card-grid-2" style={{ marginBottom: 20 }}>
              {[
                { cls: '', icon: '1️⃣', title: 'Join the Airdrop First', desc: 'It is free — just complete the tasks. Earn 70+ points and claim your share of the $10,000 prize pool. Only 5,000 spots available.' },
                { cls: 'card-blue', icon: '2️⃣', title: 'Build Your Referral Network Early', desc: 'The sooner you start, the more compounding you benefit from. In a 10-level system, time is your biggest asset.' },
                { cls: 'card-orange', icon: '3️⃣', title: 'Build a Base Income with Staking', desc: 'Stake FBiT and earn steady APY. Upgrade to Diamond tier when you can afford to — compounding works like magic.' },
                { cls: 'card-purple', icon: '4️⃣', title: 'Advanced: Become an LP Provider', desc: 'Earn extra passive income from LP fees. Understand impermanent loss first — this is an advanced strategy for DeFi-experienced users.' },
              ].map(c => (
                <div key={c.title} className={`card ${c.cls}`}>
                  <div className="card-icon">{c.icon}</div>
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
              ))}
            </div>

            <SectionTitle icon="📞" text="Official Links & Contact" />
            <table style={{ marginBottom: 20 }}>
              <thead><tr><th>Platform</th><th>Link / Handle</th><th>Purpose</th></tr></thead>
              <tbody>
                {[
                  ['🌐 Website',    SITE,                        'Main platform — stake, airdrop, swap'],
                  ['🎁 Airdrop',    `${SITE}/airdrop`,           'Complete tasks, earn points'],
                  ['💎 Staking',    `${SITE}/stake`,             'Stake FBiT — APY rewards'],
                  ['🪐 Swap',       `${SITE}/swap`,              'Jupiter terminal — SOL to FBiT'],
                  ['📖 Guide',      `${SITE}/guide`,             'Complete beginner guide'],
                  ['📄 Terms',      `${SITE}/terms`,             'Terms of Service + Risk Disclosure'],
                  ['💬 Telegram',   '@FutureBit_Official',       'Community + support'],
                  ['🐦 Twitter/X', '@FutureBit_Sol',             'Updates + announcements'],
                  ['🔍 Solscan',    `solscan.io/token/${MINT.slice(0,8)}...${MINT.slice(-6)}`, 'Token verification'],
                ].map(r => (
                  <tr key={r[0]}><td className="bold">{r[0]}</td><td style={{ fontFamily: 'monospace', fontSize: 11 }}>{r[1]}</td><td className="small gray">{r[2]}</td></tr>
                ))}
              </tbody>
            </table>

            {/* Disclaimer */}
            <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '16px 20px' }}>
              <div style={{ fontWeight: 700, color: '#f87171', fontSize: 13, marginBottom: 8 }}>⚠️ IMPORTANT RISK DISCLAIMER</div>
              <p style={{ fontSize: 11, color: '#fca5a5', lineHeight: 1.7 }}>
                This document is for <strong>educational and marketing purposes only</strong>. The income
                projections shown are <strong>not guaranteed</strong> and this is not financial advice.
                Cryptocurrency and DeFi investments carry <strong>significant financial risk</strong> —
                you can lose your entire invested amount. APY rates are variable. Impermanent loss
                can affect LP positions. Smart contracts may contain bugs.
                Token prices are highly volatile. Only invest what you
                <strong> can afford to lose entirely</strong>.
                The regulatory environment may change. <strong>DYOR — Do Your Own Research</strong>.
                Consult a qualified financial advisor in your jurisdiction.
                The FutureBit team will never ask for your seed phrase or private key.
              </p>
            </div>

            <div style={{ textAlign: 'center', marginTop: 20, padding: '16px', background: '#050a0f', borderRadius: 10 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🚀</div>
              <div style={{ color: '#00ff88', fontWeight: 900, fontSize: 18, marginBottom: 4 }}>Get Started Now!</div>
              <div style={{ color: '#9ca3af', fontSize: 12 }}>
                Connect wallet → Complete tasks → Refer friends → Stake → Earn
              </div>
              <div style={{ color: '#6b7280', fontSize: 11, marginTop: 8 }}>{SITE} · Solana Mainnet · © {YEAR} FutureBit</div>
            </div>
          </div>
          <PgFooter page={10} />
        </div>

      </div>{/* end doc */}
    </>
  );
}
