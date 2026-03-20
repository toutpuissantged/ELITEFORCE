import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';

type Props = StackScreenProps<MainStackParamList, 'ProductDetail'>;

const SIZES = [
    { id: 'small', label: 'Small', price: '20.00' },
    { id: 'medium', label: 'Medium', price: '30.00' },
    { id: 'large', label: 'Large', price: '35.00' },
];

const INGREDIENTS = [
    { id: '1', name: 'Vitamin C', icon: 'fruit-citrus', color: '#FFF4E5' },
    { id: '2', name: 'Fiber', icon: 'food-apple', color: '#F0FDF4' },
    { id: '3', name: 'Potassium', icon: 'egg-outline', color: '#FFFBEB' },
    { id: '4', name: 'Folate', icon: 'leaf', color: '#F0FDFA' },
];

const ProductDetailScreen: React.FC<Props> = ({ navigation }) => {
    const [selectedSize, setSelectedSize] = useState('medium');
    const [quantity, setQuantity] = useState(1);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1582910832782-d9055ee1722e?w=800&q=80' }}
                        style={styles.productImage}
                    />
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Select Size</Text>
                    <View style={styles.sizeGrid}>
                        {SIZES.map((size) => (
                            <TouchableOpacity
                                key={size.id}
                                style={[
                                    styles.sizeCard,
                                    selectedSize === size.id && styles.selectedSizeCard
                                ]}
                                onPress={() => setSelectedSize(size.id)}
                            >
                                <View style={styles.sizeHeader}>
                                    <View style={[
                                        styles.radio,
                                        selectedSize === size.id && styles.radioActive
                                    ]}>
                                        {selectedSize === size.id && <View style={styles.radioInner} />}
                                    </View>
                                    <Text style={styles.sizeLabel}>{size.label}</Text>
                                </View>
                                <Text style={styles.sizePrice}>$ {size.price}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>About Destination</Text>
                    <Text style={styles.description}>
                        Experience the vibrant freshness of Organic Oranges, naturally sweet and bursting with flavor. Grown without harmful chemicals and carefully handpicked, they're perfect for nutritious snacking, fresh juicing, and adding Red more.......
                    </Text>

                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ingredientList}>
                        {INGREDIENTS.map((item) => (
                            <View key={item.id} style={[styles.ingredientItem, { backgroundColor: item.color }]}>
                                <MaterialCommunityIcons name={item.icon as any} size={24} color={theme.colors.secondary} />
                            </View>
                        ))}
                    </ScrollView>

                    <Text style={styles.sectionTitle}>Extra</Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                        style={styles.quantityBtn}
                    >
                        <MaterialCommunityIcons name="minus" size={20} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity.toString().padStart(2, '0')}</Text>
                    <TouchableOpacity
                        onPress={() => setQuantity(quantity + 1)}
                        style={styles.quantityBtn}
                    >
                        <MaterialCommunityIcons name="plus" size={20} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.addToCartBtn}>
                    <Text style={styles.addToCartText}>Add to Card</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageContainer: {
        width: '100%',
        height: 380,
        backgroundColor: '#f5f5f5',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    backBtn: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    content: {
        padding: theme.spacing.lg,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: -40,
        backgroundColor: '#fff',
        flex: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.md,
    },
    sizeGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    sizeCard: {
        width: '31%',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: '#F9FAFB',
    },
    selectedSizeCard: {
        borderColor: theme.colors.primary,
        backgroundColor: '#F0FDF4',
    },
    sizeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: theme.colors.text.muted,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioActive: {
        borderColor: theme.colors.primary,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: theme.colors.primary,
    },
    sizeLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.text.muted,
    },
    sizePrice: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.text.primary,
        textAlign: 'right',
    },
    description: {
        fontSize: 15,
        color: theme.colors.text.secondary,
        lineHeight: 24,
    },
    ingredientList: {
        paddingVertical: theme.spacing.md,
    },
    ingredientItem: {
        width: 70,
        height: 70,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.lg,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: theme.spacing.sm,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: theme.colors.border,
        height: 74,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 30,
        padding: 6,
    },
    quantityBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    quantityText: {
        fontSize: 18,
        fontWeight: '700',
        marginHorizontal: 16,
        color: theme.colors.text.primary,
    },
    addToCartBtn: {
        flex: 1,
        backgroundColor: theme.colors.primary,
        height: 58,
        borderRadius: 29,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});

export default ProductDetailScreen;
