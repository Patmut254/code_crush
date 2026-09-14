import { Platform } from 'react-native';
import Constants from 'expo-constants';

// react-native-purchases types are loosely used here to keep this file
// buildable even before the native module is linked in a bare workflow.
let Purchases: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Purchases = require('react-native-purchases').default;
} catch {
  Purchases = null;
}

export const ENTITLEMENT_ID = 'code_crush_pro';
export const MONTHLY_PACKAGE_ID = 'code_crush_pro_monthly';
export const YEARLY_PACKAGE_ID = 'code_crush_pro_yearly';

let initialized = false;

export async function initRevenueCat(appUserId?: string): Promise<{ ok: boolean; error?: string }> {
  if (!Purchases) return { ok: false, error: 'RevenueCat SDK not linked (Expo Go / missing native module).' };
  try {
    const androidKey = Constants.expoConfig?.extra?.revenueCatAndroidKey as string | undefined;
    if (Platform.OS === 'android' && androidKey && androidKey !== 'YOUR_REVENUECAT_ANDROID_PUBLIC_SDK_KEY') {
      await Purchases.configure({ apiKey: androidKey, appUserID: appUserId });
      initialized = true;
      return { ok: true };
    }
    return { ok: false, error: 'Missing RevenueCat Android public SDK key in app.json extra.' };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'Unknown RevenueCat init error' };
  }
}

export async function isPro(): Promise<boolean> {
  if (!initialized || !Purchases) return false;
  try {
    const info = await Purchases.getCustomerInfo();
    return !!info?.entitlements?.active?.[ENTITLEMENT_ID];
  } catch (e) {
    console.warn('[revenuecat] getCustomerInfo failed', e);
    return false;
  }
}

export async function getOfferings(): Promise<any | null> {
  if (!initialized || !Purchases) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings?.current ?? null;
  } catch (e) {
    console.warn('[revenuecat] getOfferings failed', e);
    return null;
  }
}

export async function purchasePackage(pkg: any): Promise<{ ok: boolean; error?: string; cancelled?: boolean }> {
  if (!initialized || !Purchases) return { ok: false, error: 'RevenueCat not initialized' };
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const active = !!customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];
    return { ok: active };
  } catch (e: any) {
    if (e?.userCancelled) return { ok: false, cancelled: true };
    return { ok: false, error: e?.message ?? 'Purchase failed' };
  }
}

export async function restorePurchases(): Promise<{ ok: boolean; error?: string }> {
  if (!initialized || !Purchases) return { ok: false, error: 'RevenueCat not initialized' };
  try {
    const info = await Purchases.restorePurchases();
    const active = !!info?.entitlements?.active?.[ENTITLEMENT_ID];
    return { ok: active };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'Restore failed' };
  }
}
