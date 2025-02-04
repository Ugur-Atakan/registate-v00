import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CheckoutAddon, CheckoutData, FillingOption } from "../../utils/plans";

// initialState'i CheckoutData'ya göre güncelle
const initialState: CheckoutData = {
  companyInfo: {
    name: "",
    designator: "",
  },
  state: {
    id: "",
    name: "",
  },
  companyType: {
    id: "",
    name: "",
  },
  pricingPlan: {
    id: "",
    name: "",
    price: 0,
  },
  stateFee: {
    id: "",
    amount: 0,
  },
  expeditedFee: {
    id: "",
    name: "",
    price: 0,
  },
  addons: [],
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCompanyInfo: (state, action: PayloadAction<{ companyName: string; designator: string }>) => {
      state.companyInfo.name = action.payload.companyName;
      state.companyInfo.designator = action.payload.designator;
    },
    setCompanyType: (state, action: PayloadAction<{ companyTypeId: string; companyType: string }>) => {
      state.companyType.id = action.payload.companyTypeId;
      state.companyType.name = action.payload.companyType;
    },
    setCompanyState: (state, action: PayloadAction<{ stateId: string; stateName: string }>) => {
      state.state.id = action.payload.stateId;
      state.state.name = action.payload.stateName;
    },
    setPricingPlan: (state, action: PayloadAction<{ pricingPlanId: string; pricingPlanName: string; price: number }>) => {
      state.pricingPlan.id = action.payload.pricingPlanId;
      state.pricingPlan.name = action.payload.pricingPlanName;
      state.pricingPlan.price = action.payload.price;
    },
    setStateFee: (state, action: PayloadAction<{ stateFeeId: string; stateFeeAmount: number }>) => {
      state.stateFee.id = action.payload.stateFeeId;
      state.stateFee.amount = action.payload.stateFeeAmount;
    },
    setExpeditedFee: (state, action: PayloadAction<FillingOption>) => {
      state.expeditedFee = action.payload;
    },
    addAddon: (state, action: PayloadAction<CheckoutAddon>) => {
      const index = state.addons.findIndex((a) => a.productId === action.payload.productId);
      if (index !== -1) {
        state.addons[index] = action.payload; // Var olanı güncelle
      } else {
        state.addons.push(action.payload); // Yeni ekle
      }
    },
    removeAddon: (state, action: PayloadAction<string>) => {
      state.addons = state.addons.filter((a) => a.productId !== action.payload);
    },
    resetCheckout: () => initialState,
  },
});

export const {
  setCompanyInfo,
  setCompanyType,
  setCompanyState,
  setPricingPlan,
  setStateFee,
  setExpeditedFee,
  addAddon,
  removeAddon,
  resetCheckout,
} = checkoutSlice.actions;

export const checkoutActions = checkoutSlice.actions;
export default checkoutSlice.reducer;
