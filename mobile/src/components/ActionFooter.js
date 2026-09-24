import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, radius } from '../theme/colors';

// Single source of truth for what the primary CTA should say and do,
// given the server's derived competition state + this viewer's
// participation state. Kept as one function so there's exactly one place
// that encodes "what button shows when" — no scattered if/else in the JSX.
function resolveAction(state, viewer) {
  if (viewer.isRegistered) {
    if (viewer.registrationStatus === 'pending') {
      return { key: 'PAY', label: 'Complete Payment', sub: 'Registered', enabled: true };
    }
    if (state.submissionState === 'open') {
      return {
        key: 'SUBMIT',
        label: viewer.hasSubmitted ? 'Update Submission' : 'Upload Submission',
        sub: 'Registered',
        enabled: true,
      };
    }
    if (state.submissionState === 'not_started') {
      return { key: 'NONE', label: 'Submissions Not Open Yet', sub: 'Registered', enabled: false };
    }
    if (state.resultsDeclared) {
      return { key: 'RESULTS', label: 'View Results', sub: 'Registered', enabled: true };
    }
    return { key: 'NONE', label: 'Submission Closed', sub: 'Registered', enabled: false };
  }

  if (state.registrationState === 'open') {
    return { key: 'REGISTER', label: 'Register Now', sub: null, enabled: true };
  }
  if (state.registrationState === 'full') {
    return { key: 'NONE', label: 'All Spots Full', sub: null, enabled: false };
  }
  if (state.registrationState === 'not_started') {
    return { key: 'NONE', label: 'Registration Opens Soon', sub: null, enabled: false };
  }
  return { key: 'NONE', label: 'Registration Closed', sub: null, enabled: false };
}

export default function ActionFooter({ state, viewer, busy, onRegister, onPay, onSubmitEntry, onViewResults }) {
  const action = resolveAction(state, viewer);

  const handlePress = () => {
    if (busy || !action.enabled) return;
    if (action.key === 'REGISTER') return onRegister();
    if (action.key === 'PAY') return onPay();
    if (action.key === 'SUBMIT') return onSubmitEntry();
    if (action.key === 'RESULTS') return onViewResults();
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={handlePress}
        disabled={!action.enabled || busy}
        style={[styles.button, (!action.enabled || busy) && styles.buttonDisabled]}
      >
        {busy ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.buttonLabel}>{action.label}</Text>
            {!!action.sub && <Text style={styles.buttonSub}>{action.sub}</Text>}
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: spacing.md, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: colors.textMuted },
  buttonLabel: { color: '#fff', fontSize: 15, fontWeight: '700' },
  buttonSub: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 },
});
