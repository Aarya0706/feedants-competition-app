import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, radius, shadow } from '../theme/colors';

export default function SubmissionModal({ visible, onClose, onSubmit, submitting }) {
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleSubmit = () => {
    if (!mediaUrl.trim()) return;
    onSubmit({ mediaUrl: mediaUrl.trim(), caption: caption.trim() });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Upload Submission</Text>
          <Text style={styles.hint}>Paste a link to your uploaded performance video.</Text>

          <Text style={styles.fieldLabel}>Media link</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor={colors.textMuted}
            value={mediaUrl}
            onChangeText={setMediaUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.fieldLabel}>Caption (optional)</Text>
          <TextInput
            style={[styles.input, styles.captionInput]}
            placeholder="Say a bit about your entry..."
            placeholderTextColor={colors.textMuted}
            value={caption}
            onChangeText={setCaption}
            multiline
          />

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.actionButton, styles.cancelButton, pressed && styles.pressedDim]}
              onPress={onClose}
            >
              <Text style={styles.cancelLabel}>Cancel</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.submitButton,
                !mediaUrl.trim() && styles.submitDisabled,
                pressed && mediaUrl.trim() && styles.pressedDim,
              ]}
              onPress={handleSubmit}
              disabled={!mediaUrl.trim() || submitting}
            >
              <Text style={styles.submitLabel}>{submitting ? 'Submitting...' : 'Submit'}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    paddingTop: spacing.sm,
    ...shadow.raised,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.md },
  title: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  hint: { fontSize: 12, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  captionInput: { minHeight: 64, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md, marginTop: spacing.xs },
  actionButton: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radius.md },
  pressedDim: { opacity: 0.75 },
  cancelButton: { backgroundColor: colors.background },
  cancelLabel: { color: colors.textSecondary, fontWeight: '700' },
  submitButton: { backgroundColor: colors.accent },
  submitDisabled: { backgroundColor: colors.textMuted },
  submitLabel: { color: '#fff', fontWeight: '700' },
});
