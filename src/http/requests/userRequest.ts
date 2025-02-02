import {axiosInstance} from '..';
import {UserInterface} from '../../types/User';

const getUserData = async (): Promise<UserInterface> => {
  try {
    const repsonse = await axiosInstance.post('/user/me');
    return repsonse.data;
  } catch (error: any) {
    throw error;
  }
};


export {getUserData}