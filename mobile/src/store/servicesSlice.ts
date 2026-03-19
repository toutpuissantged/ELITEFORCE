import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Service } from '../types';

interface ServicesState {
    list: Service[];
    loading: boolean;
    error: string | null;
    filters: {
        search: string;
        category: string;
        minPrice: number | null;
        maxPrice: number | null;
        rating: number | null;
    };
}

const initialState: ServicesState = {
    list: [],
    loading: false,
    error: null,
    filters: {
        search: '',
        category: '',
        minPrice: null,
        maxPrice: null,
        rating: null,
    },
};

const servicesSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        setServicesLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setServicesError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.loading = false;
        },
        setServicesList: (state, action: PayloadAction<Service[]>) => {
            state.list = action.payload;
            state.loading = false;
            state.error = null;
        },
        setServicesFilters: (state, action: PayloadAction<Partial<ServicesState['filters']>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearServicesFilters: (state) => {
            state.filters = initialState.filters;
        },
    },
});

export const {
    setServicesLoading,
    setServicesError,
    setServicesList,
    setServicesFilters,
    clearServicesFilters,
} = servicesSlice.actions;

export default servicesSlice.reducer;
