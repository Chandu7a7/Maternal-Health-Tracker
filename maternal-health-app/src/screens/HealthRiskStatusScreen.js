import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Image, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const PRIMARY = '#ec135b';
const BG_LIGHT = '#fcf8f9';

export default function HealthRiskStatusScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    // Provide defaults if opened directly
    const riskLevel = route.params?.riskLevel || 'High';
    const advice = route.params?.advice || 'Our AI has detected potential complications based on your symptoms.';

    return (
        <View style={styles.container}>
            {/* Top Navigation Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Health Risk Status</Text>
                    <Text style={styles.headerSubtitle}>Based on your recent symptoms</Text>
                </View>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

                {/* Risk Status Card */}
                <View style={styles.riskCard}>
                    <View style={styles.iconContainer}>
                        <View style={styles.pulseBg} />
                        <View style={styles.iconCircle}>
                            <Text style={styles.warningIcon}>⚠️</Text>
                        </View>
                    </View>
                    <Text style={styles.riskTitle}>{riskLevel} Risk</Text>
                    <Text style={styles.riskDesc}>{advice}</Text>
                </View>

                {/* Emergency Advice Card */}
                <View style={styles.adviceCard}>
                    <Text style={styles.adviceTitle}>🏥 Emergency Advice</Text>

                    <View style={styles.adviceItem}>
                        <View style={styles.adviceIconBg}>
                            <Text style={styles.adviceIcon}>🚑</Text>
                        </View>
                        <View style={styles.adviceTextContainer}>
                            <Text style={styles.adviceItemTitle}>Consult your doctor immediately</Text>
                            <Text style={styles.adviceItemDesc}>Urgent medical attention is required.</Text>
                        </View>
                    </View>

                    <View style={styles.adviceItem}>
                        <View style={styles.adviceIconBg}>
                            <Text style={styles.adviceIcon}>🛏️</Text>
                        </View>
                        <View style={styles.adviceTextContainer}>
                            <Text style={styles.adviceItemTitle}>Take complete bed rest</Text>
                            <Text style={styles.adviceItemDesc}>Avoid any physical activity or stress.</Text>
                        </View>
                    </View>

                    <View style={styles.adviceItem}>
                        <View style={styles.adviceIconBg}>
                            <Text style={styles.adviceIcon}>📱</Text>
                        </View>
                        <View style={styles.adviceTextContainer}>
                            <Text style={styles.adviceItemTitle}>Keep your phone nearby</Text>
                            <Text style={styles.adviceItemDesc}>Ensure you can call for help at any time.</Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.alertBtn} onPress={() => {/* Logic for alert */ }}>
                        <Text style={styles.alertBtnIcon}>🚨</Text>
                        <Text style={styles.alertBtnText}>Send Emergency Alert</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL('tel:108')}>
                        <Text style={styles.callBtnIcon}>📞</Text>
                        <Text style={styles.callBtnText}>Call Doctor</Text>
                    </TouchableOpacity>
                </View>

                {/* Map Placeholder */}
                <View style={styles.mapContainer}>
                    <Image
                        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvXwmxaa83bTFuEdouaFnc4wGKkDEMQTyOfOFQ7lIlY5enuvorgIZDQA6O94pPSv_1AHrbWIeLUKHKQOzjDGQZf4BT6vD1U36K3pqimqk5aoDT8Bvipx5fA9DC8YZn0T242yjC4_ukWqlIwITxPfT7lhBNhhJNTuEnD7IivCkQj2rpWkIqsPKDPOZPGIsWqkR4pU7iShfVReGDXSKpZr0YVUVdY9I_XxT5kyf0ALbREfPhw4Sngcg135hYvnfbKQfQuUfdr_9xiRY' }}
                        style={styles.mapImg}
                        resizeMode="cover"
                    />
                    <View style={styles.mapOverlay}>
                        <Text style={styles.mapText}>📍 Nearest Clinic: 1.2km away</Text>
                    </View>
                </View>

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
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(252, 248, 249, 0.9)',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    backBtn: {
        padding: 8,
        marginRight: 12,
        backgroundColor: 'rgba(236, 19, 91, 0.1)',
        borderRadius: 20,
    },
    backIcon: {
        fontSize: 24,
        color: '#0f172a',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748b',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    riskCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(236, 19, 91, 0.2)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginTop: 8,
    },
    iconContainer: {
        position: 'relative',
        marginBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulseBg: {
        position: 'absolute',
        width: 90,
        height: 90,
        backgroundColor: 'rgba(236, 19, 91, 0.2)',
        borderRadius: 45,
    },
    iconCircle: {
        width: 80,
        height: 80,
        backgroundColor: PRIMARY,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    warningIcon: {
        fontSize: 40,
    },
    riskTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: PRIMARY,
        marginBottom: 8,
    },
    riskDesc: {
        fontSize: 16,
        color: '#475569',
        textAlign: 'center',
        lineHeight: 24,
    },
    adviceCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginTop: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    adviceTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 16,
    },
    adviceItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    adviceIconBg: {
        backgroundColor: 'rgba(236, 19, 91, 0.1)',
        padding: 10,
        borderRadius: 12,
        marginRight: 16,
    },
    adviceIcon: {
        fontSize: 20,
    },
    adviceTextContainer: {
        flex: 1,
    },
    adviceItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    adviceItemDesc: {
        fontSize: 14,
        color: '#64748b',
    },
    actionsContainer: {
        marginTop: 32,
        gap: 12,
    },
    alertBtn: {
        backgroundColor: PRIMARY,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
    },
    alertBtnIcon: {
        fontSize: 22,
        marginRight: 12,
    },
    alertBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    callBtn: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: PRIMARY,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 16,
    },
    callBtnIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    callBtnText: {
        color: PRIMARY,
        fontSize: 18,
        fontWeight: '700',
    },
    mapContainer: {
        marginTop: 24,
        height: 130,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    mapImg: {
        width: '100%',
        height: '100%',
    },
    mapOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    mapText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    }
});
