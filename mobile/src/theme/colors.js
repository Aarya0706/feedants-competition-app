export const colors = {
  primary: '#0F7A6E', // teal used for headings, active states, CTAs
  primaryLight: '#E4F3F0',
  primarySoft: '#D8EFEA',
  accent: '#0B5E54',
  accentDark: '#08453D',
  background: '#F4F7F6',
  card: '#FFFFFF',
  border: '#E7ECEA',
  textPrimary: '#101828',
  textSecondary: '#5B6B69',
  textMuted: '#8B9A98',
  success: '#1A9E7F',
  warning: '#D97706',
  warningLight: '#FEF3E2',
  danger: '#DC2626',
  dangerLight: '#FDECEC',
  gold: '#D4A017',
  goldLight: '#FBF1DA',
  silver: '#9AA5B1',
  bronze: '#C97A3D',
  overlay: 'rgba(16, 24, 40, 0.45)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

// Shared elevation so every card reads as sitting slightly above the
// background instead of looking flat/pasted-on. iOS uses shadow*, Android
// uses elevation — spreading this object gives both for free.
export const shadow = {
  card: {
    shadowColor: '#0B1F1C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  raised: {
    shadowColor: '#0B1F1C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 6,
  },
};
