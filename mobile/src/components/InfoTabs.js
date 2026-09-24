import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing } from '../theme/colors';

const TABS = [
  { key: 'about', label: 'About Competition' },
  { key: 'judging', label: 'Judging Parameters' },
  { key: 'rules', label: 'Rules & Eligibility' },
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
            style={styles.tabButton}
          >
            <Text style={[styles.tabLabel, active === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
            {active === tab.key && <View style={styles.tabUnderline} />}
          </Pressable>
        ))}
      </View>

      <Text style={styles.content}>{shown || 'No details provided yet.'}</Text>

      {isLong && (
        <Pressable onPress={() => setExpanded((v) => !v)}>
          <Text style={styles.viewMore}>{expanded ? 'View less ▲' : 'View more ▼'}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 16, padding: spacing.lg, marginBottom: spacing.md },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: spacing.md },
  tabButton: { marginRight: spacing.lg, paddingBottom: spacing.sm },
  tabLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  tabLabelActive: { color: colors.primary },
  tabUnderline: { height: 2, backgroundColor: colors.primary, marginTop: 6, borderRadius: 2 },
  content: { color: colors.textSecondary, fontSize: 13, lineHeight: 20 },
  viewMore: { color: colors.primary, fontWeight: '600', fontSize: 12, marginTop: spacing.sm },
});
