import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FBiT Trading Championship — $5,000 Prize | FutureBit',
  description:
    'Compete in the FutureBit FBiT Trading Championship. Trade FBiT on Jupiter DEX, top the leaderboard, and win your share of $5,000 in prizes. Season 1 — June 2026.',
  keywords: [
    'FBiT trading competition', 'Solana trading contest', 'FutureBit championship',
    'Jupiter DEX trading', 'FBiT trading prize', 'crypto trading India 2026',
  ],
  openGraph: {
    title:       'FBiT Trading Championship — $5,000 Prize Pool',
    description: 'Trade FBiT on Jupiter, top the leaderboard, win $5,000. FutureBit Season 1.',
    url:         '/competition',
  },
  alternates: { canonical: '/competition' },
};

export default function CompetitionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
