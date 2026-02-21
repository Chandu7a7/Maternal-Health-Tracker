import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LanguageContext } from '../context/LanguageContext';

const PRIMARY = '#ec135b';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const { lang, changeLanguage, t } = useContext(LanguageContext);

  const toggleLanguage = () => {
    changeLanguage(lang === 'en' ? 'hi' : 'en');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('settings')}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('language')}</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>{lang === 'hi' ? 'हिंदी' : 'English'}</Text>
            <Text style={styles.settingDesc}>{t('languageDesc')}</Text>
          </View>
          <Switch
            value={lang === 'hi'}
            onValueChange={toggleLanguage}
            trackColor={{ false: '#e2e8f0', true: PRIMARY }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('notifications')}</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>{t('pushNotifications')}</Text>
            <Text style={styles.settingDesc}>{t('pushDesc')}</Text>
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
        <Text style={styles.sectionTitle}>{t('location')}</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>{t('locationSharing')}</Text>
            <Text style={styles.settingDesc}>{t('locationDesc')}</Text>
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
        <Text style={styles.sectionTitle}>{t('about')}</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>{t('appVersion')}</Text>
          <Text style={styles.menuValue}>1.0.0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>{t('privacyPolicy')}</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>{t('termsOfService')}</Text>
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
