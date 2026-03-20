import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    Alert
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { logout } from '../store/authSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

const ProfileScreen = () => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(logout());
                    },
                },
            ]
        );
    };

    const MENU_ITEMS = [
        { id: '1', title: 'Personal Information', icon: 'account-outline', color: '#F0FDF4' },
        { id: '2', title: 'Payment Methods', icon: 'credit-card-outline', color: '#FFFBEB' },
        { id: '3', title: 'My Bookings', icon: 'calendar-check-outline', color: '#F5F3FF' },
        { id: '4', title: 'Notifications', icon: 'bell-outline', color: '#FEF2F2' },
        { id: '5', title: 'Privacy Policy', icon: 'shield-lock-outline', color: '#F0FDFA' },
        { id: '6', title: 'Help & Support', icon: 'help-circle-outline', color: '#FDF2F2' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Profile */}
                <View style={styles.header}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80' }}
                            style={styles.profileImage}
                        />
                        <TouchableOpacity style={styles.editBtn}>
                            <MaterialCommunityIcons name="pencil" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>-</Text>
                        <Text style={styles.statLabel}>Orders</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>-</Text>
                        <Text style={styles.statLabel}>Spent</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>-</Text>
                        <Text style={styles.statLabel}>Reviews</Text>
                    </View>
                </View>

                {/* Menu */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Account Settings</Text>
                    <View style={styles.menuContainer}>
                        {MENU_ITEMS.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.menuItem}>
                                <View style={[styles.menuIconContainer, { backgroundColor: item.color }]}>
                                    <MaterialCommunityIcons name={item.icon as any} size={22} color={theme.colors.primary} />
                                </View>
                                <Text style={styles.menuText}>{item.title}</Text>
                                <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.text.muted} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <MaterialCommunityIcons name="logout" size={22} color={theme.colors.error} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#f5f5f5',
    },
    editBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: theme.colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: theme.colors.text.muted,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: theme.spacing.lg,
        marginTop: -30,
        borderRadius: theme.borderRadius.xl,
        padding: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: theme.colors.text.muted,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: theme.colors.border,
    },
    menuSection: {
        paddingHorizontal: theme.spacing.lg,
        marginTop: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginBottom: 16,
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.xl,
        padding: 8,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#FAFAFA',
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: theme.colors.text.primary,
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: theme.spacing.lg,
        marginTop: 30,
        backgroundColor: '#FFF5F5',
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    logoutText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.error,
    },
});

export default ProfileScreen;
