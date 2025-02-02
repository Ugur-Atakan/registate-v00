import {PricingPlan } from "../utils/plans";

export type CompanyType = "LLC" | "C-CORP" | null;
export type StateType = "Wyoming" | "Delaware" | null;
export type CompanyDesignator =
  | "LLC"
  | "L.L.C"
  | "Limited Liability Company"
  | "Corp."
  | "Corporation"
  | "Co."
  | "Inc."
  | "Incorporated"
  | null;

export interface FormationFormData {
  companyType: CompanyType;
  registrationState: StateType;
  companyName: string;
  companyDesignator: CompanyDesignator;
  selectedPlan: PricingPlan|null;
  upsellProducts: any[];
}


export interface AddonsProps {
  formData: FormationFormData;
  setFormData: any;
  prevStep?: () => void;
  nextStep?: () => void;
}