import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CheckoutAddon {
    productId: string;
    selectedPriceId: string | null;
    }

interface CheckoutState {
  companyTypeId: string | null;
  stateId: string | null;
  companyName: string;
  designator: string;
  pricingPlanId: string | null;
  stateFeeId: string | null;
  expeditedFeeId: string | null;
  addons: CheckoutAddon[];
}

const initialState: CheckoutState = {
  companyTypeId: null,
  stateId: null,
  companyName: "",
  designator: "",
  pricingPlanId: null,
  stateFeeId: null,
  expeditedFeeId: null,
  addons: [],
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckoutData: (state, action: PayloadAction<any>) => {
      return { ...state, ...action.payload };
    },
    addAddon: (state, action: PayloadAction<CheckoutAddon>) => {
      state.addons.push(action.payload);
    },
    removeAddon: (state, action) => {
      state.addons = state.addons.filter(
        (addon) => addon.productId !== action.payload
      );
    },
  },
});

export const { setCheckoutData, addAddon, removeAddon } = checkoutSlice.actions;
export const checkOutActions = checkoutSlice.actions;

export default checkoutSlice.reducer;
