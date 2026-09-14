import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LEVELS, getAgeAppropriateLevel } from '@/data/levels';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useGameStore } from '@/store/useGameStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { validateWord } from '@/game/levelValidator';
import { pointsForWord, comboMultiplier, calculateStars } from '@/game/gameEngine';
import LetterGrid from '@/components/LetterGrid';
import GifBurst from '@/components/GifBurst';
import { playSfx } from '@/services/audioService';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { GifKey } from '@/constants/gifs';

export default function GameScreen() {
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const router = useRouter();
  const profile = usePlayerStore((s) => s.profile);
  const game = useGameStore();
  const settings = useSettingsStore();

  const baseLevel = LEVELS.find((l) => l.id === Number(levelId)) ?? LEVELS[0];
  const level = useMemo(
    () => getAgeAppropriateLevel(baseLevel, profile.id, profile.maxGridSize, profile.maxWordLength),
    [baseLevel.id, profile.id],
  );

  const [found, setFound] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsedThisLevel, setHintsUsedThisLevel] = useState(0);
  const [gif, setGif] = useState<GifKey | null>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    game.regenLivesIfDue(profile);
  }, []);

  function handlePathComplete(path: number[]) {
    const result = validateWord(path, level.letters, level.gridSize, level.targetWords, found);

    if (result.alreadyFound) return;

    if (!result.valid) {
      setCombo(0);
      setMistakes((m) => m + 1);
      playSfx('invalid', settings.soundOn);
      game.loseLife(profile);
      return;
    }

    const nextCombo = combo + 1;
    setCombo(nextCombo);
    const pts = Math.round(pointsForWord(result.word.length) * comboMultiplier(nextCombo));
    setScore((s) => s + pts);
    const nextFound = [...found, result.word];
    setFound(nextFound);
    playSfx('valid', settings.soundOn);

    if (profile.celebrateEveryWord) {
      setGif('wordCorrect');
    }

    if (nextFound.length === level.targetWords.length) {
      finishLevel(nextFound.length);
    }
  }

  function finishLevel(wordsFound: number) {
    const stars = calculateStars(
      { score, mistakes, hintsUsed: hintsUsedThisLevel },
      level.targetWords.length,
      profile.guidedMode,
    );
    game.recordLevelComplete(level.id, score, stars);
    playSfx('levelComplete', settings.soundOn);
    setGif(profile.id === 'toddler' ? 'toddlerCheer' : 'levelComplete');
    setComplete(true);
  }

  function useHint() {
    const remaining = level.targetWords.filter((w) => !found.includes(w));
    if (remaining.length === 0) return;
    const ok = game.useHint();
    if (!ok) return;
    setHintsUsedThisLevel((h) => h + 1);
    // MVP hint: just reveal the next undiscovered word directly.
    // (A fuller version would highlight only its first letter/path on the grid.)
    const revealed = remaining[0];
    playSfx('unlock', settings.soundOn);
    setFound((f) => {
      const next = [...f, revealed];
      if (next.length === level.targetWords.length) finishLevel(next.length);
      return next;
    });
  }

  if (complete) {
    return (
      <View style={styles.container}>
        <GifBurst gifKey={gif ?? 'levelComplete'} visible={!!gif} onDone={() => setGif(null)} durationMs={2000} />
        <View style={styles.completeCard}>
          <Text style={styles.completeTitle}>🎉 LEVEL COMPLETE!</Text>
          <Text style={styles.completePoints}>+{score} points</Text>
          <Text style={styles.completeStars}>
            {'⭐'.repeat(calculateStars({ score, mistakes, hintsUsed: hintsUsedThisLevel }, level.targetWords.length, profile.guidedMode))}
          </Text>
          <Text style={styles.wordsFoundLabel}>Words found</Text>
          {found.map((w) => (
            <Text key={w} style={styles.wordFound}>{w}</Text>
          ))}
          <Pressable style={styles.primaryBtn} onPress={() => router.push(`/game/${level.id + 1}`)}>
            <Text style={styles.primaryBtnText}>NEXT LEVEL</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} onPress={() => router.back()}>
            <Text style={styles.secondaryBtnText}>Back to levels</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GifBurst gifKey={gif ?? 'wordCorrect'} visible={!!gif} onDone={() => setGif(null)} />

      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.topBarText}>Level {level.id}</Text>
        <Text style={styles.topBarText}>❤️ {game.lives}</Text>
        <Text style={styles.topBarText}>⭐ {score}</Text>
      </View>

      <View style={styles.targetsRow}>
        <Text style={styles.targetsLabel}>TARGET WORDS</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {level.targetWords.map((w) => (
            <Text key={w} style={[styles.targetWord, found.includes(w) && styles.targetWordFound]}>
              {found.includes(w) ? w : '•'.repeat(w.length)}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.gridWrap}>
        <LetterGrid letters={level.letters} gridSize={level.gridSize} profile={profile} onPathComplete={handlePathComplete} />
      </View>

      <Pressable style={styles.hintBtn} onPress={useHint}>
        <Text style={styles.hintBtnText}>💡 Hint ({game.hints})</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: SPACING(4) },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING(4) },
  backText: { color: COLORS.textMuted },
  topBarText: { color: COLORS.text, fontWeight: '700' },
  targetsRow: { marginBottom: SPACING(4) },
  targetsLabel: { color: COLORS.textMuted, fontSize: 12, marginBottom: SPACING(1) },
  targetWord: { color: COLORS.textMuted, fontWeight: '700', letterSpacing: 2 },
  targetWordFound: { color: COLORS.success, textDecorationLine: 'line-through' },
  gridWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hintBtn: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING(3),
    alignItems: 'center',
    marginTop: SPACING(3),
  },
  hintBtnText: { color: COLORS.gold, fontWeight: '700' },
  completeCard: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING(6) },
  completeTitle: { color: COLORS.text, fontSize: 24, fontWeight: '900', marginBottom: SPACING(2) },
  completePoints: { color: COLORS.accent, fontSize: 18, fontWeight: '700', marginBottom: SPACING(2) },
  completeStars: { fontSize: 28, marginBottom: SPACING(3) },
  wordsFoundLabel: { color: COLORS.textMuted, marginBottom: SPACING(1) },
  wordFound: { color: COLORS.text, fontWeight: '700' },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.pill, paddingVertical: SPACING(3.5), paddingHorizontal: SPACING(8), marginTop: SPACING(5) },
  primaryBtnText: { color: COLORS.text, fontWeight: '800' },
  secondaryBtn: { marginTop: SPACING(3) },
  secondaryBtnText: { color: COLORS.textMuted },
});
