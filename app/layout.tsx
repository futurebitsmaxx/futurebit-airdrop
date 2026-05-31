import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PromoBanner from '@/components/PromoBanner';
import { FloatingAdCard } from '@/components/PromoAdBanners';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://futurebit.io';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),

  title: {
    default: 'FutureBit — 300% APY Staking | FBiT Airdrop & Trading',
    template: '%s | FutureBit',
  },
  description:
    'FutureBit on Solana — Stake FBiT for up to 300% APY, join the $10,000 airdrop, trade on Jupiter DEX, and earn with a 10-level referral system.',

  keywords: [
    'FBiT token', 'FutureBit', 'Solana airdrop 2026', 'FBiT airdrop',
    'Solana staking', '300% APY staking', 'FBiT Lucky Vault', 'FBiT trading competition',
    'crypto airdrop India', 'Solana DeFi', 'Jupiter DEX', 'FBiT swap',
    'FutureBit staking', 'CryptoIndia', 'FBiT referral',
  ],

  authors: [{ name: 'FutureBit Team', url: BASE }],
  creator: 'FutureBit',
  publisher: 'FutureBit',

  icons: {
    icon:  '/logo.png',
    apple: '/logo.png',
  },

  openGraph: {
    type:        'website',
    locale:      'en_IN',
    url:         BASE,
    siteName:    'FutureBit',
    title:       'FutureBit — 300% APY Staking | FBiT Airdrop & Trading',
    description: 'Stake FBiT for 300% APY, join $10,000 airdrop, trade on Jupiter. Built on Solana.',
    images: [
      {
        url:    '/og-image.png',
        width:  1200,
        height: 630,
        alt:    'FutureBit — FBiT Staking & Airdrop',
      },
    ],
  },

  twitter: {
    card:        'summary_large_image',
    site:        '@FutureBitOfficial',
    creator:     '@FutureBitOfficial',
    title:       'FutureBit — 300% APY Staking | FBiT Airdrop',
    description: 'Stake FBiT for 300% APY, join $10,000 airdrop, trade on Jupiter. Built on Solana.',
    images:      ['/og-image.png'],
  },

  alternates: {
    canonical: BASE,
  },

  robots: {
    index:               true,
    follow:              true,
    googleBot: {
      index:             true,
      follow:            true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':     -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type':    'Organization',
  name:       'FutureBit',
  url:         BASE,
  logo:       `${BASE}/logo.png`,
  description: 'FutureBit — Solana DeFi platform offering FBiT token staking, airdrops, trading competition and referral rewards.',
  sameAs: [
    'https://twitter.com/FutureBitOfficial',
    'https://t.me/futurebitstaking',
    'https://discord.gg/futurebit',
    'https://instagram.com/futurebitstaking',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="hero-gradient grid-overlay min-h-screen">
        <Navbar />
        <PromoBanner />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <FloatingAdCard />

        {/* Adcash AutoTag — exactly as provided, before </body> */}
        <Script
          src="https://static.ackcdn.com/js/aclib.js"
          strategy="afterInteractive"
        />
        <Script id="adcash-autotag" strategy="afterInteractive">{`
          (function run() {
            if (window.aclib) {
              aclib.runAutoTag({ zoneId: 'gsmkd1asq' });
            } else {
              setTimeout(run, 100);
            }
          })();
        `}</Script>
      </body>
    </html>
  );
}
