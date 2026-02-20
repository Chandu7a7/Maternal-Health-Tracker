import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const PRIMARY = '#ec135b';
const PRIMARY_LIGHT = '#ff4d8d';
const BG_LIGHT = '#f8f6f6';
const BG_DARK = '#221016';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#1e1e1e';
const TEXT_MUTED = '#6b7280';
const SUCCESS_COLOR = '#22c55e';
const SUCCESS_SOFT = '#e8f5e9';
const WARNING_COLOR = '#f59e0b';
const DANGER_COLOR = '#ef4444';
const DANGER_SOFT = '#ffebee';

export default function NutritionPlanScreen() {
  const navigation = useNavigation();
  const [waterGlasses, setWaterGlasses] = useState(8);
  const [pregnancyMonth] = useState(5);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNotification = () => {
    console.log('Notification pressed');
  };

  const handleAddWater = () => {
    if (waterGlasses < 10) {
      setWaterGlasses(waterGlasses + 1);
    }
  };

  const foodsToEat = [
    { icon: '🥗', title: 'Iron Rich Food', subtitle: 'Spinach, lean meat, lentils', bgColor: SUCCESS_SOFT },
    { icon: '🥚', title: 'Protein Power', subtitle: 'Eggs, chicken, tofu, beans', bgColor: SUCCESS_SOFT },
    { icon: '🥦', title: 'Fruits & Veggies', subtitle: 'Colorful variety, high fiber', bgColor: SUCCESS_SOFT },
  ];

  const foodsToAvoid = [
    { icon: '🍔', title: 'Junk Food' },
    { icon: '☕', title: 'High Caffeine' },
    { icon: '🍣', title: 'Raw Items' },
    { icon: '🥫', title: 'Processed' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BG_LIGHT} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.headerBtn} onPress={handleGoBack} activeOpacity={0.8}>
            <Text style={styles.headerBtnIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Nutrition Plan</Text>
          </View>
          <TouchableOpacity style={styles.headerBtn} onPress={handleNotification} activeOpacity={0.8}>
            <Text style={styles.headerBtnIcon}>🔔</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.mainTitle}>Nutrition Recommendation</Text>
          <Text style={styles.subtitle}>Food guidance based on your pregnancy month</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Month Badge */}
        <View style={styles.monthBadge}>
          <Text style={styles.monthBadgeIcon}>📅</Text>
          <Text style={styles.monthBadgeText}>Month {pregnancyMonth} Nutrition Plan</Text>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Mid-Pregnancy Energy</Text>
            <Text style={styles.heroSubtitle}>
              In month {pregnancyMonth}, your baby is growing rapidly. Focus on iron and protein.
            </Text>
            <TouchableOpacity style={styles.heroBtn} activeOpacity={0.8}>
              <Text style={styles.heroBtnText}>Get Daily Log</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroIconWrap}>
            <Text style={styles.heroIcon}>🍽️</Text>
          </View>
        </View>

        {/* Section: What You Should Eat */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>✅</Text>
            <Text style={styles.sectionTitle}>What You Should Eat</Text>
          </View>
          <View style={styles.foodList}>
            {foodsToEat.map((food, index) => (
              <TouchableOpacity key={index} style={styles.foodCard} activeOpacity={0.8}>
                <View style={[styles.foodIconBox, { backgroundColor: food.bgColor }]}>
                  <Text style={styles.foodIcon}>{food.icon}</Text>
                </View>
                <View style={styles.foodContent}>
                  <Text style={styles.foodTitle}>{food.title}</Text>
                  <Text style={styles.foodSubtitle}>{food.subtitle}</Text>
                </View>
                <Text style={styles.foodArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Section: What to Avoid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIconWarning}>⚠️</Text>
            <Text style={styles.sectionTitle}>What to Avoid</Text>
          </View>
          <View style={styles.avoidContainer}>
            <View style={styles.avoidGrid}>
              {foodsToAvoid.map((food, index) => (
                <View key={index} style={styles.avoidCard}>
                  <Text style={styles.avoidIcon}>{food.icon}</Text>
                  <Text style={styles.avoidTitle}>{food.title}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Section: Daily Hydration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Hydration</Text>
          <View style={styles.hydrationCard}>
            <View style={styles.hydrationLeft}>
              <View style={styles.hydrationIconBox}>
                <Text style={styles.hydrationIcon}>💧</Text>
              </View>
              <View style={styles.hydrationContent}>
                <Text style={styles.hydrationText}>{waterGlasses}/10 Glasses</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${waterGlasses * 10}%` }]} />
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={handleAddWater} activeOpacity={0.8}>
              <Text style={styles.addBtnIcon}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  header: {
    backgroundColor: BG_LIGHT,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: `${PRIMARY}20`,
  },
  headerBtnIcon: {
    fontSize: 20,
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  headerContent: {},
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  monthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginBottom: 20,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  monthBadgeIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  monthBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroCard: {
    backgroundColor: PRIMARY,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  heroGlow: {
    position: 'absolute',
    right: -30,
    bottom: -30,
    width: 150,
    height: 150,
    backgroundColor: PRIMARY_LIGHT,
    borderRadius: 75,
    opacity: 0.3,
  },
  heroContent: {
    maxWidth: '70%',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
    marginBottom: 16,
  },
  heroBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroBtnText: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: '700',
  },
  heroIconWrap: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    opacity: 0.3,
    transform: [{ rotate: '12deg' }],
  },
  heroIcon: {
    fontSize: 80,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionIconWarning: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  foodList: {
    gap: 12,
  },
  foodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  foodIconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  foodIcon: {
    fontSize: 28,
  },
  foodContent: {
    flex: 1,
  },
  foodTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 2,
  },
  foodSubtitle: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  foodArrow: {
    fontSize: 24,
    color: `${PRIMARY}40`,
    fontWeight: '300',
  },
  avoidContainer: {
    backgroundColor: `${DANGER_COLOR}10`,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: `${PRIMARY}15`,
  },
  avoidGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  avoidCard: {
    width: (width - 80) / 2,
    backgroundColor: CARD_BG,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avoidIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  avoidTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: TEXT_DARK,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  hydrationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CARD_BG,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  hydrationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hydrationIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  hydrationIcon: {
    fontSize: 22,
  },
  hydrationContent: {
    flex: 1,
  },
  hydrationText: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    width: 120,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#60a5fa',
    borderRadius: 3,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnIcon: {
    fontSize: 24,
    color: PRIMARY,
    fontWeight: '300',
  },
});
