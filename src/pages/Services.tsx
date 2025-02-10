//@ts-nocheck

import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import instance from "../http/instance";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const purchaseStatus=(id1:string,id2:string):string=>{
  if(id1===id2){
    return 'Purchased'
  }
  return 'Purchase'
}

export default function Services() {
  const [services, setServices] = useState([]);
  const dispatch = useAppDispatch();
  const subscriptions = useAppSelector(
    (state) => state.company.selectedCompany.subscriptions
  );

  const fetchServices = async () => {
    const res = await instance.get("/product/services");
    setServices(res.data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const purchaseService = async () => {
    await instance.post("/product/subscribe", {
      companyId: subscriptions[0].companyId,
      productId: services[0].id,
    });
  };


  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Available Services</h1>
        <p className="text-gray-600">
          Additional services will be available after company formation.
        </p>
        {services.length > 0 ? (
          services.map((service: any) => (
            <div
              key={service.id}
              className="bg-white shadow-md rounded-lg p-4 mt-4"
            >
              <h2 className="text-xl font-bold">{service.name}</h2>
              <p>{service.description}</p>
              <p className="text-gray-600">${service.price}</p>
            </div>
          ))
        ) : (
          <p>Aviable Service Not Found</p>
        )}
      </div>
    </DashboardLayout>
  );
}
