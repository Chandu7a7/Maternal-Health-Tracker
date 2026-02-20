import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getUser } from '../services/api';
import { getTrimester } from '../utils/helpers';

const PRIMARY = '#ec135b';
const BG_LIGHT = '#fcfafb';

export default function ProfileScreen({ navigation: navProp }) {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error('[ProfileScreen] Error loading user:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getExpectedDate = () => {
    if (!user?.pregnancyMonth) return 'N/A';
    const month = parseInt(user.pregnancyMonth) || 1;
    const today = new Date();
    const remainingMonths = 9 - month;
    const expectedDate = new Date(today);
    expectedDate.setMonth(today.getMonth() + remainingMonths);
    return expectedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getWeeks = () => {
    if (!user?.pregnancyMonth) return 0;
    const month = parseInt(user.pregnancyMonth) || 1;
    return Math.round((month / 9) * 40);
  };

  const maskPhone = (phone) => {
    if (!phone) return 'N/A';
    // Remove +91 prefix if present
    const cleanPhone = phone.replace(/^\+91\s*/, '').replace(/\s+/g, '');
    if (cleanPhone.length < 10) return phone;
    return `+91 ${cleanPhone.slice(0, 2)}XXX XXXX${cleanPhone.slice(-1)}`;
  };

  const getCleanPhone = (phone) => {
    if (!phone) return null;
    // Remove +91 prefix and spaces
    return phone.replace(/^\+91\s*/, '').replace(/\s+/g, '');
  };

  const handleCall = (phone) => {
    const cleanPhone = getCleanPhone(phone);
    if (cleanPhone) {
      Linking.openURL(`tel:+91${cleanPhone}`).catch((err) => {
        console.error('[ProfileScreen] Error calling:', err);
        Alert.alert('Error', 'Could not make call. Please check phone number.');
      });
    } else {
      Alert.alert('Error', 'Phone number not available');
    }
  };

  const handleSMS = (phone) => {
    const cleanPhone = getCleanPhone(phone);
    if (cleanPhone) {
      Linking.openURL(`sms:+91${cleanPhone}`).catch((err) => {
        console.error('[ProfileScreen] Error sending SMS:', err);
        Alert.alert('Error', 'Could not send SMS. Please check phone number.');
      });
    } else {
      Alert.alert('Error', 'Phone number not available');
    }
  };

  const month = user?.pregnancyMonth || 1;
  const trimester = getTrimester(month);
  const trimesterText =
    trimester === 1 ? 'First' : trimester === 2 ? 'Second' : 'Third';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => {
            try {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                // If can't go back, navigate to Main (Tab Navigator)
                const parentNav = navigation.getParent();
                if (parentNav) {
                  parentNav.navigate('Main');
                }
              }
            } catch (error) {
              console.error('[ProfileScreen] Back navigation error:', error);
              // Fallback: try to go back anyway
              navigation.goBack();
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => {
            // Navigate to Settings if available
            if (navigation.getParent) {
              // Could navigate to settings screen
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.headerIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
        {/* Profile Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👩</Text>
            </View>
            <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.7}>
              <Text style={styles.cameraIcon}>📷</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Month {month} • {getWeeks()} Weeks
            </Text>
          </View>
        </View>

        {/* Main Info Section */}
        <View style={styles.infoSection}>
          {/* Personal Details Card */}
          <TouchableOpacity style={styles.infoCard} activeOpacity={0.7}>
            <View style={[styles.cardIcon, styles.personalIcon]}>
              <Text style={styles.cardIconText}>👤</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>PERSONAL DETAILS</Text>
              <Text style={styles.cardValue}>Age: {user?.age || 'N/A'}</Text>
              <Text style={styles.cardSubtext}>
                {maskPhone(user?.mobile) || 'N/A'}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Pregnancy Status Card */}
          <TouchableOpacity style={styles.infoCard} activeOpacity={0.7}>
            <View style={[styles.cardIcon, styles.pregnancyIcon]}>
              <Text style={styles.cardIconText}>📅</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>PREGNANCY STATUS</Text>
              <Text style={styles.cardValue}>
                Expected: {getExpectedDate()}
              </Text>
              <Text style={styles.cardSubtext}>
                Current Phase: {trimesterText} Trimester
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Emergency Contact Card */}
          <View style={styles.infoCard}>
            <View style={[styles.cardIcon, styles.familyIcon]}>
              <Text style={styles.cardIconText}>❤️</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>EMERGENCY CONTACT</Text>
              <Text style={styles.cardValue}>
                {user?.familyContact?.split(' ')[0] || user?.familyContact || 'Rajesh'} (Husband)
              </Text>
              <Text style={styles.cardSubtext}>
                {user?.familyContact ? maskPhone(user.familyContact) : '+91 91XXX XXXX9'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.actionBtn, styles.callBtn]}
              onPress={() => handleCall(user?.familyContact)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>📞</Text>
            </TouchableOpacity>
          </View>

          {/* Doctor Contact Card */}
          <View style={styles.infoCard}>
            <View style={[styles.cardIcon, styles.doctorIcon]}>
              <Text style={styles.cardIconText}>🏥</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>PRIMARY OBSTETRICIAN</Text>
              <Text style={styles.cardValue}>Dr. Sharma</Text>
              <Text style={styles.cardSubtext}>
                {user?.doctorContact ? maskPhone(user.doctorContact) : '+91 98XXX XXXX0'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.actionBtn, styles.chatBtn]}
              onPress={() => handleSMS(user?.doctorContact)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionIcon}>💬</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity style={styles.editBtn} activeOpacity={0.8}>
              <Text style={styles.editIcon}>✏️</Text>
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} activeOpacity={0.7}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerBtn: {
    padding: 8,
    borderRadius: 20,
  },
  headerIcon: {
    fontSize: 24,
    color: '#334155',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  // Scroll & Content
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  // Hero Section
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: `${PRIMARY}33`,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarText: {
    fontSize: 64,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cameraIcon: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: `${PRIMARY}1A`,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: PRIMARY,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  // Info Section
  infoSection: {
    paddingHorizontal: 24,
    gap: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personalIcon: {
    backgroundColor: `${PRIMARY}1A`,
  },
  pregnancyIcon: {
    backgroundColor: '#eef2ff',
  },
  familyIcon: {
    backgroundColor: '#fff1f2',
  },
  doctorIcon: {
    backgroundColor: '#f0fdfa',
  },
  cardIconText: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  cardSubtext: {
    fontSize: 14,
    color: '#64748b',
  },
  chevron: {
    fontSize: 20,
    color: '#cbd5e1',
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtn: {
    backgroundColor: '#fff1f2',
  },
  chatBtn: {
    backgroundColor: '#f0fdfa',
  },
  actionIcon: {
    fontSize: 20,
  },
  // Action Section
  actionSection: {
    paddingTop: 24,
    paddingBottom: 48,
    gap: 12,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  editIcon: {
    fontSize: 20,
  },
  editText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  saveBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
});
