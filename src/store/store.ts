import { configureStore } from '@reduxjs/toolkit';
import userSlice  from './slices/userSlice';
import  workspaceSlice from './slices/workspaceSlice';
import  companySlice  from './slices/companySlice';
import  checkoutSlice from './slices/checkoutSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    workspace: workspaceSlice,
    company: companySlice,
    checkout: checkoutSlice,
  },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;