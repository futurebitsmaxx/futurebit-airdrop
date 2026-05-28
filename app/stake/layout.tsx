import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stake FBiT — 300% APY on Solana | FutureBit',
  description:
    'Stake your FBiT tokens on FutureBit and earn up to 300% APY. Flexible lock periods, compound rewards, and a 10-level referral system. Powered by Solana.',
  keywords: [
    'stake FBiT', '300% APY Solana', 'FBiT staking rewards',
    'FutureBit staking', 'Solana DeFi staking', 'high APY crypto India',
  ],
  openGraph: {
    title:       'Stake FBiT — 300% APY | FutureBit',
    description: 'Earn up to 300% APY staking FBiT on Solana. Flexible lock periods + referral rewards.',
    url:         '/stake',
  },
  alternates: { canonical: '/stake' },
};

export default function StakeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
