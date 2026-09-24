import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

const MEDAL_ICON = { 1: '🏆', 2: '🥈', 3: '🥉' };

export default function RewardsList({ rewards, currency }) {
  if (!rewards?.length) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Rewards <Text style={styles.subtitle}>(All Positions)</Text>
      </Text>
      {rewards
        .slice()
        .sort((a, b) => a.position - b.position)
        .map((reward) => (
          <View key={reward.position} style={styles.row}>
            <Text style={styles.icon}>{MEDAL_ICON[reward.position] || '⭐'}</Text>
            <Text style={styles.label}>{reward.label}</Text>
            <Text style={styles.amount}>
              {currency === 'INR' ? '₹' : currency} {reward.amount}
            </Text>
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  title: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  subtitle: { fontSize: 12, fontWeight: '400', color: colors.textMuted },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  icon: { width: 24, fontSize: 16 },
  label: { flex: 1, color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  amount: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },
});
