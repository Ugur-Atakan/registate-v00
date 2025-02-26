import instance from "../../instance";

export interface Task {
    id: string;
    title: string;
    description: string;
    Icon: string;
    status: string;
    priority: string;
    type: string;
    companyId: string;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
  }

  export interface TaskDetails {
    id: string;
    title: string;
    description: string;
    Icon: string;
    status: string;
    priority: string;
    type: string;
    companyId: string;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
    completedAt: string | null;
    assignedCompany: AssignedCompany;
    attachments: Attachment[];
    messages: TaskMessage[];
  }
  
  export interface AssignedCompany {
    id: string;
    companyName: string;
  }
  
  export interface TaskMessage {
    id: string;
    taskId: string;
    userId: string;
    message: string;
    isStaff: boolean;
    createdAt: string;
    user: TaskUser;
    attachments: Attachment[];
  }
  
  export interface TaskUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }
  
  export interface Attachment {
    id: string;
    name: string;
    url: string;
    type: string;
    uploadedBy: TaskUser;
  }
  

  export interface CreateTaskRequest {
    title: string;
    description: string;
    icon: string;
    status: string;
    priority: string;
    type: string;
    companyId: string;
    dueDate: string;
    attachments: CreateTaskAttachment[];
  }
  
  export interface CreateTaskAttachment {
    name: string;
    url: string;
    type: string;
  }

  export interface AddTaskMessageRequest {
    message: string;
    attachments: CreateTaskAttachment[];
    taskId: string;
    isStaff: boolean;
  }

  export const getAllTasks= async ():Promise<Task[]> => {
    try {
     const res= await instance.get("/admin/task/all")
     return res.data;
    } catch (error) {
      throw error;
    }
  }

  export const getTaskDetails= async (taskId:string):Promise<TaskDetails> => {
    try {
     const res= await instance.get(`/admin/task/${taskId}`)
     return res.data;
    } catch (error) {
      throw error;
    }
  }

  export const createTask= async (data:CreateTaskRequest):Promise<Task> => {
    try {
     const res= await instance.post("/admin/task/create", data)
     return res.data;
    } catch (error) {
      throw error;
    }
  }

  export const addTaskMessage= async (data:AddTaskMessageRequest):Promise<TaskDetails> => {
    try {
     const res= await instance.post(`/admin/task/add-message`,{data})
     return res.data;
    } catch (error) {
      throw error;
    }
  }