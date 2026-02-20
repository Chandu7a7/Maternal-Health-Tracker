import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { register, setAuthToken } from '../services/api';

const PRIMARY = '#ec135b';
const BG_LIGHT = '#f8f6f6';
const BG_INPUT = '#f0ecec';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    age: '',
    pregnancyMonth: '1',
    password: '',
    familyContact: '',
    doctorContact: '',
  });
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleRegister = async () => {
    if (!form.name.trim() || !form.mobile || !form.password) {
      Alert.alert('Error', 'Please fill Name, Mobile and Password');
      return;
    }
    if (form.mobile.length !== 10) {
      Alert.alert('Error', 'Mobile number must be 10 digits');
      return;
    }
    if (form.password.length < 4) {
      Alert.alert('Error', 'Password must be at least 4 characters');
      return;
    }
    const month = parseInt(form.pregnancyMonth);
    if (month < 1 || month > 9) {
      Alert.alert('Error', 'Pregnancy month must be between 1 and 9');
      return;
    }
    setLoading(true);
    try {
      console.log('[Register] Attempting registration for:', form.mobile);
      const data = await register({
        name: form.name.trim(),
        age: parseInt(form.age) || 25,
        mobile: form.mobile.trim(),
        pregnancyMonth: month || 1,
        password: form.password,
        familyContact: form.familyContact.trim(),
        doctorContact: form.doctorContact.trim(),
      });
      console.log('[Register] Success! Token received');
      await setAuthToken(data.token);
      console.log('[Register] Token saved, navigating to Dashboard...');
      navigation.replace('Main');
    } catch (err) {
      console.error('[Register] Error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      Alert.alert('Registration Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: BG_LIGHT }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🤰</Text>
          </View>
          <Text style={styles.logoTitle}>Maternal Health</Text>
          <Text style={styles.logoSubtitle}>Your companion for a healthy journey</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Your Account</Text>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#94a3b8"
                value={form.name}
                onChangeText={(v) => update('name', v)}
              />
            </View>
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>📞</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter mobile number"
                placeholderTextColor="#94a3b8"
                value={form.mobile}
                onChangeText={(v) => update('mobile', v)}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Age</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🎂</Text>
              <TextInput
                style={styles.input}
                placeholder="Your age"
                placeholderTextColor="#94a3b8"
                value={form.age}
                onChangeText={(v) => update('age', v)}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Pregnancy Month (1-9)</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>📅</Text>
              <TextInput
                style={styles.input}
                placeholder="Current month"
                placeholderTextColor="#94a3b8"
                value={form.pregnancyMonth}
                onChangeText={(v) => update('pregnancyMonth', v)}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#94a3b8"
                value={form.password}
                onChangeText={(v) => update('password', v)}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.btnText}>{loading ? 'Registering...' : 'Register'}</Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            By registering, you agree to our healthcare privacy standards and terms of use.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigating back to Login...');
              navigation.navigate('Login');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.footerLink}>Login</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.decor}>
          <View style={styles.decorShape}>
            <Text style={styles.decorIcon}>❤️</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 80 },
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${PRIMARY}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoIcon: { fontSize: 40 },
  logoTitle: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  logoSubtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  cardTitle: { fontSize: 20, fontWeight: '600', color: '#0f172a', marginBottom: 20 },
  inputWrap: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#334155', marginBottom: 6, marginLeft: 4 },
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
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: '#0f172a' },
  btn: {
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  terms: { fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 20, paddingHorizontal: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14, color: '#475569' },
  footerLink: { fontSize: 14, fontWeight: 'bold', color: PRIMARY },
  decor: { alignItems: 'center', marginTop: 32, opacity: 0.4 },
  decorShape: {
    width: 200,
    height: 80,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    backgroundColor: `${PRIMARY}20`,
    borderWidth: 1,
    borderColor: `${PRIMARY}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorIcon: { fontSize: 32 },
});
