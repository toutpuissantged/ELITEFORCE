import axios from 'axios';
import storage from './storage';
import { BASE_URL } from '../config';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor to add the auth token
api.interceptors.request.use(
    async (config) => {
        const token = await storage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            // Handle specific status codes
            if (error.response.status === 401) {
                // Unauthorized - could trigger a logout or token refresh
                await storage.removeItem('token');
            }
            return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
    }
);

export default api;
