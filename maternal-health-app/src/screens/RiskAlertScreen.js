import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { getRiskLevel, getSymptoms } from '../services/api';
import { getRiskColor, getRiskEmoji } from '../utils/helpers';

export default function RiskAlertScreen({ navigation }) {
  const [risk, setRisk] = useState({ level: 'Safe', advice: '' });
  const [symptoms, setSymptoms] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [r, s] = await Promise.all([
        getRiskLevel(),
        getSymptoms(),
      ]);
      setRisk(r);
      setSymptoms(Array.isArray(s) ? s : s?.symptoms || []);
    } catch (e) {
      setRisk({ level: 'Safe', advice: 'Continue regular checkups.' });
    }
  };

  useEffect(() => { load(); }, []);
  const onRefresh = () => { setRefreshing(true); load().finally(() => setRefreshing(false)); };

  const color = getRiskColor(risk.level);
  const emoji = getRiskEmoji(risk.level);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[color]} />}
    >
      <Text style={styles.title}>Risk Alert</Text>
      <View style={[styles.riskCard, { borderColor: color }]}>
        <Text style={styles.riskEmoji}>{emoji}</Text>
        <Text style={[styles.riskLevel, { color }]}>{risk.level}</Text>
        <Text style={styles.advice}>{risk.advice || 'Continue regular prenatal care.'}</Text>
      </View>
      {risk.level === 'High' && (
        <TouchableOpacity style={styles.emergencyBtn} onPress={() => navigation.getParent()?.navigate('More', { screen: 'Emergency' })}>
          <Text style={styles.emergencyBtnText}>🚨 Emergency Alert</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.sectionTitle}>Recent Symptoms</Text>
      {symptoms.length === 0 ? (
        <Text style={styles.empty}>No symptoms recorded</Text>
      ) : (
        symptoms.slice(0, 10).map((s, i) => (
          <View key={i} style={styles.symptomCard}>
            <Text style={styles.symptomText}>{typeof s === 'string' ? s : s.symptom || s.text}</Text>
            {s.risk && (
              <View style={[styles.badge, { backgroundColor: getRiskColor(s.risk) }]}>
                <Text style={styles.badgeText}>{s.risk}</Text>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  riskCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 4,
    marginBottom: 16,
  },
  riskEmoji: { fontSize: 48, marginBottom: 8 },
  riskLevel: { fontSize: 24, fontWeight: 'bold' },
  advice: { fontSize: 14, color: '#555', textAlign: 'center', marginTop: 8 },
  emergencyBtn: { backgroundColor: '#C62828', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  emergencyBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  empty: { color: '#999' },
  symptomCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8 },
  symptomText: { flex: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#fff', fontSize: 12 },
});
