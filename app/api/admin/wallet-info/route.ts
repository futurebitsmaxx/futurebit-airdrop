import { NextRequest, NextResponse } from 'next/server';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { getAccount, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { isAdminAuthed } from '@/lib/security';

export const runtime = 'nodejs';

const FBIT_MINT = 'CuubBzUTnQ4H2D2fHJCVWGEUEod2fJzq4nAPwfx8UGTu';
const DECIMALS  = 6;

function parseKeypair(): Keypair | null {
  const raw = process.env.ADMIN_WALLET_SECRET_KEY;
  if (!raw) return null;
  try { return Keypair.fromSecretKey(Uint8Array.from(JSON.parse(raw))); } catch { /* try next */ }
  return null;
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const kp = parseKeypair();
  if (!kp) {
    return NextResponse.json({
      configured: false,
      message: 'ADMIN_WALLET_SECRET_KEY not set in .env.local',
    });
  }

  const pubkey = kp.publicKey.toBase58();
  try {
    const rpc  = process.env.SOLANA_RPC ?? 'https://api.mainnet-beta.solana.com';
    const conn = new Connection(rpc, 'confirmed');
    const ata  = getAssociatedTokenAddressSync(new PublicKey(FBIT_MINT), kp.publicKey);
    const acct = await getAccount(conn, ata);
    const balance = Number(acct.amount) / Math.pow(10, DECIMALS);
    return NextResponse.json({ configured: true, pubkey, balance });
  } catch {
    return NextResponse.json({ configured: true, pubkey, balance: 0 });
  }
}
