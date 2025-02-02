import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface CompanyState {
  selectedPackage: any;
  
}

const initialState: CompanyState = {
    selectedPackage: null,
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    selectPackage: (state, action: PayloadAction<any>) => {
      state.selectedPackage = action.payload;
    },
  },
});
export const {selectPackage} = companySlice.actions;
export const workspaceActions = companySlice.actions;
export default companySlice.reducer;