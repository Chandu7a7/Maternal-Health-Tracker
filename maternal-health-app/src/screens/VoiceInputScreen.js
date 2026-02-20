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
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Audio } from 'expo-av';
import { analyzeAudio, addSymptom } from '../services/api';

const PRIMARY = '#ec135b';
const BG_COLOR = '#F9FBFC';

export default function VoiceInputScreen({ navigation }) {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('Ready to listen');

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  async function startRecording() {
    try {
      setStatus('Requesting permissions...');
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === 'granted') {
        setStatus('Starting microphone...');
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

        setRecording(recording);
        setIsRecording(true);
        setStatus('Listening...');
        setText('');
      } else {
        Alert.alert('Permission Denied', 'Please enable microphone access in settings.');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Could not start recording');
    }
  }

  async function stopRecording() {
    setIsRecording(false);
    setStatus('Stopping...');
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      // Analyze the recorded audio
      handleAnalysis(uri);
    } catch (err) {
      console.error('Failed to stop recording', err);
      setStatus('Error stopping');
    }
  }

  async function handleAnalysis(uri) {
    setIsAnalyzing(true);
    setStatus('Analyzing with AI...');
    try {
      const result = await analyzeAudio(uri);
      setText(result.transcript || '');
      setStatus('Analysis complete');

      if (result.riskLevel === 'High' || result.riskLevel === 'Medium') {
        navigation.navigate('HealthRiskStatus', {
          riskLevel: result.riskLevel,
          advice: result.advice,
          transcript: result.transcript,
        });
      }
    } catch (err) {
      console.error('Analysis error', err);
      Alert.alert('Analysis Failed', 'Could not process your voice. Please try again or type manually.');
      setStatus('Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  }

  const handleSaveSymptom = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      await addSymptom(text);
      Alert.alert('Success', 'Your symptom has been recorded.');
      setText('');
      setStatus('Symptom saved');
    } catch (err) {
      Alert.alert('Error', 'Failed to save symptom');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Voice Input</Text>
          <Text style={styles.subtitle}>Tell AI how you feel today</Text>
        </View>

        <View style={styles.main}>
          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, isRecording && styles.recordingText]}>
              {status.toUpperCase()}
            </Text>
          </View>

          <View style={styles.micContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                onPress={isRecording ? stopRecording : startRecording}
                disabled={isAnalyzing}
                style={[
                  styles.micButton,
                  isRecording && styles.micButtonRecording,
                  isAnalyzing && styles.micButtonDisabled
                ]}
              >
                {isAnalyzing ? (
                  <ActivityIndicator color="#fff" size="large" />
                ) : (
                  <Text style={styles.micEmoji}>{isRecording ? '🛑' : '🎤'}</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
            <Text style={styles.hintText}>
              {isRecording ? 'Tap to finish' : 'Tap to start speaking'}
            </Text>
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>RECOGNIZED SYMPTOMS</Text>
            <TextInput
              style={styles.textInput}
              value={text}
              onChangeText={setText}
              placeholder="Your symptoms will appear here after recording..."
              multiline
              numberOfLines={4}
              editable={!isAnalyzing}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.saveButton, (!text || isAnalyzing) && styles.buttonDisabled]}
              onPress={handleSaveSymptom}
              disabled={!text || isAnalyzing}
            >
              <Text style={styles.buttonText}>Save Symptom</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => { setText(''); setStatus('Ready'); }}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1a1a1a',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  main: {
    flex: 1,
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#999',
    letterSpacing: 1,
  },
  recordingText: {
    color: PRIMARY,
  },
  micContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  micButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  micButtonRecording: {
    backgroundColor: '#000',
  },
  micButtonDisabled: {
    backgroundColor: '#ccc',
  },
  micEmoji: {
    fontSize: 60,
  },
  hintText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  inputCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#999',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  textInput: {
    fontSize: 18,
    color: '#1a1a1a',
    minHeight: 100,
    textAlignVertical: 'top',
    lineHeight: 26,
  },
  buttonRow: {
    width: '100%',
    gap: 12,
  },
  saveButton: {
    backgroundColor: PRIMARY,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  clearButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
