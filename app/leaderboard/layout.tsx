import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Referral Leaderboard — Weekly Prizes | FutureBit',
  description:
    'Refer friends, climb the FutureBit leaderboard, win weekly FBiT prizes. Top referrers share the weekly prize pool. Real-time rankings updated every week.',
  keywords: [
    'FBiT referral leaderboard', 'crypto referral program India',
    'FutureBit referral rewards', 'FBiT weekly prizes', 'refer and earn crypto',
  ],
  openGraph: {
    title:       'FBiT Referral Leaderboard — Win Weekly Prizes',
    description: 'Refer friends, top the leaderboard, win FBiT every week. FutureBit referral program.',
    url:         '/leaderboard',
  },
  alternates: { canonical: '/leaderboard' },
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
