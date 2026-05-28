import { NextRequest, NextResponse } from 'next/server';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';
import { isAdminAuthed } from '@/lib/security';
import { readAll } from '@/lib/github-storage';

export const runtime  = 'nodejs';
export const maxDuration = 300; // up to 5 min (Vercel Pro / self-hosted)

const FBIT_MINT = 'CuubBzUTnQ4H2D2fHJCVWGEUEod2fJzq4nAPwfx8UGTu';
const DECIMALS  = 6;

interface DistReq {
  fbitPerPoint:  number;
  qualifyPoints: number;
  offset?:       number;
  batchSize?:    number;
  dryRun?:       boolean;
}

interface RegEntry {
  wallet: string;
  points: number;
  txId:   string;
}

function parseKeypair(): Keypair | null {
  const raw = process.env.ADMIN_WALLET_SECRET_KEY;
  if (!raw) return null;
  try { return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(raw))); } catch { return null; }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const kp = parseKeypair();
  if (!kp) {
    return NextResponse.json(
      { error: 'ADMIN_WALLET_SECRET_KEY not configured in .env.local' },
      { status: 500 },
    );
  }

  const body = await req.json() as DistReq;
  const { fbitPerPoint, qualifyPoints, offset = 0, batchSize = 15, dryRun = false } = body;

  if (!Number.isFinite(fbitPerPoint) || fbitPerPoint <= 0) {
    return NextResponse.json({ error: 'Invalid fbitPerPoint' }, { status: 400 });
  }

  // Load all registrations from GitHub
  const allRegs = (await readAll('registrations.json')) as RegEntry[];
  const qualified = allRegs.filter(r => r.points >= qualifyPoints);
  const batch = qualified.slice(offset, offset + batchSize);
  const total = qualified.length;

  if (dryRun) {
    const preview = qualified.map(r => ({
      wallet: r.wallet,
      fbit:   Math.floor(r.points * fbitPerPoint),
    }));
    return NextResponse.json({ dryRun: true, preview, total });
  }

  const rpc  = process.env.SOLANA_RPC ?? 'https://api.mainnet-beta.solana.com';
  const conn = new Connection(rpc, 'confirmed');
  const mint = new PublicKey(FBIT_MINT);

  // Get (or create) admin source token account once
  let srcATA;
  try {
    srcATA = await getOrCreateAssociatedTokenAccount(conn, kp, mint, kp.publicKey);
  } catch (err) {
    return NextResponse.json({ error: `Cannot open admin token account: ${String(err)}` }, { status: 500 });
  }

  const results: { wallet: string; fbit: number; tx?: string; error?: string }[] = [];

  for (const reg of batch) {
    const fbit    = Math.floor(reg.points * fbitPerPoint);
    const amount  = BigInt(fbit) * BigInt(Math.pow(10, DECIMALS));
    try {
      const dest    = new PublicKey(reg.wallet);
      const destATA = await getOrCreateAssociatedTokenAccount(conn, kp, mint, dest);
      const tx      = await transfer(conn, kp, srcATA.address, destATA.address, kp, amount);
      results.push({ wallet: reg.wallet, fbit, tx });
    } catch (err) {
      results.push({ wallet: reg.wallet, fbit, error: String(err).slice(0, 120) });
    }
    // Brief pause to avoid rate-limiting the RPC
    await new Promise(r => setTimeout(r, 400));
  }

  const nextOffset = offset + batchSize;
  return NextResponse.json({
    results,
    total,
    offset,
    nextOffset,
    done: nextOffset >= total,
  });
}
