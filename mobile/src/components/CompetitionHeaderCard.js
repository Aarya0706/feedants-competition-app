import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, shadow } from '../theme/colors';

export default function CompetitionHeaderCard({ competition, state, viewer }) {
  const spotsPercent = Math.min((competition.spotsBooked / competition.maxSpots) * 100, 100);
  const isNearlyFull = spotsPercent >= 80;

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{competition.title}</Text>
        {viewer.isRegistered && (
          <View
            style={[
              styles.registeredBadge,
              viewer.registrationStatus !== 'confirmed' && styles.pendingBadge,
            ]}
          >
            <Text
              style={[
                styles.registeredBadgeText,
                viewer.registrationStatus !== 'confirmed' && styles.pendingBadgeText,
              ]}
            >
              {viewer.registrationStatus === 'confirmed' ? '✓ Registered' : 'Pending payment'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.tagsRow}>
        {competition.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
        {!!competition.highlightNote && <Text style={styles.highlightNote}>🏆 {competition.highlightNote}</Text>}
      </View>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Prize Pool</Text>
          <Text style={styles.statValue}>₹{competition.prizePoolTotal}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Entry Fee</Text>
          <Text style={styles.statValue}>
            {Number(competition.entryFee) === 0 ? 'Free' : `₹${competition.entryFee}`}
          </Text>
        </View>
      </View>

      <View style={styles.spotsBlock}>
        <View style={styles.spotsLabelRow}>
          <Text style={[styles.spotsLabel, isNearlyFull && styles.spotsLabelUrgent]}>
            {state.isFull ? 'No spots left' : `Only ${state.spotsLeft} spots left`}
          </Text>
          <Text style={styles.spotsCount}>
            {competition.spotsBooked}/{competition.maxSpots}
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${spotsPercent}%` },
              isNearlyFull && styles.progressFillUrgent,
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 21, fontWeight: '800', color: colors.textPrimary, flexShrink: 1, letterSpacing: -0.3 },
  registeredBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginLeft: spacing.sm,
  },
  pendingBadge: { backgroundColor: colors.warningLight },
  registeredBadgeText: { color: colors.primary, fontWeight: '700', fontSize: 11 },
  pendingBadgeText: { color: colors.warning },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: spacing.sm, gap: spacing.sm },
  tag: { backgroundColor: colors.background, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 5 },
  tagText: { color: colors.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  highlightNote: { color: colors.textSecondary, fontSize: 12, fontWeight: '500' },
  divider: { height: 1, backgroundColor: colors.border, marginTop: spacing.lg },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
  stat: { flex: 1 },
  statDivider: { width: 1, height: 32, backgroundColor: colors.border, marginHorizontal: spacing.lg },
  statLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '600', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.3 },
  statValue: { color: colors.textPrimary, fontSize: 19, fontWeight: '800' },
  spotsBlock: { marginTop: spacing.lg },
  spotsLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  spotsLabel: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  spotsLabelUrgent: { color: colors.danger },
  spotsCount: { color: colors.textMuted, fontSize: 11, fontWeight: '600' },
  progressTrack: { height: 6, backgroundColor: colors.background, borderRadius: radius.pill, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.pill },
  progressFillUrgent: { backgroundColor: colors.danger },
});
