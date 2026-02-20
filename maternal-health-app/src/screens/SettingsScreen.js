import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';

const PRIMARY = '#ec135b';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDesc}>Receive alerts and reminders</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#e2e8f0', true: PRIMARY }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Location Sharing</Text>
            <Text style={styles.settingDesc}>Share location in emergencies</Text>
          </View>
          <Switch
            value={location}
            onValueChange={setLocation}
            trackColor={{ false: '#e2e8f0', true: PRIMARY }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>App Version</Text>
          <Text style={styles.menuValue}>1.0.0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Terms of Service</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f6f6' },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24, color: '#0f172a' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8 },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 16, fontWeight: '600', color: '#0f172a', marginBottom: 4 },
  settingDesc: { fontSize: 12, color: '#64748b' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 8 },
  menuText: { fontSize: 16, fontWeight: '500', color: '#0f172a' },
  menuValue: { fontSize: 14, color: '#64748b' },
  menuArrow: { fontSize: 20, color: '#cbd5e1' },
});
