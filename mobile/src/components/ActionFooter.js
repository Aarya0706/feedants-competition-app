import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, shadow } from '../theme/colors';

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
  const insets = useSafeAreaInsets();

  const handlePress = () => {
    if (busy || !action.enabled) return;
    if (action.key === 'REGISTER') return onRegister();
    if (action.key === 'PAY') return onPay();
    if (action.key === 'SUBMIT') return onSubmitEntry();
    if (action.key === 'RESULTS') return onViewResults();
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      <Pressable
        onPress={handlePress}
        disabled={!action.enabled || busy}
        style={({ pressed }) => [
          styles.button,
          !action.enabled && styles.buttonDisabled,
          pressed && action.enabled && styles.buttonPressed,
        ]}
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
  wrapper: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadow.raised,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonPressed: { backgroundColor: colors.accentDark },
  buttonDisabled: { backgroundColor: colors.textMuted },
  buttonLabel: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.2 },
  buttonSub: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2, fontWeight: '600' },
});
