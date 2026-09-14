import { create } from 'zustand';
import { AgeGroup, getAgeProfile, AgeProfile } from '@/data/ageProfiles';
import { saveJSON, loadJSON } from '@/services/storageService';

interface PlayerState {
  name: string;
  ageGroup: AgeGroup;
  onboarded: boolean;
  hydrated: boolean;
  profile: AgeProfile;
  hydrate: () => Promise<void>;
  setNameAndAge: (name: string, ageGroup: AgeGroup) => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const KEY = 'player';

export const usePlayerStore = create<PlayerState>((set, get) => ({
  name: '',
  ageGroup: 'adult',
  onboarded: false,
  hydrated: false,
  profile: getAgeProfile('adult'),

  hydrate: async () => {
    const saved = await loadJSON(KEY, { name: '', ageGroup: 'adult' as AgeGroup, onboarded: false });
    set({
      name: saved.name,
      ageGroup: saved.ageGroup,
      onboarded: saved.onboarded,
      profile: getAgeProfile(saved.ageGroup),
      hydrated: true,
    });
  },

  setNameAndAge: async (name, ageGroup) => {
    const clean = name.trim().slice(0, 16) || 'Coder';
    set({ name: clean, ageGroup, onboarded: true, profile: getAgeProfile(ageGroup) });
    await saveJSON(KEY, { name: clean, ageGroup, onboarded: true });
  },

  resetOnboarding: async () => {
    set({ name: '', ageGroup: 'adult', onboarded: false, profile: getAgeProfile('adult') });
    await saveJSON(KEY, { name: '', ageGroup: 'adult', onboarded: false });
  },
}));
