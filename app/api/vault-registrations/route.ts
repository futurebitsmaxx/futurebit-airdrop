import { NextRequest, NextResponse } from 'next/server';
import { readAll } from '@/lib/github-storage';
import { isAdminAuthed } from '@/lib/security';

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    return NextResponse.json(await readAll('vault-registrations.json'));
  } catch (err) {
    console.error('[api/vault-registrations] readAll failed:', err);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
