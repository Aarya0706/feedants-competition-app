import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Linking } from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

export default function JudgeCard({ judge }) {
  return (
    <View style={styles.card}>
      {judge.photoUrl ? (
        <Image source={{ uri: judge.photoUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Text style={styles.avatarInitial}>{judge.name.charAt(0)}</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.role}>{judge.title}</Text>
        <Text style={styles.name}>{judge.name}</Text>
        {!!judge.subtitle && <Text style={styles.subtitle}>{judge.subtitle}</Text>}
        {!!judge.experienceLabel && <Text style={styles.subtitle}>{judge.experienceLabel}</Text>}
      </View>

      {!!judge.introVideoUrl && (
        <Pressable style={styles.playButton} onPress={() => Linking.openURL(judge.introVideoUrl)}>
          <Text style={styles.playIcon}>▶</Text>
          <Text style={styles.playLabel}>Intro Video</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  avatarFallback: { backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: colors.primary, fontSize: 20, fontWeight: '700' },
  info: { flex: 1, marginLeft: spacing.md },
  role: { color: colors.textMuted, fontSize: 12 },
  name: { color: colors.textPrimary, fontSize: 16, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, fontSize: 12 },
  playButton: { alignItems: 'center' },
  playIcon: { color: colors.primary, fontSize: 20 },
  playLabel: { color: colors.primary, fontSize: 11, marginTop: 2 },
});
