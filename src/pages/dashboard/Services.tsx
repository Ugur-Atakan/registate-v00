//@ts-nocheck

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import instance from "../../http/instance";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const purchaseStatus = (id1: string, id2: string): string => {
  if (id1 === id2) {
    return "Purchased";
  }
  return "Purchase";
};

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
      <main id="main-content">
        <header id="header" className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Services</h1>
            <p className="text-sm text-neutral-500">
              Manage your company services
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
              <i className="fa-regular fa-bell w-5 h-5" />
            </button>
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=123"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        <div
          id="services-grid"
          className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2"
        >
          {/* Service Card 1 */}
          {services.map((product) => (
            <ServiceCard key={product.id} product={product} />
          ))}
            {services.map((product) => (
            <ServiceCard key={product.id} product={product} />
          ))}
          
        </div>
      </main>
    </DashboardLayout>
  );
}

const ServiceCard = ({ product }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-user-tie text-white"></i>
          </div>
          <h3 className="font-semibold">{product.name}</h3>
        </div>
        <span className="px-3 py-1 text-xs bg-neutral-100 rounded-full">
          Active
        </span>
      </div>
      <p className="text-sm text-neutral-600 mb-4">{product.description}</p>
      <button className="w-full px-4 py-2 bg-neutral-200 text-neutral-600 rounded-lg text-sm">
        Already Purchased
      </button>
    </div>
  );
};
