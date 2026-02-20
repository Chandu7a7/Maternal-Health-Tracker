import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MovementChart({ data = [] }) {
  const last7 = data.slice(0, 7).reverse();
  const max = Math.max(...last7.map((d) => d.count || 0), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movement (Last 7 Days)</Text>
      <View style={styles.chart}>
        {last7.map((d, i) => (
          <View key={i} style={styles.barWrap}>
            <View
              style={[
                styles.bar,
                {
                  height: `${Math.max(10, ((d.count || 0) / max) * 80)}%`,
                  backgroundColor: d.hasMovement ? '#4CAF50' : '#E0E0E0',
                },
              ]}
            />
            <Text style={styles.label}>{d.date ? new Date(d.date).getDate() : '-'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  title: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 80 },
  barWrap: { flex: 1, alignItems: 'center' },
  bar: { width: '70%', borderRadius: 4 },
  label: { fontSize: 10, marginTop: 4 },
});
