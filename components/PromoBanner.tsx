'use client';

const promos = [
  '🚀 FBiT Airdrop LIVE — Claim Your Share of $10,000 Prize Pool!',
  '💰 Stake FBiT & Earn up to 300% APY on Solana!',
  '🏆 Trading Competition — $5,000 Prize Pool — Register Now!',
  '🎰 Lucky Vault OPEN — Stake $100+ to Enter Monthly $2,000 Draw',
  '🤝 10-Level Deep Referral System — Earn from Entire Network!',
  '🔥 First 5,000 Members Only — Exclusive FBiT Airdrop Rewards!',
  '📈 FBiT Token NOW on Jupiter — Swap on Solana!',
  '🎯 Refer 1 Friend = +20 Points — More Referrals, More Rewards!',
  '◎ Solana Mainnet LIVE — Transparent On-Chain Staking!',
];

export default function PromoBanner() {
  const doubled = [...promos, ...promos];

  return (
    <div className="promo-ticker">
      <div className="promo-ticker-inner">
        {doubled.map((text, i) => (
          <span key={i} className="promo-ticker-item">
            {text}
            <span className="promo-ticker-sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
