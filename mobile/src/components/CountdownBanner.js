import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, shadow } from '../theme/colors';
import { getCountdownParts } from '../utils/dateUtils';

// Picks the next relevant deadline based on the competition's current
// lifecycle stage, so the banner is always useful instead of always
// pointing at "registration closes" even after registration has ended.
function pickTarget(competition, state) {
  if (state.registrationState === 'open') {
    return { label: 'Registration closes in', target: competition.dates.registrationClosesAt };
  }
  if (state.submissionState === 'open') {
    return { label: 'Submissions close in', target: competition.dates.submissionEndsAt };
  }
  if (state.submissionState === 'not_started') {
    return { label: 'Submissions open in', target: competition.dates.submissionStartsAt };
  }
  return null;
}

export default function CountdownBanner({ competition, state, getServerNow }) {
  const target = pickTarget(competition, state);
  const [now, setNow] = useState(getServerNow());

  useEffect(() => {
    if (!target) return undefined;
    const interval = setInterval(() => setNow(getServerNow()), 1000);
    return () => clearInterval(interval);
  }, [target, getServerNow]);

  if (!target) return null;

  const parts = getCountdownParts(target.target, now);
  if (!parts) return null; // deadline just passed; next poll will refresh state

  const isUrgent = parts.days === 0 && parts.hours < 12;

  return (
    <View style={[styles.banner, isUrgent && styles.bannerUrgent]}>
      <View style={[styles.iconWrap, isUrgent && styles.iconWrapUrgent]}>
        <Text style={styles.icon}>{isUrgent ? '⏰' : '⏳'}</Text>
      </View>
      <View style={styles.textBlock}>
        <Text style={[styles.label, isUrgent && styles.labelUrgent]}>{target.label}</Text>
        <Text style={[styles.countdown, isUrgent && styles.countdownUrgent]}>{parts.label}</Text>
      </View>
      {isUrgent && (
        <View style={styles.hurryPill}>
          <Text style={styles.hurryText}>Hurry up</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.card,
  },
  bannerUrgent: { backgroundColor: colors.dangerLight },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(15, 122, 110, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconWrapUrgent: { backgroundColor: 'rgba(220, 38, 38, 0.12)' },
  icon: { fontSize: 16 },
  textBlock: { flex: 1 },
  label: { color: colors.textSecondary, fontWeight: '600', fontSize: 12 },
  labelUrgent: { color: colors.danger },
  countdown: { color: colors.primary, fontWeight: '800', fontSize: 16, marginTop: 2 },
  countdownUrgent: { color: colors.danger },
  hurryPill: { backgroundColor: colors.danger, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 4, marginLeft: spacing.sm },
  hurryText: { color: '#fff', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.3 },
});
