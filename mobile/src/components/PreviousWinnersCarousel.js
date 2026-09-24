import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

export default function PreviousWinnersCarousel({ winners }) {
  if (!winners?.length) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Previous Winners</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {winners.map((winner, index) => (
          <Pressable
            key={`${winner.name}-${index}`}
            style={styles.item}
            onPress={() => winner.videoUrl && Linking.openURL(winner.videoUrl)}
          >
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
            <Text style={styles.name} numberOfLines={1}>
              {winner.name}
            </Text>
            <Text style={styles.position}>{winner.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  title: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.md },
  item: { width: 88, marginRight: spacing.md, alignItems: 'center' },
  thumbnail: { width: 72, height: 88, borderRadius: radius.md, backgroundColor: colors.border },
  thumbnailFallback: { alignItems: 'center', justifyContent: 'center' },
  thumbnailInitial: { color: colors.primary, fontSize: 22, fontWeight: '700' },
  playOverlay: {
    position: 'absolute',
    top: 32,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: radius.pill,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { color: '#fff', fontSize: 11 },
  name: { fontSize: 11, color: colors.textPrimary, fontWeight: '600', marginTop: spacing.xs },
  position: { fontSize: 10, color: colors.textMuted },
});
