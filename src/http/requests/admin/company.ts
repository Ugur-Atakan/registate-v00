import instance from "../../instance";
interface CompanyState {
    id: string;
    name: string;
    abbreviation: string;
    createdAt: string;
    updatedAt: string;
  }
  
interface CompanyType {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
export interface Company {
    id: string;
    companyName: string;
    monetaryValue: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    purchasedPricingPlanId: string | null;
    addressPreference: string | null;
    businessActivity: string | null;
    companyTypeId: string;
    compensationMethod: string | null;
    customAddress: string | null;
    hiringPlans: string | null;
    optionPoolHasPool: boolean | null;
    optionPoolShares: number | null;
    optionPoolSize: number | null;
    parValuePerShare: number | null;
    stateId: string;
    totalShares: number | null;
    vestingSchedule: string | null;
    state: CompanyState;
    companyType: CompanyType;
  }

  export interface CompanyDetails {
    id: string;
    companyName: string;
    status: string;
    state: string;
    companyType: string;
    createdAt: string;
    updatedAt: string;
    purchasedPricingPlan: any; // Eğer plan detayları varsa uygun interface ile değiştirebilirsin, şimdilik null veya obje olabilir.
    addressPreference: string;
    businessActivity: string;
    customAddress: string;
    monetaryValue: number;
    hiringPlans: string;
    optionPoolHasPool: boolean | null;
    optionPoolShares: number | null;
    optionPoolSize: number | null;
    parValuePerShare: number;
    directors: Director[];
    officers: Officer[];
    optionees: Optionee[];
    shareholders: Shareholder[];
    technologyDevelopers: TechnologyDeveloper[];
    subscriptions: Subscription[];
    formationSteps: FormationStep[];
    companyUsers: CompanyUser[];
  }
  
  export interface FormationStep {
    id: string;
    title: string;
    description: string;
    icon: string;
    order: number;
    status: string;
    updatedAt: string;
  }
  
  export interface CompanyUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    telephone: string | null;
    profileImage: string | null;
    role: string;
  }
  
  // Eğer detayları varsa; şu an boş diziler geldiği için stub interface'ler oluşturduk:
  export interface Director {}
  export interface Officer {}
  export interface Optionee {}
  export interface Shareholder {}
  export interface TechnologyDeveloper {}
  export interface Subscription {}
  
  export interface CreateCompanyDocument {
    companyId: string;
    uploadedById: string;
    name: string;
    key: string;
    bucketName: string;
    link: string;
    documentType: string;
    fileType: string;
    fromStaff: boolean;
  }

export const getAllCompanies= async ():Promise<Company[]> => {
  try {
   const res= await instance.get("/admin/company/all")
   return res.data;
  } catch (error) {
    throw error;
  }
}

export const getCompanyDetails= async (companyId:string):Promise<CompanyDetails> => {
  try {
   const res= await instance.get(`/admin/company/${companyId}`)
   return res.data;
  } catch (error) {
    throw error;
  }
}

export const uploadCompanyDocument= async (data:CreateCompanyDocument):Promise<any> => {
  try {
   const res= await instance.post(`/admin/company/upload-document`, data)
   return res.data;
  } catch (error) {
    throw error;
  }
}
