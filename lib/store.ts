import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VAULT_ADMIN_CFG_KEY, DEFAULT_VAULT_ADMIN_CONFIG } from '@/lib/airdropConfig';

export type Chain = 'solana';

export interface Task {
  id: string;
  label: string;
  points: number;
  icon: string;
  action: string;
  completed: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  wallet: string;
  referrals: number;
  stakedByRefs: number;
  weeklyPoints: number;
  prize: string;
}

export const VIDEO_AD_DAILY_LIMIT = 4;
export const VIDEO_AD_POINTS      = 10;

interface AppState {
  walletAddress: string | null;
  connectedChain: Chain | null;
  totalPoints: number;
  tasks: Task[];
  stakingAmount: number;
  stakingDays: number;
  ticketCount: number;
  hasEnteredGiveaway: boolean;
  referralCode: string;
  referralCount: number;
  // ── Daily video ad tracking ─────────────────────────────────────────────────
  dailyVideoCount: number;   // how many video ads watched today
  dailyVideoDate:  string;   // 'YYYY-MM-DD' — resets on new day

  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
  completeTask: (taskId: string) => void;
  enterStakingGiveaway: (amount: number, days: number) => void;
  setReferralCode: (code: string) => void;
  watchVideoAd: () => boolean;  // returns true if watch was accepted, false if daily limit hit
  adjustPoints: (delta: number) => void;
}

const defaultTasks: Task[] = [
  { id: 't1', label: 'Join Telegram Group',              points: 10, icon: '💬', action: 'https://t.me/futurebitstaking',              completed: false },
  { id: 't2', label: 'Follow on X (Twitter)',             points: 10, icon: '𝕏', action: 'https://twitter.com/FutureBitOfficial',       completed: false },
  { id: 't3', label: 'Connect Solana Wallet (Phantom)',   points: 25, icon: '◎', action: 'solana',                                      completed: false },
  { id: 't5', label: 'Retweet Launch Tweet #FBiTAirdrop', points: 15, icon: '🔁', action: 'https://twitter.com/intent/retweet',          completed: false },
  { id: 't6', label: 'Join Discord Server',               points: 10, icon: '🎮', action: 'https://discord.gg/futurebit',                completed: false },
  { id: 't7', label: 'Follow on Instagram',               points: 5,  icon: '📸', action: 'https://instagram.com/futurebitstaking',      completed: false },
  { id: 't8', label: 'Share Story & Tag Us',              points: 15, icon: '📢', action: 'share',                                      completed: false },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      walletAddress: null,
      connectedChain: null,
      totalPoints: 0,
      tasks: defaultTasks,
      stakingAmount: 0,
      stakingDays: 0,
      ticketCount: 0,
      hasEnteredGiveaway: false,
      referralCode: '',
      referralCount: 0,
      dailyVideoCount: 0,
      dailyVideoDate: '',

      connectWallet: (address) => {
        const state = get();
        const task = state.tasks.find(t => t.id === 't3');
        const alreadyDone = task?.completed ?? false;
        const addPoints = alreadyDone ? 0 : (task?.points ?? 0);
        set(s => ({
          walletAddress: address,
          connectedChain: 'solana',
          totalPoints: s.totalPoints + addPoints,
          tasks: s.tasks.map(t =>
            t.id === 't3' ? { ...t, completed: true } : t
          ),
        }));
      },

      disconnectWallet: () =>
        set({ walletAddress: null, connectedChain: null }),

      completeTask: (taskId) => {
        const state = get();
        const task = state.tasks.find(t => t.id === taskId);
        if (!task || task.completed) return;
        set(s => ({
          totalPoints: s.totalPoints + task.points,
          tasks: s.tasks.map(t =>
            t.id === taskId ? { ...t, completed: true } : t
          ),
        }));
      },

      enterStakingGiveaway: (amount, days) => {
        let vaultCfg = { ...DEFAULT_VAULT_ADMIN_CONFIG };
        try {
          const raw = typeof window !== 'undefined' ? localStorage.getItem(VAULT_ADMIN_CFG_KEY) : null;
          if (raw) vaultCfg = { ...vaultCfg, ...JSON.parse(raw) };
        } catch { /* use defaults */ }
        let tickets = Math.floor(amount / vaultCfg.minStake);
        if (days >= 60) tickets = Math.floor(tickets * 1.5);
        const state = get();
        if (state.referralCount > 0) tickets += 2;
        tickets = Math.min(vaultCfg.maxTickets, tickets);
        set({ stakingAmount: amount, stakingDays: days, ticketCount: tickets, hasEnteredGiveaway: true });
      },

      adjustPoints: (delta) =>
        set(s => ({ totalPoints: Math.max(0, s.totalPoints + delta) })),

      setReferralCode: (code) => set({ referralCode: code }),

      watchVideoAd: () => {
        const today = new Date().toISOString().slice(0, 10);
        const state = get();
        // Reset count if new day
        const count = state.dailyVideoDate === today ? state.dailyVideoCount : 0;
        if (count >= VIDEO_AD_DAILY_LIMIT) return false;
        set({
          totalPoints:     state.totalPoints + VIDEO_AD_POINTS,
          dailyVideoCount: count + 1,
          dailyVideoDate:  today,
        });
        return true;
      },
    }),
    {
      name: 'fbit-store',
      version: 3,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as AppState & { tasks: Task[] };
        // Remove old video tasks (v1, v2, v3) — now handled by daily system
        if (state.tasks) {
          state.tasks = state.tasks.filter(t => !t.id.startsWith('v'));
        }
        // Merge any new defaultTasks missing from persisted state
        if (version < 3) {
          const existing = new Set(state.tasks?.map((t: Task) => t.id) ?? []);
          const missing = defaultTasks.filter(t => !existing.has(t.id));
          if (missing.length > 0) {
            state.tasks = [...(state.tasks ?? []), ...missing];
          }
          // Initialise daily video fields
          if (!('dailyVideoCount' in state)) {
            (state as Record<string, unknown>).dailyVideoCount = 0;
            (state as Record<string, unknown>).dailyVideoDate  = '';
          }
        }
        return state;
      },
    }
  )
);

// ─── Leaderboard admin config (saved to localStorage) ────────────────────────
export interface LeaderboardAdminConfig {
  currentWeek: number;
  weeklyPrize: string;
  top1Prize:   string;
  top2Prize:   string;
  top3Prize:   string;
  top4to10:    string;
}

export const LB_ADMIN_CFG_KEY = 'fbit-admin-lb';

export const DEFAULT_LB_ADMIN_CONFIG: LeaderboardAdminConfig = {
  currentWeek: 1,
  weeklyPrize: '$950 FBiT',
  top1Prize:   '$500 FBiT',
  top2Prize:   '$300 FBiT',
  top3Prize:   '$150 FBiT',
  top4to10:    '$20 FBiT',
};

export function loadLeaderboardAdminConfig(): LeaderboardAdminConfig {
  try {
    const raw = localStorage.getItem(LB_ADMIN_CFG_KEY);
    return raw ? { ...DEFAULT_LB_ADMIN_CONFIG, ...JSON.parse(raw) } : { ...DEFAULT_LB_ADMIN_CONFIG };
  } catch {
    return { ...DEFAULT_LB_ADMIN_CONFIG };
  }
}

export const LEADERBOARD_DATA: LeaderboardEntry[] = [];
