import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    SafeAreaView,
    Alert,
    Dimensions
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { logout } from '../store/authSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
    const { user } = useAppSelector((state) => state.auth);
    const { list: bookings } = useAppSelector((state) => state.bookings);
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(logout());
                    },
                },
            ]
        );
    };

    const MENU_ITEMS = [
        { id: '1', title: 'Informations Personnelles', icon: 'account-outline', color: '#F0FDF4' },
        { id: '2', title: 'Modes de Paiement', icon: 'credit-card-outline', color: '#FFFBEB' },
        { id: '3', title: 'Mes Adresses', icon: 'map-marker-outline', color: '#F5F3FF' },
        { id: '4', title: 'Notifications', icon: 'bell-outline', color: '#FEF2F2' },
        { id: '5', title: 'Sécurité & Confidentialité', icon: 'shield-lock-outline', color: '#F0FDFA' },
        { id: '6', title: 'Aide & Support', icon: 'help-circle-outline', color: '#FDF2F2' },
    ];

    const totalSpent = bookings.reduce((acc, curr) => acc + curr.totalPrice, 0);

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
                            <MaterialCommunityIcons name="camera" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>

                {/* Stats Card */}
                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{bookings.length}</Text>
                        <Text style={styles.statLabel}>Missions</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{totalSpent} Dhs</Text>
                        <Text style={styles.statLabel}>Total Payé</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>VIP</Text>
                        <Text style={styles.statLabel}>Statut</Text>
                    </View>
                </View>

                {/* Menu Section */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Paramètres du compte</Text>
                    <View style={styles.menuContainer}>
                        {MENU_ITEMS.map((item, index) => (
                            <TouchableOpacity 
                                key={item.id} 
                                style={[
                                    styles.menuItem,
                                    index === MENU_ITEMS.length - 1 && { borderBottomWidth: 0 }
                                ]}
                            >
                                <View style={[styles.menuIconBg, { backgroundColor: item.color }]}>
                                    <MaterialCommunityIcons name={item.icon as any} size={22} color={theme.colors.primary} />
                                </View>
                                <Text style={styles.menuText}>{item.title}</Text>
                                <MaterialCommunityIcons name="chevron-right" size={20} color="#CBD5E1" />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <MaterialCommunityIcons name="logout" size={22} color="#EF4444" />
                    <Text style={styles.logoutText}>Se déconnecter</Text>
                </TouchableOpacity>

                <View style={styles.footerInfo}>
                    <Text style={styles.versionText}>EliteForce Mobile v1.0.4</Text>
                    <Text style={styles.copyrightText}>© 2026 EliteForce Security Group</Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    header: {
        alignItems: 'center',
        paddingVertical: 40,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    profileImage: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 4,
        borderColor: '#F1F5F9',
    },
    editBtn: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: theme.colors.primary,
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 24,
        marginTop: -30,
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 5,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#F1F5F9',
    },
    menuSection: {
        paddingHorizontal: 24,
        marginTop: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 16,
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 8,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F8FAFC',
    },
    menuIconBg: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#334155',
    },
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 24,
        marginTop: 32,
        backgroundColor: '#FEF2F2',
        height: 60,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    logoutText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '700',
        color: '#EF4444',
    },
    footerInfo: {
        alignItems: 'center',
        marginTop: 40,
    },
versionText: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
    },
    copyrightText: {
        fontSize: 11,
        color: '#CBD5E1',
        marginTop: 4,
    },
});

export default ProfileScreen;
