'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { connectPhantom } from '@/lib/solanaService';

interface Props {
  onClose: () => void;
}

const WALLETS = [
  { id: 'phantom',  name: 'Phantom',  icon: '👻', desc: 'Most popular Solana wallet' },
  { id: 'backpack', name: 'Backpack', icon: '🎒', desc: 'Multi-chain wallet'         },
  { id: 'solflare', name: 'Solflare', icon: '🔥', desc: 'Official Solana wallet'     },
];

export default function WalletModal({ onClose }: Props) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected,  setConnected]  = useState(false);
  const [error,      setError]      = useState('');
  const { connectWallet } = useAppStore();

  async function handleConnect(walletId: string) {
    setConnecting(walletId);
    setError('');
    try {
      // All major Solana wallets inject themselves as window.solana
      const address = await connectPhantom();
      connectWallet(address);
      setConnected(true);
      setTimeout(onClose, 900);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Wallet connect failed');
    } finally {
      setConnecting(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 modal-backdrop"
      onClick={onClose}
    >
      <div
        className="wallet-modal-box relative w-full max-w-sm rounded-2xl p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Connect Wallet</h2>
            <p className="text-xs text-gray-500 mt-0.5">◎ Solana Network</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
        </div>

        {connected ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-neon-green font-semibold">Wallet Connected!</p>
            <p className="text-gray-400 text-sm mt-1">+25 points earned!</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {WALLETS.map(wallet => (
                <button
                  key={wallet.id}
                  type="button"
                  onClick={() => handleConnect(wallet.id)}
                  disabled={connecting !== null}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all border border-white/5 hover:border-white/15 hover:bg-white/5 disabled:opacity-50"
                >
                  <span className="text-2xl shrink-0">{wallet.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{wallet.name}</p>
                    <p className="text-xs text-gray-500">{wallet.desc}</p>
                  </div>
                  {connecting === wallet.id && (
                    <span className="text-xs text-neon-green animate-pulse-neon shrink-0">Connecting...</span>
                  )}
                </button>
              ))}
            </div>

            {error && (
              <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            <p className="text-center text-xs text-gray-600 mt-4">
              By connecting, you agree to our Terms & Privacy Policy
            </p>
          </>
        )}
      </div>
    </div>
  );
}
