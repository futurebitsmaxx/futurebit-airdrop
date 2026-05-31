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

export default function VideoAdModal({ label, points, onClaim, onClose }: Props) {
  const [timeLeft, setTimeLeft] = useState(WATCH_SECONDS);
  const [canClaim, setCanClaim] = useState(false);
  const [claimed,  setClaimed]  = useState(false);

  const startRef    = useRef(Date.now());
  const rafRef      = useRef<number>(0);
  const progressRef = useRef<HTMLDivElement>(null);

  // aclib.runAutoTag is called globally by AdcashAutoTag in layout — no duplicate call needed

  // Countdown timer
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

        {/* Ad display area — Adcash AutoTag fills this */}
        <div className="video-ad-player">
          <div className="video-ad-overlay-top pointer-events-none">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/60 bg-black/40 rounded px-2 py-0.5">
              Advertisement
            </span>
            {!canClaim && (
              <span className="text-[10px] font-bold text-white bg-black/60 rounded-lg px-2.5 py-1">
                {timeLeft}s
              </span>
            )}
          </div>

          {/* Placeholder shown while Adcash loads the ad */}
          <div className="flex flex-col items-center justify-center gap-2 text-gray-700 text-xs select-none">
            <span className="text-2xl">📡</span>
            <span>Loading advertisement…</span>
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
