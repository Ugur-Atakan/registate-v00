import { CompanyResponse } from "../../types/Company";
import { CheckoutData } from "../../utils/plans";
import instance from "../instance"
import { getActiveCompanyId } from "../../utils/storage";

const createCheckout = async (data:CheckoutData) => {
    try {
      const response = await instance.post(`/company/create`,data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
    };

  const getCompanyDetails = async (companyId: string):Promise<CompanyResponse> =>
        {
          try {
            const response = await instance.get(`/company/${companyId}/details`);
            return response.data;
          } catch (error: any) {
            throw error;
          }
        }
        
  const getCompanyDocuments = async () =>
  {
    try {
     const companyId=getActiveCompanyId();
      const response = await instance.get(`/company/${companyId}/documents`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  const getCompanyTickets= async () =>
  {
    try {
      const companyId=getActiveCompanyId();
      const response = await instance.get(`/company/${companyId}/tickets`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
  const getCompanyTasks= async () =>
  {
    try {
      const companyId=getActiveCompanyId();
      console.log(companyId);
      const response = await instance.get(`/company/${companyId}/tasks`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
  const getCompanyInvoices= async () =>
  {
    try {
      const companyId=getActiveCompanyId();
      const response = await instance.get(`/company/${companyId}/invoices`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  const getTaskDetails = async (taskId: string) =>
  {
    try {
      console.log(taskId);
      const response = await instance.get(`/tasks/${taskId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }


  const  getTicketDetails=async (ticketId: string) =>{
    try {
      const response = await instance.get(`/support/ticket/${ticketId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }



  export { 
    getCompanyDetails,
    createCheckout,
    getCompanyDocuments,
    getCompanyTickets,
    getCompanyTasks,
    getCompanyInvoices,
    getTaskDetails,
    getTicketDetails
  };
