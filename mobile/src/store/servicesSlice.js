import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
    setServicesLoading: (state, action) => {
      state.loading = action.payload;
    },
    setServicesError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setServicesList: (state, action) => {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    setServicesFilters: (state, action) => {
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