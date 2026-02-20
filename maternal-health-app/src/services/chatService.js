
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../config';

const TOKEN_KEY = 'auth_token';

export const sendChatMessage = async (message) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  const response = await fetch(`${API_BASE}/chatbot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error('Chat request failed');
    error.response = { data };
    throw error;
  }

  return data;
};

