import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabParamList } from '../types/navigation';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import BookingsScreen from '../screens/BookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof MaterialCommunityIcons.glyphMap | undefined;

                    if (route.name === 'Home') iconName = 'home';
                    else if (route.name === 'Search') iconName = 'magnify';
                    else if (route.name === 'Bookings') iconName = 'calendar';
                    else if (route.name === 'Profile') iconName = 'account';

                    return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#2e64e5',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
            <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Recherche' }} />
            <Tab.Screen name="Bookings" component={BookingsScreen} options={{ title: 'Réservations' }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
        </Tab.Navigator>
    );
}
