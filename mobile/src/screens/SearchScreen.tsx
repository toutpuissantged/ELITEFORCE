import React, { useState, useEffect } from 'react';
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
import { setServicesFilters, setServicesLoading, setServicesError, setServicesList } from '../store/servicesSlice';
import axios from 'axios';

type Props = CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, 'Home'>,
    StackScreenProps<MainStackParamList>
>;

const CATEGORIES = ['All', 'Ménage', 'Plomberie', 'Électricité', 'Jardinage', 'Déménagement', 'Peinture'];

const SearchScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { list, loading, filters } = useAppSelector((state) => state.services);
    const [searchQuery, setSearchQuery] = useState(filters.search);
    const [refreshing, setRefreshing] = useState(false);

    const API_URL = process.env.API_URL || 'http://localhost:3000';

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(setServicesFilters({ search: searchQuery }));
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchServices = async () => {
        dispatch(setServicesLoading(true));
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.category && filters.category !== 'All') params.append('category', filters.category);
            if (filters.minPrice) params.append('minPrice', filters.minPrice.toString());
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
            if (filters.rating) params.append('rating', filters.rating.toString());

            const response = await axios.get(`${API_URL}/api/services?${params.toString()}`);
            dispatch(setServicesList(response.data));
        } catch (error) {
            dispatch(setServicesError('Failed to load services'));
        } finally {
            dispatch(setServicesLoading(false));
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [filters]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchServices();
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
                        placeholder="Search for services..."
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={theme.colors.text.muted}
                    />
                </View>
            </View>

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
                            onPress={() => navigation.navigate('ProductDetail', { productId: item.id.toString() })}
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
                            <Text style={styles.emptyText}>No services found</Text>
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
