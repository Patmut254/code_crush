import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'codecrush:';

export async function saveJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('[storage] save failed', key, e);
  }
}

export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn('[storage] load failed', key, e);
    return fallback;
  }
}

export async function clearAll(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const mine = keys.filter((k) => k.startsWith(PREFIX));
  await AsyncStorage.multiRemove(mine);
}
