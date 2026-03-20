import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    SafeAreaView,
    Dimensions,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabParamList, MainStackParamList } from '../types/navigation';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { setServicesFilters, fetchServices } from '../store/servicesSlice';

type Props = CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, 'Home'>,
    StackScreenProps<MainStackParamList>
>;

const CATEGORIES = [
    { id: '1', name: 'Protection VIP', icon: 'shield-account-outline', color: '#FFF4E5' },
    { id: '2', name: 'Sécurité Événementielle', icon: 'stadium-variant', color: '#F0FDF4' },
    { id: '3', name: 'Vidéosurveillance', icon: 'cctv', color: '#FDF2F2' },
    { id: '4', name: 'Transport Sécurisé', icon: 'car-defrost', color: '#FFFBEB' },
    { id: '5', name: 'Cybersécurité', icon: 'laptop-account', color: '#F5F3FF' },
    { id: '6', name: 'Audit et Conseil', icon: 'clipboard-text-outline', color: '#F0FDFA' },
];

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { list, loading } = useAppSelector((state) => state.services);
    const { user } = useAppSelector((state) => state.auth);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        await dispatch(fetchServices({}));
    };

    useEffect(() => {
        loadData();
    }, [dispatch]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            dispatch(setServicesFilters({ search: searchQuery }));
            navigation.navigate('Search');
        }
    };

    const handleCategorySelect = (categoryName: string) => {
        dispatch(setServicesFilters({ category: categoryName }));
        navigation.navigate('Search');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.userContainer}>
                        <Image 
                            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' }} 
                            style={styles.avatar} 
                        />
                        <View style={styles.userInfo}>
                            <Text style={styles.greeting}>Bonjour,</Text>
                            <Text style={styles.userName}>{user?.firstName || 'Utilisateur'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.notificationBtn}>
                        <MaterialCommunityIcons name="bell-outline" size={24} color={theme.colors.text.primary} />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                </View>

                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.mainTitle}>Sécurisez Votre Monde</Text>
                    <Text style={styles.subTitle}>avec EliteForce Security.</Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                        <MaterialCommunityIcons name="magnify" size={22} color={theme.colors.text.muted} />
                        <TextInput
                            placeholder="Rechercher une protection..."
                            style={styles.searchInput}
                            placeholderTextColor={theme.colors.text.muted}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                        />
                        <TouchableOpacity style={styles.filterBtn} onPress={() => navigation.navigate('Search')}>
                            <MaterialCommunityIcons name="tune" size={22} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Categories Grid */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Services Spécialisés</Text>
                </View>

                <View style={styles.categoriesGrid}>
                    {CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={styles.categoryItem}
                            onPress={() => handleCategorySelect(category.name)}
                        >
                            <View style={styles.categoryCard}>
                                <View style={[styles.categoryIconBg, { backgroundColor: category.color }]}>
                                    <MaterialCommunityIcons name={category.icon as any} size={26} color={theme.colors.primary} />
                                </View>
                                <Text style={styles.categoryName} numberOfLines={2}>{category.name}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Featured Services */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recommandé pour vous</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                        <Text style={styles.seeAll}>Voir tout</Text>
                    </TouchableOpacity>
                </View>

                {loading && !refreshing ? (
                    <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginTop: 20 }} />
                ) : (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.featuredList}
                    >
                        {list.length > 0 ? (
                            list.slice(0, 5).map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.featuredCard}
                                    onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
                                >
                                    <Image
                                        source={{ uri: item.image || 'https://images.unsplash.com/photo-1544022485-6bb04439c73d?w=800&q=80' }}
                                        style={styles.featuredImage}
                                    />
                                    <View style={styles.featuredInfo}>
                                        <Text style={styles.featuredCategory}>{item.category}</Text>
                                        <Text style={styles.featuredName} numberOfLines={1}>{item.name}</Text>
                                        <View style={styles.priceRow}>
                                            <Text style={styles.featuredPrice}>{item.basePrice} Dhs</Text>
                                            <View style={styles.ratingRow}>
                                                <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                                                <Text style={styles.ratingText}>{item.rating}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>Aucun service disponible pour le moment.</Text>
                            </View>
                        )}
                    </ScrollView>
                )}

                {/* Promo Banner */}
                <TouchableOpacity style={styles.promoBanner}>
                    <View style={styles.promoContent}>
                        <Text style={styles.promoTitle}>Offre Spéciale</Text>
                        <Text style={styles.promoDesc}>-20% sur votre premier audit de sécurité complet.</Text>
                        <View style={styles.promoBadge}>
                            <Text style={styles.promoBadgeText}>PROFITER MAINTENANT</Text>
                        </View>
                    </View>
                    <MaterialCommunityIcons name="shield-star" size={80} color="rgba(255,255,255,0.2)" style={styles.promoIcon} />
                </TouchableOpacity>

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        borderWidth: 2,
        borderColor: '#fff',
    },
    userInfo: {
        marginLeft: 12,
    },
    greeting: {
        fontSize: 12,
        color: '#888',
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
    },
    notificationBtn: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    notificationDot: {
        position: 'absolute',
        top: 12,
        right: 14,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.error,
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    titleSection: {
        paddingHorizontal: 24,
        marginTop: 24,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#222',
        lineHeight: 34,
    },
    subTitle: {
        fontSize: 24,
        fontWeight: '400',
        color: '#888',
        lineHeight: 30,
    },
    searchSection: {
        paddingHorizontal: 24,
        marginTop: 24,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingHorizontal: 16,
        height: 58,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 3,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        color: '#222',
    },
    filterBtn: {
        padding: 8,
        borderLeftWidth: 1,
        borderLeftColor: '#f0f0f0',
        marginLeft: 8,
        paddingLeft: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 32,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
    },
    seeAll: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '600',
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
    },
    categoryItem: {
        width: '33.33%',
        padding: 8,
    },
    categoryCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
        height: 120,
    },
    categoryIconBg: {
        width: 50,
        height: 50,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryName: {
        fontSize: 11,
        fontWeight: '700',
        color: '#444',
        textAlign: 'center',
    },
    featuredList: {
        paddingLeft: 24,
        paddingRight: 8,
    },
    featuredCard: {
        width: width * 0.6,
        backgroundColor: '#fff',
        borderRadius: 24,
        marginRight: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
        marginBottom: 10,
    },
    featuredImage: {
        width: '100%',
        height: 140,
        resizeMode: 'cover',
    },
    featuredInfo: {
        padding: 16,
    },
    featuredCategory: {
        fontSize: 10,
        color: theme.colors.primary,
        fontWeight: '800',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    featuredName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    featuredPrice: {
        fontSize: 15,
        fontWeight: '800',
        color: '#222',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#222',
        marginLeft: 4,
    },
    emptyContainer: {
        width: width - 48,
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#888',
        fontSize: 14,
    },
    promoBanner: {
        marginHorizontal: 24,
        marginTop: 32,
        backgroundColor: theme.colors.primary,
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    promoContent: {
        flex: 1,
        zIndex: 1,
    },
    promoTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 8,
    },
    promoDesc: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    promoBadge: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    promoBadgeText: {
        color: theme.colors.primary,
        fontSize: 12,
        fontWeight: '800',
    },
    promoIcon: {
        position: 'absolute',
        right: -10,
        bottom: -10,
    },
});

export default HomeScreen;
