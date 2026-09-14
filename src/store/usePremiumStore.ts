import { create } from 'zustand';
import * as RC from '@/services/revenueCatService';

interface PremiumState {
  isPro: boolean;
  loading: boolean;
  rcAvailable: boolean;
  lastError: string | null;
  offering: any | null;

  init: (appUserId?: string) => Promise<void>;
  refreshEntitlement: () => Promise<void>;
  loadOfferings: () => Promise<void>;
  buy: (pkg: any) => Promise<{ ok: boolean; cancelled?: boolean; error?: string }>;
  restore: () => Promise<{ ok: boolean; error?: string }>;
}

export const usePremiumStore = create<PremiumState>((set, get) => ({
  isPro: false,
  loading: false,
  rcAvailable: false,
  lastError: null,
  offering: null,

  init: async (appUserId) => {
    set({ loading: true });
    const res = await RC.initRevenueCat(appUserId);
    set({ rcAvailable: res.ok, lastError: res.error ?? null });
    if (res.ok) {
      await get().refreshEntitlement();
      await get().loadOfferings();
    }
    set({ loading: false });
  },

  refreshEntitlement: async () => {
    const pro = await RC.isPro();
    set({ isPro: pro });
  },

  loadOfferings: async () => {
    const offering = await RC.getOfferings();
    set({ offering });
  },

  buy: async (pkg) => {
    set({ loading: true });
    const res = await RC.purchasePackage(pkg);
    if (res.ok) set({ isPro: true });
    set({ loading: false, lastError: res.error ?? null });
    return res;
  },

  restore: async () => {
    set({ loading: true });
    const res = await RC.restorePurchases();
    if (res.ok) set({ isPro: true });
    set({ loading: false, lastError: res.error ?? null });
    return res;
  },
}));
