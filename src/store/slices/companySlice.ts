import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import { CompanyResponse, CompanyStatus } from '../../types/Company';
import { UserCompany } from '../../types/User';

interface CompanyState {
  selectedCompany: CompanyResponse;
  companies?: UserCompany[];
}

const initialState: CompanyState = {
   companies: [],
    selectedCompany: {
      id: "",
      companyName: "",
      status: "PAYMENT_PENDING" as CompanyStatus, // Varsayılan status değeri
      state: "", // Örneğin "Delaware", ama başlangıçta boş bırakıyoruz
      companyType: "", // Örneğin "C-Corp"
      createdAt: "", // ISO string; örneğin new Date().toISOString() kullanabilirsin
      updatedAt: null,
      purchasedPricingPlan: null,
      addressPreference: null, // veya "PROVIDED" gibi bir varsayılan değeri de atayabilirsin: "PROVIDED" as AddressPreferenceType
      businessActivity: null,
      customAddress: null,
      monetaryValue: null,
      hiringPlans: null,
      optionPoolHasPool: null,
      optionPoolShares: null,
      optionPoolSize: null,
      parValuePerShare: null,
      formationSteps: [],
      directors: [],
      officers: [],
      optionees: [],
      shareholders: [],
      technologyDevelopers: [],
      companyUsers: []
    },
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanies: (state, action: PayloadAction<UserCompany[]>) => {
      state.companies = action.payload;
    },
    setActiveCompany: (state, action: PayloadAction<CompanyResponse>) => {
      state.selectedCompany = action.payload
  },
  },
});
export const {setActiveCompany,setCompanies} = companySlice.actions;
export const workspaceActions = companySlice.actions;
export default companySlice.reducer;