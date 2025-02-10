import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import instance from "../../http/instance";

export default function AdminOrderDashboard(){
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
   const res= await  instance.get("/admin/orders")
    setOrders(res.data)
     };

     useEffect(() => {
            fetchOrders();
        }, []);
    
    return (
        <AdminDashboardLayout>
            <h1>Orders</h1>
            {orders.length > 0 ? (
                orders.map((order: any) => (
                    <div key={order.id}>
                        <h3>{order.title}</h3>
                    </div>
                ))
            ) : (
                <p>No orders found</p>
            )}
        </AdminDashboardLayout>
   )
}