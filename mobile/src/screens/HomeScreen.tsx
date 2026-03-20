import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    SafeAreaView,
    Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabParamList, MainStackParamList } from '../types/navigation';
import { useAppDispatch } from '../hooks/store';
import { setServicesFilters } from '../store/servicesSlice';

type Props = CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, 'Home'>,
    StackScreenProps<MainStackParamList>
>;

const CATEGORIES = [
    { id: '1', name: 'Ménage', icon: 'home-outline', color: '#FFF4E5' },
    { id: '2', name: 'Plomberie', icon: 'water-outline', color: '#F0FDF4' },
    { id: '3', name: 'Électricité', icon: 'lightning-bolt-outline', color: '#FDF2F2' },
    { id: '4', name: 'Jardinage', icon: 'leaf-outline', color: '#FFFBEB' },
    { id: '5', name: 'Déménagement', icon: 'truck-delivery-outline', color: '#F5F3FF' },
    { id: '6', name: 'Peinture', icon: 'format-paint', color: '#F0FDFA' },
];

const BY_LOCATION = [
    {
        id: '1',
        title: 'Grocery shopping',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    },
    {
        id: '2',
        title: 'Grocery shopping',
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80',
    },
];

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.locationContainer}>
                        <View style={styles.locationIcon}>
                            <MaterialCommunityIcons name="map-marker-outline" size={20} color={theme.colors.text.primary} />
                        </View>
                        <View>
                            <Text style={styles.locationLabel}>Location</Text>
                            <Text style={styles.locationText}>Chaoyang District</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.notificationBtn}>
                        <MaterialCommunityIcons name="bell-outline" size={24} color={theme.colors.text.primary} />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                </View>

                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Stay Cool with Our</Text>
                    <Text style={[styles.title, { color: theme.colors.text.muted }]}>Collections.</Text>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.text.muted} />
                        <TextInput
                            placeholder="Gongcheng 24 -Hour"
                            style={styles.searchInput}
                            placeholderTextColor={theme.colors.text.muted}
                        />
                        <TouchableOpacity style={styles.filterBtn}>
                            <MaterialCommunityIcons name="tune-variant" size={20} color={theme.colors.text.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Categories */}
                <View style={styles.categoriesGrid}>
                    {CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={styles.categoryItem}
                            onPress={() => {
                                dispatch(setServicesFilters({ category: category.name }));
                                navigation.navigate('BottomTabs', { screen: 'Search' } as any);
                            }}
                        >
                            <View style={[styles.categoryIconBox, { backgroundColor: category.color }]}>
                                <MaterialCommunityIcons name={category.icon as any} size={30} color={theme.colors.secondary} />
                            </View>
                            <Text style={styles.categoryName}>{category.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* By Location Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>By location</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.locationList}
                >
                    {BY_LOCATION.map((item) => (
                        <View key={item.id} style={styles.locationCard}>
                            <Image source={{ uri: item.image }} style={styles.locationImage} />
                            <View style={styles.locationInfo}>
                                <Text style={styles.locationCardTitle}>{item.title}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    locationLabel: {
        fontSize: 12,
        color: theme.colors.text.muted,
    },
    locationText: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    notificationDot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.error,
        borderWidth: 2,
        borderColor: '#fff',
    },
    titleContainer: {
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.xl,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: theme.colors.text.primary,
        lineHeight: 40,
    },
    searchContainer: {
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.lg,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        paddingHorizontal: theme.spacing.md,
        height: 54,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    searchInput: {
        flex: 1,
        marginLeft: theme.spacing.sm,
        fontSize: 15,
        color: theme.colors.text.primary,
    },
    filterBtn: {
        padding: theme.spacing.xs,
        borderLeftWidth: 1,
        borderLeftColor: theme.colors.border,
        paddingLeft: 12,
        marginLeft: 8,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: theme.spacing.md,
        marginTop: theme.spacing.xl,
        justifyContent: 'space-between',
    },
    categoryItem: {
        width: '30%',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    categoryIconBox: {
        width: 85,
        height: 85,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    categoryName: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.text.primary,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    seeAll: {
        fontSize: 13,
        color: theme.colors.text.muted,
    },
    locationList: {
        paddingLeft: theme.spacing.lg,
        paddingTop: theme.spacing.md,
    },
    locationCard: {
        width: width * 0.65,
        height: 220,
        marginRight: theme.spacing.lg,
        borderRadius: 30,
        backgroundColor: '#fff',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    locationImage: {
        width: '100%',
        height: 160,
    },
    locationInfo: {
        padding: theme.spacing.md,
    },
    locationCardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
});

export default HomeScreen;
