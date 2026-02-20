import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const REMINDERS = [
  { id: '1', title: 'Doctor Visit', desc: 'Monthly checkup - 25 Feb', icon: '🩺' },
  { id: '2', title: 'Medicine', desc: 'Iron tablets - Daily 8 AM', icon: '💊' },
  { id: '3', title: 'Ultrasound', desc: 'Trimester 2 scan - Schedule', icon: '📋' },
  { id: '4', title: 'Blood Test', desc: 'Hb levels - This month', icon: '🧪' },
];

export default function ReminderScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Reminders</Text>
      {REMINDERS.map((r) => (
        <View key={r.id} style={styles.card}>
          <Text style={styles.icon}>{r.icon}</Text>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{r.title}</Text>
            <Text style={styles.cardDesc}>{r.desc}</Text>
          </View>
        </View>
      ))}
      <Text style={styles.hint}>Integrate with local notifications for alerts</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  icon: { fontSize: 32, marginRight: 16 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardDesc: { fontSize: 14, color: '#666', marginTop: 4 },
  hint: { fontSize: 12, color: '#999', marginTop: 16 },
});
