import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { usePremiumStore } from '@/store/usePremiumStore';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import BottomNav from '@/components/BottomNav';

const FEATURES = [
  'All levels',
  'Unlimited lives',
  'More hints',
  'Premium themes',
  'No interruptions',
];

export default function Shop() {
  const router = useRouter();
  const { isPro, offering, loading, rcAvailable, lastError, buy, restore } = usePremiumStore();
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const monthlyPkg = offering?.monthly ?? null;
  const annualPkg = offering?.annual ?? null;

  async function handleBuy(pkg: any, label: string) {
    if (!pkg) return;
    setPurchasing(label);
    setMsg(null);
    const res = await buy(pkg);
    setPurchasing(null);
    if (res.ok) {
      setMsg('Welcome to Code Crush Pro! 🎉');
    } else if (res.cancelled) {
      setMsg(null);
    } else {
      setMsg(res.error ?? 'Purchase failed — try again.');
    }
  }

  if (isPro) {
    return (
      <View style={styles.container}>
        <View style={styles.centerCard}>
          <Text style={styles.proBadge}>💎</Text>
          <Text style={styles.proTitle}>You're Pro!</Text>
          <Text style={styles.proSubtitle}>All levels, unlimited lives, and more hints are unlocked.</Text>
          <Pressable style={styles.primaryBtn} onPress={() => router.push('/levels')}>
            <Text style={styles.primaryBtnText}>Keep playing</Text>
          </Pressable>
        </View>
        <BottomNav active="shop" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.centerCard}>
        <Text style={styles.title}>CODE CRUSH PRO</Text>
        <Text style={styles.subtitle}>Unlock your full coding journey.</Text>

        {FEATURES.map((f) => (
          <Text key={f} style={styles.feature}>✓ {f}</Text>
        ))}

        {!rcAvailable && (
          <Text style={styles.warning}>
            {lastError ?? 'Store connection unavailable right now — you can still play free levels.'}
          </Text>
        )}

        <Pressable
          style={[styles.primaryBtn, !monthlyPkg && styles.btnDisabled]}
          disabled={!monthlyPkg || !!purchasing}
          onPress={() => handleBuy(monthlyPkg, 'monthly')}
        >
          {purchasing === 'monthly' ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <Text style={styles.primaryBtnText}>START FREE TRIAL — $2.99/mo</Text>
          )}
        </Pressable>

        <Pressable
          style={[styles.secondaryBtn, !annualPkg && styles.btnDisabled]}
          disabled={!annualPkg || !!purchasing}
          onPress={() => handleBuy(annualPkg, 'annual')}
        >
          {purchasing === 'annual' ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <Text style={styles.secondaryBtnText}>Yearly — $19.99/yr (save 44%)</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.maybeLater}>MAYBE LATER</Text>
        </Pressable>

        {msg && <Text style={styles.msg}>{msg}</Text>}
        {loading && <ActivityIndicator color={COLORS.primary} style={{ marginTop: SPACING(2) }} />}
      </View>
      <BottomNav active="shop" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  centerCard: { flex: 1, justifyContent: 'center', padding: SPACING(6) },
  title: { color: COLORS.text, fontSize: 26, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: COLORS.accent, textAlign: 'center', marginBottom: SPACING(5) },
  feature: { color: COLORS.text, fontSize: 15, marginBottom: SPACING(1.5) },
  warning: { color: COLORS.gold, fontSize: 12, marginVertical: SPACING(3), textAlign: 'center' },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.pill, paddingVertical: SPACING(4), alignItems: 'center', marginTop: SPACING(5) },
  primaryBtnText: { color: COLORS.text, fontWeight: '800' },
  secondaryBtn: { paddingVertical: SPACING(3), alignItems: 'center' },
  secondaryBtnText: { color: COLORS.textMuted, fontWeight: '700' },
  btnDisabled: { opacity: 0.4 },
  maybeLater: { color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING(3), letterSpacing: 1 },
  msg: { color: COLORS.success, textAlign: 'center', marginTop: SPACING(3) },
  proBadge: { fontSize: 48, textAlign: 'center' },
  proTitle: { color: COLORS.text, fontSize: 24, fontWeight: '900', textAlign: 'center', marginTop: SPACING(2) },
  proSubtitle: { color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING(2), marginBottom: SPACING(5) },
});
