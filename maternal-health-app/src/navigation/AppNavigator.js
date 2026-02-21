import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LanguageContext } from '../context/LanguageContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import VoiceInputScreen from '../screens/VoiceInputScreen';
import BabyTrackerScreen from '../screens/BabyTrackerScreen';
import HistoryScreen from '../screens/HistoryScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HealthRiskStatusScreen from '../screens/HealthRiskStatusScreen';
import ChatScreen from '../screens/ChatScreen';
import NutritionPlanScreen from '../screens/NutritionPlanScreen';
import NotificationScreen from '../screens/NotificationScreen';
import HealthReminderScreen from '../screens/HealthReminderScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PRIMARY = '#ec135b';

function TabIcon({ name, focused }) {
  const icons = {
    Home: '🏠',
    Tracker: '👶',
    Voice: '🎤',
    History: '📊',
    Alert: '🚨',
  };
  return (
    <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      {icons[name] || '•'}
    </Text>
  );
}

function CustomTabBar({ state, descriptors, navigation }) {
  const { t } = useContext(LanguageContext);
  const routes = state.routes;
  const voiceIndex = routes.findIndex(r => r.name === 'Voice');
  const leftRoutes = routes.slice(0, voiceIndex);
  const rightRoutes = routes.slice(voiceIndex + 1);

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {/* Left side tabs */}
        {leftRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          const labelKey = (options.tabBarLabel || route.name).toLowerCase();
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <TabIcon name={route.name} focused={isFocused} />
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>
                {t(labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Central Voice FAB Button */}
        {routes[voiceIndex] && (() => {
          const route = routes[voiceIndex];
          const { options } = descriptors[route.key];
          const isFocused = state.index === voiceIndex;
          return (
            <View key={route.key} style={styles.voiceButtonContainer}>
              <TouchableOpacity
                style={styles.voiceFAB}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
              >
                <Text style={styles.voiceIcon}>🎤</Text>
              </TouchableOpacity>
            </View>
          );
        })()}

        {/* Right side tabs */}
        {rightRoutes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === voiceIndex + 1 + index;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          const labelKey = (options.tabBarLabel || route.name).toLowerCase();
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <TabIcon name={route.name} focused={isFocused} />
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelFocused]}>
                {t(labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ tabBarLabel: 'HOME' }} />
      <Tab.Screen name="Tracker" component={BabyTrackerScreen} options={{ tabBarLabel: 'TRACKER' }} />
      <Tab.Screen name="Voice" component={VoiceInputScreen} options={{ tabBarLabel: '' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: 'HISTORY' }} />
      <Tab.Screen name="Alert" component={EmergencyScreen} options={{ tabBarLabel: 'ALERT' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator({ hasToken }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={hasToken ? 'Main' : 'Login'}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="HealthRiskStatus" component={HealthRiskStatusScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="NutritionPlan" component={NutritionPlanScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="HealthReminders" component={HealthReminderScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingBottom: 0,
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 60,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  tabIconFocused: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tabLabelFocused: {
    color: PRIMARY,
  },
  // Voice FAB Button
  voiceButtonContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    zIndex: 10,
  },
  voiceFAB: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#fff',
  },
  voiceIcon: {
    fontSize: 28,
  },
});
