import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
  Animated,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { getRiskLevel, getSymptoms, getUser, setAuthToken } from '../services/api';
import { getRiskColor, getTrimester } from '../utils/helpers';

const { width } = Dimensions.get('window');

// Modern Color Palette
const PRIMARY = '#FF4B72';
const PRIMARY_LIGHT = '#FF8FA3';
const BG_DARK = '#F5F7FA'; // Off-white modern background
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#2B2D42';
const TEXT_MUTED = '#8D99AE';
const SUCCESS_COLOR = '#06D6A0';
const WARNING_COLOR = '#FFD166';
const DANGER_COLOR = '#EF476F';

export default function DashboardScreen({ navigation: navProp }) {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [risk, setRisk] = useState({ level: 'Safe', advice: '' });
  const [symptoms, setSymptoms] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  // Opacity animation for initial load
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const load = async () => {
    try {
      const [u, r, s] = await Promise.all([
        getUser().catch(() => null),
        getRiskLevel().catch(() => ({ level: 'Safe', advice: 'Continue regular checkups.' })),
        getSymptoms().catch(() => []),
      ]);
      setUser(u);
      setRisk(r);
      setSymptoms(Array.isArray(s) ? s : s?.symptoms || []);
    } catch (e) {
      setRisk({ level: 'Safe', advice: 'Continue regular checkups.' });
    }
  };

  useEffect(() => {
    load().then(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const onRefresh = () => { setRefreshing(true); load().finally(() => setRefreshing(false)); };

  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setDrawerVisible(false);
    });
  };

  const handleMenuPress = (screen) => {
    closeDrawer();
    setTimeout(() => {
      if (screen === 'logout') {
        handleLogout();
      } else if (screen === 'history') {
        navigation.navigate('History');
      } else if (screen === 'nutrition') {
        try {
          const parentNav = navigation.getParent();
          if (parentNav && typeof parentNav.navigate === 'function') {
            parentNav.navigate('NutritionPlan');
          } else {
            navigation.dispatch(CommonActions.navigate({ name: 'NutritionPlan' }));
          }
        } catch (error) {
          Alert.alert('Error', `Could not navigate to Nutrition Plan: ${error.message}`);
        }
      } else if (screen === 'profile') {
        try {
          const parentNav = navigation.getParent();
          if (parentNav && typeof parentNav.navigate === 'function') {
            parentNav.navigate('Profile');
          } else {
            navigation.dispatch(CommonActions.navigate({ name: 'Profile' }));
          }
        } catch (error) {
          Alert.alert('Error', `Could not navigate to Profile: ${error.message}`);
        }
      } else if (screen === 'settings') {
        try {
          const parentNav = navigation.getParent();
          if (parentNav && typeof parentNav.navigate === 'function') {
            parentNav.navigate('Settings');
          } else {
            navigation.dispatch(CommonActions.navigate({ name: 'Settings' }));
          }
        } catch (error) {
          Alert.alert('Error', `Could not navigate to Settings: ${error.message}`);
        }
      }
    }, 300);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await setAuthToken(null);
            try {
              const parentNav = navigation.getParent();
              if (parentNav && typeof parentNav.replace === 'function') {
                parentNav.replace('Login');
              } else {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                );
              }
            } catch (error) {
              Alert.alert('Logged Out', 'You have been logged out successfully. Please restart the app.', [{ text: 'OK' }]);
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  const month = user?.pregnancyMonth || 1;
  const trimester = getTrimester(month);
  const progress = Math.round((month / 9) * 100);

  // Advanced Risk Color handling
  let riskColor = PRIMARY;
  let riskBgColor = `${PRIMARY}15`;
  if (risk.level === 'High') {
    riskColor = DANGER_COLOR;
    riskBgColor = `${DANGER_COLOR}15`;
  } else if (risk.level === 'Medium') {
    riskColor = WARNING_COLOR;
    riskBgColor = `${WARNING_COLOR}15`;
  } else if (risk.level === 'Safe' || risk.level === 'Low') {
    riskColor = SUCCESS_COLOR;
    riskBgColor = `${SUCCESS_COLOR}15`;
  }

  const renderContent = () => {
    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY]} tintColor={PRIMARY} />}
      >
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={openDrawer}
                activeOpacity={0.8}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>👩</Text>
                  <View style={styles.onlineDot} />
                </View>
              </TouchableOpacity>
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingLight}>Good to see you,</Text>
                <Text style={styles.greetingBold}>{user?.name || 'Beautiful Mother'}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notifBtn} activeOpacity={0.8}>
              <Text style={styles.notifIcon}>🔔</Text>
              <View style={styles.notifBadge} />
            </TouchableOpacity>
          </View>

          {/* Pregnancy Progress Glass Card */}
          <View style={styles.progressCardMain}>
            <View style={styles.progressGlow} />
            <View style={styles.progressCardBody}>
              <View style={styles.progressHeaderRow}>
                <View>
                  <Text style={styles.progressMonthLabel}>Pregnancy Journey</Text>
                  <Text style={styles.progressMonthValue}>Month {month}</Text>
                  <View style={styles.trimesterPill}>
                    <Text style={styles.trimesterPillText}>
                      {trimester === 1 ? '1st' : trimester === 2 ? '2nd' : '3rd'} Trimester
                    </Text>
                  </View>
                </View>
                <View style={styles.circularProgressContainer}>
                  <View style={styles.circularProgressInner}>
                    <Text style={styles.circularProgressText}>{progress}%</Text>
                  </View>
                </View>
              </View>

              <View style={styles.progressBarWrapper}>
                <View style={styles.progressBarBg}>
                  <Animated.View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                </View>
                <View style={styles.progressBarLabels}>
                  <Text style={styles.progressLabelLeft}>Start</Text>
                  <Text style={styles.progressLabelRight}>Due</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bento Grid Layout for Dashboard Cards */}
          <View style={styles.bentoGrid}>

            {/* Status & Risk - First Row */}
            <View style={styles.bentoRow}>
              <View style={[styles.bentoCard, styles.bentoCardSmall]}>
                <View style={styles.bentoCardHeader}>
                  <View style={[styles.bentoIconBox, { backgroundColor: `${SUCCESS_COLOR}15` }]}>
                    <Text style={styles.bentoIcon}>❤️</Text>
                  </View>
                </View>
                <Text style={styles.bentoLabel}>Health</Text>
                <Text style={[styles.bentoValue, { color: SUCCESS_COLOR }]}>
                  {risk.level === 'Safe' ? 'Optimal' : 'Stable'}
                </Text>
              </View>

              <View style={[styles.bentoCard, styles.bentoCardLarge, { backgroundColor: riskBgColor }]}>
                <View style={styles.riskCardInner}>
                  <View>
                    <Text style={styles.bentoLabel}>AI Risk Analysis</Text>
                    <Text style={[styles.bentoValueBig, { color: riskColor }]}>
                      {risk.level === 'Safe' ? 'Low' : risk.level}
                    </Text>
                  </View>
                  <View style={[styles.riskIconBox, { backgroundColor: CARD_BG }]}>
                    <Text style={styles.riskIconText}>🛡️</Text>
                  </View>
                </View>
                <Text style={[styles.riskAdviceText, { color: TEXT_DARK }]} numberOfLines={2}>
                  {risk.advice || 'Your vitals are looking great today!'}
                </Text>
              </View>
            </View>

            {/* Interactions - Second Row */}
            <View style={styles.bentoRow}>

              {/* Movement Card */}
              <TouchableOpacity
                style={[styles.bentoCard, styles.bentoCardHalf]}
                onPress={() => navigation.getParent()?.navigate('Tracker')}
                activeOpacity={0.9}
              >
                <View style={[styles.bentoIconBox, { backgroundColor: `${PRIMARY}15`, marginBottom: 12 }]}>
                  <Text style={styles.bentoIcon}>👣</Text>
                </View>
                <Text style={styles.bentoLabel}>Baby Kicks</Text>
                <Text style={styles.bentoValueAction}>Log Now</Text>
                <View style={styles.actionArrowBox}>
                  <Text style={styles.actionArrow}>→</Text>
                </View>
              </TouchableOpacity>

              {/* Clinic Visits Card */}
              <View style={[styles.bentoCard, styles.bentoCardHalf]}>
                <View style={[styles.bentoIconBox, { backgroundColor: '#4361EE15', marginBottom: 12 }]}>
                  <Text style={styles.bentoIcon}>🏥</Text>
                </View>
                <Text style={styles.bentoLabel}>Next Visit</Text>
                <View style={styles.clinicDateBox}>
                  <Text style={styles.clinicDay}>12</Text>
                  <Text style={styles.clinicMonth}>NOV</Text>
                </View>
              </View>

            </View>
          </View>

          {/* Daily Tip - Elegant Banner */}
          <View style={styles.tipBanner}>
            <View style={styles.tipIconPanel}>
              <Text style={styles.tipIcon}>✨</Text>
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Daily Insight</Text>
              <Text style={styles.tipText}>Stay hydrated and rest for at least 8 hours today for optimal growth.</Text>
            </View>
          </View>

        </Animated.View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {renderContent()}

      {/* Modern Chat FAB */}
      <TouchableOpacity
        style={styles.chatFab}
        onPress={() => navigation.getParent()?.navigate('Chat') || navigation.navigate('Chat')}
        activeOpacity={0.9}
      >
        <Text style={styles.chatFabIcon}>💬</Text>
        <View style={styles.chatFabPulse} />
      </TouchableOpacity>

      {/* Drawer Modal */}
      <Modal visible={drawerVisible} transparent={true} animationType="none" onRequestClose={closeDrawer}>
        <TouchableOpacity style={styles.drawerOverlay} activeOpacity={1} onPress={closeDrawer}>
          <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
            <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
              <View style={styles.drawerHeader}>
                <View style={styles.drawerAvatar}>
                  <Text style={styles.drawerAvatarText}>👩</Text>
                </View>
                <Text style={styles.drawerName}>{user?.name || 'User'}</Text>
                <Text style={styles.drawerEmail}>{user?.mobile || ''}</Text>
              </View>

              <View style={styles.drawerMenu}>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('profile')} activeOpacity={0.7}>
                  <View style={[styles.menuIconBox, { backgroundColor: '#4361EE15' }]}><Text style={styles.menuIcon}>👤</Text></View>
                  <Text style={styles.menuText}>My Profile</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('history')} activeOpacity={0.7}>
                  <View style={[styles.menuIconBox, { backgroundColor: `${PRIMARY}15` }]}><Text style={styles.menuIcon}>📊</Text></View>
                  <Text style={styles.menuText}>Health History</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('nutrition')} activeOpacity={0.7}>
                  <View style={[styles.menuIconBox, { backgroundColor: '#22c55e15' }]}><Text style={styles.menuIcon}>🥗</Text></View>
                  <Text style={styles.menuText}>Nutrition Plan</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('settings')} activeOpacity={0.7}>
                  <View style={[styles.menuIconBox, { backgroundColor: '#8D99AE15' }]}><Text style={styles.menuIcon}>⚙️</Text></View>
                  <Text style={styles.menuText}>Settings</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <View style={styles.menuDivider} />

                <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress('logout')} activeOpacity={0.7}>
                  <View style={[styles.menuIconBox, { backgroundColor: `${DANGER_COLOR}15` }]}><Text style={styles.menuIcon}>🚪</Text></View>
                  <Text style={[styles.menuText, { color: DANGER_COLOR, fontWeight: '700' }]}>Logout</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_DARK
  },
  scroll: {
    flex: 1
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 50,  // Adjust depending on status bar
    paddingBottom: 120
  },

  /* --- Header --- */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative'
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: SUCCESS_COLOR,
    borderWidth: 2,
    borderColor: CARD_BG
  },
  avatarText: { fontSize: 28 },
  greetingContainer: { flex: 1, justifyContent: 'center' },
  greetingLight: { fontSize: 14, color: TEXT_MUTED, fontWeight: '500', marginBottom: 2 },
  greetingBold: { fontSize: 22, fontWeight: '800', color: TEXT_DARK, letterSpacing: -0.5 },
  notifBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    position: 'relative'
  },
  notifIcon: { fontSize: 22 },
  notifBadge: {
    position: 'absolute',
    top: 12,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY
  },

  /* --- Pregnancy Progress Premium Card --- */
  progressCardMain: {
    marginBottom: 24,
    position: 'relative',
    borderRadius: 24,
  },
  progressGlow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: -10,
    backgroundColor: PRIMARY,
    opacity: 0.2,
    borderRadius: 24,
    filter: 'blur(10px)',
  },
  progressCardBody: {
    backgroundColor: PRIMARY,
    borderRadius: 24,
    padding: 24,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden'
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  progressMonthLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4
  },
  progressMonthValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
    marginBottom: 10
  },
  trimesterPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start'
  },
  trimesterPillText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  circularProgressContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)'
  },
  circularProgressInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  circularProgressText: {
    fontSize: 18,
    fontWeight: '800',
    color: PRIMARY
  },
  progressBarWrapper: {
    width: '100%',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4
  },
  progressBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  progressLabelLeft: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700' },
  progressLabelRight: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700' },


  /* --- Bento Grid --- */
  bentoGrid: {
    gap: 16,
    marginBottom: 24
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 16
  },
  bentoCard: {
    backgroundColor: CARD_BG,
    borderRadius: 14,
    padding: 20,
    shadowColor: '#cbd0dcff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    justifyContent: 'space-between',
    position: 'relative'
  },
  bentoCardSmall: {
    flex: 1,
    aspectRatio: 1
  },
  bentoCardLarge: {
    flex: 1.6,
  },
  bentoCardHalf: {
    flex: 1,
    aspectRatio: 0.9
  },
  bentoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bentoIcon: { fontSize: 20 },
  bentoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_MUTED,
    marginTop: 'auto',
    marginBottom: 4
  },
  bentoValue: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5
  },
  bentoValueBig: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5
  },
  bentoValueAction: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_DARK,
    letterSpacing: -0.5
  },

  riskCardInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  riskIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3
  },
  riskIconText: { fontSize: 20 },
  riskAdviceText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },

  actionArrowBox: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: TEXT_DARK,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionArrow: { color: '#FFF', fontSize: 18, fontWeight: '700' },

  clinicDateBox: {
    marginTop: 8
  },
  clinicDay: { fontSize: 32, fontWeight: '900', color: '#4361EE', letterSpacing: -1 },
  clinicMonth: { fontSize: 14, fontWeight: '800', color: TEXT_MUTED, textTransform: 'uppercase' },

  /* --- Tip Banner --- */
  tipBanner: {
    backgroundColor: '#4361EE',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6
  },
  tipIconPanel: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  tipIcon: { fontSize: 24 },
  tipContent: { flex: 1 },
  tipTitle: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  tipText: { fontSize: 13, color: '#FFFFFF', fontWeight: '500', lineHeight: 18 },

  /* --- Floating Action Button --- */
  chatFab: {
    position: 'absolute',
    right: 24,
    bottom: 80,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  chatFabIcon: {
    fontSize: 28,
    color: '#fff',
  },

  /* --- Drawer --- */
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 26, 47, 0.4)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: CARD_BG,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    overflow: 'hidden'
  },
  drawerHeader: {
    paddingTop: 80,
    paddingBottom: 30,
    paddingHorizontal: 24,
    backgroundColor: BG_DARK,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  drawerAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4
  },
  drawerAvatarText: { fontSize: 32 },
  drawerName: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT_DARK,
    marginBottom: 4,
  },
  drawerEmail: {
    fontSize: 14,
    color: TEXT_MUTED,
    fontWeight: '500'
  },
  drawerMenu: {
    paddingTop: 16,
    paddingHorizontal: 12
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 4
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16
  },
  menuIcon: {
    fontSize: 18,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  menuArrow: {
    fontSize: 20,
    color: TEXT_MUTED,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
    marginHorizontal: 16,
  },
});
