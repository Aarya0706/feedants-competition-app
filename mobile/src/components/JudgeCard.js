import React from 'react';
import { View, Text, Image, StyleSheet, Pressable, Linking } from 'react-native';
import { colors, spacing, radius, shadow } from '../theme/colors';

export default function JudgeCard({ judge }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatarRing}>
        {judge.photoUrl ? (
          <Image source={{ uri: judge.photoUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitial}>{judge.name.charAt(0)}</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.role}>{judge.title}</Text>
        <Text style={styles.name}>{judge.name}</Text>
        {!!judge.subtitle && <Text style={styles.subtitle}>{judge.subtitle}</Text>}
        {!!judge.experienceLabel && <Text style={styles.subtitle}>{judge.experienceLabel}</Text>}
      </View>

      {!!judge.introVideoUrl && (
        <Pressable
          style={({ pressed }) => [styles.playButton, pressed && styles.playButtonPressed]}
          onPress={() => Linking.openURL(judge.introVideoUrl)}
        >
          <View style={styles.playCircle}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
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
    ...shadow.card,
  },
  avatarRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2,
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
  },
  avatar: { width: '100%', height: '100%', borderRadius: 26 },
  avatarFallback: { backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: colors.primary, fontSize: 20, fontWeight: '700' },
  info: { flex: 1, marginLeft: spacing.md },
  role: { color: colors.textMuted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  name: { color: colors.textPrimary, fontSize: 16, fontWeight: '800', marginTop: 2 },
  subtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 1 },
  playButton: { alignItems: 'center' },
  playButtonPressed: { opacity: 0.6 },
  playCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { color: colors.primary, fontSize: 14 },
  playLabel: { color: colors.primary, fontSize: 10, fontWeight: '700', marginTop: 4 },
});
