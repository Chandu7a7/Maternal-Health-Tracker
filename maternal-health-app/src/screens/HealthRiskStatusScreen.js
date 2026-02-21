import React, { useContext, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Animated,
    Image,
    Linking,
    SafeAreaView,
    StatusBar,
    Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LanguageContext } from '../context/LanguageContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const COLORS = {
    primary: '#ec135b',
    backgroundLight: '#f8f6f6',
    safe: '#10b981',
    caution: '#f59e0b',
    slate900: '#0f172a',
    slate700: '#334155',
    slate500: '#64748b',
    slate200: '#e2e8f0',
    white: '#ffffff',
};

export default function HealthRiskStatusScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { t } = useContext(LanguageContext);

    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Provide defaults if opened directly
    const rawRiskLevel = route.params?.riskLevel || 'High';
    const riskLevel = rawRiskLevel.toLowerCase(); // 'safe', 'medium', 'high'
    // Map text to UI themes based on the input string to match the design requested
    let currentTheme = { title: rawRiskLevel, color: COLORS.primary, icon: 'emergency' };

    if (riskLevel.includes('low') || riskLevel.includes('safe') || riskLevel.includes('normal')) {
        currentTheme = { title: 'Safe', color: COLORS.safe, icon: 'shield-checkmark', bgIcon: 'verified-user' };
    } else if (riskLevel.includes('medium') || riskLevel.includes('moderate')) {
        currentTheme = { title: 'Medium Risk', color: COLORS.caution, icon: 'warning', bgIcon: 'warning' };
    } else {
        currentTheme = { title: 'High Risk Alert', color: COLORS.primary, icon: 'medkit', bgIcon: 'emergency' };
    }

    const advice = route.params?.advice || 'Please consult your doctor immediately!';

    useEffect(() => {
        if (currentTheme.color === COLORS.primary) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    })
                ])
            ).start();
        }
    }, [currentTheme.color]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* Background Decoration */}
            <View style={StyleSheet.absoluteFill}>
                <View style={[styles.bgBlobRow, { top: -50, left: -50, backgroundColor: `${COLORS.primary}20` }]} />
                <View style={[styles.bgBlobRow, { bottom: -100, right: -50, backgroundColor: '#a855f720' }]} />
            </View>

            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>{t('riskStatusTitle') || 'AI Health Risk Analysis'}</Text>
                    <Text style={styles.headerSubtitle}>{t('riskStatusSub') || 'Based on your recent symptoms'}</Text>
                </View>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Dynamic Risk Status Section */}
                {currentTheme.color === COLORS.safe ? (
                    // === SAFE STATUS VIEW ===
                    <View style={[styles.mainCard, { borderColor: `${COLORS.safe}20` }]}>
                        <View style={[styles.cardBgIconPosition, { opacity: 0.1 }]}>
                            <MaterialIcons name="verified-user" size={100} color={COLORS.safe} />
                        </View>
                        <View style={styles.centerFlow}>
                            <View style={[styles.safeIconCircle, { borderColor: COLORS.safe }]}>
                                <Ionicons name="shield-checkmark" size={36} color={COLORS.safe} />
                            </View>
                            <Text style={[styles.cardTitle, { color: COLORS.safe }]}>Everything looks good!</Text>
                            <Text style={styles.cardSubtitle}>{advice.length > 30 ? advice : "Your symptoms are normal. Continue regular care."}</Text>
                        </View>
                    </View>
                ) : currentTheme.color === COLORS.caution ? (
                    // === MEDIUM RISK VIEW ===
                    <View style={[styles.mainCard, { borderColor: `${COLORS.caution}40` }]}>
                        <View style={styles.mediumRiskHeader}>
                            <View style={[styles.mediumRiskIconBox, { backgroundColor: `${COLORS.caution}20` }]}>
                                <Ionicons name="warning" size={32} color={COLORS.caution} />
                            </View>
                            <View style={styles.mediumRiskHeaderText}>
                                <Text style={[styles.cardTitle, { color: COLORS.caution, marginBottom: 2 }]}>{currentTheme.title}</Text>
                                <Text style={styles.cardSubtitleSmall}>Observation recommended</Text>
                            </View>
                        </View>
                        <View style={[styles.mediumRiskBanner, { backgroundColor: `${COLORS.caution}10`, borderLeftColor: COLORS.caution }]}>
                            <Text style={styles.cardSubtitle}>{advice}</Text>
                        </View>
                    </View>
                ) : (
                    // === HIGH RISK VIEW ===
                    <View style={[styles.mainCard, { backgroundColor: `${COLORS.primary}10`, borderColor: COLORS.primary, borderWidth: 2 }]}>
                        <View style={styles.centerFlow}>
                            <Animated.View style={[styles.highRiskCircle, { transform: [{ scale: pulseAnim }] }]}>
                                <MaterialIcons name="local-hospital" size={40} color={COLORS.white} />
                            </Animated.View>
                            <Text style={[styles.cardTitle, { color: COLORS.primary, marginTop: 16, textTransform: 'uppercase', fontWeight: '900' }]}>{currentTheme.title}</Text>
                            <Text style={[styles.cardSubtitle, { color: COLORS.slate900, fontWeight: '600' }]}>{advice}</Text>
                        </View>

                        <View style={styles.actionsContainer}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.primaryButton]}
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate('Emergency')}
                            >
                                <MaterialIcons name="sos" size={24} color={COLORS.white} />
                                <Text style={styles.primaryButtonText}>{t('sendEmergencyAlert') || 'Send Emergency Alert'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} activeOpacity={0.7}>
                                <MaterialIcons name="location-on" size={24} color={COLORS.slate900} />
                                <Text style={styles.secondaryButtonText}>Find Nearest Clinic</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Shared Advice Layout logic (only for Safe/Medium) */}
                {currentTheme.color !== COLORS.primary && (
                    <View style={styles.adviceCard}>
                        <View style={styles.adviceCardHeader}>
                            <MaterialIcons name="lightbulb-outline" size={24} color={COLORS.primary} />
                            <Text style={styles.adviceCardTitle}>Personalized Advice</Text>
                        </View>

                        <View style={styles.adviceList}>
                            <View style={styles.adviceItem}>
                                <View style={[styles.adviceIconBadge, { backgroundColor: `${COLORS.safe}20` }]}>
                                    <Ionicons name="medical" size={18} color={COLORS.safe} />
                                </View>
                                <Text style={styles.adviceItemText}>Keep taking your prenatal vitamins daily at the same time.</Text>
                            </View>
                            <View style={styles.adviceItem}>
                                <View style={[styles.adviceIconBadge, { backgroundColor: '#dbeafe' }]}>
                                    <Ionicons name="water" size={18} color="#3b82f6" />
                                </View>
                                <Text style={styles.adviceItemText}>Maintain hydration: aim for 8-10 glasses of water today.</Text>
                            </View>
                            <View style={styles.adviceItem}>
                                <View style={[styles.adviceIconBadge, { backgroundColor: '#fae8ff' }]}>
                                    <MaterialIcons name="event" size={18} color="#a855f7" />
                                </View>
                                <Text style={styles.adviceItemText}>Next checkup is scheduled in <Text style={{ fontWeight: '700' }}>2 weeks</Text>.</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Shared Action Buttons that always show on medium/safe (or fallbacks) */}
                {currentTheme.color !== COLORS.primary && (
                    <View style={styles.sharedActions}>
                        <TouchableOpacity style={[styles.actionButton, styles.primaryButton, { backgroundColor: currentTheme.color === COLORS.safe ? COLORS.safe : COLORS.caution }]} onPress={() => Linking.openURL('tel:108')}>
                            <MaterialIcons name="call" size={20} color={COLORS.white} />
                            <Text style={styles.primaryButtonText}>{currentTheme.color === COLORS.caution ? "Call Midwife for Advice" : "Contact Clinic"}</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    bgBlobRow: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20,
        paddingBottom: 16,
        backgroundColor: 'rgba(248, 246, 246, 0.8)',
        borderBottomWidth: 1,
        borderBottomColor: `${COLORS.primary}15`,
        zIndex: 10,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: `${COLORS.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.slate900,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 13,
        color: COLORS.slate500,
        marginTop: 2,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    mainCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.slate200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
        position: 'relative',
        overflow: 'hidden',
    },
    cardBgIconPosition: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    centerFlow: {
        alignItems: 'center',
    },
    safeIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 15,
        color: COLORS.slate500,
        textAlign: 'center',
        lineHeight: 22,
    },
    cardSubtitleSmall: {
        fontSize: 13,
        color: COLORS.slate500,
    },
    mediumRiskHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    mediumRiskIconBox: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    mediumRiskHeaderText: {
        flex: 1,
    },
    mediumRiskBanner: {
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
    },
    highRiskCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionsContainer: {
        marginTop: 24,
        gap: 12,
    },
    sharedActions: {
        marginTop: 16,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 8,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryButton: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: `${COLORS.primary}30`,
    },
    secondaryButtonText: {
        color: COLORS.slate900,
        fontSize: 16,
        fontWeight: '700',
    },
    adviceCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: `${COLORS.primary}10`,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    adviceCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    adviceCardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.slate900,
    },
    adviceList: {
        gap: 16,
    },
    adviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    adviceIconBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    adviceItemText: {
        flex: 1,
        fontSize: 15,
        color: COLORS.slate700,
        lineHeight: 22,
    }
});
