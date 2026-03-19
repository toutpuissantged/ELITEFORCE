import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
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
    BottomTabScreenProps<BottomTabParamList, 'Home'>,
    StackScreenProps<MainStackParamList>
>;

const categories = [
    { id: '1', name: 'Ménage', icon: 'broom' as const },
    { id: '2', name: 'Plomberie', icon: 'pipe-wrench' as const },
    { id: '3', name: 'Électricité', icon: 'lightning-bolt' as const },
    { id: '4', name: 'Jardinage', icon: 'flower' as const },
    { id: '5', name: 'Déménagement', icon: 'truck-delivery' as const },
    { id: '6', name: 'Peinture', icon: 'format-paint' as const },
];

export default function HomeScreen({ navigation }: Props) {
    const { user } = useAppSelector((state) => state.auth);
    const { list: services, loading } = useAppSelector((state) => state.services);
    const dispatch = useAppDispatch();

    const API_URL = process.env.API_URL || 'http://localhost:3000';

    useEffect(() => {
        fetchPopularServices();
    }, []);

    const fetchPopularServices = async () => {
        dispatch(setServicesLoading(true));
        try {
            const response = await axios.get(`${API_URL}/api/services`);
            dispatch(setServicesList(response.data));
        } catch (error: any) {
            dispatch(setServicesError(error.message));
        } finally {
            dispatch(setServicesLoading(false));
        }
    };

    const renderCategory = ({ item }: { item: typeof categories[0] }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => navigation.navigate('Search', { category: item.name })}
        >
            <View style={styles.categoryIconContainer}>
                <MaterialCommunityIcons name={item.icon} size={32} color="#2e64e5" />
            </View>
            <Text style={styles.categoryText}>{item.name}</Text>
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
                <Text style={styles.serviceName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.servicePrice}>À partir de {item.basePrice} Dhs</Text>
                <View style={styles.ratingContainer}>
                    <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Bonjour, {user?.firstName || 'Utilisateur'}</Text>
                <Text style={styles.subGreeting}>De quel service avez-vous besoin aujourd'hui ?</Text>
            </View>

            <TouchableOpacity
                style={styles.searchBar}
                onPress={() => navigation.navigate('Search')}
            >
                <MaterialCommunityIcons name="magnify" size={24} color="#888" />
                <Text style={styles.searchText}>Rechercher un service...</Text>
            </TouchableOpacity>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Catégories</Text>
                <FlatList
                    data={categories}
                    renderItem={renderCategory}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    scrollEnabled={false}
                    columnWrapperStyle={styles.categoryRow}
                />
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Services populaires</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                        <Text style={styles.seeAll}>Voir tout</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#2e64e5" style={{ marginTop: 20 }} />
                ) : (
                    <FlatList
                        data={services.slice(0, 5)} // Show only top 5
                        renderItem={renderServiceItem}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.horizontalList}
                    />
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9' },
    header: { padding: 20, paddingTop: 60, backgroundColor: '#2e64e5' },
    greeting: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    subGreeting: { fontSize: 16, color: '#e0e0e0', marginTop: 5 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 20,
        marginTop: -25,
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    searchText: { marginLeft: 10, color: '#888', fontSize: 16 },
    section: { padding: 20, paddingTop: 0 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    seeAll: { color: '#2e64e5', fontSize: 14, fontWeight: 'bold' },
    categoryRow: { justifyContent: 'space-between', marginBottom: 20 },
    categoryItem: { alignItems: 'center', width: '30%' },
    categoryIconContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#e6eeff',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryText: { fontSize: 12, color: '#333', textAlign: 'center' },
    horizontalList: { paddingRight: 20 },
    serviceCard: {
        width: 160,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
        overflow: 'hidden',
        marginBottom: 5,
    },
    serviceImage: { width: '100%', height: 100 },
    serviceInfo: { padding: 10 },
    serviceName: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    servicePrice: { fontSize: 13, color: '#2e64e5', fontWeight: '600', marginBottom: 4 },
    ratingContainer: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { fontSize: 12, color: '#666', marginLeft: 4 },
});
