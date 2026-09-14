import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { COLORS, RADIUS } from '@/constants/theme';
import { AgeProfile } from '@/data/ageProfiles';

interface Props {
  letters: string[];
  gridSize: number;
  profile: AgeProfile;
  onPathComplete: (path: number[]) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 24;

export default function LetterGrid({ letters, gridSize, profile, onPathComplete }: Props) {
  const [path, setPath] = useState<number[]>([]);
  const cellSize = Math.floor(((SCREEN_WIDTH - GRID_PADDING * 2) / gridSize) - 8 * profile.uiScale);

  const cellCenter = useCallback(
    (index: number) => {
      const r = Math.floor(index / gridSize);
      const c = index % gridSize;
      const step = cellSize + 8 * profile.uiScale;
      return { x: c * step + cellSize / 2, y: r * step + cellSize / 2 };
    },
    [cellSize, gridSize, profile.uiScale],
  );

  function indexFromPoint(x: number, y: number): number | null {
    const step = cellSize + 8 * profile.uiScale;
    const c = Math.floor(x / step);
    const r = Math.floor(y / step);
    if (r < 0 || c < 0 || r >= gridSize || c >= gridSize) return null;
    return r * gridSize + c;
  }

  function addToPath(idx: number) {
    setPath((prev) => {
      if (prev.includes(idx)) return prev;
      return [...prev, idx];
    });
  }

  const panGesture = Gesture.Pan()
    .onBegin((e) => {
      const idx = indexFromPoint(e.x, e.y);
      if (idx !== null) runOnJSAdd(idx);
    })
    .onUpdate((e) => {
      const idx = indexFromPoint(e.x, e.y);
      if (idx !== null) runOnJSAdd(idx);
    })
    .onEnd(() => {
      runOnJSFinish();
    });

  function runOnJSAdd(idx: number) {
    addToPath(idx);
  }
  function runOnJSFinish() {
    setPath((prev) => {
      if (prev.length > 0) onPathComplete(prev);
      return [];
    });
  }

  function handleTap(idx: number) {
    // toddler / kid tap-in-order mode: each tap extends the word; tapping the
    // last-selected cell again submits it, keeping this dead simple for tiny fingers.
    if (path.length > 0 && path[path.length - 1] === idx) {
      onPathComplete(path);
      setPath([]);
      return;
    }
    addToPath(idx);
  }

  const gridStyle = {
    width: gridSize * (cellSize + 8 * profile.uiScale) - 8 * profile.uiScale,
    height: gridSize * (cellSize + 8 * profile.uiScale) - 8 * profile.uiScale,
  };

  const content = (
    <View style={[styles.grid, gridStyle]}>
      {letters.map((letter, idx) => {
        const selected = path.includes(idx);
        const order = path.indexOf(idx);
        return (
          <Cell
            key={idx}
            letter={letter}
            size={cellSize}
            selected={selected}
            guided={profile.guidedMode && order === path.length - 1 && !selected}
            onPress={profile.inputMode === 'tapInOrder' ? () => handleTap(idx) : undefined}
          />
        );
      })}
    </View>
  );

  if (profile.inputMode === 'dragTrace') {
    return <GestureDetector gesture={panGesture}>{content}</GestureDetector>;
  }
  return content;
}

function Cell({
  letter,
  size,
  selected,
  guided,
  onPress,
}: {
  letter: string;
  size: number;
  selected: boolean;
  guided?: boolean;
  onPress?: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function press() {
    scale.value = withSpring(1.15, {}, () => {
      scale.value = withSpring(1);
    });
    onPress?.();
  }

  return (
    <Animated.View
      style={[
        styles.cell,
        { width: size, height: size, margin: 4 },
        selected && styles.cellSelected,
        guided && styles.cellGuided,
        animStyle,
      ]}
      onTouchStart={onPress ? press : undefined}
    >
      <Text style={[styles.cellText, { fontSize: size * 0.4 }]}>{letter}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'center' },
  cell: {
    backgroundColor: COLORS.bgAlt,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellSelected: { backgroundColor: COLORS.primary },
  cellGuided: { borderWidth: 3, borderColor: COLORS.gold },
  cellText: { color: COLORS.text, fontWeight: '800' },
});
