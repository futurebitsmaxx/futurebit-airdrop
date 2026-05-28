import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthed } from '@/lib/security';
import { getThreatSnapshot } from '@/lib/ddos';

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(getThreatSnapshot());
}
