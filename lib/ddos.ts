// DDoS Protection — sliding window rate limiter, IP reputation, bot detection, AI analysis.

import Anthropic from '@anthropic-ai/sdk';
import type { NextRequest } from 'next/server';

// ── Types ─────────────────────────────────────────────────────────────────────
interface IpRecord {
  timestamps:   number[];
  score:        number;
  blockedUntil: number;
  endpoints:    string[];
  aiChecked:    boolean;
  lastSeen:     number;
}

// ── In-memory store ───────────────────────────────────────────────────────────
const ipStore = new Map<string, IpRecord>();

const BLOCK_THRESHOLD   = 50;
const PERM_BLOCK_THRESH = 100;
const MAX_SCORE         = 200;   // cap — prevents integer overflow
const BLOCK_DURATION_MS = 60 * 60 * 1000;
const WINDOW_MS         = 60 * 1000;
const MAX_PER_WINDOW    = 60;
const GC_INTERVAL_MS    = 15 * 60 * 1000;  // clean stale IPs every 15 min
const STALE_AFTER_MS    = 2 * 60 * 60 * 1000; // remove IPs unseen for 2h

// Garbage collect stale IP records to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of ipStore) {
    const isStale    = now - rec.lastSeen > STALE_AFTER_MS;
    const isUnblocked = rec.blockedUntil <= now;
    const isClean    = rec.score === 0;
    if (isStale && isUnblocked && isClean) ipStore.delete(ip);
  }
}, GC_INTERVAL_MS).unref();

// ── Known bad User-Agent signatures ──────────────────────────────────────────
const BOT_UA = [
  'curl/', 'wget/', 'python-requests', 'go-http-client', 'java/', 'libwww',
  'masscan', 'nikto', 'nmap', 'sqlmap', 'dirbuster', 'zgrab', 'nuclei',
  'httpclient', 'okhttp', 'axios/', 'node-fetch', 'got/',
];

// ── Anthropic client (lazy) ───────────────────────────────────────────────────
let _ai: Anthropic | null = null;
function getAI(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!_ai) _ai = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _ai;
}

// ── Get or create IP record ───────────────────────────────────────────────────
function getRecord(ip: string): IpRecord {
  if (!ipStore.has(ip)) {
    ipStore.set(ip, {
      timestamps: [], score: 0, blockedUntil: 0,
      endpoints: [], aiChecked: false, lastSeen: Date.now(),
    });
  }
  return ipStore.get(ip)!;
}

// ── Bot detection ─────────────────────────────────────────────────────────────
function botScore(req: NextRequest): number {
  let s = 0;
  const ua = req.headers.get('user-agent') ?? '';
  if (!ua)                                                      s += 25;
  else if (BOT_UA.some(b => ua.toLowerCase().includes(b)))      s += 20;
  if (!req.headers.get('accept-language'))                      s += 10;
  if (!req.headers.get('accept'))                               s += 5;
  return s;
}

// ── Sliding window check ──────────────────────────────────────────────────────
function slidingCheck(record: IpRecord, max: number, windowMs: number): boolean {
  const now = Date.now();
  record.timestamps = record.timestamps.filter(t => now - t < windowMs);
  if (record.timestamps.length >= max) return false;
  record.timestamps.push(now);
  return true;
}

