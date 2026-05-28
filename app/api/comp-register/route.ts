import { NextRequest, NextResponse } from 'next/server';
import { appendEntry } from '@/lib/github-storage';
import { rateLimit, getIp, checkSize, validateCompReg } from '@/lib/security';
import { ddosCheck, penalizeIp } from '@/lib/ddos';

export async function POST(req: NextRequest) {
  const ddos = await ddosCheck(req, '/api/comp-register');
  if (ddos === 'block')       return NextResponse.json({ error: 'Blocked' }, { status: 403 });
  if (ddos === 'rate-limited')return NextResponse.json({ error: 'Slow down' }, { status: 429 });
  if (ddos === 'throttle')    await new Promise(r => setTimeout(r, 2000));

  if (!checkSize(req)) {
    penalizeIp(req, 15);
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  const ip = getIp(req);
  if (!rateLimit(`comp-register:${ip}`, 3, 24 * 60 * 60 * 1000)) {
    penalizeIp(req, 10);
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const err  = validateCompReg(body);
    if (err) {
      penalizeIp(req, 5);
      return NextResponse.json({ error: err }, { status: 400 });
    }
    await appendEntry('comp-registrations.json', body, 'txId');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
