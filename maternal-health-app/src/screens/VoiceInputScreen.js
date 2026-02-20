import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
  ScrollView,
} from 'react-native';
import { addSymptom } from '../services/api';
import { startRecording, stopRecording, requestPermissions } from '../services/voiceService';

const PRIMARY = '#ec135b';
const BG_LIGHT = '#f8f6f6';

export default function VoiceInputScreen() {
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    if (recording) {
      // Start pulse animations for two rings
      const createPulse = (animValue) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(animValue, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        );
      };

      const anim1 = createPulse(pulseAnim1);
      const anim2 = createPulse(pulseAnim2);
      
      // Stagger the animations
      setTimeout(() => anim2.start(), 1000);
      anim1.start();

      return () => {
        anim1.stop();
        anim2.stop();
        pulseAnim1.setValue(0);
        pulseAnim2.setValue(0);
      };
    } else {
      pulseAnim1.setValue(0);
      pulseAnim2.setValue(0);
    }
  }, [recording]);

  const handleVoicePress = async () => {
    if (recording) {
      setRecording(false);
      const { success, uri } = await stopRecording();
      if (success && uri) {
        // In real app, this would be transcribed text from API
        setText('Mujhe chakkar aa rahe hai');
      }
      return;
    }
    setRecording(true);
    await startRecording();
  };

  const handleSubmit = async () => {
    const symptom = text.trim();
    if (!symptom) {
      Alert.alert('Error', 'Please enter or record a symptom');
      return;
    }
    setLoading(true);
    try {
      const data = await addSymptom(symptom);
      setLastResult(data);
      setText('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      if (data.risk === 'High') {
        Alert.alert('⚠️ High Risk Detected', data.advice || 'Please consult your doctor immediately.');
      }
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (recording) {
      setRecording(false);
      stopRecording();
    }
    setText('');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Notification Banner */}
        {showSuccess && (
          <View style={styles.successBanner}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successText}>Your symptom has been recorded</Text>
          </View>
        )}

        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tell Us How You Feel Today</Text>
          <Text style={styles.headerSubtitle}>Press the mic and speak your symptoms</Text>
        </View>

        {/* Main Section: Microphone & Listening */}
        <View style={styles.mainSection}>
          {/* Large Pulse Microphone Button */}
          <View style={styles.micContainer}>
            {recording && (
              <>
                <Animated.View
                  style={[
                    styles.pulseRing,
                    {
                      transform: [
                        {
                          scale: pulseAnim1.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.5],
                          }),
                        },
                      ],
                      opacity: pulseAnim1.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.7, 0],
                      }),
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.pulseRing,
                    {
                      transform: [
                        {
                          scale: pulseAnim2.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.5],
                          }),
                        },
                      ],
                      opacity: pulseAnim2.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.7, 0],
                      }),
                    },
                  ]}
                />
              </>
            )}
            <TouchableOpacity
              style={[styles.micBtn, recording && styles.micBtnRecording]}
              onPress={handleVoicePress}
              activeOpacity={0.8}
            >
              <Text style={styles.micIcon}>🎤</Text>
            </TouchableOpacity>
            {recording && (
              <View style={styles.listeningIndicator}>
                <View style={styles.listeningDot} />
                <Text style={styles.listeningText}>LISTENING...</Text>
              </View>
            )}
          </View>

          {/* Live Preview Area */}
          {(text || recording) && (
            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>LIVE PREVIEW</Text>
              <Text style={styles.previewText}>
                {text || (recording ? 'Listening...' : '')}
              </Text>
            </View>
          )}

          {/* Text Input (Alternative) */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Or type symptom: chakkar, ulti, bleeding, no movement..."
              placeholderTextColor="#94a3b8"
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.saveBtn, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading || !text.trim()}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.saveIcon}>💾</Text>
                  <Text style={styles.saveText}>Save Symptom</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  // Success Banner
  successBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  successIcon: {
    fontSize: 20,
    color: '#059669',
  },
  successText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065f46',
    flex: 1,
  },
  // Header
  header: {
    paddingTop: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  // Main Section
  mainSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 32,
  },
  // Microphone Container
  micContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pulseRing: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: PRIMARY,
    opacity: 0.4,
  },
  micBtn: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1,
  },
  micBtnRecording: {
    backgroundColor: PRIMARY,
  },
  micIcon: {
    fontSize: 48,
  },
  listeningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
  },
  listeningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY,
  },
  listeningText: {
    fontSize: 10,
    fontWeight: '700',
    color: PRIMARY,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  // Preview Card
  previewCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#0f172a',
    fontStyle: 'italic',
    lineHeight: 28,
  },
  // Input Container
  inputContainer: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#0f172a',
  },
  // Actions Container
  actionsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
    marginTop: 16,
  },
  saveBtn: {
    height: 64,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  saveIcon: {
    fontSize: 20,
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  cancelBtn: {
    height: 56,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
  },
});
