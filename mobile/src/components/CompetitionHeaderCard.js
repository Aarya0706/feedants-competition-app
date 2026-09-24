import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

export default function CompetitionHeaderCard({ competition, state, viewer }) {
  const spotsPercent = Math.min((competition.spotsBooked / competition.maxSpots) * 100, 100);

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{competition.title}</Text>
        {viewer.isRegistered && (
          <View style={styles.registeredBadge}>
            <Text style={styles.registeredBadgeText}>
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

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Prize Pool</Text>
          <Text style={styles.statValue}>₹ {competition.prizePoolTotal}</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Entry Fee</Text>
          <Text style={styles.statValue}>₹ {competition.entryFee}</Text>
        </View>
        <View style={styles.spotsBlock}>
          <Text style={styles.statLabel}>
            {state.isFull ? 'No spots left' : `Only ${state.spotsLeft} spots left`}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${spotsPercent}%` }]} />
          </View>
          <Text style={styles.spotsCount}>
            {competition.spotsBooked} / {competition.maxSpots} Booked
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, flexShrink: 1 },
  registeredBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  registeredBadgeText: { color: colors.primary, fontWeight: '600', fontSize: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: spacing.sm, gap: spacing.sm },
  tag: { backgroundColor: colors.background, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  tagText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
  highlightNote: { color: colors.textSecondary, fontSize: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'flex-start', marginTop: spacing.lg },
  stat: { marginRight: spacing.xl },
  statLabel: { color: colors.textMuted, fontSize: 12, marginBottom: 4 },
  statValue: { color: colors.textPrimary, fontSize: 18, fontWeight: '700' },
  spotsBlock: { flex: 1, marginLeft: spacing.lg },
  progressTrack: { height: 4, backgroundColor: colors.border, borderRadius: radius.pill, marginTop: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  spotsCount: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
});
