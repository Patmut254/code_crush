import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { gifSource, GifKey } from '@/constants/gifs';

interface Props {
  gifKey: GifKey;
  visible: boolean;
  onDone: () => void;
  durationMs?: number;
  size?: number;
}

/** Full-feedback GIF moment — used for correct words, level completion, unlocks, streaks. */
export default function GifBurst({ gifKey, visible, onDone, durationMs = 1200, size = 160 }: Props) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onDone, durationMs);
    return () => clearTimeout(t);
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(200)}
      pointerEvents="none"
      style={styles.overlay}
    >
      <Image source={gifSource(gifKey)} style={{ width: size, height: size }} contentFit="contain" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
});
