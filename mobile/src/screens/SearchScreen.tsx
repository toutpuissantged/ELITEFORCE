import React, { useState, useEffect, useCallback } from 'react';
import Slider from '@react-native-community/slider';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    ActivityIndicator,
    SafeAreaView
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

const CATEGORIES = ['All', 'Protection VIP', 'Sécurité Événementielle', 'Vidéosurveillance', 'Cybersécurité', 'Transport Sécurisé', 'Audit et Conseil'];

const SearchScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { list, loading, filters } = useAppSelector((state) => state.services);
    const [searchQuery, setSearchQuery] = useState(filters.search);
    const [priceRange, setPriceRange] = useState(filters.maxPrice || 1000);
    const [rating, setRating] = useState(filters.rating || 0);
    const [refreshing, setRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(setServicesFilters({ search: searchQuery }));
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery, dispatch]);

    const loadServices = useCallback(async () => {
        await dispatch(fetchServices(filters));
        setRefreshing(false);
    }, [dispatch, filters]);

    useEffect(() => {
        loadServices();
    }, [loadServices]);

    const onRefresh = () => {
        setRefreshing(true);
        loadServices();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <View style={styles.searchBar}>
                    <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.text.muted} />
                    <TextInput
                        placeholder="Rechercher un service..."
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={theme.colors.text.muted}
                    />
                </View>
                <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.filterToggleBtn}>
                    <MaterialCommunityIcons name="tune" size={24} color={showFilters ? theme.colors.primary : theme.colors.text.primary} />
                </TouchableOpacity>
            </View>

            {showFilters && (
                <View style={styles.advancedFiltersContainer}>
                    {/* Price Slider */}
                    <View style={styles.filterSection}>
                        <View style={styles.filterHeader}>
                            <Text style={styles.filterLabel}>Prix Max: $ {priceRange}</Text>
                        </View>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={0}
                            maximumValue={2000}
                            step={10}
                            value={priceRange}
                            onSlidingComplete={(value: number) => {
                                setPriceRange(value);
                                dispatch(setServicesFilters({ maxPrice: value }));
                            }}
                            minimumTrackTintColor={theme.colors.primary}
                            maximumTrackTintColor="#000000"
                            thumbTintColor={theme.colors.primary}
                        />
                    </View>

                    {/* Rating Stars */}
                    <View style={styles.filterSection}>
                        <Text style={styles.filterLabel}>Note Minimum</Text>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity
                                    key={star}
                                    onPress={() => {
                                        const newRating = rating === star ? 0 : star;
                                        setRating(newRating);
                                        dispatch(setServicesFilters({ rating: newRating }));
                                    }}
                                >
                                    <MaterialCommunityIcons
                                        name={star <= rating ? "star" : "star-outline"}
                                        size={32}
                                        color="#FFD700"
                                    />
                                </TouchableOpacity>
                            ))}
                            {rating > 0 && (
                                <TouchableOpacity onPress={() => { setRating(0); dispatch(setServicesFilters({ rating: 0 })); }} style={styles.clearRatingBtn}>
                                    <Text style={styles.clearRatingText}>Clear</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            )}

            <View style={styles.categoriesContainer}>
                <FlatList
                    data={CATEGORIES}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.categoryChip,
                                (filters.category === item || (item === 'All' && !filters.category)) && styles.categoryChipSelected
                            ]}
                            onPress={() => dispatch(setServicesFilters({ category: item === 'All' ? '' : item }))}
                        >
                            <Text style={[
                                styles.categoryText,
                                (filters.category === item || (item === 'All' && !filters.category)) && styles.categoryTextSelected
                            ]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {loading && !refreshing ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={list}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.resultsList}
                    showsVerticalScrollIndicator={false}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.resultCard}
                            onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
                        >
                            <Image
                                source={{ uri: (item as any).image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6954?w=800&q=80' }}
                                style={styles.resultImage}
                            />
                            <View style={styles.resultInfo}>
                                <View style={styles.categoryRow}>
                                    <Text style={styles.resultCategory}>{item.category}</Text>
                                    <View style={styles.ratingRow}>
                                        <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
                                        <Text style={styles.ratingText}>{item.rating}</Text>
                                    </View>
                                </View>
                                <Text style={styles.resultName}>{item.name}</Text>
                                <View style={styles.priceRow}>
                                    <Text style={styles.resultPrice}>$ {item.basePrice}</Text>
                                    <TouchableOpacity style={styles.addBtn}>
                                        <MaterialCommunityIcons name="plus" size={20} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="magnify-close" size={60} color={theme.colors.text.muted} />
                            <Text style={styles.emptyText}>Aucun service trouvé</Text>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.md,
        backgroundColor: '#fff',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    filterToggleBtn: {
        width: 48,
        height: 48,
        marginLeft: 12,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    advancedFiltersContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    filterSection: {
        marginTop: 12,
    },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text.primary,
        marginBottom: 8,
    },
    starsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    clearRatingBtn: {
        marginLeft: 16,
        padding: 4,
    },
    clearRatingText: {
        fontSize: 12,
        color: theme.colors.text.muted,
        textDecorationLine: 'underline',
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: theme.colors.text.primary,
    },
    categoriesContainer: {
        backgroundColor: '#fff',
        paddingBottom: theme.spacing.md,
    },
    categoriesList: {
        paddingHorizontal: theme.spacing.lg,
    },
    categoryChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F9FAFB',
        marginRight: 10,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    categoryChipSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.text.secondary,
    },
    categoryTextSelected: {
        color: '#fff',
    },
    resultsList: {
        padding: theme.spacing.lg,
    },
    resultCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.lg,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    resultImage: {
        width: 100,
        height: 100,
        borderRadius: 16,
    },
    resultInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    categoryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    resultCategory: {
        fontSize: 11,
        color: theme.colors.text.muted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.text.primary,
        marginLeft: 4,
    },
    resultName: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resultPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    addBtn: {
        backgroundColor: theme.colors.primary,
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.text.muted,
        marginTop: 16,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SearchScreen;
