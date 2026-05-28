'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import WalletModal from './WalletModal';

type Highlight = 'green' | 'orange' | 'purple' | undefined;

const navLinks: { href: string; label: string; highlight?: Highlight }[] = [
  { href: '/',            label: 'Home'        },
  { href: '/guide',       label: '📖 Guide'    },
  { href: '/stake',       label: '💎 Stake',   highlight: 'green'  },
  { href: '/airdrop',     label: 'Airdrop 🎁'  },
  { href: '/competition', label: '🏆 Trading', highlight: 'orange' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/swap',        label: '🪐 Swap',    highlight: 'purple' },
];

function linkClass(highlight: Highlight, active: boolean): string {
  if (highlight === 'green')  return active ? 'nav-hl-active nav-hl-green-active'  : 'nav-hl nav-hl-green';
  if (highlight === 'orange') return active ? 'nav-hl-active nav-hl-orange-active' : 'nav-hl nav-hl-orange';
  if (highlight === 'purple') return active ? 'nav-hl-active nav-hl-purple-active' : 'nav-hl nav-hl-purple';
  return active ? 'text-neon-green bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5';
}

export default function Navbar() {
  const pathname = usePathname();
  const { walletAddress, connectedChain, disconnectWallet } = useAppStore();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [mobileOpen,      setMobileOpen]      = useState(false);

  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
    : null;

  return (
    <>
      <nav className="navbar-glass fixed top-0 left-0 right-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="FutureBit Logo"
              width={36}
              height={36}
              className="rounded-full"
              priority
            />
            <span className="font-bold text-lg hidden sm:block">
              Future<span className="text-neon-green">Bit</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  linkClass(link.highlight, pathname === link.href)
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Wallet + Mobile toggle */}
          <div className="flex items-center gap-3">
            {walletAddress ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse-neon" />
                  <span className="text-gray-300">{shortAddress}</span>
                  <span className="text-gray-500 capitalize">· {connectedChain}</span>
                </span>
                <button type="button" onClick={disconnectWallet}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1">
                  Disconnect
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setShowWalletModal(true)}
                className="btn-primary text-sm py-2 px-4">
                Connect Wallet
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-gray-400 hover:text-white p-2"
            >
              <div className="space-y-1" aria-hidden="true">
                <span className={`block w-5 h-0.5 bg-current transition-all ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block w-5 h-0.5 bg-current transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-current transition-all ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href ? 'text-neon-green bg-white/5' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {showWalletModal && <WalletModal onClose={() => setShowWalletModal(false)} />}
    </>
  );
}
