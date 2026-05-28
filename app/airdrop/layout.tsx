import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FBiT Airdrop — $10,000 Free Tokens | FutureBit',
  description:
    'Join the FutureBit FBiT airdrop. Complete simple tasks, earn points, qualify for up to $10,000 in free FBiT tokens. Connect your Solana wallet — no investment needed.',
  keywords: [
    'FBiT airdrop', 'free crypto India', 'Solana airdrop 2026',
    'FutureBit airdrop', 'FBiT free tokens', 'crypto airdrop',
  ],
  openGraph: {
    title:       'FBiT Airdrop — $10,000 Free Tokens | FutureBit',
    description: 'Complete tasks, earn points, qualify for $10,000 in FBiT. Free — no investment needed.',
    url:         '/airdrop',
  },
  alternates: { canonical: '/airdrop' },
};

export default function AirdropLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
