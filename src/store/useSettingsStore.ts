import { create } from 'zustand';
import { saveJSON, loadJSON } from '@/services/storageService';

interface SettingsState {
  soundOn: boolean;
  musicOn: boolean;
  theme: 'classic' | 'premiumNeon';
  hydrate: () => Promise<void>;
  toggleSound: () => void;
  toggleMusic: () => void;
  setTheme: (t: 'classic' | 'premiumNeon') => void;
}

const KEY = 'settings';

export const useSettingsStore = create<SettingsState>((set, get) => ({
  soundOn: true,
  musicOn: true,
  theme: 'classic',

  hydrate: async () => {
    const saved = await loadJSON(KEY, { soundOn: true, musicOn: true, theme: 'classic' as const });
    set(saved);
  },
  toggleSound: () => {
    set({ soundOn: !get().soundOn });
    saveJSON(KEY, get());
  },
  toggleMusic: () => {
    set({ musicOn: !get().musicOn });
    saveJSON(KEY, get());
  },
  setTheme: (t) => {
    set({ theme: t });
    saveJSON(KEY, get());
  },
}));
