import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { isAdminAuthed } from '@/lib/security';

export const runtime = 'nodejs';

const FBIT_MINT = 'CuubBzUTnQ4H2D2fHJCVWGEUEod2fJzq4nAPwfx8UGTu';

export async function GET(req: NextRequest) {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const txHash = searchParams.get('tx')?.trim();
  const wallet = searchParams.get('wallet')?.trim();

  if (!txHash || !wallet) {
    return NextResponse.json({ valid: false, reason: 'Missing tx or wallet parameter' }, { status: 400 });
  }

  const rpc  = process.env.SOLANA_RPC ?? 'https://api.mainnet-beta.solana.com';
  const conn = new Connection(rpc, 'confirmed');

  let tx;
  try {
    tx = await conn.getParsedTransaction(txHash, {
      maxSupportedTransactionVersion: 0,
      commitment: 'confirmed',
    });
  } catch (err) {
    return NextResponse.json({ valid: false, reason: `RPC error: ${String(err).slice(0, 80)}` });
  }

  if (!tx) {
    return NextResponse.json({ valid: false, reason: 'Transaction not found on Solana' });
  }

  // Check transaction success
  if (tx.meta?.err) {
    return NextResponse.json({ valid: false, reason: 'Transaction failed on-chain' });
  }

  // Identify all FBiT token transfers using pre/post token balances
  const pre  = tx.meta?.preTokenBalances  ?? [];
  const post = tx.meta?.postTokenBalances ?? [];

  let fbitAmount = 0;

  // Sum all FBiT increases (tokens received by any account)
  for (const p of post) {
    if (p.mint !== FBIT_MINT) continue;
    const prev   = pre.find(x => x.accountIndex === p.accountIndex);
    const before = prev ? Number(prev.uiTokenAmount.amount) : 0;
    const after  = Number(p.uiTokenAmount.amount);
    if (after > before) {
      fbitAmount += (after - before) / 1e6; // FBiT has 6 decimals
    }
  }

  // Check if the registered wallet appears as a signer or account in the tx
  const accounts = tx.transaction.message.accountKeys;
  let walletMatches = false;
  try {
    const walletPk = new PublicKey(wallet);
    walletMatches  = accounts.some(a => {
      const pk = typeof a.pubkey === 'string' ? a.pubkey : a.pubkey.toBase58();
      return pk === walletPk.toBase58();
    });
  } catch { /* invalid wallet public key */ }

  return NextResponse.json({
    valid:         true,
    fbitAmount,
    walletMatches,
    blockTime:     tx.blockTime ? new Date(tx.blockTime * 1000).toISOString() : null,
    slot:          tx.slot,
  });
}
