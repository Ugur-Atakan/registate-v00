import { baseApi } from "..";

const getPricingPlans = async () => {
  try {
    const response = await baseApi.get("/formation/pricing-plans");
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

const getPlanAddons = async (planId: string) => {
  try {
    const response = await baseApi.get(
      `/formation/pricing-plan-addons/${planId}`
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

const getStateFeesAndExpeditedFees = async (
  stateId: string,
  companyTypeId: string
) => {
  try {
    const response = await baseApi.get(
      `/formation/state-fee/${stateId}/${companyTypeId}`
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

const getCompanyTypes = async () => {
  try {
    const response = await baseApi.get("/formation/company-type/all");
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

const getStates = async () => {
  try {
    const response = await baseApi.get("/formation/state/all");
    return response.data;
  } catch (error: any) {
    throw error;
  }
};



export {
  getPricingPlans,
  getPlanAddons,
  getStateFeesAndExpeditedFees,
  getCompanyTypes,
  getStates,
};
