import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, radius, shadow } from '../theme/colors';

const TABS = [
  { key: 'about', label: 'About' },
  { key: 'judging', label: 'Judging' },
  { key: 'rules', label: 'Rules' },
];

export default function InfoTabs({ about, judgingParameters, rulesAndEligibility }) {
  const [active, setActive] = useState('about');
  const [expanded, setExpanded] = useState(false);

  const content = { about, judging: judgingParameters, rules: rulesAndEligibility }[active] || '';
  const isLong = content.length > 140;
  const shown = expanded || !isLong ? content : `${content.slice(0, 140)}...`;

  return (
    <View style={styles.card}>
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.key}
            onPress={() => {
              setActive(tab.key);
              setExpanded(false);
            }}
            style={[styles.tabButton, active === tab.key && styles.tabButtonActive]}
          >
            <Text style={[styles.tabLabel, active === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.content}>{shown || 'No details provided yet.'}</Text>

      {isLong && (
        <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={8}>
          <Text style={styles.viewMore}>{expanded ? 'View less ▲' : 'View more ▼'}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, ...shadow.card },
  tabRow: { flexDirection: 'row', backgroundColor: colors.background, borderRadius: radius.md, padding: 4, marginBottom: spacing.md },
  tabButton: { flex: 1, paddingVertical: 8, borderRadius: radius.sm, alignItems: 'center' },
  tabButtonActive: { backgroundColor: colors.card, ...shadow.card },
  tabLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  tabLabelActive: { color: colors.primary },
  content: { color: colors.textSecondary, fontSize: 13, lineHeight: 21 },
  viewMore: { color: colors.primary, fontWeight: '700', fontSize: 12, marginTop: spacing.sm },
});
