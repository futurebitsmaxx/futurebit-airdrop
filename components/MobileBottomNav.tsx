'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const bottomNavLinks = [
  { href: '/',            icon: '🏠', label: 'Home'   },
  { href: '/guide',       icon: '📖', label: 'Guide'  },
  { href: '/stake',       icon: '💎', label: 'Stake'  },
  { href: '/airdrop',     icon: '🎁', label: 'Drop'   },
  { href: '/competition', icon: '🏆', label: 'Trade'  },
  { href: '/leaderboard', icon: '🥇', label: 'Board'  },
  { href: '/swap',        icon: '🪐', label: 'Swap'   },
];

function toggleMenu() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('futurebit-menu-toggle'));
  }
}

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav lg:hidden">
      {bottomNavLinks.map(link => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="mobile-bottom-nav-link"
          >
            <span className="mobile-bottom-nav-icon">{link.icon}</span>
            <span className={`mobile-bottom-nav-label${active ? ' mobile-bottom-nav-label--active' : ''}`}>
              {link.label}
            </span>
            {active && <span className="mobile-bottom-nav-dot" />}
          </Link>
        );
      })}

      {/* Hamburger (3-line) button — opens top navbar menu */}
      <button
        type="button"
        onClick={toggleMenu}
        className="mobile-bottom-nav-link mobile-bottom-nav-menu-btn"
        aria-label="Open menu"
      >
        <span className="mobile-bottom-nav-menu-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="mobile-bottom-nav-label">Menu</span>
      </button>
    </nav>
  );
}
