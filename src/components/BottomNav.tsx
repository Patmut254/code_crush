import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING } from '@/constants/theme';

const TABS = [
  { key: 'home', icon: '🏠', label: 'Home', route: '/home' },
  { key: 'levels', icon: '🎮', label: 'Levels', route: '/levels' },
  { key: 'profile', icon: '👤', label: 'Profile', route: '/profile' },
  { key: 'shop', icon: '💎', label: 'Pro', route: '/shop' },
] as const;

export default function BottomNav({ active }: { active: string }) {
  const router = useRouter();
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => (
        <Pressable key={tab.key} onPress={() => router.push(tab.route as any)} style={styles.tab}>
          <Text style={{ fontSize: 20, opacity: active === tab.key ? 1 : 0.5 }}>{tab.icon}</Text>
          <Text style={[styles.label, active === tab.key && styles.labelActive]}>{tab.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    paddingVertical: SPACING(2.5),
    borderTopWidth: 1,
    borderTopColor: COLORS.bgAlt,
  },
  tab: { flex: 1, alignItems: 'center' },
  label: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  labelActive: { color: COLORS.text, fontWeight: '700' },
});
