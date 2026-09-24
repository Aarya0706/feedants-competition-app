import AsyncStorage from '@react-native-async-storage/async-storage';

// Point this at your machine's LAN IP when running on a physical device -
// "localhost" only resolves inside the iOS simulator, not on a real phone
// or the Android emulator (use 10.0.2.2 for the Android emulator).
export const API_BASE_URL = 'http://localhost:4000/api';

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (auth) {
    const token = await AsyncStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.error?.message || `Request failed (${res.status})`;
    const error = new Error(message);
    error.code = data?.error?.code;
    error.status = res.status;
    throw error;
  }

  return data;
}

export default request;
