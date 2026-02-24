import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@shared/services/baseApi';
import authReducer from '@features/auth/authSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
