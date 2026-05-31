// Security utilities: rate limiting, input validation, HMAC sessions, auth checks.

import { createHmac, timingSafeEqual } from 'crypto';
import type { NextRequest } from 'next/server';

// ── Environment — fail fast if critical secrets are missing in production ─────
const ADMIN_PASS     = process.env.ADMIN_PASS     ?? 'futurebit2025';
const SESSION_SECRET = process.env.SESSION_SECRET ?? 'change-this-secret-in-production';

if (process.env.NODE_ENV === 'production') {
  if (!process.env.ADMIN_PASS)     console.error('[security] WARNING: ADMIN_PASS env var not set — using default!');
  if (!process.env.SESSION_SECRET) console.error('[security] WARNING: SESSION_SECRET env var not set — using default!');
}

// ── Rate Limiter (in-memory, with GC to prevent memory leak) ─────────────────
const _store = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of _store) {
    if (now > entry.resetAt) _store.delete(key);
  }
}, 10 * 60 * 1000).unref(); // .unref() so it doesn't prevent process exit

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = _store.get(key);
  if (!entry || now > entry.resetAt) {
    _store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

// ── IP Extraction ─────────────────────────────────────────────────────────────
// Prefer Vercel's verified header over X-Forwarded-For (which can be spoofed)
export function getIp(req: NextRequest): string {
  // x-vercel-forwarded-for is set by Vercel's edge and cannot be spoofed by clients
  const vercelIp = req.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim();
  if (vercelIp && vercelIp !== 'unknown') return vercelIp;
  // Fallback for local dev
  return req.headers.get('x-real-ip') ?? 'unknown';
}

// ── HMAC Session Token (stateless — no DB needed) ────────────────────────────
// Format: base64url( "ip:timestamp:hmac" )  — expires in 8 hours

export function createSession(ip: string): string {
  const payload = `${ip}:${Date.now()}`;
  const sig = createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`, 'utf-8').toString('base64url');
}

export function verifySession(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return false;
  try {
    // Reject abnormally large tokens before decoding (prevent memory exhaustion)
    if (token.length > 512) return false;
    const decoded    = Buffer.from(token, 'base64url').toString('utf-8');
    const lastColon  = decoded.lastIndexOf(':');
    if (lastColon < 10) return false;
    const payload    = decoded.slice(0, lastColon);
    const sig        = decoded.slice(lastColon + 1);
    const expected   = createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
    // Timing-safe comparison — prevents timing attacks
    const aBuf = Buffer.from(sig,      'utf-8');
    const bBuf = Buffer.from(expected, 'utf-8');
    if (aBuf.length !== bBuf.length) return false;
    if (!timingSafeEqual(aBuf, bBuf)) return false;
    // Check expiry (8 hours)
    const parts = payload.split(':');
    const ts    = parseInt(parts[parts.length - 1], 10);
    return !isNaN(ts) && Date.now() - ts < 8 * 60 * 60 * 1000;
  } catch { return false; }
}

// ── Admin Password Check (timing-safe) ───────────────────────────────────────
export function checkAdminPass(password: unknown): boolean {
  if (typeof password !== 'string' || password.length === 0) return false;
  // If ADMIN_PASS is somehow empty, reject everything
  if (ADMIN_PASS.length === 0) return false;
  try {
    const a = Buffer.from(password,   'utf-8');
    const b = Buffer.from(ADMIN_PASS, 'utf-8');
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch { return false; }
}

// ── Cookie-Based Admin Auth Check ────────────────────────────────────────────
export function isAdminAuthed(req: NextRequest): boolean {
  return verifySession(req.cookies.get('fbit_admin')?.value);
}

// ── Request Size Guard ────────────────────────────────────────────────────────
export function checkSize(req: NextRequest, maxBytes = 8_000): boolean {
  const cl = req.headers.get('content-length');
  return !cl || parseInt(cl, 10) <= maxBytes;
}

// ── Input Validation ──────────────────────────────────────────────────────────
const SOLANA_ADDR  = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const TX_ID_RE     = /^[A-Z0-9]{1,20}$/;
const SOLANA_TX_RE = /^[1-9A-HJ-NP-Za-km-z]{80,100}$/; // base58-encoded 64-byte sig

export function validateAirdropReg(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) return 'Invalid request body';
  const b = body as Record<string, unknown>;
  if (!TX_ID_RE.test(String(b.txId ?? '')))                              return 'Invalid txId';
  if (!SOLANA_ADDR.test(String(b.wallet ?? '')))                         return 'Invalid wallet address';
  if (typeof b.points !== 'number' || b.points < 0 || b.points > 10_000) return 'Invalid points';
  if (typeof b.registeredAt !== 'string' || b.registeredAt.length > 30)  return 'Invalid timestamp';
  return null;
}

export function validateCompReg(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) return 'Invalid request body';
  const b = body as Record<string, unknown>;
  if (!TX_ID_RE.test(String(b.txId ?? '')))                             return 'Invalid txId';
  if (!SOLANA_ADDR.test(String(b.wallet ?? '')))                        return 'Invalid wallet address';
  if (typeof b.registeredAt !== 'string' || b.registeredAt.length > 30) return 'Invalid timestamp';
  return null;
}

export function validateVaultReg(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) return 'Invalid request body';
  const b = body as Record<string, unknown>;
  if (!SOLANA_ADDR.test(String(b.wallet ?? '')))                            return 'Invalid wallet address';
  if (!SOLANA_TX_RE.test(String(b.txHash ?? '')))                           return 'Invalid stake transaction hash';
  const amount = Number(b.amount);
  if (!Number.isFinite(amount) || amount < 0 || amount > 1_000_000)         return 'Invalid amount';
  if (![30, 60, 90].includes(Number(b.days)))                               return 'Invalid lock duration';
  if (typeof b.registeredAt !== 'string' || b.registeredAt.length > 30)     return 'Invalid timestamp';
  return null;
}
