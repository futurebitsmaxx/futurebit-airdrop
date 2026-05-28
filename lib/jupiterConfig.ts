// ─── FBiT Token Config ───────────────────────────────────────────────────────
export const FBIT_MINT = 'CuubBzUTnQ4H2D2fHJCVWGEUEod2fJzq4nAPwfx8UGTu';

// Well-known Solana token mints
export const SOL_MINT  = 'So11111111111111111111111111111111111111112';
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const USDT_MINT = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';

// Jupiter links
export const JUPITER_SWAP_URL   = `https://jup.ag/swap/SOL-${FBIT_MINT}`;
export const JUPITER_TOKEN_URL  = `https://jup.ag/tokens/${FBIT_MINT}`;
export const JUPITER_WATCHLIST  = `https://jup.ag/portfolio?token=${FBIT_MINT}`;

// RPC endpoint (use your own Helius/Triton key in production)
export const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

export const TOKEN_INFO = {
  symbol:   'FBiT',
  name:     'FutureBit Token',
  mint:     FBIT_MINT,
  decimals: 6,
};

// Jupiter Price API v2 — live price with buy/sell quotes
export const JUPITER_PRICE_API =
  `https://api.jup.ag/price/v2?ids=${FBIT_MINT}&showExtraInfo=true`;
