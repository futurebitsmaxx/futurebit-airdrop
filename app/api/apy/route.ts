import { JsonRpcProvider, Contract } from 'ethers';
import { POLYGON, STAKING_PARAMS } from '@/lib/contractConfig';

export const runtime = 'nodejs';

let cache: { apy: number; ts: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return Response.json({ apy: cache.apy, source: 'cache' });
  }
  try {
    const provider = new JsonRpcProvider(POLYGON.rpcUrl);
    const contract = new Contract(
      POLYGON.stakingContract,
      ['function getEffectiveAPY() view returns (uint256)'],
      provider,
    );
    const raw = await contract.getEffectiveAPY() as bigint;
    // Contract may return bps (30000 = 300%) or direct (300 = 300%)
    const apy = Number(raw) > 1000 ? Number(raw) / 100 : Number(raw);
    const clamped = Math.max(STAKING_PARAMS.baseApyMin, Math.min(apy, 9999));
    cache = { apy: clamped, ts: Date.now() };
    return Response.json({ apy: clamped, source: 'contract' });
  } catch {
    try {
      const fallbackProvider = new JsonRpcProvider(POLYGON.fallbackRpc);
      const contract = new Contract(
        POLYGON.stakingContract,
        ['function getEffectiveAPY() view returns (uint256)'],
        fallbackProvider,
      );
      const raw = await contract.getEffectiveAPY() as bigint;
      const apy = Number(raw) > 1000 ? Number(raw) / 100 : Number(raw);
      const clamped = Math.max(STAKING_PARAMS.baseApyMin, Math.min(apy, 9999));
      cache = { apy: clamped, ts: Date.now() };
      return Response.json({ apy: clamped, source: 'fallback-rpc' });
    } catch {
      return Response.json({ apy: STAKING_PARAMS.baseApyMax, source: 'fallback' });
    }
  }
}
