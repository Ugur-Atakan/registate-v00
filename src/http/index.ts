import axiosInstance from './instance';

import axios from 'axios';

const baseApi = axios.create({
  baseURL:process.env.API_BASE_URL,
});

export default baseApi;


export {axiosInstance, baseApi};
