import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'https://feedants-competition-app.vercel.app/api';

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