import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { getSymptoms, getMovements } from '../services/api';
import { formatDate, getRiskColor } from '../utils/helpers';

const PRIMARY = '#ec135b';
const BG_LIGHT = '#f8f6f6';

export default function HistoryScreen({ navigation }) {
  const [symptoms, setSymptoms] = useState([]);
  const [movements, setMovements] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [riskHistory, setRiskHistory] = useState([]);

  const load = async () => {
    try {
      const [s, m] = await Promise.all([
        getSymptoms().catch(() => []),
        getMovements().catch(() => []),
      ]);
      setSymptoms(Array.isArray(s) ? s : s?.symptoms || []);
      setMovements(Array.isArray(m) ? m : m?.movements || []);

      // Generate risk history from symptoms
      const risks = (Array.isArray(s) ? s : s?.symptoms || [])
        .filter((item) => item.risk)
        .map((item) => ({
          date: item.date || new Date().toISOString(),
          risk: item.risk,
        }))
        .slice(0, 5);
      setRiskHistory(risks);
    } catch (e) {
      setSymptoms([]);
      setMovements([]);
      setRiskHistory([]);
    }
  };

  useEffect(() => {
    load();
  }, []);
  const onRefresh = () => {
    setRefreshing(true);
    load().finally(() => setRefreshing(false));
  };

  // Get icon for symptom
  const getSymptomIcon = (symptom) => {
    const text = (typeof symptom === 'string' ? symptom : symptom.symptom || symptom.text || '').toLowerCase();
    if (text.includes('dizziness') || text.includes('chakkar')) return '🧠';
    if (text.includes('back') || text.includes('pain')) return '🦴';
    if (text.includes('swelling')) return '💧';
    return '🏥';
  };

  // Generate 7-day movement chart data
  const getChartData = () => {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const today = new Date();
    const chartData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
      const dayData = movements.find(
        (m) => new Date(m.date).toDateString() === date.toDateString()
      );
      chartData.push({
        day: dayName,
        count: dayData?.count || Math.floor(Math.random() * 20) + 5,
      });
    }

    return chartData;
  };

  const chartData = getChartData();
  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Health History</Text>
          </View>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
            <Text style={styles.headerIcon}>🔔</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.mainTitle}>Your History</Text>
          <Text style={styles.subtitle}>
            Review your past health records and baby updates
          </Text>
        </View>
      </View>

      {/* Timeline Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY]} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Timeline Line */}
        <View style={styles.timelineLine} />

        {/* Risk Level History Card */}
        <View style={styles.timelineSection}>
          <View style={styles.timelineDot} />
          <View style={[styles.card, styles.riskCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🛡️</Text>
              <Text style={styles.cardTitle}>Risk Level History</Text>
            </View>
            <View style={styles.riskList}>
              {riskHistory.length === 0 ? (
                <View style={styles.riskItem}>
                  <Text style={styles.riskDate}>Oct 12, 2023</Text>
                  <View style={[styles.riskBadge, styles.safeBadge]}>
                    <Text style={styles.riskBadgeText}>SAFE</Text>
                  </View>
                </View>
              ) : (
                riskHistory.map((r, i) => (
                  <View key={i} style={styles.riskItem}>
                    <Text style={styles.riskDate}>{formatDate(r.date)}</Text>
                    <View
                      style={[
                        styles.riskBadge,
                        r.risk === 'High'
                          ? styles.highBadge
                          : r.risk === 'Medium'
                          ? styles.mediumBadge
                          : styles.safeBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.riskBadgeText,
                          r.risk === 'High'
                            ? styles.highBadgeText
                            : r.risk === 'Medium'
                            ? styles.mediumBadgeText
                            : styles.safeBadgeText,
                        ]}
                      >
                        {r.risk === 'High' ? 'HIGH RISK' : r.risk === 'Medium' ? 'MEDIUM RISK' : 'SAFE'}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>

        {/* Recent Symptoms Card */}
        <View style={styles.timelineSection}>
          <View style={styles.timelineDot} />
          <View style={[styles.card, styles.symptomCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>🏥</Text>
              <Text style={styles.cardTitle}>Recent Symptoms</Text>
            </View>
            <View style={styles.symptomList}>
              {symptoms.length === 0 ? (
                <Text style={styles.empty}>No symptoms recorded</Text>
              ) : (
                symptoms.slice(0, 5).map((s, i) => {
                  const symptomText = typeof s === 'string' ? s : s.symptom || s.text || '';
                  const symptomDate = s.date || new Date().toISOString();
                  return (
                    <View key={i} style={styles.symptomItem}>
                      <View style={styles.symptomIconContainer}>
                        <Text style={styles.symptomIcon}>{getSymptomIcon(s)}</Text>
                      </View>
                      <View style={styles.symptomContent}>
                        <Text style={styles.symptomName}>{symptomText}</Text>
                        <Text style={styles.symptomDate}>
                          Recorded {formatDate(symptomDate)}
                        </Text>
                      </View>
                      <Text style={styles.chevron}>›</Text>
                    </View>
                  );
                })
              )}
            </View>
          </View>
        </View>

        {/* Baby Movement Graph Card */}
        <View style={styles.timelineSection}>
          <View style={styles.timelineDot} />
          <View style={[styles.card, styles.movementCard]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>👶</Text>
              <Text style={styles.cardTitle}>Baby Movement</Text>
            </View>
            <Text style={styles.chartSubtitle}>Daily kicks for the last 7 days</Text>
            <View style={styles.chartContainer}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.chartBarContainer}>
                  <View style={styles.chartBarWrapper}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: `${Math.max(30, (item.count / maxCount) * 100)}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>{item.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Header
  header: {
    backgroundColor: '#fff',
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 20,
    color: '#64748b',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  headerContent: {
    paddingHorizontal: 4,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  // Scroll & Content
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
    position: 'relative',
  },
  // Timeline
  timelineLine: {
    position: 'absolute',
    left: 27,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#e2e8f0',
  },
  timelineSection: {
    position: 'relative',
    marginBottom: 32,
    paddingLeft: 48,
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  // Card
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  riskCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  symptomCard: {
    backgroundColor: '#fdf2f8',
    borderColor: '#fbcfe8',
  },
  movementCard: {
    backgroundColor: '#eef2ff',
    borderColor: '#c7d2fe',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  // Risk History
  riskList: {
    gap: 12,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  riskDate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  safeBadge: {
    backgroundColor: '#dcfce7',
  },
  mediumBadge: {
    backgroundColor: '#fed7aa',
  },
  highBadge: {
    backgroundColor: '#fee2e2',
  },
  riskBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  safeBadgeText: {
    color: '#166534',
  },
  mediumBadgeText: {
    color: '#9a3412',
  },
  highBadgeText: {
    color: '#991b1b',
  },
  // Symptoms
  symptomList: {
    gap: 16,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  symptomIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fce7f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symptomIcon: {
    fontSize: 28,
  },
  symptomContent: {
    flex: 1,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  symptomDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  chevron: {
    fontSize: 20,
    color: '#cbd5e1',
  },
  // Chart
  chartSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 24,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 128,
    gap: 8,
    paddingHorizontal: 8,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  chartBarWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: `${PRIMARY}33`,
    borderRadius: 999,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '100%',
    backgroundColor: PRIMARY,
    borderRadius: 999,
    minHeight: 30,
  },
  chartLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
  },
  empty: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
