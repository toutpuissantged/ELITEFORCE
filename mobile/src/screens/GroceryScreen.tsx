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
    Dimensions,
    FlatList
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';

type Props = StackScreenProps<MainStackParamList, 'Grocery'>;

const SUBCATEGORIES = [
    { id: '1', name: 'Fruits', icon: 'apple' },
    { id: '2', name: 'Dairy', icon: 'bottle-wine-outline' },
    { id: '3', name: 'Vegetable', icon: 'carrot' },
    { id: '4', name: 'Meat', icon: 'food-steak' },
    { id: '5', name: 'Snacks', icon: 'cookie' },
];

const PRODUCTS = [
    {
        id: '1',
        name: 'Organic Spinach',
        price: '20.00',
        oldPrice: '12.00',
        unit: '1Bunch',
        image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80',
    },
    {
        id: '2',
        name: 'Raw Sweet Corn',
        price: '25.00',
        oldPrice: '13.00',
        unit: '1Bunch',
        image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80',
    },
];

const GroceryScreen: React.FC<Props> = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Grocery</Text>
                <TouchableOpacity style={styles.cartBtn}>
                    <MaterialCommunityIcons name="cart-outline" size={24} color={theme.colors.text.primary} />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>1</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
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

                {/* Subcategories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.subCatList}
                >
                    {SUBCATEGORIES.map((cat) => (
                        <View key={cat.id} style={styles.subCatItem}>
                            <View style={styles.subCatIcon}>
                                <MaterialCommunityIcons name={cat.icon as any} size={24} color={theme.colors.secondary} />
                            </View>
                            <Text style={styles.subCatName}>{cat.name}</Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Promo Banner */}
                <View style={styles.banner}>
                    <View style={styles.bannerContent}>
                        <Text style={styles.bannerTitle}>This week's fresh picks</Text>
                        <Text style={styles.bannerSub}>100% organic, delivered within 3 hours.</Text>
                        <TouchableOpacity style={styles.shopNowBtn}>
                            <Text style={styles.shopNowText}>Shop Now</Text>
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80' }}
                        style={styles.bannerImage}
                    />
                </View>

                {/* Most Requested Items */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Most Requested Items</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.productsGrid}>
                    {PRODUCTS.map((product) => (
                        <TouchableOpacity
                            key={product.id}
                            style={styles.productCard}
                            onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                        >
                            <Image source={{ uri: product.image }} style={styles.productImage} />
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <View style={styles.priceRow}>
                                    <Text style={styles.productPrice}>${product.price}</Text>
                                    <Text style={styles.oldPrice}>${product.oldPrice}</Text>
                                </View>
                                <View style={styles.unitRow}>
                                    <Text style={styles.productUnit}>{product.unit}</Text>
                                    <TouchableOpacity style={styles.addBtn}>
                                        <MaterialCommunityIcons name="plus" size={20} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

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
        height: 60,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    cartBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: theme.colors.error,
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    searchContainer: {
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.md,
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
    subCatList: {
        paddingLeft: theme.spacing.lg,
        paddingVertical: theme.spacing.lg,
    },
    subCatItem: {
        alignItems: 'center',
        marginRight: theme.spacing.xl,
    },
    subCatIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    subCatName: {
        fontSize: 13,
        color: theme.colors.text.muted,
        fontWeight: '500',
    },
    banner: {
        marginHorizontal: theme.spacing.lg,
        backgroundColor: theme.colors.primary,
        borderRadius: 30,
        flexDirection: 'row',
        padding: theme.spacing.lg,
        alignItems: 'center',
        overflow: 'hidden',
        height: 160,
    },
    bannerContent: {
        flex: 1,
        zIndex: 1,
    },
    bannerTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
        lineHeight: 28,
    },
    bannerSub: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginBottom: theme.spacing.lg,
        lineHeight: 20,
    },
    shopNowBtn: {
        backgroundColor: theme.colors.secondary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    shopNowText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    bannerImage: {
        width: 140,
        height: 140,
        borderRadius: 70,
        position: 'absolute',
        right: -30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.xl,
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
    productsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    productCard: {
        width: '45%',
        backgroundColor: '#fff',
        borderRadius: 30,
        margin: '2.5%',
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    productImage: {
        width: '100%',
        height: 120,
        borderRadius: 20,
        resizeMode: 'contain',
    },
    productInfo: {
        marginTop: theme.spacing.md,
    },
    productName: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    oldPrice: {
        fontSize: 12,
        color: theme.colors.text.muted,
        textDecorationLine: 'line-through',
        marginLeft: 10,
    },
    unitRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    productUnit: {
        fontSize: 12,
        color: theme.colors.text.muted,
    },
    addBtn: {
        backgroundColor: theme.colors.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default GroceryScreen;
