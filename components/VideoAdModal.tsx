'use client';

import { useState, useEffect, useRef } from 'react';

interface Props {
  adId:    string;
  label:   string;
  points:  number;
  onClaim: () => void;
  onClose: () => void;
}

const WATCH_SECONDS = 30;
const ZONE_ID       = 'gsmkd1asq';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    aclib?: any;
  }
}

// Rotating FutureBit promo fallback banners
const PROMOS = [
  { theme: 'green',  headline: '🚀 Earn 300% APY on FBiT',          body: 'Stake FBiT tokens for 60+ days and earn industry-leading returns. Limited slots available!' },
  { theme: 'blue',   headline: '🎁 $10,000 FBiT Airdrop is LIVE',    body: 'Complete daily tasks & refer friends to qualify for the biggest Solana airdrop of 2026.' },
  { theme: 'purple', headline: '🎰 Win Up to 1,000 FBiT Daily',      body: 'Stake FBiT to earn Lucky Vault raffle tickets. Guaranteed weekly prize draws!' },
  { theme: 'orange', headline: '🏆 $50,000 Trading Prize Pool',       body: 'Trade FBiT on Jupiter DEX and climb the weekly leaderboard for massive cash prizes.' },
] as const;

export default function VideoAdModal({ label, points, onClaim, onClose }: Props) {
  const [timeLeft,    setTimeLeft]    = useState(WATCH_SECONDS);
  const [canClaim,    setCanClaim]    = useState(false);
  const [claimed,     setClaimed]     = useState(false);
  const [adInjected,  setAdInjected]  = useState(false);
  const [promoIdx]                    = useState(() => Math.floor(Math.random() * PROMOS.length));

  const startRef    = useRef(Date.now());
  const rafRef      = useRef<number>(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const adDivId     = useRef(`adcash-banner-${Date.now()}`);

  // ── Try to inject Adcash banner into our container ──────────────────────
  useEffect(() => {
    const containerId = adDivId.current;
    let attempts = 0;

    const timer = setInterval(() => {
      attempts++;

      if (window.aclib) {
        clearInterval(timer);
        try {
          // runBanner targets a specific div — works with Banner zones
          window.aclib.runBanner({ zoneId: ZONE_ID, container: `#${containerId}` });
          setAdInjected(true);
        } catch {
          // AutoTag zones don't support runBanner — fall through to promo
        }
        return;
      }

      if (attempts >= 60) clearInterval(timer); // 6 s timeout → show promo
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // ── Countdown timer ──────────────────────────────────────────────────────
  useEffect(() => {
    function tick() {
      const elapsed   = Math.floor((Date.now() - startRef.current) / 1000);
      const remaining = Math.max(0, WATCH_SECONDS - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) {
        setCanClaim(true);
      } else {
        rafRef.current = window.setTimeout(tick, 500);
      }
    }
    rafRef.current = window.setTimeout(tick, 500);
    return () => clearTimeout(rafRef.current);
  }, []);

  const pct = Math.round(((WATCH_SECONDS - timeLeft) / WATCH_SECONDS) * 100);
  useEffect(() => {
    progressRef.current?.style.setProperty('--vpw', `${pct}%`);
  }, [pct]);

  function handleClaim() {
    if (!canClaim || claimed) return;
    setClaimed(true);
    setTimeout(() => { onClaim(); onClose(); }, 900);
  }

  const promo = PROMOS[promoIdx];

  return (
    <div className="modal-backdrop fixed inset-0 z-200 flex items-center justify-center p-4">
      <div className="video-ad-modal">

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-white font-bold text-sm">📺 {label}</p>
            <p className="text-neon-green text-xs mt-0.5">+{points} pts after watching {WATCH_SECONDS}s</p>
          </div>
          {canClaim && !claimed && (
            <button type="button" onClick={onClose}
              className="text-gray-600 hover:text-white text-2xl leading-none ml-3">×</button>
          )}
        </div>

        {/* ── Ad area ── */}
        <div className="video-ad-player">

          {/* Adcash banner target div */}
          <div id={adDivId.current} className="w-full h-full" />

          {/* Promo fallback — shown when Adcash banner isn't injected */}
          {!adInjected && (
            <div className={`promo-ad-area promo-ad-area--${promo.theme} absolute inset-0`}>
              <div className="p-5 flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-600 border border-white/10 rounded px-2 py-0.5">
                    Sponsored
                  </span>
                  <span className="text-[10px] font-bold text-white/50 bg-black/30 rounded-lg px-2.5 py-0.5">
                    {timeLeft}s
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg leading-snug mb-2">{promo.headline}</h3>
                <p className="text-gray-400 text-xs leading-relaxed flex-1">{promo.body}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-gray-600 text-[10px]">futurebit.io</span>
                  <span className="promo-ad-cta">Learn More →</span>
                </div>
              </div>
            </div>
          )}

          {/* "Advertisement" badge overlay */}
          <div className="video-ad-overlay-top pointer-events-none">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/60 bg-black/40 rounded px-2 py-0.5">
              Advertisement
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="video-ad-progress-bg mt-3">
          <div ref={progressRef} className="video-ad-progress-fill video-ad-progress-fill-var" />
        </div>

        {/* Timer / Claim */}
        <div className="mt-3 flex items-center justify-between">
          {!canClaim ? (
            <>
              <p className="text-gray-500 text-xs">Watch the full ad to earn points</p>
              <span className="video-ad-timer">{timeLeft}s left</span>
            </>
          ) : claimed ? (
            <p className="text-neon-green font-bold text-sm w-full text-center">
              ✅ +{points} points credited!
            </p>
          ) : (
            <button type="button" onClick={handleClaim}
              className="btn-primary w-full text-sm py-2.5">
              🎉 Claim +{points} Points
            </button>
          )}
        </div>

        {!canClaim && (
          <p className="text-center text-gray-700 text-xs mt-2">
            Cannot skip — watch full ad to unlock points
          </p>
        )}
      </div>
    </div>
  );
}
