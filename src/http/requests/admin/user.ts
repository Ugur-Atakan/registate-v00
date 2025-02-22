import { User } from "../../../types/User";
import instance from "../../instance";

export const getAllUsers= async ():Promise<User[]> => {
  try {
   const res= await instance.get("/admin/users")
   return res.data.users;
  } catch (error) {
    throw error;
  }
}