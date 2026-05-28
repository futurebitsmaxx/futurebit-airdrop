import { NextRequest, NextResponse } from 'next/server';
import { checkAdminPass, createSession, getIp, rateLimit } from '@/lib/security';
import { ddosCheck, penalizeIp } from '@/lib/ddos';

export async function POST(req: NextRequest) {
  // DDoS check
  const ddos = await ddosCheck(req, '/api/admin/login');
  if (ddos === 'block')        return NextResponse.json({ error: 'Blocked' }, { status: 403 });
  if (ddos === 'rate-limited') return NextResponse.json({ error: 'Slow down' }, { status: 429 });
  if (ddos === 'throttle')     await new Promise(r => setTimeout(r, 2000));

  const ip = getIp(req);
  // Max 5 login attempts per IP per 15 minutes
  if (!rateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000)) {
    penalizeIp(req, 20);
    return NextResponse.json({ error: 'Too many attempts. Wait 15 minutes.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    if (!checkAdminPass(body?.password)) {
      penalizeIp(req, 15); // wrong password = suspicious
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    const token = createSession(ip);
    const res   = NextResponse.json({ ok: true });
    res.cookies.set('fbit_admin', token, {
      httpOnly: true,
      sameSite: 'strict',
      path:     '/',
      maxAge:   8 * 60 * 60,
      secure:   process.env.NODE_ENV === 'production',
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
