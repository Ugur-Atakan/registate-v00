import instance from "../../http/instance";


const updateCompanyFormationStepStatus = async (companyId: string, step: string, status: string) => {
  const response = await instance.put(`/admin/company/${companyId}/formation-step`, {
    step,
    status
  });
  return response;
};


const getCompanyOrders = async (companyId: string) => {
  const orders = await instance.get(`/admin/company/${companyId}/orders`);
  return orders;
};


const getCompanyTasks = async (companyId: string) => {
  const tasks = await instance.get(`/admin/company/${companyId}/tasks`);
  return tasks;
}

const getCompanyTickets = async (companyId: string) => {
  const tickets = await instance.get(`/admin/company/${companyId}/tickets`);
  return tickets;
}
const getCompanyDocuments = async (companyId: string) =>{
    const documents = await instance.get(`/admin/company/${companyId}/documents`);
    return documents;
} 


// Company Status,State, Pricing Plan —> List, Update 


// Company Orders —> List,  Update
// getCompanyOrders methodu ile orderları listelenecek
// orders/details sayfasına gidilecek orada işlemler yapılacak 

// Company Tickets —> List, Update 
// getCompanyTickets methodu ile ticketları listelenecek
// support/details sayfasına gidilecek orada işlemler yapılacak

// Company Tasks—> List, Add, Update 
// getCompanyTasks methodu ile taskları listelenecek
// tasks/details sayfasına gidilecek orada işlemler yapılacak

// Company Documents —> List, Add, Update
// getCompanyDocuments methodu ile documentleri listelenecek
// documents/details sayfasına gidilecek orada işlemler yapılacak
// yeni bir document eklenmesi için create company Document sayfası yapılacak

// Company Users —> List, Add, Update

// Company Subscriptions  —> List, Add, Update




// EKLENECEK SAYFALAR

// Create Company Documents

// Add Company Team Member 
