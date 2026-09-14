export const COLORS = {
  bg: '#0F172A',
  bgAlt: '#1E293B',
  card: '#1E2A47',
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  accent: '#00D9C0',
  success: '#2ECC71',
  danger: '#FF6B6B',
  gold: '#FFD166',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  lockedGrey: '#475569',
};

export const RADIUS = { sm: 10, md: 16, lg: 24, pill: 999 };

export const SPACING = (n: number) => n * 4;

// Simple theme swap unlocked by Code Crush Pro
export const THEMES = {
  classic: { primary: COLORS.primary, accent: COLORS.accent, bg: COLORS.bg },
  premiumNeon: { primary: '#FF00E5', accent: '#00FFF0', bg: '#05010F' },
};
