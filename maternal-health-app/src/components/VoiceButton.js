import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function VoiceButton({ onPress, recording, disabled }) {
  return (
    <TouchableOpacity
      style={[styles.btn, recording && styles.recording, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.icon}>{recording ? '⏹' : '🎤'}</Text>
      <Text style={styles.label}>{recording ? 'Stop' : 'Record'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recording: { backgroundColor: '#C62828' },
  disabled: { opacity: 0.6 },
  icon: { fontSize: 28 },
  label: { fontSize: 10, color: '#fff', marginTop: 4 },
});
