import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
  Linking,
} from 'react-native';
import { triggerEmergency, getUser } from '../services/api';

const PRIMARY = '#ec135b';
const BG_LIGHT = '#fcfafa';

export default function EmergencyScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    getUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, []);

  const handleEmergency = () => {
    Alert.alert(
      'Emergency Alert',
      'Send alert to your doctor and family immediately?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Alert',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await triggerEmergency('High risk - Immediate attention needed');
              Alert.alert('✅ Sent', 'Emergency Alert Sent Successfully');
            } catch (err) {
              Alert.alert('Error', err.response?.data?.message || 'Could not send. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleSMS = (phone) => {
    Linking.openURL(`sms:${phone}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Help</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Warning Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconContainer}>
            <Text style={styles.heroIcon}>🏠</Text>
          </View>
          <Text style={styles.heroTitle}>Emergency Help</Text>
          <Text style={styles.heroSubtitle}>
            Send alert to your doctor or family immediately
          </Text>
        </View>

        {/* Primary Emergency Action */}
        <View style={styles.emergencySection}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[styles.emergencyBtn, loading && styles.btnDisabled]}
              onPress={handleEmergency}
              disabled={loading}
              activeOpacity={0.8}
            >
              <View style={styles.pulseRing} />
              <Text style={styles.emergencyIcon}>🚨</Text>
              <Text style={styles.emergencyText}>SEND ALERT</Text>
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.smsHint}>
            <Text style={styles.smsIcon}>💬</Text>
            <Text style={styles.smsText}>SMS will be sent to doctor and family</Text>
          </View>
        </View>

        {/* Contact List Section */}
        <View style={styles.contactsSection}>
          <View style={styles.contactsHeader}>
            <Text style={styles.contactsTitle}>Primary Contacts</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.editBtn}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Doctor Card */}
          <View style={styles.contactCard}>
            <View style={styles.contactAvatar}>
              <Text style={styles.avatarText}>👩‍⚕️</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Dr. Sharma</Text>
              <Text style={styles.contactPhone}>
                {user?.doctorContact || '7725094650'}
              </Text>
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleCall(user?.doctorContact || '7725094650')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionIcon}>📞</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleSMS(user?.doctorContact || '7725094650')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionIcon}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Family Card */}
          <View style={styles.contactCard}>
            <View style={styles.contactAvatar}>
              <Text style={styles.avatarInitials}>FM</Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>Family Member</Text>
              <Text style={styles.contactPhone}>
                {user?.familyContact || '909838601'}
              </Text>
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleCall(user?.familyContact || '909838601')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionIcon}>📞</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleSMS(user?.familyContact || '909838601')}
                activeOpacity={0.7}
              >
                <Text style={styles.actionIcon}>💬</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location Alert Tip */}
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              Your current GPS location will be automatically shared with your emergency contacts when the alert is sent.
            </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  backBtn: {
    padding: 8,
    borderRadius: 20,
  },
  backIcon: {
    fontSize: 24,
    color: '#334155',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    paddingRight: 40,
  },
  placeholder: {
    width: 40,
  },
  // Scroll & Content
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${PRIMARY}1A`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroIcon: {
    fontSize: 48,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 240,
  },
  // Emergency Section
  emergencySection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emergencyBtn: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  emergencyIcon: {
    fontSize: 64,
    marginBottom: 8,
  },
  emergencyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  btnDisabled: {
    opacity: 0.7,
  },
  smsHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 16,
  },
  smsIcon: {
    fontSize: 14,
  },
  smsText: {
    fontSize: 14,
    fontWeight: '500',
    color: `${PRIMARY}CC`,
  },
  // Contacts Section
  contactsSection: {
    gap: 16,
  },
  contactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  editBtn: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: `${PRIMARY}0D`,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: `${PRIMARY}1A`,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${PRIMARY}33`,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    fontSize: 24,
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: PRIMARY,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#64748b',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIcon: {
    fontSize: 20,
  },
  // Info Card
  infoCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  infoIcon: {
    fontSize: 20,
    color: '#64748b',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
});
