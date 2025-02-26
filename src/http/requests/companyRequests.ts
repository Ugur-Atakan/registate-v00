import { CompanyResponse } from "../../types/Company";
import instance from "../instance"
import { getActiveCompanyId } from "../../utils/storage";


const getServices= async () => {
  try {
    const response = await instance.get('/product/products');
    return response.data;
  } catch (error: any) {
    throw error; 
  }
};

const buySingleItem = async ({productId,priceId}:{productId:string,priceId:string}):Promise<string> => {
  try {
    const companyId=getActiveCompanyId();
    let data={
      productId,
      priceId,
      companyId
    }
    console.log(data);
    const response = await instance.post('/checkout/create-checkout-session',data);
    return response.data.url;
  } catch (error: any) {
    throw error;
  }
};

const getCompanyDetails = async (companyId?: string): Promise<CompanyResponse> => {
  try {
    // companyId parametresi varsa onu, yoksa localStorage'dan alınan değeri kullanın.
    const currentId = companyId || getActiveCompanyId();
    const response = await instance.get(`/company/${currentId}/details`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching company details:", error);
    throw error;
  }
};
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
    getCompanyDocuments,
    getCompanyTickets,
    getCompanyTasks,
    getCompanyInvoices,
    getTaskDetails,
    getTicketDetails,
    buySingleItem,
    getServices
  };
