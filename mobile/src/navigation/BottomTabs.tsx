import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabParamList } from '../types/navigation';

import HomeScreen from '../screens/HomeScreen';
// Placeholder components for new tabs
const ChatsScreen = () => null;
const VideosScreen = () => null;
const CartScreen = () => null;
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof MaterialCommunityIcons.glyphMap | undefined;

                    if (route.name === 'Home') iconName = 'home-outline';
                    else if (route.name === 'Chats') iconName = 'chat-outline';
                    else if (route.name === 'Videos') iconName = 'play-box-outline';
                    else if (route.name === 'Cart') iconName = 'cart-outline';
                    else if (route.name === 'Profile') iconName = 'account-outline';

                    return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#1B4332',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
            <Tab.Screen name="Chats" component={ChatsScreen} options={{ title: 'Chats' }} />
            <Tab.Screen name="Videos" component={VideosScreen} options={{ title: 'Videos' }} />
            <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        </Tab.Navigator>
    );
}
