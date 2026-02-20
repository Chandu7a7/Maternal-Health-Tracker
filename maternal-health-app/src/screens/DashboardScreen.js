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
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { getRiskLevel, getSymptoms, getUser, setAuthToken } from '../services/api';
import { getRiskColor, getTrimester } from '../utils/helpers';

const PRIMARY = '#ec135b';
const BG_LIGHT = '#fcfafb';
const SUCCESS_BG = '#ecfdf5';
const SUCCESS_DEEP = '#059669';

export default function DashboardScreen({ navigation: navProp }) {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [risk, setRisk] = useState({ level: 'Safe', advice: '' });
  const [symptoms, setSymptoms] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

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

  useEffect(() => { load(); }, []);
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
      } else if (screen === 'profile') {
        // Navigate to Profile screen via stack navigator
        try {
          const parentNav = navigation.getParent();
          console.log('[Dashboard] Parent navigator:', parentNav ? 'Found' : 'Not found');
          if (parentNav && typeof parentNav.navigate === 'function') {
            console.log('[Dashboard] Navigating to Profile...');
            parentNav.navigate('Profile');
          } else {
            // Use CommonActions to navigate
            console.log('[Dashboard] Using CommonActions to navigate to Profile');
            navigation.dispatch(
              CommonActions.navigate({
                name: 'Profile',
              })
            );
          }
        } catch (error) {
          console.error('[Dashboard] Profile navigation error:', error);
          Alert.alert('Error', `Could not navigate to Profile: ${error.message}`);
        }
      } else if (screen === 'settings') {
        try {
          const parentNav = navigation.getParent();
          if (parentNav && typeof parentNav.navigate === 'function') {
            console.log('[Dashboard] Navigating to Settings...');
            parentNav.navigate('Settings');
          } else {
            navigation.dispatch(
              CommonActions.navigate({
                name: 'Settings',
              })
            );
          }
        } catch (error) {
          console.error('[Dashboard] Settings navigation error:', error);
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
            console.log('[Dashboard] Logging out...');
            await setAuthToken(null);
            console.log('[Dashboard] Token cleared, navigating to Login...');
            
            // Navigate to Login screen via stack navigator
            try {
              const parentNav = navigation.getParent();
              console.log('[Dashboard] Parent navigator for logout:', parentNav ? 'Found' : 'Not found');
              
              if (parentNav && typeof parentNav.replace === 'function') {
                console.log('[Dashboard] Using parent navigator to replace with Login');
                parentNav.replace('Login');
              } else {
                // Use CommonActions to reset navigation stack
                console.log('[Dashboard] Resetting navigation stack to Login');
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                );
              }
            } catch (error) {
              console.error('[Dashboard] Logout navigation error:', error);
              // Even if navigation fails, token is cleared, so show success message
              Alert.alert(
                'Logged Out',
                'You have been logged out successfully. Please restart the app.',
                [{ text: 'OK' }]
              );
            }
          } catch (error) {
            console.error('[Dashboard] Logout error:', error);
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  const month = user?.pregnancyMonth || 1;
  const trimester = getTrimester(month);
  const progress = Math.round((month / 9) * 100);
  const riskColor = getRiskColor(risk.level);

  const renderContent = () => {
    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[PRIMARY]} />}
      >
        {/* Modern Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={openDrawer}
              activeOpacity={0.7}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>👩</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
              <Text style={styles.greetingSub}>Take Care of Yourself</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Pregnancy Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View style={styles.progressLeft}>
              <Text style={styles.monthText}>Month {month}</Text>
              <Text style={styles.trimesterText}>
                {trimester === 1 ? 'First' : trimester === 2 ? 'Second' : 'Third'} Trimester
              </Text>
            </View>
            <View style={styles.progressRight}>
              <Text style={styles.progressLabel}>PROGRESS</Text>
              <Text style={styles.progressVal}>{progress}%</Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabelText}>MONTH 1</Text>
            <Text style={styles.progressLabelText}>MONTH 9</Text>
          </View>
        </View>

        {/* Grid Cards - Modern Layout */}
        <View style={styles.grid}>
          {/* Health Status Card */}
          <View style={styles.gridCard}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconCircle, { backgroundColor: SUCCESS_BG }]}>
                  <Text style={styles.checkIcon}>✓</Text>
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardLabel}>HEALTH STATUS</Text>
                  <Text style={styles.cardValue}>{risk.level === 'Safe' ? 'Good' : risk.level}</Text>
                </View>
              </View>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {risk.advice || 'You are doing great! Keep up with your vitamins.'}
              </Text>
            </View>
          </View>

          {/* AI Risk Level Card */}
          <View style={styles.gridCard}>
            <View style={styles.cardContent}>
              <View style={styles.riskCardHeader}>
                <View style={styles.riskLeft}>
                  <Text style={styles.cardLabel}>AI RISK LEVEL</Text>
                  <Text style={styles.cardValue}>{risk.level}</Text>
                  <View style={[styles.riskBadge, { backgroundColor: riskColor + '22' }]}>
                    <View style={[styles.riskDot, { backgroundColor: riskColor }]} />
                    <Text style={[styles.riskBadgeText, { color: riskColor }]}>
                      {risk.level === 'High' ? 'HIGH' : risk.level === 'Medium' ? 'MEDIUM' : 'LOW'} RISK
                    </Text>
                  </View>
                </View>
                <View style={styles.gaugeContainer}>
                  <View style={styles.gaugeWrapper}>
                    <View style={[styles.gaugeCircle, { borderColor: riskColor }]}>
                      <Text style={styles.gaugeIcon}>🛡️</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Baby Movement Card */}
          <View style={styles.gridCard}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconCircle, { backgroundColor: `${PRIMARY}20` }]}>
                  <Text style={styles.babyIcon}>👶</Text>
                </View>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardLabel}>BABY MOVEMENT</Text>
                  <Text style={styles.cardValue}>Did baby move?</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.movementRow}
                onPress={() => navigation.getParent()?.navigate('Tracker')}
                activeOpacity={0.7}
              >
                <Text style={styles.movementText}>Movement Today</Text>
                <View style={styles.movementToggle}>
                  <View style={styles.toggleCircle} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Clinic Visits Card */}
          <View style={styles.gridCard}>
            <View style={styles.cardContent}>
              <View style={styles.clinicHeader}>
                <Text style={styles.cardLabel}>CLINIC VISITS</Text>
                <View style={styles.upcomingBadge}>
                  <Text style={styles.upcomingText}>UPCOMING</Text>
                </View>
              </View>
              <View style={styles.clinicRow}>
                <View style={styles.clinicDate}>
                  <Text style={styles.clinicMonth}>
                    {new Date().toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </Text>
                  <Text style={styles.clinicDay}>12</Text>
                </View>
                <View style={styles.clinicInfo}>
                  <Text style={styles.clinicTitle}>Routine Checkup</Text>
                  <View style={styles.clinicLocRow}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.clinicLoc}>City Medical Center</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Pro Tip Section with Illustration */}
        <View style={styles.proTipCard}>
          <View style={styles.proTipBackground}>
            <Text style={styles.watermarkText}>Mother Care</Text>
          </View>
          <View style={styles.proTipContent}>
            <Text style={styles.proTipLabel}>Pro Tip</Text>
            <Text style={styles.proTipTitle}>Rest at least 8 hours every day.</Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: BG_LIGHT }]}>
      {renderContent()}

      {/* Drawer Modal */}
      <Modal
        visible={drawerVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeDrawer}
      >
        <TouchableOpacity
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPress={closeDrawer}
        >
          <Animated.View
            style={[
              styles.drawer,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1}>
              {/* Drawer Header */}
              <View style={styles.drawerHeader}>
                <View style={styles.drawerAvatar}>
                  <Text style={styles.drawerAvatarText}>👩</Text>
                </View>
                <Text style={styles.drawerName}>{user?.name || 'User'}</Text>
                <Text style={styles.drawerEmail}>{user?.mobile || ''}</Text>
              </View>

              {/* Drawer Menu Items */}
              <View style={styles.drawerMenu}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress('profile')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuIcon}>👤</Text>
                  <Text style={styles.menuText}>Profile</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress('history')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuIcon}>📊</Text>
                  <Text style={styles.menuText}>History</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress('settings')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuIcon}>⚙️</Text>
                  <Text style={styles.menuText}>Settings</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <View style={styles.menuDivider} />

                <TouchableOpacity
                  style={[styles.menuItem, styles.logoutItem]}
                  onPress={() => handleMenuPress('logout')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.menuIcon}>🚪</Text>
                  <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
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
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 100 },
  // Modern Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: `${PRIMARY}33`,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: { fontSize: 24 },
  greetingContainer: { flex: 1 },
  greeting: { fontSize: 18, fontWeight: '700', color: '#0f172a', letterSpacing: -0.5 },
  greetingSub: { fontSize: 13, color: '#64748b', marginTop: 2 },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notifIcon: { fontSize: 20 },
  // Progress Card
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: `${PRIMARY}10`,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  progressLeft: { flex: 1 },
  monthText: { fontSize: 32, fontWeight: '800', color: PRIMARY, letterSpacing: -1 },
  trimesterText: { fontSize: 14, color: '#64748b', marginTop: 4, fontWeight: '500' },
  progressRight: { alignItems: 'flex-end' },
  progressLabel: { fontSize: 10, fontWeight: '700', color: '#94a3b8', letterSpacing: 1.2 },
  progressVal: { fontSize: 18, fontWeight: '700', color: '#334155', marginTop: 2 },
  progressBarContainer: { marginBottom: 8 },
  progressBar: {
    height: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: PRIMARY,
    borderRadius: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressLabelText: { fontSize: 10, fontWeight: '700', color: '#94a3b8', letterSpacing: 0.5, textTransform: 'uppercase' },
  // Grid Cards
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 20,
  },
  gridCard: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  cardContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 150,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTextContainer: { flex: 1, marginLeft: 16 },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconText: { fontSize: 24 },
  checkIcon: { fontSize: 36, color: SUCCESS_DEEP, fontWeight: '900' },
  babyIcon: { fontSize: 28 },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardValue: { fontSize: 20, fontWeight: '700', color: '#0f172a', letterSpacing: -0.5 },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginTop: 12,
  },
  // Risk Card
  riskCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  riskLeft: { flex: 1 },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    gap: 6,
  },
  riskDot: { width: 6, height: 6, borderRadius: 3 },
  riskBadgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  gaugeContainer: { marginLeft: 8 },
  gaugeWrapper: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
  gaugeIcon: { fontSize: 28 },
  // Movement Row
  movementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginTop: 8,
  },
  movementText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  movementToggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    padding: 2,
    justifyContent: 'center',
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },
  // Clinic Card
  clinicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  upcomingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
  },
  upcomingText: { fontSize: 9, fontWeight: '700', color: '#0369a1', letterSpacing: 0.5 },
  clinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clinicDate: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clinicMonth: { fontSize: 10, fontWeight: '700', color: '#0369a1', textTransform: 'uppercase', letterSpacing: 0.5 },
  clinicDay: { fontSize: 20, fontWeight: '700', color: '#0369a1', marginTop: 2 },
  clinicInfo: { flex: 1 },
  clinicTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', letterSpacing: -0.3 },
  clinicLocRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  locationIcon: { fontSize: 12 },
  clinicLoc: { fontSize: 12, color: '#64748b' },
  // Pro Tip
  proTipCard: {
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#d1fae5',
    overflow: 'hidden',
    minHeight: 120,
    position: 'relative',
  },
  proTipBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermarkText: {
    fontSize: 72,
    fontWeight: '300',
    color: SUCCESS_DEEP,
    fontStyle: 'italic',
    transform: [{ rotate: '-15deg' }],
  },
  proTipContent: {
    padding: 20,
    zIndex: 1,
  },
  proTipLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  proTipTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: 24,
    letterSpacing: -0.3,
    maxWidth: '85%',
  },
  // Drawer Styles
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  drawerHeader: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: PRIMARY,
    alignItems: 'center',
  },
  drawerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: PRIMARY,
  },
  drawerAvatarText: {
    fontSize: 40,
  },
  drawerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  drawerEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  drawerMenu: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  menuIcon: {
    fontSize: 24,
    width: 32,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
  },
  menuArrow: {
    fontSize: 20,
    color: '#cbd5e1',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
    marginHorizontal: 20,
  },
  logoutItem: {
    marginTop: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});
