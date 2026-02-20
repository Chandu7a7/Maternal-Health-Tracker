import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { recordMovement, getMovements } from '../services/api';
import { formatDate } from '../utils/helpers';

const PRIMARY = '#ec135b';
const BG_LIGHT = '#fdf8fa';
const SUCCESS = '#22c55e';
const ERROR = '#ef4444';

export default function BabyTrackerScreen() {
  const [todayMovement, setTodayMovement] = useState(null);
  const [count, setCount] = useState(12);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRecorded, setLastRecorded] = useState(null);

  const load = async () => {
    try {
      const data = await getMovements();
      setHistory(Array.isArray(data) ? data : data?.movements || []);
      const today = new Date().toDateString();
      const todayRec = (Array.isArray(data) ? data : data?.movements || []).find(
        (m) => new Date(m.date).toDateString() === today
      );
      setTodayMovement(todayRec?.hasMovement ?? null);
      setCount(todayRec?.count ?? 12);
      if (todayRec?.date) {
        const date = new Date(todayRec.date);
        setLastRecorded(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (e) {
      setHistory([]);
    }
  };

  useEffect(() => { load(); }, []);

  const record = async (hasMovement) => {
    setLoading(true);
    try {
      const newCount = hasMovement ? count + 1 : count;
      await recordMovement(hasMovement, newCount);
      setTodayMovement(hasMovement);
      setCount(newCount);
      setLastRecorded(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      load();
    } catch (e) {
      setTodayMovement(hasMovement);
      if (hasMovement) {
        setCount((c) => c + 1);
      }
      setLastRecorded(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    } finally {
      setLoading(false);
    }
  };

  const incrementCount = () => {
    setCount((c) => Math.max(0, c + 1));
  };

  const decrementCount = () => {
    setCount((c) => Math.max(0, c - 1));
  };

  // Generate 7-day chart data
  const getChartData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const chartData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
      const dayData = history.find(
        (h) => new Date(h.date).toDateString() === date.toDateString()
      );
      chartData.push({
        day: dayName,
        count: dayData?.count || 0,
        isToday: i === 0,
      });
    }
    
    return chartData;
  };

  const chartData = getChartData();
  const maxCount = Math.max(...chartData.map(d => d.count), 1);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Baby Movement Tracker</Text>
          <Text style={styles.subtitle}>Record your baby's movement today</Text>
        </View>

        {/* Card 1: Daily Check-in */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Did you feel your baby's movement today?</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[
                styles.checkBtn,
                styles.btnYes,
                todayMovement === true && styles.btnYesSelected,
              ]}
              onPress={() => record(true)}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.checkIcon}>😊</Text>
              <Text style={styles.checkText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.checkBtn,
                styles.btnNo,
                todayMovement === false && styles.btnNoSelected,
              ]}
              onPress={() => record(false)}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.checkIcon}>😟</Text>
              <Text style={styles.checkText}>No</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2: Movement Counter */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Movement Count</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={styles.counterBtn}
              onPress={decrementCount}
              activeOpacity={0.7}
            >
              <Text style={styles.counterIcon}>−</Text>
            </TouchableOpacity>
            <View style={styles.counterDisplay}>
              <Text style={styles.counterNumber}>{count}</Text>
              <Text style={styles.counterLabel}>KICKS</Text>
            </View>
            <TouchableOpacity
              style={[styles.counterBtn, styles.counterBtnAdd]}
              onPress={incrementCount}
              activeOpacity={0.7}
            >
              <Text style={styles.counterIconAdd}>+</Text>
            </TouchableOpacity>
          </View>
          {lastRecorded && (
            <Text style={styles.lastRecorded}>Last recorded: {lastRecorded}</Text>
          )}
        </View>

        {/* Card 3: Movement History Chart */}
        <View style={styles.card}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Movement History</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Last 7 Days</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            {chartData.map((item, index) => (
              <View key={index} style={styles.chartBarContainer}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      height: `${Math.max(20, (item.count / maxCount) * 100)}%`,
                      backgroundColor: item.isToday ? PRIMARY : `${PRIMARY}4D`,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.chartLabel,
                    item.isToday && styles.chartLabelActive,
                  ]}
                >
                  {item.day}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Health Tip Section */}
        <View style={styles.tipContainer}>
          <View style={styles.tipBackground} />
          <View style={styles.tipOverlay} />
          <View style={styles.tipContent}>
            <Text style={styles.tipLabel}>Health Tip</Text>
            <Text style={styles.tipText}>Try tracking after meals.</Text>
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
  content: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 100,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
  },
  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: `${PRIMARY}1A`,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 20,
  },
  // Check-in Buttons
  btnRow: {
    flexDirection: 'row',
    gap: 16,
  },
  checkBtn: {
    flex: 1,
    paddingVertical: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  btnYes: {
    backgroundColor: SUCCESS,
  },
  btnYesSelected: {
    backgroundColor: SUCCESS,
    opacity: 0.9,
  },
  btnNo: {
    backgroundColor: ERROR,
  },
  btnNoSelected: {
    backgroundColor: ERROR,
    opacity: 0.9,
  },
  checkIcon: {
    fontSize: 36,
  },
  checkText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  // Counter
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    marginBottom: 24,
  },
  counterBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${PRIMARY}1A`,
    borderWidth: 2,
    borderColor: `${PRIMARY}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnAdd: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  counterIcon: {
    fontSize: 36,
    fontWeight: '700',
    color: PRIMARY,
  },
  counterIconAdd: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  counterDisplay: {
    alignItems: 'center',
    flex: 1,
  },
  counterNumber: {
    fontSize: 60,
    fontWeight: '900',
    color: PRIMARY,
    lineHeight: 72,
  },
  counterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  lastRecorded: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  // Chart
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  badge: {
    backgroundColor: `${PRIMARY}1A`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: PRIMARY,
    letterSpacing: 0.5,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 128,
    gap: 8,
    paddingHorizontal: 4,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  chartBar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 20,
  },
  chartLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
  },
  chartLabelActive: {
    color: PRIMARY,
  },
  // Health Tip
  tipContainer: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    backgroundColor: '#94a3b8',
    position: 'relative',
  },
  tipBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#cbd5e1',
    opacity: 0.8,
  },
  tipOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1,
  },
  tipContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    zIndex: 2,
  },
  tipLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});
