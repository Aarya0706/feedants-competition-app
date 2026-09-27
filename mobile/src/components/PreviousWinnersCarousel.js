import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { colors, spacing, radius, shadow } from '../theme/colors';

const RANK_STYLE = {
  1: { bg: colors.goldLight, color: colors.gold },
  2: { bg: colors.background, color: colors.silver },
  3: { bg: '#FBEAE0', color: colors.bronze },
};

export default function PreviousWinnersCarousel({ winners }) {
  if (!winners?.length) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Previous Winners</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {winners.map((winner, index) => {
          const rank = RANK_STYLE[index + 1];
          return (
            <Pressable
              key={`${winner.name}-${index}`}
              style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
              onPress={() => winner.videoUrl && Linking.openURL(winner.videoUrl)}
            >
              <View style={styles.thumbnailWrap}>
                {winner.thumbnailUrl ? (
                  <Image source={{ uri: winner.thumbnailUrl }} style={styles.thumbnail} />
                ) : (
                  <View style={[styles.thumbnail, styles.thumbnailFallback]}>
                    <Text style={styles.thumbnailInitial}>{winner.name.charAt(0)}</Text>
                  </View>
                )}
                {!!winner.videoUrl && (
                  <View style={styles.playOverlay}>
                    <Text style={styles.playIcon}>▶</Text>
                  </View>
                )}
                {!!rank && (
                  <View style={[styles.rankBadge, { backgroundColor: rank.bg }]}>
                    <Text style={[styles.rankBadgeText, { color: rank.color }]}>{index + 1}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.name} numberOfLines={1}>
                {winner.name}
              </Text>
              <Text style={styles.position}>{winner.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, ...shadow.card },
  title: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginBottom: spacing.md },
  scrollContent: { paddingRight: spacing.sm },
  item: { width: 92, marginRight: spacing.md, alignItems: 'center' },
  itemPressed: { opacity: 0.65 },
  thumbnailWrap: { position: 'relative' },
  thumbnail: { width: 78, height: 94, borderRadius: radius.md, backgroundColor: colors.background },
  thumbnailFallback: { alignItems: 'center', justifyContent: 'center' },
  thumbnailInitial: { color: colors.primary, fontSize: 22, fontWeight: '700' },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 24, 40, 0.28)',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { color: '#fff', fontSize: 14 },
  rankBadge: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeText: { fontSize: 11, fontWeight: '800' },
  name: { fontSize: 11, color: colors.textPrimary, fontWeight: '700', marginTop: spacing.sm },
  position: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
});
