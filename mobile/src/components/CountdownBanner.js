import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme/colors';
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
      <Text style={styles.icon}>⏳</Text>
      <Text style={styles.label}>{target.label}</Text>
      <Text style={styles.countdown}>{parts.label}</Text>
      {isUrgent && <Text style={styles.hurry}>⏰ Hurry up!</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  bannerUrgent: { backgroundColor: '#FDECEC' },
  icon: { marginRight: spacing.xs },
  label: { color: colors.textPrimary, fontWeight: '600', fontSize: 13, flexShrink: 1 },
  countdown: { color: colors.primary, fontWeight: '700', fontSize: 14, marginLeft: 'auto' },
  hurry: { color: colors.danger, fontSize: 12, fontWeight: '600', width: '100%', textAlign: 'right', marginTop: 4 },
});
