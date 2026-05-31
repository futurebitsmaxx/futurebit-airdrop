import { NextRequest } from 'next/server';
import { readObject, writeObject } from '@/lib/github-storage';
import { isAdminAuthed, checkSize, rateLimit, getIp } from '@/lib/security';
import { ddosCheck } from '@/lib/ddos';

export const runtime = 'nodejs';

// ── Default site config ───────────────────────────────────────────────────────
export interface SiteConfig {
  totalPrize:     string;
  endDate:        string;
  maxWinners:     number;
  qualifyPoints:  number;
  fbitPerPoint:   number;
  badgeText:      string;
  subtitle:       string;
  vaultPrize:     string;
  vaultDrawDate:  string;
  compPrize:      string;
  updatedAt:      string;
}

const DEFAULTS: SiteConfig = {
  totalPrize:    '$10,000 FBiT',
  endDate:       '2026-06-08',
  maxWinners:    5000,
  qualifyPoints: 70,
  fbitPerPoint:  0.05,
  badgeText:     '🎁 AIRDROP LIVE',
  subtitle:      'For the first 5,000 members',
  vaultPrize:    '$3,500 FBiT',
  vaultDrawDate: '2026-06-30',
  compPrize:     '$5,000 FBiT',
  updatedAt:     new Date().toISOString(),
};

// Module-level cache with TTL — refreshes from GitHub every 60 seconds
// so all Vercel instances converge on the latest value quickly
let memCache: SiteConfig | null = null;
let cacheTs = 0;
const CACHE_TTL_MS = 60_000; // 60 seconds

function mergeDefaults(raw: Record<string, unknown>): SiteConfig {
  return { ...DEFAULTS, ...raw } as SiteConfig;
}

// ── GET — public, returns current config ─────────────────────────────────────
export async function GET() {
  const now = Date.now();
  // Serve from memory if fresh enough
  if (memCache && (now - cacheTs) < CACHE_TTL_MS) {
    return Response.json(memCache, {
      headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=30' },
    });
  }
  // Re-read from GitHub (or fallback to defaults)
  try {
    const raw = await readObject('site-config.json');
    memCache = mergeDefaults(raw);
  } catch {
    if (!memCache) memCache = { ...DEFAULTS };
  }
  cacheTs = now;
  return Response.json(memCache, {
    headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=30' },
  });
}

// ── Validate config input — prevent injection / oversized strings ─────────────
function validateConfig(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) return 'Invalid body';
  const b = body as Record<string, unknown>;
  const strFields = ['totalPrize','badgeText','subtitle','vaultPrize','vaultDrawDate','compPrize','endDate'] as const;
  for (const f of strFields) {
    if (b[f] !== undefined && (typeof b[f] !== 'string' || (b[f] as string).length > 200))
      return `Invalid field: ${f}`;
  }
  if (b.maxWinners !== undefined && (typeof b.maxWinners !== 'number' || b.maxWinners < 1 || b.maxWinners > 1_000_000))
    return 'Invalid maxWinners';
  if (b.qualifyPoints !== undefined && (typeof b.qualifyPoints !== 'number' || b.qualifyPoints < 0 || b.qualifyPoints > 10_000))
    return 'Invalid qualifyPoints';
  if (b.fbitPerPoint !== undefined && (typeof b.fbitPerPoint !== 'number' || b.fbitPerPoint < 0 || b.fbitPerPoint > 1_000))
    return 'Invalid fbitPerPoint';
  return null;
}

// ── POST — admin only, updates config ────────────────────────────────────────
export async function POST(req: NextRequest) {
  // DDoS protection
  const ddos = await ddosCheck(req, '/api/site-config');
  if (ddos === 'block')        return Response.json({ error: 'Blocked' }, { status: 403 });
  if (ddos === 'rate-limited') return Response.json({ error: 'Slow down' }, { status: 429 });
  if (ddos === 'throttle')     await new Promise(r => setTimeout(r, 2000));

  // Verify admin session (same HMAC cookie used by all admin routes)
  if (!isAdminAuthed(req)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rate limit: max 30 config saves per admin IP per hour
  const ip = getIp(req);
  if (!rateLimit(`site-config:${ip}`, 30, 60 * 60 * 1000)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  // Payload size guard
  if (!checkSize(req, 4_000)) {
    return Response.json({ error: 'Payload too large' }, { status: 413 });
  }

  let body: Partial<SiteConfig>;
  try {
    body = await req.json() as Partial<SiteConfig>;
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Validate input
  const err = validateConfig(body);
  if (err) return Response.json({ error: err }, { status: 400 });

  const newConfig: SiteConfig = {
    ...DEFAULTS,
    ...(memCache ?? {}),
    ...body,
    updatedAt: new Date().toISOString(),
  };

  // Update memory cache immediately
  memCache = newConfig;

  // Persist to GitHub (best-effort)
  try {
    await writeObject('site-config.json', newConfig as unknown as Record<string, unknown>);
  } catch { /* memory cache still serves updated values */ }

  return Response.json({ ok: true, config: newConfig });
}
