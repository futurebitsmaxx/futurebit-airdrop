'use client';

import { useState } from 'react';
import { useAppStore, VIDEO_AD_DAILY_LIMIT, VIDEO_AD_POINTS } from '@/lib/store';
import VideoAdModal from '@/components/VideoAdModal';
import QAModal from '@/components/QAModal';

export default function DailyTasksPage() {
  const { totalPoints, dailyVideoCount, dailyVideoDate, watchVideoAd } = useAppStore();

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showQAModal,    setShowQAModal]    = useState(false);

  const today           = new Date().toISOString().slice(0, 10);
  const todayVideoCount = dailyVideoDate === today ? dailyVideoCount : 0;
  const videoAtLimit    = todayVideoCount >= VIDEO_AD_DAILY_LIMIT;
  const videoAdId       = `v${(todayVideoCount % VIDEO_AD_DAILY_LIMIT) + 1}`;
  const videoPct        = Math.round((todayVideoCount / VIDEO_AD_DAILY_LIMIT) * 100);
  const videoPointsToday = todayVideoCount * VIDEO_AD_POINTS;
  const maxVideoPoints   = VIDEO_AD_DAILY_LIMIT * VIDEO_AD_POINTS;

  return (
    <div className="min-h-screen px-4 pt-10 pb-20 max-w-5xl mx-auto">

      {/* ── Hero header ──────────────────────────────────── */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-neon-green/10 border border-neon-green/20 rounded-full px-4 py-1.5 text-neon-green text-sm font-semibold mb-5">
          ⚡ Daily Tasks
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3 leading-tight">
          Earn Points Every Day
        </h1>
        <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
          Complete daily challenges to earn FBiT points and boost your airdrop allocation.
        </p>

        {/* Points badge */}
        <div className="mt-6 inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-3">
          <span className="text-gray-400 text-sm">Total Points</span>
          <span className="w-px h-4 bg-white/10" />
          <span className="text-neon-green font-bold text-xl">{totalPoints.toLocaleString()}</span>
          <span className="text-gray-600 text-sm">pts</span>
        </div>
      </div>

      {/* ── Today's summary bar ──────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Videos Today',   value: `${todayVideoCount}/${VIDEO_AD_DAILY_LIMIT}`, color: 'text-blue-400'      },
          { label: 'Video Points',   value: `+${videoPointsToday}`,                        color: 'text-neon-green'    },
          { label: 'Max Video / Day',value: `${maxVideoPoints} pts`,                        color: 'text-gray-300'      },
          { label: 'Q&A Reward',     value: '+20 / −5 pts',                                 color: 'text-purple-400'   },
        ].map(s => (
          <div key={s.label} className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-center">
            <p className={`font-bold text-lg ${s.color}`}>{s.value}</p>
            <p className="text-gray-600 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Main task cards ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* ─── Watch Video Ads card ─────────────────────── */}
        <div className="bg-card rounded-2xl p-6 flex flex-col">

          {/* Card header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-3xl">
              📺
            </div>
            <div className="flex-1">
              <h2 className="text-white font-bold text-lg leading-tight">Watch Video Ads</h2>
              <p className="text-gray-500 text-sm mt-0.5">Daily Bonus — resets at midnight</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-neon-green font-bold text-lg">+{VIDEO_AD_POINTS}</p>
              <p className="text-gray-600 text-xs">pts / video</p>
            </div>
          </div>

          {/* Daily progress */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-400">Today&apos;s progress</span>
              <span className="text-white font-semibold">{todayVideoCount}/{VIDEO_AD_DAILY_LIMIT} watched</span>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-neon-green rounded-full transition-all duration-700"
                style={{ width: `${videoPct}%` }}
              />
            </div>
          </div>

          {/* Ad slot indicators */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {Array.from({ length: VIDEO_AD_DAILY_LIMIT }).map((_, i) => (
              <div
                key={i}
                className={`rounded-xl py-3.5 flex flex-col items-center gap-1.5 border transition-all ${
                  i < todayVideoCount
                    ? 'bg-neon-green/10 border-neon-green/30 text-neon-green'
                    : i === todayVideoCount
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                    : 'bg-white/3 border-white/5 text-gray-700'
                }`}
              >
                <span className="text-lg leading-none">
                  {i < todayVideoCount ? '✓' : i === todayVideoCount ? '▶' : '○'}
                </span>
                <span className="text-[10px] font-semibold">Ad {i + 1}</span>
              </div>
            ))}
          </div>

          {/* How it works bullets */}
          <div className="space-y-2 mb-6 flex-1">
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <span className="text-blue-400">•</span> Watch 30 seconds to unlock points
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <span className="text-blue-400">•</span> Up to {VIDEO_AD_DAILY_LIMIT} videos per day
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <span className="text-blue-400">•</span> Earn up to {maxVideoPoints} pts daily from videos
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <span className="text-blue-400">•</span> Limit resets every midnight
            </div>
          </div>

          {/* CTA */}
          {videoAtLimit ? (
            <div className="bg-yellow-950/50 border border-yellow-500/20 rounded-xl px-4 py-4 text-center">
              <p className="text-yellow-400 text-sm font-semibold">✓ Daily limit reached ({VIDEO_AD_DAILY_LIMIT}/{VIDEO_AD_DAILY_LIMIT})</p>
              <p className="text-gray-500 text-xs mt-1">Come back tomorrow for more bonus points</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowVideoModal(true)}
              className="btn-primary w-full text-sm py-3.5"
            >
              ▶ Watch Ad {todayVideoCount + 1} — Earn +{VIDEO_AD_POINTS} pts
            </button>
          )}
        </div>

        {/* ─── Q&A Challenge card ───────────────────────── */}
        <div className="bg-card rounded-2xl p-6 flex flex-col">

          {/* Card header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-3xl">
              🎯
            </div>
            <div className="flex-1">
              <h2 className="text-white font-bold text-lg leading-tight">Q&A Challenge</h2>
              <p className="text-gray-500 text-sm mt-0.5">Crypto knowledge quiz — unlimited plays</p>
            </div>
          </div>

          {/* Points breakdown */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-neon-green/5 border border-neon-green/15 rounded-xl px-4 py-4 text-center">
              <p className="text-neon-green font-bold text-2xl">+20</p>
              <p className="text-gray-500 text-xs mt-1">pts per correct</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-4 text-center">
              <p className="text-red-400 font-bold text-2xl">−5</p>
              <p className="text-gray-500 text-xs mt-1">pts per wrong</p>
            </div>
          </div>

          {/* How it works */}
          <div className="space-y-2.5 mb-6 flex-1">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3">How it works</p>
            {[
              '15 crypto & DeFi questions, shuffled each session',
              '4 multiple-choice options per question',
              'Correct answer earns +20 pts immediately',
              'Wrong answer deducts 5 pts and shows next question',
              'Unlimited sessions — keep playing and earning!',
            ].map(rule => (
              <div key={rule} className="flex items-start gap-2.5 text-xs text-gray-400">
                <span className="text-purple-400 mt-0.5 shrink-0">✓</span>
                {rule}
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={() => setShowQAModal(true)}
            className="w-full rounded-xl py-3.5 text-sm font-bold border border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-white transition-all duration-200"
          >
            🎯 Start Q&A Challenge
          </button>
        </div>
      </div>

      {/* ── Info banner ───────────────────────────────────── */}
      <div className="bg-white/3 border border-white/8 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center gap-4">
        <span className="text-2xl shrink-0">💡</span>
        <div>
          <p className="text-white text-sm font-semibold mb-0.5">Points count towards your FBiT Airdrop</p>
          <p className="text-gray-400 text-xs">
            All points earned here are added to your airdrop allocation.
            You need a minimum of{' '}
            <span className="text-neon-green font-semibold">70 points</span>{' '}
            to qualify. Keep completing tasks daily to maximise your rewards!
          </p>
        </div>
        <a
          href="/airdrop"
          className="shrink-0 btn-outline text-xs py-2 px-4 whitespace-nowrap"
        >
          View Airdrop →
        </a>
      </div>

      {/* ── Modals ────────────────────────────────────────── */}
      {showVideoModal && (
        <VideoAdModal
          adId={videoAdId}
          label={`Video Ad ${todayVideoCount + 1} of ${VIDEO_AD_DAILY_LIMIT}`}
          points={VIDEO_AD_POINTS}
          onClaim={() => { watchVideoAd(); }}
          onClose={() => setShowVideoModal(false)}
        />
      )}
      {showQAModal && <QAModal onClose={() => setShowQAModal(false)} />}
    </div>
  );
}
