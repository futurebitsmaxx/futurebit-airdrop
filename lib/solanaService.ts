// ─── Solana Staking Service ─────────────────────────────────────────────────
// Reads on-chain FBiT token and staking data. Write transactions redirect to
// stake.futurebit.in (which handles Anchor program interaction).

import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { SOLANA, buildOriginalReferralUrl } from './contractConfig';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SolanaTokenInfo {
  balance:  string;
  decimals: number;
  symbol:   string;
}

export interface SolanaWalletState {
  connected:   boolean;
  address:     string | null;
  balance:     string;
  tokenBalance: string;
}

// ─── Connection ───────────────────────────────────────────────────────────────

function getConnection() {
  return new Connection(SOLANA.rpcUrl, 'confirmed');
}

// ─── READ: SOL balance ────────────────────────────────────────────────────────

export async function fetchSolBalance(address: string): Promise<string> {
  try {
    const conn = getConnection();
    const pk   = new PublicKey(address);
    const lamports = await conn.getBalance(pk);
    return (lamports / LAMPORTS_PER_SOL).toFixed(4);
  } catch {
    return '0.0000';
  }
}

// ─── READ: FBiT SPL Token balance ────────────────────────────────────────────

export async function fetchFBiTBalance(walletAddress: string): Promise<string> {
  try {
    const conn      = getConnection();
    const walletPk  = new PublicKey(walletAddress);
    const mintPk    = new PublicKey(SOLANA.tokenMint);

    const accounts = await conn.getParsedTokenAccountsByOwner(walletPk, { mint: mintPk });
    if (!accounts.value.length) return '0.000000';

    const info = accounts.value[0].account.data.parsed.info;
    const bal  = info.tokenAmount.uiAmountString as string;
    return bal ?? '0.000000';
  } catch {
    return '0.000000';
  }
}

// ─── WALLET: Connect Phantom ──────────────────────────────────────────────────

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString(): string } }>;
      disconnect: () => Promise<void>;
      publicKey?: { toString(): string } | null;
    };
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      isMetaMask?: boolean;
    };
  }
}

export async function connectPhantom(): Promise<string> {
  if (!window.solana?.isPhantom) {
    throw new Error('Please install Phantom wallet: https://phantom.app');
  }
  const resp = await window.solana.connect();
  return resp.publicKey.toString();
}

export function disconnectPhantom() {
  window.solana?.disconnect();
}

export function getPhantomAddress(): string | null {
  return window.solana?.publicKey?.toString() ?? null;
}

// ─── Referral link for Solana (redirects to original site) ───────────────────

export function getSolanaStakeUrl(address: string) {
  return buildOriginalReferralUrl(address);
}

// ─── Validate Solana address ─────────────────────────────────────────────────

export function isValidSolanaAddress(addr: string): boolean {
  try {
    const pk = new PublicKey(addr);
    return PublicKey.isOnCurve(pk.toBytes());
  } catch {
    return false;
  }
}

// ─── Staking info shape ───────────────────────────────────────────────────────

export interface SolanaStakingInfo {
  isStaker:      boolean;   // has any staking accounts on-chain
  stakeCount:    number;    // number of individual stake positions
  totalStaked:   string;    // estimated total staked (FBiT, 6 decimals) — best-effort
  referralCount: number;    // parsed referral count if available
}

// ─── READ: Staking data from Solana program ───────────────────────────────────
// Uses getProgramAccounts with a memcmp filter on the wallet pubkey.
// Anchor stores the owner pubkey at byte offset 8 (after the 8-byte discriminator).

export async function fetchSolanaStakingInfo(walletAddress: string): Promise<SolanaStakingInfo> {
  const empty: SolanaStakingInfo = { isStaker: false, stakeCount: 0, totalStaked: '0', referralCount: 0 };
  try {
    const conn     = getConnection();
    const walletPk = new PublicKey(walletAddress);
    const programPk = new PublicKey(SOLANA.programId);

    // Find all program accounts where wallet pubkey appears at offset 8
    const accounts = await conn.getProgramAccounts(programPk, {
      encoding: 'base64',
      filters: [
        {
          memcmp: {
            offset: 8,                    // skip Anchor 8-byte discriminator
            bytes: walletPk.toBase58(),   // wallet pubkey in base58
          },
        },
      ],
    });

    if (!accounts.length) return empty;

    // Try to parse stake amounts from each account (best-effort without IDL).
    // Anchor serialises u64 as little-endian 8 bytes. Common layout after the
    // 8-byte discriminator + 32-byte pubkey is: amount (u64) at offset 40.
    let totalRaw = 0;
    for (const { account } of accounts) {
      try {
        const raw = Buffer.from(account.data as unknown as string, 'base64');
        if (raw.length >= 48) {
          // Read u64 little-endian at offset 40; use lo 32 bits (safe for amounts < 4B FBiT)
          const lo = raw.readUInt32LE(40);
          const hi = raw.readUInt32LE(44);
          totalRaw += lo + hi * 0x100000000;
        }
      } catch { /* skip unparseable account */ }
    }

    // Convert from 6-decimal FBiT units to human-readable
    const totalStaked = totalRaw > 0
      ? (totalRaw / 1_000_000).toFixed(2)
      : '0';

    return {
      isStaker:      true,
      stakeCount:    accounts.length,
      totalStaked,
      referralCount: 0,  // referral count needs IDL — show "view on site" instead
    };
  } catch {
    return empty;
  }
}
