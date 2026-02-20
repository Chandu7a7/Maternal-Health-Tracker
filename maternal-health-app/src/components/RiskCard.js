import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getRiskColor, getRiskEmoji } from '../utils/helpers';

export default function RiskCard({ level, advice }) {
  const color = getRiskColor(level);
  const emoji = getRiskEmoji(level);

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.level}>{emoji} {level}</Text>
      {advice ? <Text style={styles.advice}>{advice}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 6,
    marginBottom: 12,
  },
  level: { fontSize: 18, fontWeight: '600' },
  advice: { fontSize: 14, color: '#555', marginTop: 8 },
});
