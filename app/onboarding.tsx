import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { usePlayerStore } from '@/store/usePlayerStore';
import { AGE_PROFILES, AgeGroup } from '@/data/ageProfiles';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

const AGE_OPTIONS = Object.values(AGE_PROFILES);

export default function Onboarding() {
  const router = useRouter();
  const setNameAndAge = usePlayerStore((s) => s.setNameAndAge);
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('adult');
  const [step, setStep] = useState<'name' | 'age'>('name');

  const canContinue = name.trim().length > 0;

  async function finish() {
    await setNameAndAge(name, ageGroup);
    router.replace('/home');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>CODE CRUSH</Text>
      <Text style={styles.tagline}>Crush code. Level up.</Text>

      {step === 'name' ? (
        <View style={styles.card}>
          <Text style={styles.label}>What should we call you?</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your player name"
            placeholderTextColor={COLORS.textMuted}
            style={styles.input}
            maxLength={16}
            autoFocus
          />
          <Pressable
            disabled={!canContinue}
            onPress={() => setStep('age')}
            style={[styles.primaryBtn, !canContinue && { opacity: 0.4 }]}
          >
            <Text style={styles.primaryBtnText}>Continue</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>Who's playing?</Text>
          <Text style={styles.sublabel}>This tunes the whole game — grid size, difficulty, and how hints work.</Text>
          <FlatList
            data={AGE_OPTIONS}
            keyExtractor={(o) => o.id}
            style={{ marginVertical: SPACING(3) }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setAgeGroup(item.id)}
                style={[styles.ageOption, ageGroup === item.id && styles.ageOptionSelected]}
              >
                <Text style={styles.ageOptionTitle}>{item.label}</Text>
                <Text style={styles.ageOptionRange}>Ages {item.ageRange}</Text>
              </Pressable>
            )}
          />
          <Pressable onPress={finish} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Let's play, {name.trim() || 'Coder'}!</Text>
          </Pressable>
          <Pressable onPress={() => setStep('name')}>
            <Text style={styles.backLink}>← back</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, alignItems: 'center', paddingTop: SPACING(24), paddingHorizontal: SPACING(6) },
  logo: { color: COLORS.text, fontSize: 34, fontWeight: '900', letterSpacing: 1 },
  tagline: { color: COLORS.accent, marginTop: SPACING(1), marginBottom: SPACING(10) },
  card: { width: '100%', backgroundColor: COLORS.card, borderRadius: RADIUS.lg, padding: SPACING(5) },
  label: { color: COLORS.text, fontSize: 18, fontWeight: '700', marginBottom: SPACING(2) },
  sublabel: { color: COLORS.textMuted, fontSize: 13, marginBottom: SPACING(2) },
  input: {
    backgroundColor: COLORS.bgAlt,
    color: COLORS.text,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING(4),
    paddingVertical: SPACING(3),
    fontSize: 16,
    marginBottom: SPACING(4),
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING(3.5),
    alignItems: 'center',
  },
  primaryBtnText: { color: COLORS.text, fontWeight: '800', fontSize: 16 },
  ageOption: {
    backgroundColor: COLORS.bgAlt,
    borderRadius: RADIUS.md,
    padding: SPACING(3.5),
    marginBottom: SPACING(2.5),
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ageOptionSelected: { borderColor: COLORS.accent },
  ageOptionTitle: { color: COLORS.text, fontWeight: '700', fontSize: 16 },
  ageOptionRange: { color: COLORS.textMuted, marginTop: 2 },
  backLink: { color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING(3) },
});
