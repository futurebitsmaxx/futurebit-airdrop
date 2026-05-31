'use client';

import { useEffect, useRef, useState } from 'react';
import '@jup-ag/plugin/css';
import { FBIT_MINT, SOL_MINT, SOLANA_RPC } from '@/lib/jupiterConfig';

interface Props {
  mode?: 'integrated' | 'widget';
}

export default function JupiterTerminal({ mode = 'integrated' }: Props) {
  const initiated = useRef(false);
  const [error,   setError]   = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initiated.current) return;
    initiated.current = true;

    import('@jup-ag/plugin')
      .then(({ init }) => {
        return init({
          displayMode:        mode === 'integrated' ? 'integrated' : 'widget',
          integratedTargetId: 'jupiter-plugin-container',
          defaultExplorer:    'Solscan',
          formProps: {
            initialInputMint:  SOL_MINT,
            initialOutputMint: FBIT_MINT,
          },
        });
      })
      .then(() => setLoading(false))
      .catch(() => setError(true));
  // mode is stable — only run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="jupiter-error-state">
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-white font-semibold mb-2">Jupiter Failed to Load</p>
        <p className="text-gray-400 text-sm mb-4">
          Jupiter could not load due to a network issue or ad blocker.
        </p>
        <a
          href={`https://jup.ag/swap/SOL-${FBIT_MINT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-sm"
        >
          🪐 Swap Directly on Jupiter.ag
        </a>
      </div>
    );
  }

  return (
    <div className="jupiter-terminal-root">
      {/* Loading overlay — sits on top, jupiter container stays visible underneath */}
      {loading && (
        <div className="jupiter-loading-overlay">
          <div className="jupiter-spinner" />
          <p className="text-gray-400 text-sm mt-4">Loading Jupiter...</p>
        </div>
      )}
      {/* Jupiter mounts into this div — MUST remain in DOM and visible at all times */}
      <div id="jupiter-plugin-container" className="jupiter-terminal-wrap" />
    </div>
  );
}

// Suppress TS error for RPC prop — only used if Jupiter Plugin supports it
void SOLANA_RPC;
