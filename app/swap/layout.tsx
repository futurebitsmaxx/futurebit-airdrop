import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Swap FBiT on Jupiter DEX | FutureBit',
  description:
    'Buy or sell FBiT tokens instantly on Jupiter DEX — best Solana aggregator. Get the best swap rates for FBiT with minimal slippage.',
  keywords: [
    'swap FBiT', 'buy FBiT', 'FBiT Jupiter swap', 'FBiT DEX',
    'Solana token swap', 'FBiT price', 'buy FutureBit token',
  ],
  openGraph: {
    title:       'Swap FBiT on Jupiter DEX | FutureBit',
    description: 'Buy or sell FBiT instantly on Jupiter DEX — best rates on Solana.',
    url:         '/swap',
  },
  alternates: { canonical: '/swap' },
};

export default function SwapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
