import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { setServicesList, setServicesLoading, setServicesError } from '../store/servicesSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabParamList, MainStackParamList } from '../types/navigation';
import { Service } from '../types';
import axios from 'axios';

type Props = CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, 'Search'>,
    StackScreenProps<MainStackParamList>
>;

const categories = ['Tous', 'Ménage', 'Plomberie', 'Électricité', 'Jardinage', 'Déménagement', 'Peinture'];

export default function SearchScreen({ route, navigation }: Props) {
    const initialCategory = route.params?.category || 'Tous';

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [rating, setRating] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const { list: services, loading, error } = useAppSelector((state) => state.services);
    const dispatch = useAppDispatch();

    const API_URL = process.env.API_URL || 'http://localhost:3000';

    const fetchServices = async (query = searchQuery, category = selectedCategory, min = minPrice, max = maxPrice, rtg = rating) => {
        dispatch(setServicesLoading(true));
        try {
            const params: any = {};
            if (query) params.search = query;
            if (category && category !== 'Tous') params.category = category;
            if (min) params.minPrice = min;
            if (max) params.maxPrice = max;
            if (rtg) params.rating = rtg;

            const response = await axios.get(`${API_URL}/api/services`, { params });
            dispatch(setServicesList(response.data));
        } catch (err: any) {
            dispatch(setServicesError(err.message));
        } finally {
            dispatch(setServicesLoading(false));
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchServices(searchQuery, selectedCategory, minPrice, maxPrice, rating);
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, selectedCategory, minPrice, maxPrice, rating]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchServices(searchQuery, selectedCategory, minPrice, maxPrice, rating);
    }, [searchQuery, selectedCategory, minPrice, maxPrice, rating]);

    const renderCategoryChip = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={[styles.chip, selectedCategory === item && styles.chipSelected]}
            onPress={() => setSelectedCategory(item)}
        >
            <Text style={[styles.chipText, selectedCategory === item && styles.chipTextSelected]}>
                {item}
            </Text>
        </TouchableOpacity>
    );

    const renderServiceItem = ({ item }: { item: Service }) => (
        <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
        >
            <Image
                source={{ uri: 'https://via.placeholder.com/150' }}
                style={styles.serviceImage}
            />
            <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.serviceCategory}>{item.category}</Text>
                <View style={styles.priceRatingRow}>
                    <Text style={styles.servicePrice}>{item.basePrice} Dhs</Text>
                    <View style={styles.ratingContainer}>
                        <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchBar}>
                    <MaterialCommunityIcons name="magnify" size={24} color="#888" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <MaterialCommunityIcons name="close-circle" size={20} color="#888" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.filtersContainer}>
                    <FlatList
                        data={categories}
                        renderItem={renderCategoryChip}
                        keyExtractor={(item) => item}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                </View>

                <View style={styles.advancedFilters}>
                    <TextInput
                        style={styles.filterInput}
                        placeholder="Prix min"
                        keyboardType="numeric"
                        value={minPrice}
                        onChangeText={setMinPrice}
                    />
                    <TextInput
                        style={styles.filterInput}
                        placeholder="Prix max"
                        keyboardType="numeric"
                        value={maxPrice}
                        onChangeText={setMaxPrice}
                    />
                    <TextInput
                        style={styles.filterInput}
                        placeholder="Note min (ex: 4)"
                        keyboardType="numeric"
                        value={rating}
                        onChangeText={setRating}
                    />
                </View>
            </View>

            {error ? (
                <Text style={styles.errorText}>Erreur de chargement des services</Text>
            ) : loading && !refreshing ? (
                <ActivityIndicator size="large" color="#2e64e5" style={styles.loader} />
            ) : services.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="clipboard-text-off-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>Aucun résultat trouvé</Text>
                </View>
            ) : (
                <FlatList
                    data={services}
                    renderItem={renderServiceItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9' },
    header: { backgroundColor: '#fff', padding: 20, paddingTop: 60, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    filtersContainer: { height: 40, marginBottom: 10 },
    advancedFilters: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5 },
    filterInput: { flex: 1, backgroundColor: '#f0f0f0', borderRadius: 8, padding: 8, marginHorizontal: 5, fontSize: 14 },
    chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 10, justifyContent: 'center' },
    chipSelected: { backgroundColor: '#2e64e5' },
    chipText: { color: '#666', fontWeight: '500' },
    chipTextSelected: { color: '#fff' },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContainer: { padding: 15 },
    serviceCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        overflow: 'hidden',
    },
    serviceImage: { width: 100, height: 100 },
    serviceInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
    serviceName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    serviceCategory: { fontSize: 13, color: '#888', marginTop: 2 },
    priceRatingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    servicePrice: { fontSize: 15, color: '#2e64e5', fontWeight: 'bold' },
    ratingContainer: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { fontSize: 13, color: '#666', marginLeft: 4 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { marginTop: 10, fontSize: 16, color: '#888' },
    errorText: { textAlign: 'center', marginTop: 20, color: 'red', fontSize: 16 },
});
