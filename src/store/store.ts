import { configureStore } from '@reduxjs/toolkit';
import userSlice  from './slices/userSlice';
import  companySlice  from './slices/companySlice';
import  checkoutSlice from './slices/checkoutSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    company: companySlice,
    checkout: checkoutSlice,
  },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;