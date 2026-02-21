import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Switch,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LanguageContext } from '../context/LanguageContext';
import { getUser, updateProfile } from '../services/api';

const PRIMARY = '#ec135b';
const BG_LIGHT = '#fdf8f9';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#0f172a';
const TEXT_MUTED = '#64748b';

export default function HealthReminderScreen() {
    const navigation = useNavigation();
    const { t } = useContext(LanguageContext);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [medications, setMedications] = useState([
        { id: '1', name: 'Folic Acid', time: '10:00 AM', taken: false },
        { id: '2', name: 'Iron Tablet', time: '08:00 PM', taken: true },
    ]);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const data = await getUser();
            setUser(data);
            if (data.medications && data.medications.length > 0) {
                setMedications(data.medications.map((m, i) => ({ ...m, id: m._id || String(i) })));
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleMedication = async (id) => {
        try {
            const updated = medications.map(m =>
                m.id === id ? { ...m, taken: !m.taken } : m
            );
            setMedications(updated);
            await updateProfile({ medications: updated });
        } catch (error) {
            console.error('Error updating medication status:', error);
            Alert.alert('Error', 'Failed to update status');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PRIMARY} />
            </View>
        );
    }

    const nextVisitDate = user?.nextDoctorVisit ? new Date(user.nextDoctorVisit).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '20 Feb';

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={BG_LIGHT} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={PRIMARY} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Health Reminders</Text>
                </View>
                <Text style={styles.headerSubtitle}>
                    Stay on track with your doctor visits and medicines
                </Text>
            </View>

            <ScrollView
                style={styles.main}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Next Doctor Visit Card */}
                <View style={styles.visitCard}>
                    <View style={styles.visitGlow} />
                    <View style={styles.visitHeader}>
                        <View style={styles.visitIconBox}>
                            <MaterialIcons name="calendar-today" size={32} color={PRIMARY} />
                        </View>
                        <View style={styles.upcomingBadge}>
                            <Text style={styles.upcomingText}>Upcoming</Text>
                        </View>
                    </View>
                    <Text style={styles.visitTitle}>Doctor Visit</Text>
                    <Text style={styles.visitText}>
                        Your next doctor visit is on <Text style={styles.visitDateHighlight}>{nextVisitDate}</Text>
                    </Text>
                    <TouchableOpacity style={styles.calendarBtn}>
                        <MaterialIcons name="event" size={18} color={PRIMARY} />
                        <Text style={styles.calendarBtnText}>Add to Calendar</Text>
                    </TouchableOpacity>
                </View>

                {/* Medicine Schedule Card */}
                <View style={styles.medicineCard}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleRow}>
                            <MaterialIcons name="medical-services" size={24} color={PRIMARY} />
                            <Text style={styles.sectionTitle}>Medicine Schedule</Text>
                        </View>
                        <Text style={styles.dailyBadge}>Daily</Text>
                    </View>

                    <View style={styles.medicineList}>
                        {medications.map((med) => (
                            <View key={med.id} style={styles.medicineItem}>
                                <View>
                                    <Text style={styles.medName}>{med.name}</Text>
                                    <View style={styles.medTimeRow}>
                                        <MaterialIcons name="schedule" size={12} color={TEXT_MUTED} />
                                        <Text style={styles.medTime}>{med.time}</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={med.taken}
                                    onValueChange={() => toggleMedication(med.id)}
                                    trackColor={{ false: '#e2e8f0', true: PRIMARY }}
                                    thumbColor="#fff"
                                />
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.addReminderBtn}>
                        <MaterialIcons name="add" size={20} color={PRIMARY} />
                        <Text style={styles.addReminderText}>Add New Reminder</Text>
                    </TouchableOpacity>
                </View>

                {/* Monthly Checkup Card */}
                <View style={styles.checkupCard}>
                    <View style={styles.checkupIconBg}>
                        <MaterialIcons name="medical-services" size={80} color="rgba(255,255,255,0.1)" />
                    </View>
                    <View style={styles.checkupHeader}>
                        <View style={styles.dueBadge}>
                            <Text style={styles.dueText}>Due Soon</Text>
                        </View>
                        <MaterialIcons name="notification-important" size={24} color="#fff" />
                    </View>
                    <Text style={styles.checkupTitle}>Monthly Checkup</Text>
                    <Text style={styles.checkupDesc}>
                        Your routine prenatal checkup is due in 3 days. Ensure you have your medical file ready.
                    </Text>
                    <View style={styles.checkupActions}>
                        <TouchableOpacity style={styles.bookBtn}>
                            <Text style={styles.bookBtnText}>Book Now</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.laterBtn}>
                            <Text style={styles.laterBtnText}>Remind Later</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG_LIGHT,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BG_LIGHT,
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(236,19,91,0.1)',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: TEXT_DARK,
        marginLeft: 12,
    },
    headerSubtitle: {
        fontSize: 18,
        color: TEXT_MUTED,
        lineHeight: 24,
    },
    main: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        gap: 24,
    },
    // Visit Card
    visitCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(236,19,91,0.05)',
        position: 'relative',
        overflow: 'hidden',
    },
    visitGlow: {
        position: 'absolute',
        top: -30,
        right: -30,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: `${PRIMARY}08`,
    },
    visitHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    visitIconBox: {
        width: 56,
        height: 56,
        backgroundColor: `${PRIMARY}1A`,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    upcomingBadge: {
        backgroundColor: `${PRIMARY}1A`,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    upcomingText: {
        color: PRIMARY,
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    visitTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: TEXT_DARK,
        marginBottom: 4,
    },
    visitText: {
        fontSize: 15,
        color: TEXT_MUTED,
        marginBottom: 20,
    },
    visitDateHighlight: {
        color: PRIMARY,
        fontWeight: '700',
    },
    calendarBtn: {
        backgroundColor: `${PRIMARY}0D`,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    calendarBtnText: {
        color: PRIMARY,
        fontSize: 15,
        fontWeight: '700',
    },
    // Medicine Card
    medicineCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    sectionTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: TEXT_DARK,
    },
    dailyBadge: {
        fontSize: 12,
        color: TEXT_MUTED,
        fontWeight: '600',
    },
    medicineList: {
        gap: 16,
    },
    medicineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 14,
        backgroundColor: BG_LIGHT,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(236,19,91,0.05)',
    },
    medName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 2,
    },
    medTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    medTime: {
        fontSize: 12,
        color: TEXT_MUTED,
        fontWeight: '500',
    },
    addReminderBtn: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        paddingVertical: 8,
    },
    addReminderText: {
        color: PRIMARY,
        fontSize: 14,
        fontWeight: '600',
    },
    // Checkup Card
    checkupCard: {
        backgroundColor: PRIMARY,
        borderRadius: 20,
        padding: 20,
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 6,
        position: 'relative',
        overflow: 'hidden',
    },
    checkupIconBg: {
        position: 'absolute',
        bottom: -20,
        right: -10,
    },
    checkupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    dueBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    dueText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    checkupTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 4,
    },
    checkupDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 20,
        marginBottom: 20,
    },
    checkupActions: {
        flexDirection: 'row',
        gap: 12,
    },
    bookBtn: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    bookBtnText: {
        color: PRIMARY,
        fontSize: 14,
        fontWeight: '800',
    },
    laterBtn: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    laterBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '800',
    },
});
