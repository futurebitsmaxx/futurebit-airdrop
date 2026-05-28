// ─── Admin-editable config (saved to localStorage) ──────────────────────────
export interface AirdropAdminConfig {
  title:         string;   // page heading
  badgeText:     string;   // live badge
  subtitle:      string;   // sub-headline
  totalPrize:    string;   // e.g. "$10,000 FBiT"
  endDate:       string;   // YYYY-MM-DD
  maxWinners:    number;
  qualifyPoints: number;   // minimum pts to qualify
  fbitPerPoint:  number;   // allocation rate e.g. 0.05 → 100 pts = 5 FBiT
}

export const ADMIN_CFG_KEY = 'fbit-admin-cfg';

export const DEFAULT_ADMIN_CONFIG: AirdropAdminConfig = {
  title:         'FBiT Community Airdrop',
  badgeText:     '🎁 AIRDROP LIVE — 14 Days Remaining',
  subtitle:      'For the first 5,000 members',
  totalPrize:    '$10,000 FBiT',
  endDate:       '2026-06-08',
  maxWinners:    5000,
  qualifyPoints: 70,
  fbitPerPoint:  0.05,
};

export function loadAdminConfig(): AirdropAdminConfig {
  try {
    const raw = localStorage.getItem(ADMIN_CFG_KEY);
    if (!raw) return { ...DEFAULT_ADMIN_CONFIG };
    return { ...DEFAULT_ADMIN_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_ADMIN_CONFIG };
  }
}

export function saveAdminConfig(cfg: AirdropAdminConfig): void {
  try { localStorage.setItem(ADMIN_CFG_KEY, JSON.stringify(cfg)); } catch { /* ignore */ }
}

// ─── Lucky Vault admin config (saved to localStorage) ────────────────────────
export interface LuckyVaultAdminConfig {
  isOpen:       boolean;
  monthlyPrize: string;
  drawDate:     string;
  minStake:     number;
  maxTickets:   number;
}

export const VAULT_ADMIN_CFG_KEY = 'fbit-admin-vault';

export const DEFAULT_VAULT_ADMIN_CONFIG: LuckyVaultAdminConfig = {
  isOpen:       true,
  monthlyPrize: '$3,500 FBiT',
  drawDate:     '2026-06-30',
  minStake:     100,
  maxTickets:   10,
};

export function loadVaultAdminConfig(): LuckyVaultAdminConfig {
  try {
    const raw = localStorage.getItem(VAULT_ADMIN_CFG_KEY);
    return raw ? { ...DEFAULT_VAULT_ADMIN_CONFIG, ...JSON.parse(raw) } : { ...DEFAULT_VAULT_ADMIN_CONFIG };
  } catch {
    return { ...DEFAULT_VAULT_ADMIN_CONFIG };
  }
}

export function saveVaultAdminConfig(cfg: LuckyVaultAdminConfig): void {
  try { localStorage.setItem(VAULT_ADMIN_CFG_KEY, JSON.stringify(cfg)); } catch { /* ignore */ }
}

// ─── Lucky Vault registration shape ──────────────────────────────────────────
export interface VaultRegistration {
  wallet:       string;
  txHash:       string;   // Solana on-chain stake transaction signature
  amount:       number;   // USD value staked
  days:         number;   // lock duration chosen
  tickets:      number;   // calculated ticket count
  registeredAt: string;   // ISO timestamp
}

export const VAULT_REG_KEY = 'fbit-vault-reg';

export function saveVaultReg(reg: VaultRegistration): void {
  try { localStorage.setItem(VAULT_REG_KEY, JSON.stringify(reg)); } catch { /* ignore */ }
}

export function loadVaultReg(): VaultRegistration | null {
  try {
    const raw = localStorage.getItem(VAULT_REG_KEY);
    return raw ? (JSON.parse(raw) as VaultRegistration) : null;
  } catch { return null; }
}

export async function submitVaultReg(reg: VaultRegistration): Promise<{ ok: boolean; error?: string }> {
  saveVaultReg(reg);
  try {
    const res = await fetch('/api/vault-register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(reg),
    });
    if (res.ok) return { ok: true };
    const data = await res.json().catch(() => ({})) as { error?: string };
    return { ok: false, error: data.error ?? `Server error ${res.status}` };
  } catch {
    return { ok: false, error: 'Network error — please try again' };
  }
}

// ─── Airdrop Distribution Config ─────────────────────────────────────────────

export const AIRDROP_CONFIG = {
  qualifyPoints: 70,
  totalPrize:    '$10,000 FBiT',
  endDate:       '2026-06-08',
  maxWinners:    5000,

  // Webhook URL — set NEXT_PUBLIC_AIRDROP_WEBHOOK in .env.local
  // Option A: Formspree.io endpoint  (https://formspree.io/f/xpwzabcd)
  // Option B: Google Sheets Apps Script Web App URL
  // Option C: leave empty → registrations saved to localStorage only
  webhookUrl: process.env.NEXT_PUBLIC_AIRDROP_WEBHOOK ?? '',

  adminPassword: process.env.NEXT_PUBLIC_ADMIN_PASS ?? 'futurebit2025',
} as const;

// ── Registration entry shape ──────────────────────────────────────────────────
export interface AirdropRegistration {
  wallet:       string;
  points:       number;
  fbitBalance:  string;
  isStaker:     boolean;
  stakeCount:   number;
  totalStaked:  string;
  referralLink: string;
  registeredAt: string;   // ISO timestamp
  txId:         string;   // random ID for tracking
}

// ── LocalStorage key ──────────────────────────────────────────────────────────
export const REG_STORAGE_KEY = 'fbit-airdrop-reg';

// ── Save registration to localStorage ────────────────────────────────────────
export function saveRegistration(reg: AirdropRegistration): void {
  try {
    localStorage.setItem(REG_STORAGE_KEY, JSON.stringify(reg));
  } catch { /* ignore */ }
}

export function loadRegistration(): AirdropRegistration | null {
  try {
    const raw = localStorage.getItem(REG_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AirdropRegistration) : null;
  } catch {
    return null;
  }
}

// ── Submit registration — saves locally + sends to server API + optional webhook ──
export async function submitRegistration(reg: AirdropRegistration): Promise<boolean> {
  saveRegistration(reg);                          // always save locally first

  // Primary: POST to built-in Next.js API route (persists server-side)
  try {
    const res = await fetch('/api/register', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(reg),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({})) as { error?: string };
      console.warn('[airdrop] Server registration failed:', data.error ?? res.status);
    }
  } catch { /* server unavailable — local save is the fallback */ }

  // Secondary: external webhook (Formspree / Google Sheets) if configured
  const url = AIRDROP_CONFIG.webhookUrl;
  if (!url) return true;
  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body:    JSON.stringify(reg),
    });
    return res.ok;
  } catch { return true; }
}

// ── Generate a short random transaction ID ────────────────────────────────────
export function genTxId(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}
