import { CheckoutData } from "../../utils/plans";
import instance from "../instance"

const createCheckout = async (data:CheckoutData) => {
    try {
      const response = await instance.post(`/company/create`,data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
    };

const getCompanyDetails = async (companyId:string) => {
        try {
          const response = await instance.get(`/company/${companyId}/details`);
          return response.data;
        } catch (error: any) {
          throw error;
        }
      };
      
  export { 
    getCompanyDetails,
    createCheckout
  };
