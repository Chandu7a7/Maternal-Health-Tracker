import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AlertBox({ type = 'info', title, message }) {
  const colors = {
    info: { bg: '#E3F2FD', border: '#2196F3' },
    warning: { bg: '#FFF8E1', border: '#FFC107' },
    error: { bg: '#FFEBEE', border: '#F44336' },
    success: { bg: '#E8F5E9', border: '#4CAF50' },
  };
  const c = colors[type] || colors.info;

  return (
    <View style={[styles.box, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { padding: 16, borderRadius: 12, borderWidth: 2, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '600' },
  message: { fontSize: 14, marginTop: 4, color: '#555' },
});
