import React, { useState } from 'react';
 
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/colors';
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
        <Text style={styles.errorText}>{error?.message || 'Could not load this competition.'}</Text>
        <Pressable onPress={reload} style={styles.retryButton}>
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
        <Pressable onPress={onGoBack} style={styles.backButton}>
          <Text style={styles.backLabel}>← Go back</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
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
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: spacing.lg },
  errorText: { color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.md },
  retryButton: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 8 },
  retryLabel: { color: '#fff', fontWeight: '700' },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  backButton: {},
  backLabel: { color: colors.textPrimary, fontWeight: '600' },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  disclaimerBox: { backgroundColor: colors.primaryLight, borderRadius: 12, padding: spacing.md, marginBottom: spacing.md },
  disclaimerText: { color: colors.accent, fontSize: 12 },
});
