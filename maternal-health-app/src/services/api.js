import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../config';

const TOKEN_KEY = 'auth_token';
let authToken = null;

async function request(method, path, body = null) {
  const url = `${API_BASE}${path}`;
  console.log(`[API] ${method} ${url}`, body ? { body } : '');
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  };
  if (body && (method === 'POST' || method === 'PUT')) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(url, opts);
    const data = await res.json().catch(() => ({ message: 'Invalid JSON response' }));
    console.log(`[API] Response ${res.status}:`, data);
    if (!res.ok) {
      const err = new Error(data.message || res.statusText || 'Request failed');
      err.response = { status: res.status, data };
      throw err;
    }
    return data;
  } catch (err) {
    if (err.message.includes('Network request failed') || err.message.includes('Failed to fetch')) {
      console.error('[API] Network error - check backend is running and API_BASE is correct:', API_BASE);
      throw new Error('Cannot connect to server. Please check your internet connection and ensure backend is running.');
    }
    throw err;
  }
}

export const setAuthToken = async (token) => {
  authToken = token;
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  else await AsyncStorage.removeItem(TOKEN_KEY);
};

export const loadStoredToken = async () => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) authToken = token;
  return token;
};

export const initAuth = async () => loadStoredToken();

export const register = (data) => request('POST', '/auth/register', data);
export const login = (mobile, password) => request('POST', '/auth/login', { mobile, password });
export const addSymptom = (symptomText) => request('POST', '/symptoms', { symptom: symptomText });
export const getSymptoms = () => request('GET', '/symptoms');
export const getRiskLevel = () => request('GET', '/risk/level');
export const recordMovement = (hasMovement, count) => request('POST', '/movements', { hasMovement, count });
export const getMovements = () => request('GET', '/movements');
export const triggerEmergency = (message) => request('POST', '/emergency', { message });
export const getUser = () => request('GET', '/auth/me');
export const updateProfile = (data) => request('PUT', '/auth/update-profile', data);
export const predictNutrition = (pregnancy_month) => request('POST', '/nutrition/predict-nutrition', { pregnancy_month });

export const analyzeAudio = async (uri, mimeType = 'audio/m4a') => {
  const url = `${API_BASE}/voice/analyze`;
  const token = await loadStoredToken();

  const formData = new FormData();
  formData.append('audio', {
    uri,
    type: mimeType,
    name: 'recording.m4a',
  });

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to analyze audio');
  return data;
};
