import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getUser } from '../services/api';
import { getTrimester } from '../utils/helpers';

const NUTRITION_BY_TRIMESTER = {
  1: {
    eat: ['Folic acid rich: leafy greens, citrus', 'Iron: spinach, lentils', 'Protein: dal, eggs', 'Small frequent meals for nausea'],
    avoid: ['Raw/uncooked food', 'Excess caffeine', 'Alcohol', 'Unpasteurized dairy'],
  },
  2: {
    eat: ['Calcium: milk, yogurt, paneer', 'Omega-3: nuts, fish (if allowed)', 'Iron: dates, jaggery', 'Vitamin D: sunlight, fortified foods'],
    avoid: ['High sugar snacks', 'Unwashed fruits', 'Excess salt'],
  },
  3: {
    eat: ['Fiber: whole grains, fruits', 'Protein: pulses, chicken (if veg allowed)', 'Calcium & Iron', 'Plenty of fluids'],
    avoid: ['Heavy meals before bed', 'Spicy food if causing heartburn', 'Unpasteurized cheese'],
  },
};

export default function NutritionScreen() {
  const [user, setUser] = useState(null);
  const [month, setMonth] = useState(1);

  React.useEffect(() => {
    getUser()
      .then((u) => {
        setUser(u);
        setMonth(u?.pregnancyMonth || 1);
      })
      .catch(() => setMonth(1));
  }, []);

  const trimester = getTrimester(month);
  const tips = NUTRITION_BY_TRIMESTER[trimester] || NUTRITION_BY_TRIMESTER[1];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nutrition</Text>
      <Text style={styles.subtitle}>Month {month} • Trimester {trimester}</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🍎 Eat</Text>
        {tips.eat.map((item, i) => (
          <Text key={i} style={styles.listItem}>• {item}</Text>
        ))}
      </View>
      <View style={[styles.card, styles.avoidCard]}>
        <Text style={styles.cardTitle}>🚫 Avoid</Text>
        {tips.avoid.map((item, i) => (
          <Text key={i} style={styles.listItem}>• {item}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  avoidCard: { backgroundColor: '#FFF8E1' },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  listItem: { fontSize: 14, marginBottom: 6, color: '#333' },
});
