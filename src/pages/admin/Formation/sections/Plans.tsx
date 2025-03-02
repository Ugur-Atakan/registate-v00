import { useEffect, useState } from "react";
import instance from "../../../../http/instance";

export default function PricingPlansSection() {
  const [plans, setPlans] = useState<any[]>([]);

  const getPricingPlans = async () => {
    const response = await instance.get(`admin/pricing-plans/all`);
    setPlans(response.data);
  };
  useEffect(() => {
    getPricingPlans();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pricing Plans</h2>
      {plans.length > 0 ? (
        <ul className="space-y-4">
          {plans.map((plan) => (
            <li
              key={plan.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{plan.name}</p>
                <p className="text-sm text-gray-500">
                  Subtitle: {plan.subtitle}
                </p>
                <p className="text-sm text-gray-500">Price: {plan.price}</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">
                Update Plan
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No documents found.</p>
      )}
      <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
        Add Document
      </button>
    </div>
  );
}
