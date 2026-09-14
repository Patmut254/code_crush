import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useGameStore } from '@/store/useGameStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { usePremiumStore } from '@/store/usePremiumStore';
import { COLORS } from '@/constants/theme';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const player = usePlayerStore();
  const game = useGameStore();
  const settings = useSettingsStore();
  const premium = usePremiumStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    (async () => {
      await Promise.all([player.hydrate(), game.hydrate(), settings.hydrate()]);
      await premium.init(player.name || undefined);
      game.initForProfile(player.profile);
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    const inOnboarding = segments[0] === 'onboarding';
    if (!player.onboarded && !inOnboarding) {
      router.replace('/onboarding');
    }
  }, [ready, player.onboarded, segments]);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.bg } }} />
    </GestureHandlerRootView>
  );
}
