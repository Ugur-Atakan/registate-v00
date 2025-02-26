import instance from "../../instance";

interface TicketUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }
  
interface TicketCompany {
    id: string;
    companyName: string;
  }
export interface Ticket {
    id: string;
    ticketNo: number;
    userId: string;
    subject: string;
    category: string;
    status: string;
    priority: string;
    isActivate: boolean;
    createdAt: string;
    updatedAt: string;
    user: TicketUser;
    company: TicketCompany[];
  }


  export interface TicketDetails {
    id: string;
    ticketNo: number;
    userId: string;
    subject: string;
    category: string;
    status: string;
    priority: string;
    isActivate: boolean;
    createdAt: string;
    updatedAt: string;
    messages: TicketMessageDetail[];
  }
  
  export interface TicketMessageDetail {
    id: string;
    ticketId: string;
    userId: string;
    message: string;
    isStaff: boolean;
    createdAt: string;
    attachments: TicketAttachment[];
  }
  
  export interface TicketAttachment {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedById: string;
    createdAt: string;
    updatedAt: string;
  }

  
export const getAllTickets= async ():Promise<Ticket[]> => {
  try {
   const res= await instance.get("/admin/tickets")
   return res.data;
  } catch (error) {
    throw error;
  }
}

export const getTicketDetails= async (ticketId:string):Promise<TicketDetails[]> => {
  try {
   const res= await instance.get(`/admin/ticket/${ticketId}/details`)
   return res.data;
  } catch (error) {
    throw error;
  }
}

export const updateTicketStatus= async (ticketId:string,status:string):Promise<Ticket[]> => {
  try {
   const res= await instance.put(`/admin/ticket/${ticketId}/edit`,{status})
   return res.data;
  } catch (error) {
    throw error;
  }
}
export const addTicketMessage= async (data:any):Promise<Ticket[]> => {
  try {
   const res= await instance.post(`/admin/support/add-message-to-ticket`,{data})
   return res.data;
  } catch (error) {
    throw error;
  }
}