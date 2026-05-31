'use client';

import { useState, useEffect } from 'react';
import { LEADERBOARD_DATA, loadLeaderboardAdminConfig, DEFAULT_LB_ADMIN_CONFIG, type LeaderboardAdminConfig } from '@/lib/store';
import AdBanner from '@/components/AdBanner';

function useCountdown() {
  const getTimeLeft = () => {
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() + (7 - now.getDay()) % 7 || 7);
    sunday.setHours(23, 59, 0, 0);
    const diff = sunday.getTime() - now.getTime();
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };
  const [t, setT] = useState(getTimeLeft);
  useEffect(() => {
    const id = setInterval(() => setT(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const RANK_STYLES = ['rank-gold', 'rank-silver', 'rank-bronze'];
const RANK_ICONS  = ['🥇', '🥈', '🥉'];

// Map rank to admin prize field
function rankPrize(i: number, cfg: LeaderboardAdminConfig): string {
  if (i === 0) return cfg.top1Prize;
  if (i === 1) return cfg.top2Prize;
  if (i === 2) return cfg.top3Prize;
  return cfg.top4to10;
}

export default function LeaderboardPage() {
  const time = useCountdown();
  const [cfg, setCfg] = useState<LeaderboardAdminConfig>(DEFAULT_LB_ADMIN_CONFIG);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setCfg(loadLeaderboardAdminConfig());
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Apply admin prizes to leaderboard entries
  const entries = LEADERBOARD_DATA.map((e, i) => ({
    ...e,
    prize: rankPrize(i, cfg),
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5 leaderboard-badge">
          ⚔️ WEEK {cfg.currentWeek} — ACTIVE
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">
          Referral <span className="text-neon-purple">Leaderboard</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Refer the most users — win <strong className="text-white">{cfg.weeklyPrize} weekly prizes</strong>!
        </p>
      </div>

      {/* Countdown */}
      <div className="flex justify-center gap-3 mb-10">
        <p className="text-gray-500 text-sm self-center">Resets in:</p>
        {[
          { val: time.d, label: 'Days'  },
          { val: time.h, label: 'Hours' },
          { val: time.m, label: 'Mins'  },
          { val: time.s, label: 'Secs'  },
        ].map(({ val, label }) => (
          <div key={label} className="countdown-box">
            <div className="text-xl font-black text-neon-green tabular-nums">
              {String(val).padStart(2, '0')}
            </div>
            <div className="text-gray-600 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {entries.length === 0 ? (
        /* Empty state */
        <div className="leaderboard-table rounded-2xl p-12 text-center mb-8">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-white font-bold text-lg mb-2">No entries yet — Week {cfg.currentWeek}</p>
          <p className="text-gray-400 text-sm mb-4">
            Be the first! Refer friends, get them to stake, and claim the top spot.
          </p>
          <a href="/airdrop" className="btn-primary inline-block">Get Your Referral Link →</a>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {entries.slice(0, 3).map((entry, i) => (
              <div key={entry.rank} className={`podium-card podium-card--${['gold', 'silver', 'bronze'][i]} rounded-2xl p-4 sm:p-6 text-center`}>
                <div className="text-3xl sm:text-4xl mb-2">{RANK_ICONS[i]}</div>
                <p className="text-white font-bold text-sm sm:text-base truncate">{entry.name}</p>
                <p className="text-gray-500 text-xs mt-1 truncate">{entry.wallet}</p>
                <div className="mt-3 pt-3 border-t border-white/8">
                  <p className={`text-lg font-black ${RANK_STYLES[i]}`}>{entry.prize}</p>
                  <p className="text-gray-500 text-xs mt-1">{entry.referrals} referrals</p>
                </div>
              </div>
            ))}
          </div>

          {/* Full Leaderboard Table */}
          <div className="leaderboard-table rounded-2xl overflow-hidden">
            <div className="leaderboard-table-header grid grid-cols-12 gap-2 px-5 py-3 text-xs text-gray-500 uppercase tracking-wider">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">User</div>
              <div className="col-span-2 text-right hidden sm:block">Referrals</div>
              <div className="col-span-3 text-right hidden sm:block">Staked by Refs</div>
              <div className="col-span-2 text-right">Prize</div>
            </div>
            {entries.map((entry, i) => (
              <div
                key={entry.rank}
                className={`leaderboard-row grid grid-cols-12 gap-2 px-5 py-4 items-center border-t border-white/4 ${i < 3 ? 'leaderboard-row--top' : ''}`}
              >
                <div className="col-span-1 text-lg">
                  {i < 3 ? RANK_ICONS[i] : <span className="text-gray-600 text-sm font-bold">#{entry.rank}</span>}
                </div>
                <div className="col-span-4">
                  <p className="text-white font-medium text-sm">{entry.name}</p>
                  <p className="text-gray-600 text-xs">{entry.wallet}</p>
                </div>
                <div className="col-span-2 text-right hidden sm:block">
                  <span className="text-neon-blue text-sm font-semibold">{entry.referrals}</span>
                </div>
                <div className="col-span-3 text-right hidden sm:block">
                  <span className="text-gray-300 text-sm">${entry.stakedByRefs.toLocaleString()}</span>
                </div>
                <div className="col-span-7 sm:col-span-2 text-right">
                  <span className={`text-sm font-bold ${i < 3 ? RANK_STYLES[i] : 'text-neon-green'}`}>{entry.prize}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Rules */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="leaderboard-rules-card rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">📋 Qualification Rules</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {[
              'You must stake minimum $50 yourself',
              'Referred user must stake $25+',
              'Only active stakes are counted',
              'Unique wallets only — no duplicates',
              'Weekly reset: Sunday 11:59 PM UTC',
            ].map(rule => (
              <li key={rule} className="flex gap-2">
                <span className="text-neon-purple shrink-0">✦</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        <div className="leaderboard-rules-card rounded-2xl p-6">
          <h3 className="text-white font-bold mb-4">💰 Prize Breakdown — Week {cfg.currentWeek}</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {[
              { label: '🥇 1st Place',  prize: cfg.top1Prize  },
              { label: '🥈 2nd Place',  prize: cfg.top2Prize  },
              { label: '🥉 3rd Place',  prize: cfg.top3Prize  },
              { label: '4th–10th',      prize: cfg.top4to10 + ' each' },
            ].map(row => (
              <li key={row.label} className="flex justify-between">
                <span className="text-neon-purple shrink-0">{row.label}</span>
                <span className="text-neon-green font-bold">{row.prize}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Announcement box */}
      <div className="mt-8 leaderboard-announcement rounded-2xl p-6 text-center">
        <p className="text-lg font-bold text-white mb-2">
          ⚔️ WEEKLY REFERRAL WAR — WEEK {cfg.currentWeek} IS LIVE!
        </p>
        <p className="text-gray-400 text-sm mb-4">
          This contest is for those who are ready to prove their hustle! 💪<br />
          Share your airdrop link, drive referrals, and climb the leaderboard!
        </p>
        <a href="/airdrop" className="btn-primary inline-block">Get Your Referral Link →</a>
      </div>

      <AdBanner page="leaderboard" className="mt-8" />
    </div>
  );
}
