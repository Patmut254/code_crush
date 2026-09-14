import { create } from 'zustand';
import { saveJSON, loadJSON } from '@/services/storageService';
import { AgeProfile } from '@/data/ageProfiles';

interface LevelResult {
  levelId: number;
  stars: 1 | 2 | 3;
  bestScore: number;
}

interface GameState {
  lives: number;
  lastLifeLostAt: number | null;
  hints: number;
  completed: Record<number, LevelResult>;
  totalStars: number;
  streakDays: number;
  lastPlayedDate: string | null;
  hydrated: boolean;

  hydrate: () => Promise<void>;
  initForProfile: (profile: AgeProfile) => void;
  loseLife: (profile: AgeProfile) => boolean; // returns true if a life was actually consumed
  regenLivesIfDue: (profile: AgeProfile) => void;
  useHint: () => boolean;
  refillHints: (n: number) => void;
  recordLevelComplete: (levelId: number, score: number, stars: 1 | 2 | 3) => void;
  bumpStreak: () => void;
}

const KEY = 'game';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export const useGameStore = create<GameState>((set, get) => ({
  lives: 5,
  lastLifeLostAt: null,
  hints: 3,
  completed: {},
  totalStars: 0,
  streakDays: 0,
  lastPlayedDate: null,
  hydrated: false,

  hydrate: async () => {
    const saved = await loadJSON(KEY, {
      lives: 5,
      lastLifeLostAt: null as number | null,
      hints: 3,
      completed: {} as Record<number, LevelResult>,
      totalStars: 0,
      streakDays: 0,
      lastPlayedDate: null as string | null,
    });
    set({ ...saved, hydrated: true });
  },

  initForProfile: (profile) => {
    if (get().hydrated && get().lastPlayedDate) return; // don't clobber returning players
    set({ lives: profile.startingLives, hints: profile.freeHintsPerLevel });
  },

  loseLife: (profile) => {
    if (!profile.wrongAttemptsCostLives) return false;
    const { lives } = get();
    if (lives <= 0) return false;
    const next = lives - 1;
    set({ lives: next, lastLifeLostAt: Date.now() });
    saveJSON(KEY, { ...get() });
    return true;
  },

  regenLivesIfDue: (profile) => {
    const { lives, lastLifeLostAt } = get();
    if (profile.lifeRegenMs <= 0) return;
    if (lives >= profile.startingLives || !lastLifeLostAt) return;
    const elapsed = Date.now() - lastLifeLostAt;
    const regained = Math.floor(elapsed / profile.lifeRegenMs);
    if (regained > 0) {
      const next = Math.min(profile.startingLives, lives + regained);
      set({ lives: next, lastLifeLostAt: next >= profile.startingLives ? null : Date.now() });
      saveJSON(KEY, { ...get() });
    }
  },

  useHint: () => {
    const { hints } = get();
    if (hints <= 0) return false;
    set({ hints: hints - 1 });
    saveJSON(KEY, { ...get() });
    return true;
  },

  refillHints: (n) => {
    set({ hints: n });
    saveJSON(KEY, { ...get() });
  },

  recordLevelComplete: (levelId, score, stars) => {
    const { completed, totalStars } = get();
    const prev = completed[levelId];
    const prevStars = prev?.stars ?? 0;
    const nextEntry: LevelResult = {
      levelId,
      stars: (Math.max(stars, prevStars) as 1 | 2 | 3),
      bestScore: Math.max(score, prev?.bestScore ?? 0),
    };
    const nextCompleted = { ...completed, [levelId]: nextEntry };
    const addedStars = nextEntry.stars - prevStars;
    set({ completed: nextCompleted, totalStars: totalStars + addedStars });
    get().bumpStreak();
    saveJSON(KEY, { ...get() });
  },

  bumpStreak: () => {
    const today = todayStr();
    const { lastPlayedDate, streakDays } = get();
    if (lastPlayedDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const nextStreak = lastPlayedDate === yesterday ? streakDays + 1 : 1;
    set({ streakDays: nextStreak, lastPlayedDate: today });
  },
}));
