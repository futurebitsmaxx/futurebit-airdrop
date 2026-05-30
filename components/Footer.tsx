'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { loadSocialConfig, DEFAULT_SOCIAL_CONFIG, type SocialConfig } from '@/lib/socialConfig';

export default function Footer() {
  const [social, setSocial] = useState<SocialConfig>(DEFAULT_SOCIAL_CONFIG);

  useEffect(() => {
    setSocial(loadSocialConfig());
  }, []);

  const communityLinks = [
    { label: 'Telegram',     href: social.telegram,  icon: '✈️' },
    { label: 'X (Twitter)',  href: social.twitter,   icon: '𝕏'  },
    { label: 'Discord',      href: social.discord,   icon: '💬' },
    { label: 'Instagram',    href: social.instagram, icon: '📸' },
    { label: 'YouTube',      href: social.youtube,   icon: '▶️' },
    { label: 'Facebook',     href: social.facebook,  icon: '👥' },
  ].filter(l => l.href);

  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image src="/logo.png" alt="FutureBit" width={28} height={28} className="rounded-full" />
              <span className="font-bold">Future<span className="text-neon-green">Bit</span></span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Solana DeFi staking platform — up to 300% APY, 10-level referrals, and FBiT token trading on Jupiter.
            </p>
          </div>

          {/* Earn */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Earn</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/guide"       className="hover:text-neon-green transition-colors">📖 How to Join Guide</Link></li>
              <li><Link href="/airdrop"     className="hover:text-neon-green transition-colors">FBiT Airdrop</Link></li>
              <li><Link href="/stake"       className="hover:text-neon-green transition-colors">Staking Dashboard</Link></li>
              <li><Link href="/competition" className="hover:text-neon-green transition-colors">Trading Competition</Link></li>
              <li><Link href="/leaderboard" className="hover:text-neon-green transition-colors">Referral Contest</Link></li>
            </ul>
          </div>

          {/* Trade */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Trade</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/swap" className="hover:text-neon-green transition-colors">Swap FBiT</Link></li>
              <li>
                <a href="https://jup.ag/swap/SOL-CuubBzUTnQ4H2D2fHJCVWGEUEod2fJzq4nAPwfx8UGTu"
                  target="_blank" rel="noopener noreferrer"
                  className="hover:text-neon-green transition-colors">Jupiter DEX ↗</a>
              </li>
              <li>
                <a href="https://solscan.io/token/CuubBzUTnQ4H2D2fHJCVWGEUEod2fJzq4nAPwfx8UGTu"
                  target="_blank" rel="noopener noreferrer"
                  className="hover:text-neon-green transition-colors">Solscan ↗</a>
              </li>
            </ul>
          </div>

          {/* Community — admin se set hota hai */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Community</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {communityLinks.map(l => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer"
                    className="hover:text-neon-green transition-colors flex items-center gap-1.5">
                    <span className="text-xs">{l.icon}</span> {l.label}
                  </a>
                </li>
              ))}
              {communityLinks.length === 0 && (
                <li className="text-gray-600 text-xs italic">No links configured</li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">© 2026 FutureBit. All rights reserved. · Solana Mainnet</p>
          <div className="flex gap-4 text-xs text-gray-600">
            <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/docs"    className="hover:text-gray-400 transition-colors">Docs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
