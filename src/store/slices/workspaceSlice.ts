import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface WorkspaceState {
  selectedCompany: any;
  companies:any[];
}

const initialState: WorkspaceState = {
  companies: [], 
  selectedCompany: null,
};

export const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setActiveCompany: (state, action: PayloadAction<any>) => {
      state.selectedCompany = action.payload;
    }
    ,
    addCompany: (state, action: PayloadAction<any>) => {
      state.companies.push(action.payload);
    },
    removeCompany: (state, action: PayloadAction<any>) => {
      state.companies = state.companies.filter(
        (company) => company.id !== action.payload
      );
    },
  },
});
export const {setActiveCompany,addCompany,removeCompany} = workspaceSlice.actions;
export const workspaceActions = workspaceSlice.actions;
export default workspaceSlice.reducer;