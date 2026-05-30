import { Connection, PublicKey } from '@solana/web3.js';
import { SOLANA, STAKING_PARAMS } from '@/lib/contractConfig';

export const runtime = 'nodejs';

let cache: { apy: number; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000;

// Common Anchor PDA seeds for global/config state accounts
const GLOBAL_SEEDS = [
  [Buffer.from('state')],
  [Buffer.from('global')],
  [Buffer.from('config')],
  [Buffer.from('staking')],
  [Buffer.from('global_state')],
];

async function readSolanaAPY(rpcUrl: string): Promise<number | null> {
  const conn = new Connection(rpcUrl, 'confirmed');
  const programId = new PublicKey(SOLANA.programId);

  for (const seeds of GLOBAL_SEEDS) {
    try {
      const [pda] = PublicKey.findProgramAddressSync(seeds, programId);
      const info  = await conn.getAccountInfo(pda);
      if (!info || info.data.length < 16) continue;

      const data = info.data;
      // Skip 8-byte Anchor discriminator, then scan for a plausible APY u64
      for (let off = 8; off <= Math.min(120, data.length - 8); off += 8) {
        const lo  = data.readUInt32LE(off);
        const hi  = data.readUInt32LE(off + 4);
        if (hi !== 0) continue; // APY fits in u32 easily
        // Basis-point format: 30000 → 300%
        if (lo >= 1000 && lo <= 100000) {
          const apy = lo / 100;
          if (apy >= STAKING_PARAMS.baseApyMin && apy <= 9999) return apy;
        }
        // Direct percent: 300 → 300%
        if (lo >= STAKING_PARAMS.baseApyMin && lo <= 9999) return lo;
      }
    } catch {
      // This PDA doesn't exist or read failed — try next seed
    }
  }
  return null;
}

export async function GET() {
  // Check env-var admin override (set in Vercel dashboard as APY_VALUE)
  const envOverride = process.env.APY_VALUE ? Number(process.env.APY_VALUE) : null;
  if (envOverride && envOverride >= 1 && envOverride <= 9999) {
    return Response.json({ apy: envOverride, source: 'env' });
  }

  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return Response.json({ apy: cache.apy, source: 'cache' });
  }

  // Try primary Solana RPC
  let apy = await readSolanaAPY(SOLANA.rpcUrl);

  // Try fallback RPC
  if (apy === null) {
    apy = await readSolanaAPY(SOLANA.fallbackRpc);
  }

  // Use default if Solana read failed
  const result = apy ?? STAKING_PARAMS.baseApyMax;
  cache = { apy: result, ts: Date.now() };

  return Response.json({
    apy:    result,
    source: apy !== null ? 'solana' : 'fallback',
  });
}
