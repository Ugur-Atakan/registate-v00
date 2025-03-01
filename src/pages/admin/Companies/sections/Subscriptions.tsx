import { useEffect, useState } from "react";
import instance from "../../../../http/instance";

interface SectionProps {
  companyId: string;
}




export default function CompanySubscriptionsSection({ companyId }: SectionProps) {
const [subscriptions, setSubscriptions] = useState<any[]>([]);
        
const getCompanySubs = async () => {
  // böyle bir endpoint yok geliştirilecek
  const response = await instance.get(`/admin/company/${companyId}/subscriptions`);
  setSubscriptions(response.data);
};


useEffect(() => {
  if (companyId) {
    getCompanySubs();
  }
}, [companyId]);


    return (
      <div>
      <h2 className="text-xl font-semibold mb-4">Company Subscriptions</h2>
      {subscriptions &&subscriptions.length > 0 ? (
        <ul className="space-y-4">
          {subscriptions.map((sub: any) => (
            <li key={sub.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-medium">Subscription: {sub.planName}</p>
                <p className="text-sm text-gray-500">Status: {sub.status}</p>
              </div>
              <button className="px-3 py-1 bg-blue-600 text-white rounded">Update Subscription</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No subscriptions found.</p>
      )}
      <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Add Subscription</button>
    </div>

    )
}
