import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import servicesReducer from './servicesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    services: servicesReducer,
  },
});

export default store;