import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { login, setAuthToken } from '../services/api';

const PRIMARY = '#ec135b';
const BG_LIGHT = '#f8f6f6';
const BG_INPUT = '#e8e4e4';

export default function LoginScreen({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    console.log('[LoginScreen] Mounted');
  }, []);

  const handleLogin = async () => {
    if (!mobile.trim() || !password) {
      Alert.alert('Error', 'Please enter mobile number and password');
      return;
    }
    if (mobile.length !== 10) {
      Alert.alert('Error', 'Mobile number must be 10 digits');
      return;
    }
    setLoading(true);
    try {
      console.log('[Login] Attempting login for:', mobile);
      const data = await login(mobile.trim(), password);
      console.log('[Login] Success! Token received');
      await setAuthToken(data.token);
      console.log('[Login] Token saved, navigating to Dashboard...');
      navigation.replace('Main');
    } catch (err) {
      console.error('[Login] Error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      Alert.alert('Login Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: BG_LIGHT }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>👶</Text>
          </View>
          <Text style={styles.logoTitle}>Maternal Care</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSubtitle}>Sign in to track your journey</Text>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>📱</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter mobile number"
                placeholderTextColor="#94a3b8"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                maxLength={10}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
            </View>
          </View>

          <View style={styles.inputWrap}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity><Text style={styles.forgotLink}>Forgot Password?</Text></TouchableOpacity>
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                ref={passwordInputRef}
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.btnText}>{loading ? 'Signing in...' : 'Login'}</Text>
            <Text style={styles.btnArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New user? </Text>
            <TouchableOpacity
              onPress={() => {
                console.log('Navigating to Register...');
                navigation.navigate('Register');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.footerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dots}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 48 },
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${PRIMARY}20`,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoIcon: { fontSize: 36 },
  logoTitle: { fontSize: 14, fontWeight: '600', color: '#334155', letterSpacing: 2 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: { fontSize: 28, fontWeight: 'bold', color: '#0f172a' },
  cardSubtitle: { fontSize: 14, color: '#64748b', marginTop: 8, marginBottom: 24 },
  inputWrap: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: '#334155', marginBottom: 8, marginLeft: 4 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginLeft: 4 },
  forgotLink: { fontSize: 12, fontWeight: '600', color: PRIMARY },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BG_INPUT,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputIcon: { fontSize: 20, marginRight: 12 },
  input: { flex: 1, paddingVertical: 16, fontSize: 16, color: '#0f172a' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  btnArrow: { color: '#fff', fontSize: 18 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  footerText: { fontSize: 14, color: '#64748b' },
  footerLink: { fontSize: 14, fontWeight: 'bold', color: PRIMARY },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: `${PRIMARY}66` },
});
