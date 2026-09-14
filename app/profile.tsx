import { View, Text, StyleSheet, Pressable, Switch, ScrollView } from 'react-native';
import { useState } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useGameStore } from '@/store/useGameStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { usePremiumStore } from '@/store/usePremiumStore';
import { AGE_PROFILES, AgeGroup } from '@/data/ageProfiles';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import BottomNav from '@/components/BottomNav';

export default function Profile() {
  const { name, ageGroup, setNameAndAge } = usePlayerStore();
  const { totalStars, streakDays } = useGameStore();
  const { soundOn, musicOn, toggleSound, toggleMusic } = useSettingsStore();
  const { isPro, restore, loading, lastError } = usePremiumStore();
  const [restoreMsg, setRestoreMsg] = useState<string | null>(null);

  async function handleRestore() {
    const res = await restore();
    setRestoreMsg(res.ok ? 'Purchases restored ✅' : res.error ?? 'Nothing to restore');
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: SPACING(5), paddingBottom: SPACING(24) }}>
        <Text style={styles.title}>👤 {name || 'Coder'}</Text>
        <Text style={styles.subtitle}>{isPro ? 'Code Crush Pro member 💎' : 'Free player'}</Text>

        <View style={styles.statsRow}>
          <Text style={styles.stat}>⭐ {totalStars} total stars</Text>
          <Text style={styles.stat}>🔥 {streakDays} day streak</Text>
        </View>

        <Text style={styles.sectionLabel}>Age mode</Text>
        {Object.values(AGE_PROFILES).map((p) => (
          <Pressable
            key={p.id}
            onPress={() => setNameAndAge(name, p.id as AgeGroup)}
            style={[styles.ageRow, ageGroup === p.id && styles.ageRowActive]}
          >
            <Text style={styles.ageRowText}>{p.label} ({p.ageRange})</Text>
            {ageGroup === p.id && <Text style={styles.checkmark}>✓</Text>}
          </Pressable>
        ))}

        <Text style={styles.sectionLabel}>Settings</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>🔊 Sound</Text>
          <Switch value={soundOn} onValueChange={toggleSound} />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>🎵 Music</Text>
          <Switch value={musicOn} onValueChange={toggleMusic} />
        </View>

        <Pressable style={styles.restoreBtn} onPress={handleRestore} disabled={loading}>
          <Text style={styles.restoreBtnText}>{loading ? 'Checking…' : 'Restore purchases'}</Text>
        </Pressable>
        {restoreMsg && <Text style={styles.restoreMsg}>{restoreMsg}</Text>}
        {lastError && <Text style={styles.errorMsg}>{lastError}</Text>}
      </ScrollView>
      <BottomNav active="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  title: { color: COLORS.text, fontSize: 24, fontWeight: '900' },
  subtitle: { color: COLORS.accent, marginBottom: SPACING(4) },
  statsRow: { flexDirection: 'row', gap: SPACING(4), marginBottom: SPACING(6) },
  stat: { color: COLORS.textMuted, fontWeight: '600' },
  sectionLabel: { color: COLORS.textMuted, fontSize: 12, marginTop: SPACING(4), marginBottom: SPACING(2) },
  ageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING(3.5),
    marginBottom: SPACING(2),
  },
  ageRowActive: { borderWidth: 2, borderColor: COLORS.accent },
  ageRowText: { color: COLORS.text, fontWeight: '600' },
  checkmark: { color: COLORS.accent, fontWeight: '900' },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: SPACING(3.5),
    marginBottom: SPACING(2),
  },
  settingLabel: { color: COLORS.text, fontWeight: '600' },
  restoreBtn: { backgroundColor: COLORS.card, borderRadius: RADIUS.pill, padding: SPACING(3.5), alignItems: 'center', marginTop: SPACING(4) },
  restoreBtnText: { color: COLORS.text, fontWeight: '700' },
  restoreMsg: { color: COLORS.success, textAlign: 'center', marginTop: SPACING(2) },
  errorMsg: { color: COLORS.danger, textAlign: 'center', marginTop: SPACING(2), fontSize: 12 },
});
