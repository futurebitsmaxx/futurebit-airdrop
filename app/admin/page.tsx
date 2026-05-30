'use client';

import { useState, useEffect } from 'react';
import {
  AIRDROP_CONFIG, REG_STORAGE_KEY, type AirdropRegistration,
  loadAdminConfig, saveAdminConfig, DEFAULT_ADMIN_CONFIG, type AirdropAdminConfig,
  loadVaultAdminConfig, saveVaultAdminConfig, DEFAULT_VAULT_ADMIN_CONFIG, type LuckyVaultAdminConfig,
  type VaultRegistration,
} from '@/lib/airdropConfig';
import {
  COMP_REG_KEY, type CompRegistration,
  loadCompAdminConfig, saveCompAdminConfig, DEFAULT_COMP_ADMIN_CONFIG, type CompAdminConfig,
} from '@/lib/competitionConfig';
import {
  LEADERBOARD_DATA,
  loadLeaderboardAdminConfig, DEFAULT_LB_ADMIN_CONFIG, type LeaderboardAdminConfig,
  LB_ADMIN_CFG_KEY,
} from '@/lib/store';
import {
  loadSocialConfig, saveSocialConfig, DEFAULT_SOCIAL_CONFIG, type SocialConfig,
} from '@/lib/socialConfig';
import { APY_OVERRIDE_KEY } from '@/lib/useAPY';


function saveJSON(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
}

type TabId = 'overview' | 'registrations' | 'vault' | 'competition' | 'leaderboard' | 'distribute' | 'settings' | 'social' | 'setup' | 'threats';
interface ThreatEntry { ip: string; score: number; blocked: boolean; requests: number; }

