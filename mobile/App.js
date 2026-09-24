import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CompetitionDetailsScreen from './src/screens/CompetitionDetailsScreen';
import { API_BASE_URL } from './src/api/client';

// Keep the id you already have here.
const DEMO_COMPETITION_ID = '6ab54e92ded77a9b79d2cd30';

// DEV ONLY: signs in as the seeded demo user until a real login screen exists.
async function devLogin() {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'demo@feedants.test', password: 'password123' }),
  });
  const data = await res.json();
  if (data.token) await AsyncStorage.setItem('token', data.token);
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    devLogin().catch((e) => console.warn('Dev login failed', e)).finally(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <CompetitionDetailsScreen competitionId={DEMO_COMPETITION_ID} onGoBack={() => {}} />
    </SafeAreaProvider>
  );
}