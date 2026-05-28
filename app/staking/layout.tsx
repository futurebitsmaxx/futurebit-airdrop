import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lucky Vault — Monthly Lottery for FBiT Stakers | FutureBit',
  description:
    'Stake FBiT on Solana and enter the FutureBit Lucky Vault monthly draw. Win up to $3,500 in FBiT prizes every month. The more you stake, the more tickets you earn.',
  keywords: [
    'FBiT Lucky Vault', 'Solana staking lottery', 'FutureBit staking',
    'FBiT monthly draw', 'crypto lottery India', 'stake FBiT win prizes',
  ],
  openGraph: {
    title:       'Lucky Vault — Monthly Prize Draw for FBiT Stakers',
    description: 'Stake FBiT → earn lottery tickets → win $3,500 monthly. FutureBit Lucky Vault.',
    url:         '/staking',
  },
  alternates: { canonical: '/staking' },
};

export default function StakingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
