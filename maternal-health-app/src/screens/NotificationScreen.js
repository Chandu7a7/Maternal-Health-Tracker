import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from '../context/LanguageContext';

const PRIMARY = '#ec135b';
const BG_LIGHT = '#f8f6f6';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#1e293b';
const TEXT_MUTED = '#64748b';

export default function NotificationScreen() {
    const navigation = useNavigation();
    const { t } = useContext(LanguageContext);

    const notifications = [
        {
            id: '1',
            type: 'risk',
            title: 'Risk Alert',
            time: '10 mins ago',
            message: 'Medium risk detected based on your last voice entry. Please monitor your symptoms.',
            actionLabel: 'View analysis',
            icon: '⚠️',
            color: PRIMARY,
        },
        {
            id: '2',
            type: 'movement',
            title: 'Movement Alert',
            time: '1 hour ago',
            message: "You haven't recorded your baby's movement today. It's time for a kick count!",
            actionLabel: 'Record Now',
            icon: '👶',
            color: `${PRIMARY}99`,
            btnAction: () => navigation.navigate('Tracker'),
        },
        {
            id: '3',
            type: 'medication',
            title: 'Medication',
            time: '3 hours ago',
            message: 'Time to take your folic acid supplement. This helps with baby\'s development.',
            actionLabel: 'Mark as Taken',
            icon: '💊',
            color: `${PRIMARY}4D`,
        },
        {
            id: '4',
            type: 'visit',
            title: 'Doctor Visit',
            time: 'Yesterday',
            message: 'Your routine checkup is scheduled for tomorrow at 10:00 AM at the Health Center.',
            icon: '📅',
            color: `${PRIMARY}4D`,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzKxM5wyE995mk2vXYmYiSGyWjZTW7TpNYAi0pnP4vGGX4Q9Dj5Iph6g_jCzkP2y9ClsFD-JTn_wxjcPciYriBHOy7ny1s8cQQNLg80Lyo9LE9M33wQxZ_U9dc2w0b2vyQU_enkmlXEgvO9liRqTyVKx6gMLOjQYimBIMLCfRObinevJYZ3cItcrrKXeIrrM9MdBG9KLjDITtYvYBm6KBUADVvZN69znprr8z5b0t7hjkbw6ZWR_kAgjfa4FU7cWVUO7KEz4H3iUs',
        },
    ];

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
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications</Text>
                </View>
                <Text style={styles.headerSubtitle}>Your recent health alerts and reminders</Text>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {notifications.map((item) => (
                    <View key={item.id} style={styles.notificationCard}>
                        <View style={[styles.priorityIndicator, { backgroundColor: item.color }]} />
                        <View style={styles.cardBody}>
                            <View style={styles.iconContainer}>
                                <View style={[styles.iconWrapper, { backgroundColor: `${PRIMARY}10` }]}>
                                    <Text style={styles.emojiIcon}>{item.icon}</Text>
                                </View>
                            </View>
                            <View style={styles.textContainer}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    <Text style={styles.itemTime}>{item.time}</Text>
                                </View>
                                <Text style={styles.itemMessage}>{item.message}</Text>

                                {item.type === 'movement' ? (
                                    <TouchableOpacity
                                        style={styles.primaryActionButton}
                                        onPress={item.btnAction}
                                    >
                                        <Text style={styles.primaryActionText}>{item.actionLabel}</Text>
                                    </TouchableOpacity>
                                ) : item.type === 'medication' ? (
                                    <TouchableOpacity style={styles.secondaryActionButton}>
                                        <Text style={styles.secondaryActionText}>{item.actionLabel}</Text>
                                    </TouchableOpacity>
                                ) : item.type === 'risk' ? (
                                    <TouchableOpacity style={styles.linkButton}>
                                        <Text style={styles.linkText}>{item.actionLabel}</Text>
                                        <Text style={styles.chevronIcon}>›</Text>
                                    </TouchableOpacity>
                                ) : null}

                                {item.image && (
                                    <View style={styles.imageContainer}>
                                        <Image source={{ uri: item.image }} style={styles.visitImage} />
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                ))}
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
    header: {
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 20,
        backgroundColor: BG_LIGHT,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(236, 19, 91, 0.1)',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
        borderRadius: 20,
    },
    backIcon: {
        fontSize: 24,
        color: PRIMARY,
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: TEXT_DARK,
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: TEXT_MUTED,
        marginLeft: 48,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: CARD_BG,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    priorityIndicator: {
        width: 6,
    },
    cardBody: {
        flex: 1,
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    iconContainer: {
        flexShrink: 0,
    },
    iconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emojiIcon: {
        fontSize: 24,
    },
    textContainer: {
        flex: 1,
        gap: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: TEXT_DARK,
    },
    itemTime: {
        fontSize: 10,
        fontWeight: '600',
        color: TEXT_MUTED,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    itemMessage: {
        fontSize: 14,
        color: TEXT_MUTED,
        lineHeight: 22,
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 4,
    },
    linkText: {
        fontSize: 14,
        fontWeight: '700',
        color: PRIMARY,
    },
    chevronIcon: {
        fontSize: 18,
        color: PRIMARY,
        fontWeight: 'bold',
    },
    primaryActionButton: {
        backgroundColor: PRIMARY,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 12,
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryActionText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '800',
    },
    secondaryActionButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
        borderWidth: 1.5,
        borderColor: 'rgba(236,19,91,0.1)',
    },
    secondaryActionText: {
        fontSize: 13,
        fontWeight: '700',
        color: TEXT_DARK,
    },
    imageContainer: {
        marginTop: 12,
        height: 120,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    visitImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});
