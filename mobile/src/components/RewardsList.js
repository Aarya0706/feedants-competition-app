import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, shadow } from '../theme/colors';

const MEDAL = {
  1: { icon: '🏆', bg: colors.goldLight, color: colors.gold },
  2: { icon: '🥈', bg: colors.background, color: colors.silver },
  3: { icon: '🥉', bg: '#FBEAE0', color: colors.bronze },
};
const DEFAULT_MEDAL = { icon: '⭐', bg: colors.primaryLight, color: colors.primary };

export default function RewardsList({ rewards, currency }) {
  if (!rewards?.length) return null;
  const sorted = rewards.slice().sort((a, b) => a.position - b.position);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        Rewards <Text style={styles.subtitle}>(All Positions)</Text>
      </Text>
      {sorted.map((reward, index) => {
        const medal = MEDAL[reward.position] || DEFAULT_MEDAL;
        return (
          <View key={reward.position} style={[styles.row, index === sorted.length - 1 && styles.rowLast]}>
            <View style={[styles.iconWrap, { backgroundColor: medal.bg }]}>
              <Text style={styles.icon}>{medal.icon}</Text>
            </View>
            <Text style={styles.label}>{reward.label}</Text>
            <Text style={[styles.amount, { color: medal.color }]}>
              {currency === 'INR' ? '₹' : `${currency} `}{reward.amount}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, ...shadow.card },
  title: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { fontSize: 12, fontWeight: '500', color: colors.textMuted },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  rowLast: { borderBottomWidth: 0 },
  iconWrap: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  icon: { fontSize: 14 },
  label: { flex: 1, color: colors.textPrimary, fontSize: 13, fontWeight: '600' },
  amount: { fontSize: 14, fontWeight: '800' },
});
