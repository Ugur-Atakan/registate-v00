import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface WorkspaceState {
  selectedPackage: any;
  
}

const initialState: WorkspaceState = {
    selectedPackage: null,
};

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    selectPackage: (state, action: PayloadAction<any>) => {
      state.selectedPackage = action.payload;
    },
  },
});
export const {selectPackage} = workspaceSlice.actions;
export const workspaceActions = workspaceSlice.actions;
export default workspaceSlice.reducer;