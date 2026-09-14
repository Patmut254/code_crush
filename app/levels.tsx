import { View, Text, StyleSheet, SectionList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LEVELS, WORLD_META, isWorldUnlocked } from '@/data/levels';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useGameStore } from '@/store/useGameStore';
import { usePremiumStore } from '@/store/usePremiumStore';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import BottomNav from '@/components/BottomNav';

const FREE_LEVEL_LIMIT = 15;

export default function Levels() {
  const router = useRouter();
  const profile = usePlayerStore((s) => s.profile);
  const { completed } = useGameStore();
  const isPro = usePremiumStore((s) => s.isPro);
  const completedIds = Object.keys(completed).map(Number);

  const sections = WORLD_META.filter((w) => profile.allowedWorlds.includes(w.index)).map((world) => ({
    title: `World ${world.index + 1} · ${world.name}`,
    unlocked: isWorldUnlocked(world.index, profile.allowedWorlds, completedIds),
    data: LEVELS.filter((l) => l.world === world.index),
  }));

  return (
    <View style={styles.container}>
      <SectionList
        contentContainerStyle={{ padding: SPACING(5), paddingBottom: SPACING(24) }}
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}{!section.unlocked ? ' 🔒' : ''}</Text>
        )}
        renderItem={({ item, section, index }) => {
          const result = completed[item.id];
          const prevInWorldDone = index === 0 || !!completed[section.data[index - 1].id];
          const requiresPro = item.id > FREE_LEVEL_LIMIT && !isPro;
          const locked = !section.unlocked || (!prevInWorldDone && !result) || requiresPro;
          return (
            <Pressable
              disabled={locked}
              onPress={() => router.push(`/game/${item.id}`)}
              style={[styles.levelCard, locked && styles.levelCardLocked]}
            >
              <Text style={styles.levelStars}>
                {result ? '⭐'.repeat(result.stars) + '☆'.repeat(3 - result.stars) : requiresPro ? '💎' : locked ? '🔒' : '○'}
              </Text>
              <Text style={styles.levelName}>Level {item.id}</Text>
              {requiresPro && <Text style={styles.proTag}>PRO</Text>}
            </Pressable>
          );
        }}
      />
      <BottomNav active="levels" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  sectionTitle: { color: COLORS.text, fontWeight: '800', fontSize: 16, marginTop: SPACING(4), marginBottom: SPACING(2) },
  levelCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING(4),
    marginBottom: SPACING(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelCardLocked: { opacity: 0.4 },
  levelStars: { fontSize: 16 },
  levelName: { color: COLORS.text, fontWeight: '700' },
  proTag: { color: COLORS.gold, fontWeight: '800', fontSize: 12 },
});
