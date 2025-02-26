import { Product } from "../../../types/Product";
import { User } from "../../../types/User";
import instance from "../../instance";

export const getAlProducts= async ():Promise<Product[]> => {
    try {
        const res = await instance.get("admin/products/all");
        return res.data;
    } catch (error) {
      throw error;
    }
  }
  export const getUserDetails= async (userId:string):Promise<User[]> => {
    try {
     const res= await instance.get(`/admin/users/${userId}`)
     return res.data.users;
    } catch (error) {
      throw error;
    }
  }
