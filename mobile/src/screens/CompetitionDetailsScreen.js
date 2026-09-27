import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '../theme/colors';
import useCompetitionDetails from '../hooks/useCompetitionDetails';
import { registerForCompetition, confirmPayment, submitEntry } from '../api/competitions';
import { showAlert } from '../utils/alert';
import CompetitionHeaderCard from '../components/CompetitionHeaderCard';
import JudgeCard from '../components/JudgeCard';
import CountdownBanner from '../components/CountdownBanner';
import ImportantDatesGrid from '../components/ImportantDatesGrid';
import PreviousWinnersCarousel from '../components/PreviousWinnersCarousel';
import InfoTabs from '../components/InfoTabs';
import RewardsList from '../components/RewardsList';
import ActionFooter from '../components/ActionFooter';
import SubmissionModal from '../components/SubmissionModal';

export default function CompetitionDetailsScreen({ competitionId, onGoBack }) {
  const { data, error, loading, reload, getServerNow } = useCompetitionDetails(competitionId);
  const [busy, setBusy] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error?.message || 'Could not load this competition.'}</Text>
        <Pressable
          onPress={reload}
          style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
        >
          <Text style={styles.retryLabel}>Retry</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const { competition, state, viewer } = data;

  const handleRegister = async () => {
    setBusy(true);
    try {
      const res = await registerForCompetition(competitionId);
      await reload();
      if (res.registration.status === 'pending') {
        showAlert('Almost there', 'Your spot is reserved. Complete payment to confirm your registration.');
      } else {
        showAlert('Registered!', "You're all set for this competition.");
      }
    } catch (err) {
      showAlert('Registration failed', err.message);
    } finally {
      setBusy(false);
    }
  };

  // In production this triggers the Razorpay checkout SDK; here we mock a
  // successful payment to demonstrate the confirm-payment flow end to end.
  const handlePay = async () => {
    setBusy(true);
    try {
      await confirmPayment(competitionId, `mock_${Date.now()}`);
      await reload();
      showAlert('Payment successful', "You're registered for this competition.");
    } catch (err) {
      showAlert('Payment failed', err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSubmitEntry = async ({ mediaUrl, caption }) => {
    setBusy(true);
    try {
      await submitEntry(competitionId, mediaUrl, caption);
      await reload();
      setModalVisible(false);
      showAlert('Submitted!', 'Your entry has been received.');
    } catch (err) {
      showAlert('Submission failed', err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable
          onPress={onGoBack}
          hitSlop={8}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        >
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          Competition Details
        </Text>
        <View style={styles.topBarSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
      >
        <CompetitionHeaderCard competition={competition} state={state} viewer={viewer} />
        <JudgeCard judge={competition.judge} />
        <CountdownBanner competition={competition} state={state} getServerNow={getServerNow} />
        <ImportantDatesGrid dates={competition.dates} />
        <PreviousWinnersCarousel winners={competition.previousWinners} />
        <InfoTabs
          about={competition.about}
          judgingParameters={competition.judgingParameters}
          rulesAndEligibility={competition.rulesAndEligibility}
        />
        <RewardsList rewards={competition.rewards} currency={competition.currency} />

        {!!competition.disclaimer && (
          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>ℹ️ Disclaimer: {competition.disclaimer}</Text>
          </View>
        )}
      </ScrollView>

      <ActionFooter
        state={state}
        viewer={viewer}
        busy={busy}
        onRegister={handleRegister}
        onPay={handlePay}
        onSubmitEntry={() => setModalVisible(true)}
        onViewResults={() => showAlert('Results', 'Results screen not in scope for this assignment.')}
      />

      <SubmissionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitEntry}
        submitting={busy}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: spacing.xl },
  errorIcon: { fontSize: 32, marginBottom: spacing.sm },
  errorTitle: { color: colors.textPrimary, fontWeight: '800', fontSize: 16, marginBottom: spacing.xs },
  errorText: { color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg, fontSize: 13 },
  retryButton: { backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm, borderRadius: radius.md },
  retryButtonPressed: { backgroundColor: colors.accent },
  retryLabel: { color: '#fff', fontWeight: '700' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: { opacity: 0.7 },
  backIcon: { fontSize: 16, color: colors.textPrimary, fontWeight: '700' },
  topBarTitle: { flex: 1, textAlign: 'center', color: colors.textPrimary, fontWeight: '700', fontSize: 14, marginHorizontal: spacing.sm },
  topBarSpacer: { width: 34 },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  disclaimerBox: { backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  disclaimerText: { color: colors.accent, fontSize: 12, lineHeight: 18 },
});