// ── Claude AI threat analysis ─────────────────────────────────────────────────
async function analyzeWithAI(ip: string, record: IpRecord, endpoint: string): Promise<'block' | 'throttle' | 'allow'> {
  const ai = getAI();
  if (!ai) return record.score >= PERM_BLOCK_THRESH ? 'block' : 'throttle';

  try {
    const msg = await ai.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 60,
      system:     'You are a security AI for a DeFi platform. Analyze request patterns and decide action. Reply ONLY with valid JSON: {"action":"block"|"throttle"|"allow","reason":"short reason"}',
      messages: [{
        role: 'user',
        content: JSON.stringify({
          ip_masked:          ip.replace(/\.\d+$/, '.xxx').replace(/:[^:]+$/, ':xxx'),
          reputation_score:   record.score,
          requests_in_window: record.timestamps.length,
          recent_endpoints:   record.endpoints.slice(-5),
          current_endpoint:   endpoint,
        }),
      }],
    });

    const text = msg.content[0].type === 'text' ? msg.content[0].text.trim() : '';
    // Extract JSON from response (Claude might add extra text)
    const match = text.match(/\{[^}]+\}/);
    if (match) {
      const parsed = JSON.parse(match[0]) as { action?: string };
      if (parsed.action === 'block' || parsed.action === 'throttle' || parsed.action === 'allow') {
        return parsed.action;
      }
    }
  } catch { /* AI unavailable — fall back to score */ }

  return record.score >= PERM_BLOCK_THRESH ? 'block' : 'throttle';
}

// ── Main DDoS check ───────────────────────────────────────────────────────────
export type DDoSResult = 'ok' | 'block' | 'throttle' | 'rate-limited';

export async function ddosCheck(req: NextRequest, endpoint: string): Promise<DDoSResult> {
  // Use Vercel's verified IP (cannot be spoofed by clients)
  const ip = (
    req.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );

  // Skip penalization for truly unknown IPs (would accumulate under single key)
  if (ip === 'unknown') return 'ok';

  const record = getRecord(ip);
  record.lastSeen = Date.now();

  // Track endpoint history (last 20)
  record.endpoints.push(endpoint);
  if (record.endpoints.length > 20) record.endpoints.shift();

  // 1. Currently blocked?
  if (record.blockedUntil > Date.now()) return 'block';

  // 2. Bot detection
  const bs = botScore(req);
  if (bs > 0) record.score = Math.min(MAX_SCORE, record.score + bs);

  // 3. Sliding window — 60 req/min
  if (!slidingCheck(record, MAX_PER_WINDOW, WINDOW_MS)) {
    record.score = Math.min(MAX_SCORE, record.score + 10);
    return 'rate-limited';
  }

  // 4. AI analysis when score first crosses threshold
  if (record.score >= BLOCK_THRESHOLD && !record.aiChecked) {
    record.aiChecked = true;
    const action = await analyzeWithAI(ip, record, endpoint);

    if (action === 'block') {
      record.blockedUntil = Date.now() + (
        record.score >= PERM_BLOCK_THRESH ? 24 * 60 * 60 * 1000 : BLOCK_DURATION_MS
      );
      return 'block';
    }
    if (action === 'throttle') return 'throttle';
    // AI said allow — reduce score (false positive)
    record.score = Math.max(0, record.score - 20);
  }

  // 5. Hard block at permanent threshold
  if (record.score >= PERM_BLOCK_THRESH) {
    record.blockedUntil = Date.now() + 24 * 60 * 60 * 1000;
    return 'block';
  }

  return 'ok';
}

// ── Penalize IP for bad behavior ──────────────────────────────────────────────
export function penalizeIp(req: NextRequest, points: number): void {
  const ip = req.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim()
           ?? req.headers.get('x-real-ip')
           ?? 'unknown';
  if (ip === 'unknown') return; // don't penalize shared 'unknown' key

  const record = getRecord(ip);
  record.score = Math.min(MAX_SCORE, record.score + points);

  // Allow re-analysis if score climbs above threshold again
  if (record.score >= BLOCK_THRESHOLD) record.aiChecked = false;
}

// ── Admin threat snapshot ─────────────────────────────────────────────────────
export function getThreatSnapshot(): Array<{ ip: string; score: number; blocked: boolean; requests: number }> {
  const now = Date.now();
  return Array.from(ipStore.entries())
    .filter(([, r]) => r.score > 0 || r.blockedUntil > now)
    .map(([ip, r]) => ({
      ip:       ip.replace(/\.\d+$/, '.xxx').replace(/:[^:]+$/, ':xxx'),
      score:    r.score,
      blocked:  r.blockedUntil > now,
      requests: r.timestamps.length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 50);
}
