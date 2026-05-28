// ─── Trading Competition Config ───────────────────────────────────────────────

export const COMP_CONFIG = {
  name:        'FBiT Trading Championship',
  season:      'Season 1',
  startDate:   '2026-06-01T00:00:00Z',
  endDate:     '2026-06-30T23:59:59Z',
  totalPrize:  '$5,000 FBiT',
  prizePool:   5000,            // USD equivalent
  minVolume:   100,             // minimum FBiT volume to qualify (USD)
  token:       'FBiT',
  tokenMint:   'CuubBzUTnQ4H2D2fHJCVWGEUEod2fJzq4nAPwfx8UGTu',
  jupiterUrl:  'https://jup.ag/swap/SOL-CuubBzUTnQ4H2D2fHJCVWGEUEod2fJzq4nAPwfx8UGTu',
  webhookUrl:  process.env.NEXT_PUBLIC_COMP_WEBHOOK ?? '',
} as const;

// ── Prize tiers ───────────────────────────────────────────────────────────────
export const PRIZE_TIERS = [
  { rank: '🥇 1st',       prize: '$1,500 FBiT', extra: '+ Exclusive NFT Badge'   },
  { rank: '🥈 2nd',       prize: '$1,000 FBiT', extra: '+ FBiT Staker Badge'      },
  { rank: '🥉 3rd',       prize: '$600 FBiT',   extra: '+ Premium Access'         },
  { rank: '4th–10th',    prize: '$150 FBiT',   extra: 'each'                     },
  { rank: '11th–50th',   prize: '$25 FBiT',    extra: 'each'                     },
  { rank: 'Lucky Draw',  prize: '$200 FBiT',   extra: '10 random qualified traders'},
] as const;

// ── Rules ─────────────────────────────────────────────────────────────────────
export const COMP_RULES = [
  { icon: '◎', rule: 'Only FBiT trading on Solana network counts' },
  { icon: '📊', rule: 'Metric: Total FBiT trading volume (buy + sell combined)' },
  { icon: '💵', rule: `Minimum $${COMP_CONFIG.minVolume} volume required to qualify` },
  { icon: '🔒', rule: 'One wallet = one participant (multi-wallet banned)' },
  { icon: '⏰', rule: 'Only trades during the competition period are counted' },
  { icon: '🤖', rule: 'Bot trading, wash trading — instant disqualification' },
] as const;

// ── Trader leaderboard — populated via Birdeye/Helius API or admin panel ──────
export interface TraderEntry {
  rank:        number;
  wallet:      string;
  displayName: string;
  volume:      number;   // USD
  trades:      number;
  pnlPct:      number;   // percentage
  prize:       string;
}

export const TRADER_LEADERBOARD: TraderEntry[] = [];

// ── Competition admin config (saved to localStorage) ─────────────────────────
export interface CompAdminConfig {
  season:     string;
  startDate:  string;
  endDate:    string;
  totalPrize: string;
  minVolume:  number;
}

export const COMP_ADMIN_CFG_KEY = 'fbit-admin-comp';

export const DEFAULT_COMP_ADMIN_CONFIG: CompAdminConfig = {
  season:     'Season 1',
  startDate:  '2026-06-01',
  endDate:    '2026-06-30',
  totalPrize: '$5,000 FBiT',
  minVolume:  100,
};

export function loadCompAdminConfig(): CompAdminConfig {
  try {
    const raw = localStorage.getItem(COMP_ADMIN_CFG_KEY);
    return raw ? { ...DEFAULT_COMP_ADMIN_CONFIG, ...JSON.parse(raw) } : { ...DEFAULT_COMP_ADMIN_CONFIG };
  } catch {
    return { ...DEFAULT_COMP_ADMIN_CONFIG };
  }
}

export function saveCompAdminConfig(cfg: CompAdminConfig): void {
  try { localStorage.setItem(COMP_ADMIN_CFG_KEY, JSON.stringify(cfg)); } catch { /* ignore */ }
}

// ── Competition registration shape ────────────────────────────────────────────
export interface CompRegistration {
  wallet:         string;
  registeredAt:   string;
  txId:           string;
}

export const COMP_REG_KEY = 'fbit-comp-reg';

export function saveCompReg(reg: CompRegistration): void {
  try { localStorage.setItem(COMP_REG_KEY, JSON.stringify(reg)); } catch { /* ignore */ }
}

export function loadCompReg(): CompRegistration | null {
  try {
    const raw = localStorage.getItem(COMP_REG_KEY);
    return raw ? (JSON.parse(raw) as CompRegistration) : null;
  } catch { return null; }
}

export function genCompTxId(): string {
  return 'C' + Math.random().toString(36).slice(2, 9).toUpperCase();
}

export async function submitCompReg(reg: CompRegistration): Promise<boolean> {
  saveCompReg(reg);

  // Primary: POST to built-in Next.js API route
  try {
    const res = await fetch('/api/comp-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reg),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({})) as { error?: string };
      console.warn('[competition] Server registration failed:', data.error ?? res.status);
    }
  } catch { /* server unavailable — local save is fallback */ }

  // Secondary: external webhook if configured
  const url = COMP_CONFIG.webhookUrl;
  if (!url) return true;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(reg),
    });
    return res.ok;
  } catch { return true; }
}
