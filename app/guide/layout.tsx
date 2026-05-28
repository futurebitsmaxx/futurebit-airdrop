import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FutureBit Guide — How to Stake, Earn & Win FBiT',
  description:
    'Step-by-step guide to FutureBit — how to buy FBiT, stake for 300% APY, join the airdrop, enter Lucky Vault, trade in the competition, and earn referral rewards.',
  keywords: [
    'FutureBit guide', 'how to stake FBiT', 'FBiT tutorial',
    'FutureBit how to', 'FBiT beginners guide', 'Solana staking guide',
  ],
  openGraph: {
    title:       'FutureBit Guide — How to Stake, Earn & Win FBiT',
    description: 'Complete guide: buy FBiT → stake 300% APY → join airdrop → win prizes.',
    url:         '/guide',
  },
  alternates: { canonical: '/guide' },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
