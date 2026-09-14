import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useGameStore } from '@/store/useGameStore';
import { WORLD_META } from '@/data/levels';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import BottomNav from '@/components/BottomNav';

export default function Home() {
  const router = useRouter();
  const { name, profile } = usePlayerStore();
  const { lives, totalStars, streakDays, completed } = useGameStore();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: SPACING(5), paddingBottom: SPACING(24) }}>
        <Text style={styles.title}>CODE CRUSH</Text>
        <Text style={styles.tagline}>Crush code. Level up.</Text>
        <Text style={styles.greeting}>Hey {name || 'Coder'} 👋 · {profile.label}</Text>

        <View style={styles.statsRow}>
          <Stat icon="🔥" label={`${streakDays} day streak`} />
          <Stat icon="❤️" label={`${lives} lives`} />
          <Stat icon="⭐" label={`${totalStars} stars`} />
        </View>

        <Pressable style={styles.playBtn} onPress={() => router.push('/levels')}>
          <Text style={styles.playBtnText}>▶ PLAY</Text>
        </Pressable>

        {WORLD_META.map((world) => {
          const unlockedForAge = profile.allowedWorlds.includes(world.index);
          const doneCount = world.levelIds.filter((id) => completed[id]).length;
          const pct = doneCount / world.levelIds.length;
          return (
            <View key={world.index} style={styles.worldCard}>
              <Text style={styles.worldName}>World {world.index + 1} · {world.name}</Text>
              {unlockedForAge ? (
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
                </View>
              ) : (
                <Text style={styles.lockedText}>🔒 Unlocks for older players</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
      <BottomNav active="home" />
    </View>
  );
}

function Stat({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.statPill}>
      <Text style={styles.statText}>{icon} {label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  title: { color: COLORS.text, fontSize: 30, fontWeight: '900' },
  tagline: { color: COLORS.accent, marginBottom: SPACING(2) },
  greeting: { color: COLORS.textMuted, marginBottom: SPACING(4) },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING(2), marginBottom: SPACING(5) },
  statPill: { backgroundColor: COLORS.card, borderRadius: RADIUS.pill, paddingVertical: SPACING(2), paddingHorizontal: SPACING(3) },
  statText: { color: COLORS.text, fontWeight: '600' },
  playBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING(5),
    alignItems: 'center',
    marginBottom: SPACING(6),
  },
  playBtnText: { color: COLORS.text, fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  worldCard: { backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: SPACING(4), marginBottom: SPACING(3) },
  worldName: { color: COLORS.text, fontWeight: '700', marginBottom: SPACING(2) },
  progressTrack: { height: 10, backgroundColor: COLORS.bgAlt, borderRadius: RADIUS.pill, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.accent },
  lockedText: { color: COLORS.lockedGrey },
});
