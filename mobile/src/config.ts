import { Platform } from 'react-native';

const ENV_API_URL = process.env.API_URL || process.env.EXPO_PUBLIC_API_URL;

export const BASE_URL = ENV_API_URL
    ? (ENV_API_URL.endsWith('/api') ? ENV_API_URL : `${ENV_API_URL}/api`)
    : (Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api');

export const SOCKET_URL = ENV_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000');