export default function AdminPage() {
  const [authed,       setAuthed]       = useState(false);
  const [password,     setPassword]     = useState('');
  const [passError,    setPassError]    = useState('');
  const [activeTab,    setActiveTab]    = useState<TabId>('overview');
  const [localReg,     setLocalReg]     = useState<AirdropRegistration | null>(null);
  const [localCompReg, setLocalCompReg] = useState<CompRegistration | null>(null);
  const [apiRegs,      setApiRegs]      = useState<AirdropRegistration[]>([]);
  const [apiCompRegs,  setApiCompRegs]  = useState<CompRegistration[]>([]);
  const [apiVaultRegs, setApiVaultRegs] = useState<VaultRegistration[]>([]);

  type VerifyStatus = 'idle' | 'checking' | 'valid' | 'invalid' | 'not_found';
  interface VerifyResult { fbitAmount: number; walletMatches: boolean; reason?: string; }
  const [verifyStatus, setVerifyStatus] = useState<Record<string, VerifyStatus>>({});
  const [verifyData,   setVerifyData]   = useState<Record<string, VerifyResult>>({});
  const [distributing,   setDistributing]   = useState(false);
  const [distProgress,   setDistProgress]   = useState(0);
  const [distResults,    setDistResults]    = useState<{ wallet: string; fbit: number; tx?: string; error?: string }[]>([]);
  const [distDone,       setDistDone]       = useState(false);
  const [distTotal,      setDistTotal]      = useState(0);
  const [walletPubkey,   setWalletPubkey]   = useState('');
  const [walletBalance,  setWalletBalance]  = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [distPreview,    setDistPreview]    = useState<{ wallet: string; fbit: number }[]>([]);
  const [showPreview,    setShowPreview]    = useState(false);
  const [savedMsg,     setSavedMsg]     = useState('');
  const [threats,      setThreats]      = useState<ThreatEntry[]>([]);
  const [threatLoading,setThreatLoading]= useState(false);

  // Config states
  const [airdropCfg, setAirdropCfg] = useState<AirdropAdminConfig>(DEFAULT_ADMIN_CONFIG);
  const [vaultCfg,   setVaultCfg]   = useState<LuckyVaultAdminConfig>(DEFAULT_VAULT_ADMIN_CONFIG);
  const [compCfg,    setCompCfg]    = useState<CompAdminConfig>(DEFAULT_COMP_ADMIN_CONFIG);
  const [lbCfg,      setLbCfg]      = useState<LeaderboardAdminConfig>(DEFAULT_LB_ADMIN_CONFIG);
  const [socialCfg,  setSocialCfg]  = useState<SocialConfig>(DEFAULT_SOCIAL_CONFIG);

  // Settings active section
  const [settingsSection, setSettingsSection] = useState<'airdrop' | 'vault' | 'competition' | 'leaderboard' | 'apy'>('airdrop');
  const [apyOverride, setApyOverride] = useState<string>('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(REG_STORAGE_KEY);
      if (raw) setLocalReg(JSON.parse(raw) as AirdropRegistration);
      const compRaw = localStorage.getItem(COMP_REG_KEY);
      if (compRaw) setLocalCompReg(JSON.parse(compRaw) as CompRegistration);
    } catch { /* ignore */ }
    setAirdropCfg(loadAdminConfig());
    setVaultCfg(loadVaultAdminConfig());
    setCompCfg(loadCompAdminConfig());
    setLbCfg(loadLeaderboardAdminConfig());
    setSocialCfg(loadSocialConfig());
    try {
      const raw = localStorage.getItem(APY_OVERRIDE_KEY);
      if (raw) setApyOverride(JSON.parse(raw).toString());
    } catch { /* ignore */ }
  }, []);

  // Fetch all server-side registrations after login (cookie sent automatically)
  useEffect(() => {
    if (!authed) return;
    fetch('/api/registrations')
      .then(r => r.ok ? r.json() : [])
      .then((data: unknown) => Array.isArray(data) ? setApiRegs(data as AirdropRegistration[]) : null)
      .catch(() => {});
    fetch('/api/comp-registrations')
      .then(r => r.ok ? r.json() : [])
      .then((data: unknown) => Array.isArray(data) ? setApiCompRegs(data as CompRegistration[]) : null)
      .catch(() => {});
    fetch('/api/vault-registrations')
      .then(r => r.ok ? r.json() : [])
      .then((data: unknown) => Array.isArray(data) ? setApiVaultRegs(data as VaultRegistration[]) : null)
      .catch(() => {});
  }, [authed]);

  function handleSave(section: string) {
    if (section === 'airdrop')     { saveAdminConfig(airdropCfg); }
    if (section === 'vault')       { saveVaultAdminConfig(vaultCfg); }
    if (section === 'competition') { saveCompAdminConfig(compCfg); }
    if (section === 'leaderboard') { saveJSON(LB_ADMIN_CFG_KEY, lbCfg); }
    if (section === 'social')      { saveSocialConfig(socialCfg); }
    if (section === 'apy') {
      const val = Number(apyOverride);
      if (apyOverride === '') { localStorage.removeItem(APY_OVERRIDE_KEY); }
      else if (Number.isFinite(val) && val >= 1) { localStorage.setItem(APY_OVERRIDE_KEY, JSON.stringify(val)); }
    }
    setSavedMsg(`✅ ${section} settings saved!`);
    setTimeout(() => setSavedMsg(''), 2500);
  }

  async function login() {
    setPassError('');
    try {
      const res = await fetch('/api/admin/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password }),
      });
      const data = await res.json() as { error?: string };
      if (res.ok) setAuthed(true);
      else setPassError(data.error ?? 'Incorrect password');
    } catch {
      setPassError('Connection error. Try again.');
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthed(false);
    setPassword('');
  }

  async function checkWalletBalance() {
    setBalanceLoading(true);
    try {
      const res  = await fetch('/api/admin/wallet-info');
      const data = await res.json() as { configured: boolean; pubkey?: string; balance?: number; message?: string };
      if (data.configured && data.pubkey) {
        setWalletPubkey(data.pubkey);
        setWalletBalance(data.balance ?? 0);
      } else {
        setWalletPubkey('');
        setWalletBalance(null);
      }
    } catch { /* ignore */ }
    setBalanceLoading(false);
  }

  async function previewDistribution() {
    const res  = await fetch('/api/admin/distribute', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ fbitPerPoint: airdropCfg.fbitPerPoint, qualifyPoints: airdropCfg.qualifyPoints, dryRun: true }),
    });
    const data = await res.json() as { preview?: { wallet: string; fbit: number }[]; total?: number };
    setDistPreview(data.preview ?? []);
    setDistTotal(data.total ?? 0);
    setShowPreview(true);
  }

  async function startDistribution() {
    if (!window.confirm(`Send FBiT to ${qualifiedRegs.length} wallets? This cannot be undone.`)) return;
    setDistributing(true);
    setDistProgress(0);
    setDistResults([]);
    setDistDone(false);

    const BATCH = 15;
    let offset  = 0;
    let total   = qualifiedRegs.length;
    const allResults: typeof distResults = [];

    while (true) {
      try {
        const res  = await fetch('/api/admin/distribute', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ fbitPerPoint: airdropCfg.fbitPerPoint, qualifyPoints: airdropCfg.qualifyPoints, offset, batchSize: BATCH, dryRun: false }),
        });
        const data = await res.json() as { results?: typeof distResults; total?: number; done?: boolean; nextOffset?: number; error?: string };
        if (!res.ok) { console.error('[distribute]', data.error); break; }
        if (data.total) total = data.total;
        allResults.push(...(data.results ?? []));
        setDistResults([...allResults]);
        setDistProgress(Math.round(allResults.length / total * 100));
        if (data.done) break;
        offset = data.nextOffset ?? (offset + BATCH);
      } catch (err) {
        console.error('[distribute batch error]', err);
        break;
      }
    }

    setDistributing(false);
    setDistDone(true);
  }

  async function verifyStake(txHash: string, wallet: string) {
    setVerifyStatus(s => ({ ...s, [txHash]: 'checking' }));
    try {
      const res  = await fetch(`/api/admin/verify-stake?tx=${encodeURIComponent(txHash)}&wallet=${encodeURIComponent(wallet)}`);
      const data = await res.json() as { valid: boolean; fbitAmount?: number; walletMatches?: boolean; reason?: string };
      if (data.valid) {
        setVerifyStatus(s  => ({ ...s, [txHash]: 'valid' }));
        setVerifyData(d    => ({ ...d, [txHash]: { fbitAmount: data.fbitAmount ?? 0, walletMatches: data.walletMatches ?? false } }));
      } else {
        setVerifyStatus(s  => ({ ...s, [txHash]: data.reason?.includes('not found') ? 'not_found' : 'invalid' }));
        setVerifyData(d    => ({ ...d, [txHash]: { fbitAmount: 0, walletMatches: false, reason: data.reason } }));
      }
    } catch {
      setVerifyStatus(s => ({ ...s, [txHash]: 'invalid' }));
    }
  }

  // Merge server + localStorage registrations (dedup by txId)
  const allRegs: AirdropRegistration[] = (() => {
    const map = new Map<string, AirdropRegistration>();
    apiRegs.forEach(r => map.set(r.txId, r));
    if (localReg) map.set(localReg.txId, localReg);
    return Array.from(map.values()).sort((a, b) =>
      new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    );
  })();
  const qualifiedRegs = allRegs.filter(r => r.points >= airdropCfg.qualifyPoints);

  const compRegs: CompRegistration[] = (() => {
    const map = new Map<string, CompRegistration>();
    apiCompRegs.forEach(r => map.set(r.txId, r));
    if (localCompReg) map.set(localCompReg.txId, localCompReg);
    return Array.from(map.values()).sort((a, b) =>
      new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime()
    );
  })();


  function exportCSV() {
    const header = 'wallet,points,fbitBalance,isStaker,stakeCount,totalStaked,registeredAt,txId';
    const rows   = qualifiedRegs.map(r =>
      `${r.wallet},${r.points},${r.fbitBalance},${r.isStaker},${r.stakeCount},${r.totalStaked},${r.registeredAt},${r.txId}`
    );
    const csv  = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `fbit-airdrop-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="wallet-modal-box rounded-2xl p-8">
            <h1 className="text-2xl font-bold text-white mb-2">🔐 Admin Panel</h1>
            <p className="text-gray-500 text-sm mb-6">FutureBit Airdrop Admin</p>
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm mb-3 outline-none focus:border-neon-green/40"
            />
            {passError && <p className="text-red-400 text-xs mb-3">{passError}</p>}
            <button type="button" onClick={login} className="btn-primary w-full">Login</button>
            <p className="text-gray-600 text-xs text-center mt-4">
              Set password via <span className="font-mono">ADMIN_PASS</span> env var
            </p>
          </div>
        </div>
      </div>
    );
  }

  function loadThreats() {
    setThreatLoading(true);
    fetch('/api/admin/threats')
      .then(r => r.ok ? r.json() : [])
      .then((data: ThreatEntry[]) => setThreats(data))
      .catch(() => {})
      .finally(() => setThreatLoading(false));
  }

  const TABS: { id: TabId; label: string }[] = [
    { id: 'overview',       label: '📊 Overview'      },
    { id: 'registrations',  label: '📋 Airdrop'       },
    { id: 'vault',          label: '🎰 Lucky Vault'   },
    { id: 'competition',    label: '🏆 Competition'   },
    { id: 'leaderboard',    label: '⚔️ Leaderboard'   },
    { id: 'distribute',     label: '🚀 Distribution'  },
    { id: 'settings',       label: '⚙️ Settings'      },
    { id: 'social',         label: '🔗 Social Links'  },
    { id: 'setup',          label: '🔌 Setup'         },
    { id: 'threats',        label: '🛡️ Threats'       },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">🛡️ FutureBit Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all campaigns — Airdrop · Lucky Vault · Competition · Leaderboard</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={exportCSV} className="btn-primary text-sm">
            📥 Export CSV
          </button>
          <button type="button" onClick={logout} className="btn-outline text-sm text-red-400 border-red-500/30 hover:border-red-500">
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="stake-tab-bar mb-6 flex-wrap gap-y-1">
        {TABS.map(t => (
          <button key={t.id} type="button" onClick={() => setActiveTab(t.id)}
            className={`stake-tab-btn ${activeTab === t.id ? 'stake-tab-btn--active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ OVERVIEW ══ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Prize Pool',      value: '$22,500',              sub: 'Across all campaigns', color: 'text-neon-green'  },
              { label: 'Airdrop Registrations', value: String(allRegs.length), sub: `${qualifiedRegs.length} qualified`, color: 'text-neon-green' },
              { label: 'Competition Entries',   value: String(compRegs.length), sub: 'Registered traders',       color: 'text-yellow-400' },
              { label: 'Leaderboard Stakers',   value: String(LEADERBOARD_DATA.length), sub: 'Week ' + lbCfg.currentWeek, color: 'text-neon-purple' },
            ].map(s => (
              <div key={s.label} className="stake-wallet-card text-center">
                <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-white text-sm font-semibold mt-1">{s.label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Campaign status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: '🎁 Airdrop',
                status: 'LIVE',
                statusColor: 'text-neon-green',
                prize: airdropCfg.totalPrize,
                ends: airdropCfg.endDate,
                detail: `${qualifiedRegs.length} / ${airdropCfg.maxWinners} wallets qualified`,
                tab: 'registrations' as TabId,
              },
              {
                title: '🎰 Lucky Vault',
                status: vaultCfg.isOpen ? 'OPEN' : 'CLOSED',
                statusColor: vaultCfg.isOpen ? 'text-neon-green' : 'text-red-400',
                prize: vaultCfg.monthlyPrize,
                ends: vaultCfg.drawDate,
                detail: `Min stake: $${vaultCfg.minStake} · Max ${vaultCfg.maxTickets} tickets`,
                tab: 'vault' as TabId,
              },
              {
                title: '🏆 Competition',
                status: 'UPCOMING',
                statusColor: 'text-yellow-400',
                prize: compCfg.totalPrize,
                ends: compCfg.endDate,
                detail: `${compRegs.length} registered · ${compCfg.season}`,
                tab: 'competition' as TabId,
              },
            ].map(c => (
              <div key={c.title} className="stake-wallet-card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-bold">{c.title}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/5 ${c.statusColor}`}>{c.status}</span>
                </div>
                <p className="text-2xl font-extrabold text-neon-green mb-1">{c.prize}</p>
                <p className="text-gray-500 text-xs mb-1">Ends: {c.ends}</p>
                <p className="text-gray-400 text-xs mb-4">{c.detail}</p>
                <button type="button" onClick={() => setActiveTab(c.tab)} className="btn-outline text-xs py-1.5 px-3 w-full">
                  Manage →
                </button>
              </div>
            ))}
          </div>

          {/* Leaderboard snapshot */}
          <div className="stake-wallet-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">⚔️ Referral Leaderboard — Week {lbCfg.currentWeek}</h3>
              <button type="button" onClick={() => setActiveTab('leaderboard')} className="btn-outline text-xs py-1 px-3">View All →</button>
            </div>
            <div className="space-y-2">
              {LEADERBOARD_DATA.slice(0, 5).map((e, i) => (
                <div key={e.rank} className="flex items-center gap-3 text-sm">
                  <span className="w-7 text-center shrink-0">{['🥇','🥈','🥉','4️⃣','5️⃣'][i]}</span>
                  <span className="text-white font-medium flex-1">{e.name}</span>
                  <span className="text-gray-500 text-xs">{e.referrals} refs</span>
                  <span className="text-neon-green font-bold text-xs">{e.prize}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ AIRDROP REGISTRATIONS ══ */}
      {activeTab === 'registrations' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-neon-green/8 border border-neon-green/20 rounded-xl p-4">
            <span className="text-neon-green text-xl">✅</span>
            <div className="text-sm text-neon-green/80">
              Showing <strong className="text-white">{allRegs.length}</strong> total registrations
              ({apiRegs.length} from server · {localReg ? 1 : 0} from this browser).
              Every new registration is saved to the server automatically.
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">{qualifiedRegs.length} qualified wallets</p>
              <p className="text-gray-500 text-xs">Min {airdropCfg.qualifyPoints} pts to qualify</p>
            </div>
            <button type="button" onClick={exportCSV} className="btn-outline text-xs py-1.5 px-3">📥 Export CSV</button>
          </div>

          <div className="stake-wallet-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {['#', 'Wallet', 'Points', 'FBiT', 'Staker', 'Staked', 'Registered', 'ID'].map(h => (
                    <th key={h} className="text-left text-gray-500 text-xs font-semibold pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {qualifiedRegs.map((r, i) => (
                  <tr key={r.txId} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                    <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-gray-300">{r.wallet.slice(0,8)}...{r.wallet.slice(-4)}</td>
                    <td className="py-3 pr-4 text-neon-green font-bold">{r.points}</td>
                    <td className="py-3 pr-4 text-white">{r.fbitBalance}</td>
                    <td className="py-3 pr-4">{r.isStaker ? <span className="text-neon-green">✅</span> : <span className="text-gray-500">—</span>}</td>
                    <td className="py-3 pr-4 text-gray-300 text-xs">${r.totalStaked}</td>
                    <td className="py-3 pr-4 text-gray-400 text-xs">{new Date(r.registeredAt).toLocaleDateString('en-IN')}</td>
                    <td className="py-3 font-mono text-xs text-gray-500">{r.txId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ LUCKY VAULT ══ */}
      {activeTab === 'vault' && (
        <div className="space-y-5">
          {/* Status card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Monthly Prize', value: vaultCfg.monthlyPrize, color: 'text-yellow-400' },
              { label: 'Draw Date',     value: vaultCfg.drawDate,     color: 'text-white'      },
              { label: 'Min Stake',     value: `$${vaultCfg.minStake}`, color: 'text-neon-green' },
              { label: 'Max Tickets',   value: String(vaultCfg.maxTickets), color: 'text-neon-green' },
            ].map(s => (
              <div key={s.label} className="stake-wallet-card text-center">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Prize structure */}
          <div className="stake-wallet-card">
            <h3 className="text-white font-bold mb-4">🏆 Prize Structure</h3>
            <div className="space-y-3">
              {[
                { tier: 'Grand Prize', winners: '1 winner',          reward: '$2,000 FBiT', icon: '🥇', color: 'rank-gold'     },
                { tier: 'Silver Prize', winners: '3 winners',        reward: '$500 FBiT each', icon: '🥈', color: 'rank-silver' },
                { tier: 'Bronze Prize', winners: '10 winners',       reward: '$100 FBiT each', icon: '🥉', color: 'rank-bronze' },
                { tier: 'Participation', winners: 'All eligible',    reward: '50 FBiT + 0.5% APY Boost', icon: '🎁', color: 'text-neon-green' },
              ].map(p => (
                <div key={p.tier} className="flex items-center gap-4 p-3 rounded-xl bg-white/3 border border-white/6">
                  <span className="text-2xl">{p.icon}</span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold">{p.tier}</p>
                    <p className="text-gray-500 text-xs">{p.winners}</p>
                  </div>
                  <span className={`font-bold text-sm ${p.color}`}>{p.reward}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket multipliers */}
          <div className="stake-wallet-card">
            <h3 className="text-white font-bold mb-4">🚀 Ticket Multipliers</h3>
            <div className="space-y-2">
              {[
                { rule: 'Each $100 staked',       bonus: '1 ticket (max 10)'  },
                { rule: 'Stake for 60+ days',      bonus: '1.5x tickets'       },
                { rule: 'Active referral member',  bonus: '+2 bonus tickets'   },
              ].map(m => (
                <div key={m.rule} className="flex justify-between items-center text-sm py-2 border-b border-white/4 last:border-0">
                  <span className="text-gray-400">{m.rule}</span>
                  <span className="text-neon-green font-bold">{m.bonus}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vault settings */}
          <div className="stake-wallet-card">
            <h3 className="text-white font-bold mb-4">⚙️ Vault Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">Monthly Prize</label>
                <input type="text" title="Monthly Prize" value={vaultCfg.monthlyPrize} onChange={e => setVaultCfg(p => ({...p, monthlyPrize: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">Draw Date</label>
                <input type="date" title="Draw Date" value={vaultCfg.drawDate} onChange={e => setVaultCfg(p => ({...p, drawDate: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">Minimum Stake ($)</label>
                <input type="number" title="Minimum Stake" value={vaultCfg.minStake} onChange={e => setVaultCfg(p => ({...p, minStake: +e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">Max Tickets per Wallet</label>
                <input type="number" title="Max Tickets per Wallet" value={vaultCfg.maxTickets} onChange={e => setVaultCfg(p => ({...p, maxTickets: +e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <label className="text-gray-400 text-sm">Vault Status:</label>
              <button type="button" onClick={() => setVaultCfg(p => ({...p, isOpen: !p.isOpen}))}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${vaultCfg.isOpen ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {vaultCfg.isOpen ? '🟢 OPEN' : '🔴 CLOSED'}
              </button>
            </div>
            <button type="button" onClick={() => handleSave('vault')} className="btn-primary text-sm">
              💾 Save Vault Settings
            </button>
            {savedMsg.includes('vault') && <span className="ml-3 text-neon-green text-sm">{savedMsg}</span>}
          </div>

          {/* ── Vault Registrations + On-chain Verification ── */}
          <div className="stake-wallet-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-base">📋 Staker Registrations</h3>
                <p className="text-gray-500 text-xs mt-0.5">{apiVaultRegs.length} registered • Click Verify to check deposit on-chain</p>
              </div>
              <button type="button"
                onClick={() => fetch('/api/vault-registrations').then(r => r.json()).then((d: unknown) => Array.isArray(d) && setApiVaultRegs(d as VaultRegistration[]))}
                className="btn-outline text-xs py-1.5 px-3">
                🔄 Refresh
              </button>
            </div>

            {apiVaultRegs.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <div className="text-3xl mb-2">📭</div>
                <p className="text-sm">No vault registrations yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/8">
                      {['#', 'Wallet', 'Reported Amount', 'Lock', 'Tickets', 'Registered', 'Stake Tx', 'On-chain Verify'].map(h => (
                        <th key={h} className="text-left text-gray-500 font-semibold pb-3 pr-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {apiVaultRegs.map((r, i) => {
                      const st  = verifyStatus[r.txHash] ?? 'idle';
                      const vd  = verifyData[r.txHash];
                      return (
                        <tr key={r.txHash} className="border-b border-white/4 hover:bg-white/2 transition-colors">
                          <td className="py-3 pr-3 text-gray-500">{i + 1}</td>

                          {/* Wallet */}
                          <td className="py-3 pr-3 font-mono text-gray-300">
                            {r.wallet.slice(0, 6)}…{r.wallet.slice(-4)}
                          </td>

                          {/* Reported amount */}
                          <td className="py-3 pr-3 text-white font-bold">${r.amount.toLocaleString()}</td>

                          {/* Lock duration */}
                          <td className="py-3 pr-3 text-gray-400">{r.days}d</td>

                          {/* Tickets */}
                          <td className="py-3 pr-3 text-neon-purple font-bold">{r.tickets} 🎟️</td>

                          {/* Registered date */}
                          <td className="py-3 pr-3 text-gray-500 whitespace-nowrap">
                            {new Date(r.registeredAt).toLocaleDateString('en-IN')}
                          </td>

                          {/* Tx link */}
                          <td className="py-3 pr-3">
                            <a
                              href={`https://solscan.io/tx/${r.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-blue-400 underline"
                              title={r.txHash}
                            >
                              {r.txHash.slice(0, 8)}…
                            </a>
                          </td>

                          {/* Verify column */}
                          <td className="py-3">
                            {st === 'idle' && (
                              <button type="button"
                                onClick={() => verifyStake(r.txHash, r.wallet)}
                                className="text-xs btn-outline py-1 px-2 whitespace-nowrap">
                                🔍 Verify
                              </button>
                            )}
                            {st === 'checking' && (
                              <span className="text-yellow-400 text-xs">⏳ Checking…</span>
                            )}
                            {st === 'valid' && vd && (
                              <div className="space-y-0.5">
                                <p className="text-neon-green font-bold">
                                  ✅ {vd.fbitAmount.toLocaleString()} FBiT
                                </p>
                                <p className={`text-xs ${vd.walletMatches ? 'text-neon-green' : 'text-yellow-400'}`}>
                                  {vd.walletMatches ? '✓ Wallet match' : '⚠ Wallet mismatch'}
                                </p>
                              </div>
                            )}
                            {st === 'not_found' && (
                              <span className="text-gray-500 text-xs">❓ Tx not found</span>
                            )}
                            {st === 'invalid' && (
                              <div>
                                <p className="text-red-400 text-xs font-bold">❌ Invalid</p>
                                {vd?.reason && <p className="text-gray-600 text-xs">{vd.reason.slice(0, 30)}</p>}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Summary row */}
                <div className="mt-4 pt-4 border-t border-white/8 flex flex-wrap gap-6 text-sm">
                  <div>
                    <span className="text-gray-500">Total registered: </span>
                    <span className="text-white font-bold">{apiVaultRegs.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total reported stake: </span>
                    <span className="text-neon-green font-bold">
                      ${apiVaultRegs.reduce((s, r) => s + r.amount, 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total tickets issued: </span>
                    <span className="text-neon-purple font-bold">
                      {apiVaultRegs.reduce((s, r) => s + r.tickets, 0)} 🎟️
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Verified on-chain: </span>
                    <span className="text-neon-green font-bold">
                      {Object.values(verifyStatus).filter(s => s === 'valid').length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ COMPETITION ══ */}
      {activeTab === 'competition' && (
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Season',       value: compCfg.season,           color: 'text-white'       },
              { label: 'Prize Pool',   value: compCfg.totalPrize,        color: 'text-yellow-400'  },
              { label: 'Registered',  value: String(compRegs.length),   color: 'text-neon-green'  },
              { label: 'Min Volume',  value: `$${compCfg.minVolume}`,   color: 'text-neon-green'  },
            ].map(s => (
              <div key={s.label} className="stake-wallet-card text-center">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Trading Leaderboard */}
          <div className="stake-wallet-card">
            <h3 className="text-white font-bold mb-3">📊 Trading Leaderboard</h3>
            <div className="text-center py-10 text-gray-500">
              <div className="text-4xl mb-3">📊</div>
              <p className="text-sm font-medium text-gray-400">No trading data yet</p>
              <p className="text-xs mt-1">Integrate Birdeye or Helius API to show real-time trading volume rankings.</p>
            </div>
          </div>

          {/* Registrations */}
          <div className="stake-wallet-card overflow-x-auto">
            <h3 className="text-white font-bold mb-4">📋 Competition Registrations</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {['#', 'Wallet', 'Registered', 'Tx ID'].map(h => (
                    <th key={h} className="text-left text-gray-500 text-xs font-semibold pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compRegs.map((r, i) => (
                  <tr key={r.txId} className="border-b border-white/4">
                    <td className="py-3 pr-4 text-gray-500">{i + 1}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-gray-300">{r.wallet.slice(0,12)}...</td>
                    <td className="py-3 pr-4 text-gray-400 text-xs">{new Date(r.registeredAt).toLocaleDateString()}</td>
                    <td className="py-3 font-mono text-xs text-gray-500">{r.txId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Competition settings */}
          <div className="stake-wallet-card">
            <h3 className="text-white font-bold mb-4">⚙️ Competition Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">Season Name</label>
                <input type="text" title="Season Name" value={compCfg.season} onChange={e => setCompCfg(p => ({...p, season: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">Total Prize Pool</label>
                <input type="text" title="Total Prize Pool" value={compCfg.totalPrize} onChange={e => setCompCfg(p => ({...p, totalPrize: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">Start Date</label>
                <input type="date" title="Start Date" value={compCfg.startDate} onChange={e => setCompCfg(p => ({...p, startDate: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">End Date</label>
                <input type="date" title="End Date" value={compCfg.endDate} onChange={e => setCompCfg(p => ({...p, endDate: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">Minimum Volume ($)</label>
                <input type="number" title="Minimum Volume" value={compCfg.minVolume} onChange={e => setCompCfg(p => ({...p, minVolume: +e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
              </div>
            </div>
            <button type="button" onClick={() => handleSave('competition')} className="btn-primary text-sm">
              💾 Save Competition Settings
            </button>
            {savedMsg.includes('competition') && <span className="ml-3 text-neon-green text-sm">{savedMsg}</span>}
          </div>
        </div>
      )}

      {/* ══ LEADERBOARD ══ */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Current Week',  value: `Week ${lbCfg.currentWeek}`, color: 'text-white'       },
              { label: 'Weekly Prize',  value: lbCfg.weeklyPrize,           color: 'text-yellow-400'  },
              { label: '1st Place',     value: lbCfg.top1Prize,             color: 'rank-gold'        },
              { label: 'Participants',  value: String(LEADERBOARD_DATA.length), color: 'text-neon-green' },
            ].map(s => (
              <div key={s.label} className="stake-wallet-card text-center">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Leaderboard table */}
          <div className="stake-wallet-card overflow-x-auto">
            <h3 className="text-white font-bold mb-4">⚔️ Referral Leaderboard — Week {lbCfg.currentWeek}</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {['Rank', 'Name', 'Wallet', 'Referrals', 'Staked by Refs', 'Weekly Pts', 'Prize'].map(h => (
                    <th key={h} className="text-left text-gray-500 text-xs font-semibold pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD_DATA.map((e, i) => (
                  <tr key={e.rank} className="border-b border-white/4">
                    <td className="py-3 pr-4">{i < 3 ? ['🥇','🥈','🥉'][i] : <span className="text-gray-500">#{e.rank}</span>}</td>
                    <td className="py-3 pr-4 text-white font-medium">{e.name}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-gray-500">{e.wallet}</td>
                    <td className="py-3 pr-4 text-neon-green font-bold">{e.referrals}</td>
                    <td className="py-3 pr-4 text-gray-300">${e.stakedByRefs.toLocaleString()}</td>
                    <td className="py-3 pr-4 text-gray-300">{e.weeklyPoints.toLocaleString()}</td>
                    <td className="py-3 text-yellow-400 font-bold">{e.prize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Leaderboard settings */}
          <div className="stake-wallet-card">
            <h3 className="text-white font-bold mb-4">⚙️ Leaderboard Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">Current Week Number</label>
                <input type="number" title="Current Week Number" min={1} value={lbCfg.currentWeek} onChange={e => setLbCfg(p => ({...p, currentWeek: +e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">Total Weekly Prize</label>
                <input type="text" title="Total Weekly Prize" value={lbCfg.weeklyPrize} onChange={e => setLbCfg(p => ({...p, weeklyPrize: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">🥇 1st Place Prize</label>
                <input type="text" title="1st Place Prize" value={lbCfg.top1Prize} onChange={e => setLbCfg(p => ({...p, top1Prize: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">🥈 2nd Place Prize</label>
                <input type="text" title="2nd Place Prize" value={lbCfg.top2Prize} onChange={e => setLbCfg(p => ({...p, top2Prize: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">🥉 3rd Place Prize</label>
                <input type="text" title="3rd Place Prize" value={lbCfg.top3Prize} onChange={e => setLbCfg(p => ({...p, top3Prize: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">4th–10th Prize (each)</label>
                <input type="text" title="4th to 10th Prize" value={lbCfg.top4to10} onChange={e => setLbCfg(p => ({...p, top4to10: e.target.value}))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
              </div>
            </div>
            <button type="button" onClick={() => handleSave('leaderboard')} className="btn-primary text-sm">
              💾 Save Leaderboard Settings
            </button>
            {savedMsg.includes('leaderboard') && <span className="ml-3 text-neon-green text-sm">{savedMsg}</span>}
          </div>
        </div>
      )}

      {/* ══ DISTRIBUTION ══ */}
      {activeTab === 'distribute' && (
        <div className="space-y-5">

          {/* Step 1 — one-time setup notice */}
          <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm">
            <p className="text-yellow-300 font-semibold mb-1">⚙️ One-time setup</p>
            <p className="text-gray-400 text-xs">
              Add your distribution wallet secret key to <span className="font-mono text-white">.env.local</span>:
            </p>
            <code className="block bg-black/40 text-neon-green text-xs font-mono rounded-lg px-3 py-2 mt-2">
              ADMIN_WALLET_SECRET_KEY=[1,2,3,...,64]  {'  '}← JSON array from your wallet
            </code>
            <p className="text-gray-600 text-xs mt-2">Export from Phantom: Settings → Export Private Key → copy the byte array.</p>
          </div>

          {/* Wallet status */}
          <div className="stake-wallet-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">💳 Distribution Wallet</h2>
              <button type="button" onClick={checkWalletBalance} disabled={balanceLoading} className="btn-outline text-xs py-1.5 px-3">
                {balanceLoading ? '⏳ Checking…' : '🔄 Check Balance'}
              </button>
            </div>

            {walletPubkey ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-xs mb-1">Wallet Address</p>
                  <p className="font-mono text-white text-xs break-all">{walletPubkey}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">FBiT Balance</p>
                  <p className={`text-2xl font-extrabold ${(walletBalance ?? 0) > 0 ? 'text-neon-green' : 'text-red-400'}`}>
                    {walletBalance?.toLocaleString() ?? 0} FBiT
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Click <strong className="text-white">Check Balance</strong> to verify your wallet is configured.
              </p>
            )}
          </div>

          {/* Distribution summary */}
          <div className="stake-wallet-card">
            <h2 className="text-white font-bold text-lg mb-4">📊 Distribution Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
              {[
                { label: 'Qualified Wallets',  value: String(qualifiedRegs.length),                                              color: 'text-neon-green'  },
                { label: 'FBiT per Point',     value: String(airdropCfg.fbitPerPoint),                                          color: 'text-white'       },
                { label: 'Total FBiT Needed',  value: qualifiedRegs.reduce((s, r) => s + Math.floor(r.points * airdropCfg.fbitPerPoint), 0).toLocaleString(), color: 'text-yellow-400'  },
                { label: 'Min Qualify Points', value: String(airdropCfg.qualifyPoints),                                         color: 'text-gray-300'    },
              ].map(s => (
                <div key={s.label} className="bg-white/3 rounded-xl p-3 text-center border border-white/6">
                  <p className={`text-xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={previewDistribution} disabled={distributing}
                className="btn-outline text-sm py-2.5 px-5">
                👁 Preview Distribution
              </button>
              <button type="button" onClick={startDistribution} disabled={distributing || qualifiedRegs.length === 0}
                className="btn-primary text-sm py-2.5 px-5 disabled:opacity-50">
                {distributing ? '⏳ Distributing…' : '🚀 Send Tokens Now'}
              </button>
              <button type="button" onClick={exportCSV} className="btn-outline text-sm py-2.5 px-5">
                📥 Export CSV
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {distributing && (
            <div className="stake-wallet-card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-semibold text-sm">Sending tokens…</p>
                <p className="text-neon-green font-bold">{distProgress}%</p>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full">
                <div className="h-full bg-neon-green rounded-full transition-all duration-500" style={{ width: `${distProgress}%` }} />
              </div>
              <p className="text-gray-500 text-xs mt-2">{distResults.length} of {distTotal} wallets processed</p>
            </div>
          )}

          {/* Done banner */}
          {distDone && !distributing && (
            <div className="rounded-xl bg-neon-green/10 border border-neon-green/30 p-4">
              <p className="text-neon-green font-bold text-sm">
                ✅ Distribution complete — {distResults.filter(r => r.tx).length} successful,{' '}
                {distResults.filter(r => r.error).length} failed
              </p>
            </div>
          )}

          {/* Results table */}
          {distResults.length > 0 && (
            <div className="stake-wallet-card overflow-x-auto">
              <h3 className="text-white font-bold mb-3">📋 Transaction Results</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/8">
                    {['#', 'Wallet', 'FBiT Sent', 'Status', 'Tx'].map(h => (
                      <th key={h} className="text-left text-gray-500 font-semibold pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {distResults.map((r, i) => (
                    <tr key={i} className="border-b border-white/4">
                      <td className="py-2 pr-4 text-gray-500">{i + 1}</td>
                      <td className="py-2 pr-4 font-mono text-gray-300">{r.wallet.slice(0, 8)}…{r.wallet.slice(-4)}</td>
                      <td className="py-2 pr-4 text-neon-green font-bold">{r.fbit}</td>
                      <td className="py-2 pr-4">
                        {r.tx
                          ? <span className="text-neon-green">✅ Sent</span>
                          : <span className="text-red-400">❌ Failed</span>}
                      </td>
                      <td className="py-2">
                        {r.tx
                          ? <a href={`https://solscan.io/tx/${r.tx}`} target="_blank" rel="noopener noreferrer"
                              className="text-blue-400 underline font-mono">{r.tx.slice(0, 10)}…</a>
                          : <span className="text-gray-600 text-xs">{r.error?.slice(0, 40)}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Preview modal */}
          {showPreview && distPreview.length > 0 && (
            <div className="stake-wallet-card overflow-x-auto">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold">👁 Distribution Preview ({distTotal} wallets)</h3>
                <button type="button" onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-white text-sm">✕ Close</button>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/8">
                    {['#', 'Wallet', 'FBiT to Receive'].map(h => (
                      <th key={h} className="text-left text-gray-500 font-semibold pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {distPreview.slice(0, 50).map((p, i) => (
                    <tr key={i} className="border-b border-white/4">
                      <td className="py-1.5 pr-4 text-gray-500">{i + 1}</td>
                      <td className="py-1.5 pr-4 font-mono text-gray-300">{p.wallet.slice(0, 8)}…{p.wallet.slice(-4)}</td>
                      <td className="py-1.5 text-neon-green font-bold">{p.fbit} FBiT</td>
                    </tr>
                  ))}
                  {distPreview.length > 50 && (
                    <tr><td colSpan={3} className="py-2 text-gray-500 text-xs text-center">… and {distPreview.length - 50} more</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══ SETTINGS ══ */}
      {activeTab === 'settings' && (
        <div className="space-y-5">
          {/* Section switcher */}
          <div className="flex gap-2 flex-wrap">
            {([
              { id: 'airdrop',     label: '🎁 Airdrop'    },
              { id: 'vault',       label: '🎰 Lucky Vault' },
              { id: 'competition', label: '🏆 Competition' },
              { id: 'leaderboard', label: '⚔️ Leaderboard' },
              { id: 'apy',         label: '📈 APY'          },
            ] as { id: typeof settingsSection; label: string }[]).map(s => (
              <button key={s.id} type="button" onClick={() => setSettingsSection(s.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${settingsSection === s.id ? 'bg-neon-green/20 text-neon-green border border-neon-green/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'}`}>
                {s.label}
              </button>
            ))}
          </div>

          {savedMsg && <p className="text-neon-green text-sm font-bold">{savedMsg}</p>}

          {/* Airdrop settings */}
          {settingsSection === 'airdrop' && (
            <div className="stake-wallet-card space-y-4">
              <h2 className="text-white font-bold text-lg">🎁 Airdrop Settings</h2>
              <p className="text-gray-500 text-xs">Changes are saved to localStorage and reflected on the airdrop page after refresh.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Airdrop Title</label>
                  <input type="text" value={airdropCfg.title} onChange={e => setAirdropCfg(p => ({...p, title: e.target.value}))}
                    placeholder="FBiT Community Airdrop"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Live Badge Text</label>
                  <input type="text" value={airdropCfg.badgeText} onChange={e => setAirdropCfg(p => ({...p, badgeText: e.target.value}))}
                    placeholder="🎁 AIRDROP LIVE — 14 Days Remaining"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Sub-headline</label>
                  <input type="text" value={airdropCfg.subtitle} onChange={e => setAirdropCfg(p => ({...p, subtitle: e.target.value}))}
                    placeholder="For the first 5,000 members"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Total Prize Pool</label>
                  <input type="text" value={airdropCfg.totalPrize} onChange={e => setAirdropCfg(p => ({...p, totalPrize: e.target.value}))}
                    placeholder="$10,000 FBiT"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">End Date</label>
                  <input type="date" value={airdropCfg.endDate} onChange={e => setAirdropCfg(p => ({...p, endDate: e.target.value}))}
                    title="Airdrop end date"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Max Winners</label>
                  <input type="number" min={1} value={airdropCfg.maxWinners} onChange={e => setAirdropCfg(p => ({...p, maxWinners: +e.target.value || 1}))}
                    placeholder="5000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Minimum Qualify Points</label>
                  <input type="number" min={1} value={airdropCfg.qualifyPoints} onChange={e => setAirdropCfg(p => ({...p, qualifyPoints: +e.target.value || 1}))}
                    placeholder="70"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                  <p className="text-gray-600 text-xs mt-1">Current: {airdropCfg.qualifyPoints} pts to qualify</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-400 text-xs font-semibold mb-1">FBiT per Point (Allocation Rate)</label>
                  <div className="flex items-center gap-3">
                    <input type="number" min={0.001} step={0.001} value={airdropCfg.fbitPerPoint} onChange={e => setAirdropCfg(p => ({...p, fbitPerPoint: parseFloat(e.target.value) || 0.001}))}
                      placeholder="0.05"
                      className="w-40 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                    <span className="text-gray-400 text-sm">→ 100 pts = <strong className="text-neon-green">{(100 * airdropCfg.fbitPerPoint).toFixed(2)} FBiT</strong></span>
                  </div>
                </div>
              </div>
              {/* Allocation preview */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      {['Points', 'FBiT Earned', 'Status'].map(h => (
                        <th key={h} className="text-left text-gray-500 text-xs font-semibold pb-2 pr-6">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[50, airdropCfg.qualifyPoints, 100, 125, 150, 200]
                      .filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b)
                      .map(pts => (
                        <tr key={pts} className="border-b border-white/4">
                          <td className={`py-2 pr-6 font-bold ${pts < airdropCfg.qualifyPoints ? 'text-gray-500' : 'text-neon-green'}`}>{pts} pts</td>
                          <td className="py-2 pr-6 text-white font-bold">{Math.floor(pts * airdropCfg.fbitPerPoint)} FBiT</td>
                          <td className="py-2 text-xs">{pts < airdropCfg.qualifyPoints ? <span className="text-red-400">❌ Not qualified</span> : <span className="text-neon-green">✅ Eligible</span>}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => handleSave('airdrop')} className="btn-primary">💾 Save Settings</button>
                <button type="button" onClick={() => setAirdropCfg({ ...DEFAULT_ADMIN_CONFIG })} className="btn-outline text-sm px-4">↩ Reset</button>
              </div>
            </div>
          )}

          {/* APY settings */}
          {settingsSection === 'apy' && (
            <div className="stake-wallet-card space-y-4">
              <h2 className="text-white font-bold text-lg">📈 APY Override</h2>
              <p className="text-gray-500 text-xs">
                Live APY is read automatically from the Solana staking program. Set an override here to show a specific value across the site (Home page, Stake page, Footer, Promo banners). Leave blank to use the live on-chain value.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">APY Override (%) — leave blank for live value</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number" min={1} max={9999} step={1}
                      value={apyOverride}
                      onChange={e => setApyOverride(e.target.value)}
                      placeholder="e.g. 300"
                      className="w-40 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40"
                    />
                    <span className="text-gray-400 text-sm">
                      {apyOverride ? <span className="text-neon-green font-bold">{apyOverride}% APY shown</span> : <span className="text-gray-500">Live from Solana</span>}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs mt-1.5">
                    Check current APY on <a href="https://stake.futurebit.in" target="_blank" rel="noopener noreferrer" className="text-neon-green underline">stake.futurebit.in</a> and enter it here.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => handleSave('apy')} className="btn-primary">💾 Save APY</button>
                <button type="button" onClick={() => { setApyOverride(''); localStorage.removeItem(APY_OVERRIDE_KEY); setSavedMsg('✅ APY override cleared — using live value'); setTimeout(() => setSavedMsg(''), 2500); }} className="btn-outline text-sm px-4">↩ Clear Override</button>
              </div>
            </div>
          )}

          {/* Vault settings */}
          {settingsSection === 'vault' && (
            <div className="stake-wallet-card space-y-4">
              <h2 className="text-white font-bold text-lg">🎰 Lucky Vault Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Monthly Prize</label>
                  <input type="text" title="Monthly Prize" value={vaultCfg.monthlyPrize} onChange={e => setVaultCfg(p => ({...p, monthlyPrize: e.target.value}))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Draw Date</label>
                  <input type="date" title="Draw Date" value={vaultCfg.drawDate} onChange={e => setVaultCfg(p => ({...p, drawDate: e.target.value}))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Minimum Stake ($)</label>
                  <input type="number" title="Minimum Stake" value={vaultCfg.minStake} onChange={e => setVaultCfg(p => ({...p, minStake: +e.target.value}))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Max Tickets per Wallet</label>
                  <input type="number" title="Max Tickets per Wallet" value={vaultCfg.maxTickets} onChange={e => setVaultCfg(p => ({...p, maxTickets: +e.target.value}))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => handleSave('vault')} className="btn-primary">💾 Save Settings</button>
                <button type="button" onClick={() => setVaultCfg({ ...DEFAULT_VAULT_ADMIN_CONFIG })} className="btn-outline text-sm px-4">↩ Reset</button>
              </div>
            </div>
          )}

          {/* Competition settings */}
          {settingsSection === 'competition' && (
            <div className="stake-wallet-card space-y-4">
              <h2 className="text-white font-bold text-lg">🏆 Competition Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Season Name</label>
                  <input type="text" title="Season Name" value={compCfg.season} onChange={e => setCompCfg(p => ({...p, season: e.target.value}))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Total Prize Pool</label>
                  <input type="text" title="Total Prize Pool" value={compCfg.totalPrize} onChange={e => setCompCfg(p => ({...p, totalPrize: e.target.value}))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Start Date</label>
                  <input type="date" title="Start Date" value={compCfg.startDate} onChange={e => setCompCfg(p => ({...p, startDate: e.target.value}))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">End Date</label>
                  <input type="date" title="End Date" value={compCfg.endDate} onChange={e => setCompCfg(p => ({...p, endDate: e.target.value}))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Minimum Volume ($)</label>
                  <input type="number" title="Minimum Volume" value={compCfg.minVolume} onChange={e => setCompCfg(p => ({...p, minVolume: +e.target.value}))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => handleSave('competition')} className="btn-primary">💾 Save Settings</button>
                <button type="button" onClick={() => setCompCfg({ ...DEFAULT_COMP_ADMIN_CONFIG })} className="btn-outline text-sm px-4">↩ Reset</button>
              </div>
            </div>
          )}

          {/* Leaderboard settings */}
          {settingsSection === 'leaderboard' && (
            <div className="stake-wallet-card space-y-4">
              <h2 className="text-white font-bold text-lg">⚔️ Leaderboard Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Current Week Number</label>
                  <input type="number" title="Current Week Number" min={1} value={lbCfg.currentWeek} onChange={e => setLbCfg(p => ({...p, currentWeek: +e.target.value}))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">Total Weekly Prize</label>
                  <input type="text" title="Total Weekly Prize" value={lbCfg.weeklyPrize} onChange={e => setLbCfg(p => ({...p, weeklyPrize: e.target.value}))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">🥇 1st Prize</label>
                  <input type="text" title="1st Prize" value={lbCfg.top1Prize} onChange={e => setLbCfg(p => ({...p, top1Prize: e.target.value}))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">🥈 2nd Prize</label>
                  <input type="text" title="2nd Prize" value={lbCfg.top2Prize} onChange={e => setLbCfg(p => ({...p, top2Prize: e.target.value}))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">🥉 3rd Prize</label>
                  <input type="text" title="3rd Prize" value={lbCfg.top3Prize} onChange={e => setLbCfg(p => ({...p, top3Prize: e.target.value}))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">4th–10th Prize (each)</label>
                  <input type="text" title="4th to 10th Prize" value={lbCfg.top4to10} onChange={e => setLbCfg(p => ({...p, top4to10: e.target.value}))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => handleSave('leaderboard')} className="btn-primary">💾 Save Settings</button>
                <button type="button" onClick={() => setLbCfg({ ...DEFAULT_LB_ADMIN_CONFIG })} className="btn-outline text-sm px-4">↩ Reset</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ SOCIAL LINKS ══ */}
      {activeTab === 'social' && (
        <div className="space-y-5">
          <div className="stake-wallet-card">
            <h2 className="text-white font-bold text-lg mb-1">🔗 Social Media Links</h2>
            <p className="text-gray-500 text-xs mb-6">
              Yahan URL update karo — Footer mein automatically reflect ho jayega. Khali chhod do jo platform nahi hai.
            </p>

            <div className="space-y-4">
              {([
                { key: 'telegram',  label: 'Telegram',    icon: '✈️', placeholder: 'https://t.me/yourgroup'           },
                { key: 'twitter',   label: 'X (Twitter)', icon: '𝕏',  placeholder: 'https://twitter.com/yourhandle'   },
                { key: 'discord',   label: 'Discord',     icon: '💬', placeholder: 'https://discord.gg/yourserver'    },
                { key: 'instagram', label: 'Instagram',   icon: '📸', placeholder: 'https://instagram.com/yourhandle' },
                { key: 'youtube',   label: 'YouTube',     icon: '▶️', placeholder: 'https://youtube.com/@yourchannel' },
                { key: 'facebook',  label: 'Facebook',    icon: '👥', placeholder: 'https://facebook.com/yourpage'   },
              ] as { key: keyof SocialConfig; label: string; icon: string; placeholder: string }[]).map(s => (
                <div key={s.key} className="flex items-center gap-3">
                  <span className="text-xl w-7 text-center shrink-0">{s.icon}</span>
                  <div className="flex-1">
                    <label className="block text-gray-400 text-xs font-semibold mb-1">{s.label}</label>
                    <input
                      type="url"
                      value={socialCfg[s.key]}
                      onChange={e => setSocialCfg(p => ({ ...p, [s.key]: e.target.value }))}
                      placeholder={s.placeholder}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:border-neon-green/40 font-mono placeholder-gray-700"
                    />
                  </div>
                  {/* Live status indicator */}
                  <span className={`text-xs shrink-0 mt-4 ${socialCfg[s.key] ? 'text-neon-green' : 'text-gray-600'}`}>
                    {socialCfg[s.key] ? '✅' : '—'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => handleSave('social')} className="btn-primary">
                💾 Save Social Links
              </button>
              <button type="button"
                onClick={() => setSocialCfg({ ...DEFAULT_SOCIAL_CONFIG })}
                className="btn-outline text-sm px-4">
                ↩ Reset
              </button>
            </div>
            {savedMsg.includes('social') && <p className="text-neon-green text-sm mt-3">{savedMsg}</p>}
          </div>

          {/* Live preview */}
          <div className="stake-wallet-card">
            <h3 className="text-white font-bold mb-4">👁 Footer Preview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {([
                { key: 'telegram',  label: 'Telegram',    icon: '✈️' },
                { key: 'twitter',   label: 'X (Twitter)', icon: '𝕏'  },
                { key: 'discord',   label: 'Discord',     icon: '💬' },
                { key: 'instagram', label: 'Instagram',   icon: '📸' },
                { key: 'youtube',   label: 'YouTube',     icon: '▶️' },
                { key: 'facebook',  label: 'Facebook',    icon: '👥' },
              ] as { key: keyof SocialConfig; label: string; icon: string }[]).map(s => (
                <div key={s.key} className={`rounded-xl p-3 border text-sm flex items-center gap-2 ${socialCfg[s.key] ? 'border-neon-green/20 bg-neon-green/5' : 'border-white/5 bg-white/2 opacity-40'}`}>
                  <span>{s.icon}</span>
                  <div className="min-w-0">
                    <p className={`font-medium text-xs ${socialCfg[s.key] ? 'text-white' : 'text-gray-600'}`}>{s.label}</p>
                    {socialCfg[s.key] ? (
                      <a href={socialCfg[s.key]} target="_blank" rel="noopener noreferrer"
                        className="text-neon-green text-xs underline truncate block max-w-[140px]">
                        {socialCfg[s.key].replace('https://', '')}
                      </a>
                    ) : (
                      <p className="text-gray-600 text-xs">Not set</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-xs mt-4">⚠️ Save karne ke baad site refresh karo — Footer mein dikh jayega.</p>
          </div>
        </div>
      )}

      {/* ══ SETUP ══ */}
      {activeTab === 'setup' && (
        <div className="space-y-5">
          <div className="stake-wallet-card">
            <h2 className="text-white font-bold text-lg mb-4">⚙️ Real Backend Setup (Formspree)</h2>
            <ol className="space-y-4 text-sm">
              {[
                { n: '1', title: 'Create a FREE account on Formspree.io',        body: 'Go to formspree.io → "New Form" → name it "FBiT Airdrop" → Create form', code: null },
                { n: '2', title: 'Copy the form endpoint URL',                    body: 'Dashboard → "Integration" → copy your endpoint URL:', code: 'https://formspree.io/f/xpwzabcd  ← this one' },
                { n: '3', title: 'Set the environment variable',                  body: 'Add this to your .env.local file in the project root:', code: 'NEXT_PUBLIC_AIRDROP_WEBHOOK=https://formspree.io/f/YOUR_FORM_ID' },
                { n: '4', title: 'Change admin password (optional)',               body: 'In .env.local:', code: 'NEXT_PUBLIC_ADMIN_PASS=your-password-here' },
                { n: '5', title: 'Restart the site',                              body: 'Run npm run dev or redeploy. All registrations now go to Formspree.', code: null },
              ].map(step => (
                <li key={step.n} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-neon-green/15 border border-neon-green/30 text-neon-green text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{step.n}</span>
                  <div className="flex-1">
                    <p className="text-white font-medium">{step.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{step.body}</p>
                    {step.code && <code className="block bg-black/40 text-neon-green text-xs font-mono rounded-lg px-3 py-2 mt-2">{step.code}</code>}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="stake-wallet-card">
            <h3 className="text-white font-bold mb-3">📊 Alternative Backends</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              {[
                { name: 'Formspree',      free: '50 free/mo',  desc: 'Easiest — just paste the URL'               },
                { name: 'Google Sheets',  free: 'Unlimited',   desc: 'Google Sheets → sheet.best API'             },
                { name: 'Telegram Bot',   free: 'Unlimited',   desc: 'Registrations arrive in a Telegram channel' },
              ].map(b => (
                <div key={b.name} className="bg-white/3 rounded-xl p-4 border border-white/6">
                  <p className="text-white font-bold">{b.name}</p>
                  <p className="text-neon-green text-xs">{b.free}</p>
                  <p className="text-gray-400 text-xs mt-1">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ THREATS ══ */}
      {activeTab === 'threats' && (
        <div className="space-y-5">
          <div className="stake-wallet-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-white font-bold text-lg">🛡️ AI Threat Monitor</h2>
                <p className="text-gray-500 text-xs mt-1">Live IP reputation — Claude AI analyzes suspicious patterns automatically</p>
              </div>
              <button type="button" onClick={loadThreats} disabled={threatLoading}
                className="btn-outline text-xs py-1.5 px-3">
                {threatLoading ? '⏳ Loading...' : '🔄 Refresh'}
              </button>
            </div>

            {threats.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">✅</p>
                <p className="text-white font-bold">No Threats Detected</p>
                <p className="text-gray-500 text-sm mt-1">All IPs have clean reputation scores. Click Refresh to check live data.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      {['IP (masked)', 'Score', 'Status', 'Requests/min', 'Danger Level'].map(h => (
                        <th key={h} className="text-left text-gray-500 text-xs font-semibold pb-3 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {threats.map((t, i) => (
                      <tr key={i} className="border-b border-white/4">
                        <td className="py-2 pr-4 font-mono text-gray-300 text-xs">{t.ip}</td>
                        <td className="py-2 pr-4">
                          <span className={`font-bold ${t.score >= 100 ? 'text-red-400' : t.score >= 50 ? 'text-orange-400' : 'text-yellow-400'}`}>
                            {t.score}
                          </span>
                        </td>
                        <td className="py-2 pr-4">
                          {t.blocked
                            ? <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">🚫 BLOCKED</span>
                            : <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">⚠️ WATCHING</span>
                          }
                        </td>
                        <td className="py-2 pr-4 text-gray-400">{t.requests}</td>
                        <td className="py-2">
                          <div className="w-24 h-1.5 bg-white/10 rounded-full">
                            <div className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.min(100, t.score)}%`,
                                background: t.score >= 100 ? '#f87171' : t.score >= 50 ? '#fb923c' : '#facc15',
                              }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="stake-wallet-card">
            <h3 className="text-white font-bold mb-3">🤖 How AI Security Works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: '🔍', title: 'Bot Detection', desc: 'Checks User-Agent, headers, and request patterns. No browser fingerprint = suspicious.' },
                { icon: '📊', title: 'Reputation Score', desc: 'Each IP gets a score. Bad behavior adds points. Score ≥ 50 triggers Claude AI analysis.' },
                { icon: '🧠', title: 'Claude AI Decision', desc: 'Claude analyzes the threat pattern and decides: Block (1h/24h), Throttle (2s delay), or Allow.' },
              ].map(c => (
                <div key={c.title} className="bg-white/3 rounded-xl p-4 border border-white/6">
                  <span className="text-2xl mb-2 block">{c.icon}</span>
                  <p className="text-white font-bold text-sm mb-1">{c.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-neon-green/5 border border-neon-green/20 rounded-xl p-4 text-sm text-gray-400">
              <strong className="text-neon-green">Setup:</strong> Add <span className="font-mono text-white">ANTHROPIC_API_KEY=sk-ant-...</span> in <span className="font-mono text-white">.env.local</span> to enable Claude AI analysis.
              Without it, score-based blocking still works automatically.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
