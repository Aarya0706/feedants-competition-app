import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme/colors';
import { formatDateParts } from '../utils/dateUtils';

function DateCell({ icon, label, iso }) {
  const { datePart, timePart } = formatDateParts(iso);
  return (
    <View style={styles.cell}>
      <Text style={styles.icon}>{icon}</Text>
      <View>
        <Text style={styles.cellLabel}>{label}</Text>
        <Text style={styles.cellDate}>{datePart}</Text>
        <Text style={styles.cellTime}>{timePart}</Text>
      </View>
    </View>
  );
}

export default function ImportantDatesGrid({ dates }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Important Dates</Text>
      <View style={styles.grid}>
        <DateCell icon="📅" label="Register Before" iso={dates.registrationClosesAt} />
        <DateCell icon="📨" label="Submission Starts" iso={dates.submissionStartsAt} />
        <DateCell icon="⬆️" label="Submission Ends" iso={dates.submissionEndsAt} />
        <DateCell icon="🏆" label="Result Date" iso={dates.resultDate} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  title: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.lg },
  cell: { flexDirection: 'row', width: '48%', alignItems: 'flex-start' },
  icon: { fontSize: 16, marginRight: spacing.sm },
  cellLabel: { color: colors.textMuted, fontSize: 11 },
  cellDate: { color: colors.textPrimary, fontSize: 13, fontWeight: '700', marginTop: 2 },
  cellTime: { color: colors.textSecondary, fontSize: 12 },
});
