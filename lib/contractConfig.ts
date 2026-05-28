// ─── Real FutureBit Smart Contract Configuration ────────────────────────────
// Source: stake.futurebit.in (mainnet deployed)

// ── POLYGON MAINNET ──────────────────────────────────────────────────────────
export const POLYGON = {
  chainId:     137,
  chainName:   'Polygon Mainnet',
  rpcUrl:      'https://polygon-bor-rpc.publicnode.com',
  fallbackRpc: 'https://polygon-rpc.com',
  explorer:    'https://polygonscan.com',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },

  // Token
  tokenAddress:    '0xa31b5A95268CAd709e6691Ec2F2F107A3F36D945',  // WFBIT
  tokenSymbol:     'WFBIT',
  tokenDecimals:   6,
  tokenName:       'Wrapped FutureBit Token',

  // Staking contract
  stakingContract: '0xb86DA67406DaD482428704c14AdA269E9653FDca',

  // Admin
  adminAddress:    '0xdA07c812CE11620FDFaacF9ded9c96F62884eD1e',
} as const;

// ── SOLANA MAINNET ────────────────────────────────────────────────────────────
export const SOLANA = {
  rpcUrl:        'https://mainnet.helius-rpc.com/?api-key=2fca8858-977e-4caa-8eb8-c5f042a91002',
  fallbackRpc:   'https://api.mainnet-beta.solana.com',
  explorer:      'https://explorer.solana.com',

  // Token
  tokenMint:     'CuubBzUTnQ4H2D2fHJCVWGEUEod2fJzq4nAPwfx8UGTu',  // FBiT
  tokenSymbol:   'FBiT',
  tokenDecimals: 6,
  tokenName:     'FutureBit Token',

  // Program & Vaults
  programId:     '8AYv6AAqYxHzLxARsFRsqGSbhDuEmbnsGoLExpdcP4pp',
  stakeVault:    '851yeewTXCDVRW1CGNCQk9KJCavTj1mZMfTEJcjACAzH',

  // Admin
  adminAddress:  'HuaC6DyPcYxJvxeyMtr7YJHz1jTz2s3vSfZBh6AdG8Rp',
} as const;

// ── STAKING PARAMS (same for both chains) ────────────────────────────────────
export const STAKING_PARAMS = {
  lockPeriodDays:    30,
  claimIntervalSec:  21600,   // 6 hours
  minStakeAmount:    1,
  maxStakePerUser:   500_000_000,
  baseApyMin:        10,
  baseApyMax:        300,
} as const;

// ── 10-LEVEL REFERRAL COMMISSIONS ────────────────────────────────────────────
export const REFERRAL_LEVELS = [
  { level: 1,  bps:   25, pct: '0.25%' },
  { level: 2,  bps:   50, pct: '0.50%' },
  { level: 3,  bps:  125, pct: '1.25%' },
  { level: 4,  bps:  150, pct: '1.50%' },
  { level: 5,  bps:  200, pct: '2.00%' },
  { level: 6,  bps:  325, pct: '3.25%' },
  { level: 7,  bps:  350, pct: '3.50%' },
  { level: 8,  bps:  425, pct: '4.25%' },
  { level: 9,  bps:  550, pct: '5.50%' },
  { level: 10, bps:  800, pct: '8.00%' },
] as const;

// ── TEAM TARGET BONUS TIERS ──────────────────────────────────────────────────
export const TEAM_TIERS = [
  { tier: 1,  name: 'Bronze',   minTeamStaked: 250_000,       bonusBps:   200, bonusPct: '+2% APY',   icon: '🥉', color: '#cd7f32' },
  { tier: 2,  name: 'Silver',   minTeamStaked: 350_000,       bonusBps:   300, bonusPct: '+3% APY',   icon: '🥈', color: '#c0c0c0' },
  { tier: 3,  name: 'Gold',     minTeamStaked: 500_000,       bonusBps:   400, bonusPct: '+4% APY',   icon: '🥇', color: '#ffd700' },
  { tier: 4,  name: 'Platinum', minTeamStaked: 1_000_000,     bonusBps:   500, bonusPct: '+5% APY',   icon: '💠', color: '#e5e4e2' },
  { tier: 5,  name: 'Diamond',  minTeamStaked: 5_000_000,     bonusBps:   600, bonusPct: '+6% APY',   icon: '💎', color: '#b9f2ff' },
  { tier: 6,  name: 'Ruby',     minTeamStaked: 10_000_000,    bonusBps:   700, bonusPct: '+7% APY',   icon: '🔴', color: '#e0115f' },
  { tier: 7,  name: 'Emerald',  minTeamStaked: 50_000_000,    bonusBps:   750, bonusPct: '+7.5% APY', icon: '💚', color: '#50c878' },
  { tier: 8,  name: 'Sapphire', minTeamStaked: 100_000_000,   bonusBps:   850, bonusPct: '+8.5% APY', icon: '🔵', color: '#0f52ba' },
  { tier: 9,  name: 'Obsidian', minTeamStaked: 500_000_000,   bonusBps:   900, bonusPct: '+9% APY',   icon: '⚫', color: '#3d3d3d' },
  { tier: 10, name: 'Titan',    minTeamStaked: 1_000_000_000, bonusBps:  1000, bonusPct: '+10% APY',  icon: '👑', color: '#ff6b35' },
] as const;

// ── POLYGON ERC-20 ABI (minimal) ─────────────────────────────────────────────
export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
] as const;

// ── POLYGON STAKING CONTRACT ABI ─────────────────────────────────────────────
export const STAKING_ABI = [
  // ─ Read ─
  'function getEffectiveAPY() view returns (uint256)',
  'function getTeamBonusBps(address user) view returns (uint256)',
  'function getTeamTierInfo(address user) view returns (uint8 tierIndex, uint256 minTeamStaked, uint256 bonusBps)',
  'function getUserStakes(address user) view returns (tuple(uint256 stakeId, uint256 amount, uint256 startTime, uint256 lastClaimTime, bool isActive)[])',
  'function getPendingReward(address user, uint256 stakeId) view returns (uint256)',
  'function getReferrals(address user) view returns (address[])',
  'function getReferralChain(address user) view returns (address[])',
  'function getReferralPercentages() view returns (uint256[])',
  'function users(address user) view returns (bool isRegistered, address referrer, uint256 totalStaked, uint256 totalEarned, uint256 teamTotalStaked)',
  'function totalStaked() view returns (uint256)',
  'function totalUsers() view returns (uint256)',
  'function totalRewardsPaid() view returns (uint256)',
  // ─ Write ─
  'function registerUser(address referrer)',
  'function stake(uint256 amount)',
  'function claimRewards(uint256 stakeId)',
  'function compoundRewards(uint256 stakeId)',
  'function unstake(uint256 stakeId)',
] as const;

// ── External link helpers ─────────────────────────────────────────────────────
export const ORIGINAL_SITE = 'https://stake.futurebit.in';

export function buildReferralUrl(host: string, address: string) {
  return `${host}/stake?ref=${address}`;
}

export function buildOriginalReferralUrl(address: string) {
  return `${ORIGINAL_SITE}/?ref=${address}`;
}

export function polygonscanTx(hash: string) {
  return `${POLYGON.explorer}/tx/${hash}`;
}

export function solanaExplorerTx(sig: string) {
  return `${SOLANA.explorer}/tx/${sig}`;
}
