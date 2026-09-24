import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

export default function SubmissionModal({ visible, onClose, onSubmit, submitting }) {
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleSubmit = () => {
    if (!mediaUrl.trim()) return;
    onSubmit({ mediaUrl: mediaUrl.trim(), caption: caption.trim() });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Upload Submission</Text>
          <Text style={styles.hint}>Paste a link to your uploaded performance video.</Text>

          <TextInput
            style={styles.input}
            placeholder="https://..."
            value={mediaUrl}
            onChangeText={setMediaUrl}
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, styles.captionInput]}
            placeholder="Caption (optional)"
            value={caption}
            onChangeText={setCaption}
            multiline
          />

          <View style={styles.actions}>
            <Pressable style={[styles.actionButton, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.cancelLabel}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.submitButton, !mediaUrl.trim() && styles.submitDisabled]}
              onPress={handleSubmit}
              disabled={!mediaUrl.trim() || submitting}
            >
              <Text style={styles.submitLabel}>{submitting ? 'Submitting...' : 'Submit'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.card, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.lg },
  title: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  hint: { fontSize: 12, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: 13,
    marginBottom: spacing.md,
  },
  captionInput: { minHeight: 60, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md },
  actionButton: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.sm },
  cancelButton: { backgroundColor: colors.background },
  cancelLabel: { color: colors.textSecondary, fontWeight: '600' },
  submitButton: { backgroundColor: colors.accent },
  submitDisabled: { backgroundColor: colors.textMuted },
  submitLabel: { color: '#fff', fontWeight: '700' },
});
