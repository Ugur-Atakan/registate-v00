import instance from "../../instance";

export interface Order {
    id: string;
    status: string;
    amount: number;
    currency: string;
    stripeCheckoutSessionId: string | null;
    createdAt: string;
    updatedAt: string;
    companyId: string;
    paymentMethod: string;
    orderItems: OrderItem[];
    user: OrderUser;
  }
  
  export interface OrderItem {
    id: string;
    orderId: string;
    type: string;
    productId: string;
    priceId: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    product: OrderProduct;
    price: OrderPrice;
  }
  
  export interface OrderProduct {
    name: string;
    id: string;
    stripeProductId: string;
    updatedAt: string;
    createdAt: string;
    description: string;
  }
  
  export interface OrderPrice {
    unit_amount: number;
    currency: string;
    id: string;
    stripePriceId: string;
  }
  
  export interface OrderUser {
    firstName: string;
    lastName: string;
    email: string;
    id: string;
    customerStripeID: string;
  }

export const getAllOrders= async ():Promise<Order[]> => {
  try {
   const res= await instance.get("/admin/order/all")
   return res.data.orders;
  } catch (error) {
    throw error;
  }
}
export const getOrderDetails= async (orderId:string):Promise<Order[]> => {
  try {
   const res= await instance.get(`/admin/order/${orderId}/details`)
   return res.data;
  } catch (error) {
    throw error;
  }
}

export const updateOrderStatus= async (orderId:string,status:string):Promise<Order[]> => {
  try {
   const res= await instance.patch(`/admin/order/${orderId}`,{status})
   return res.data;
  } catch (error) {
    throw error;
  }
}