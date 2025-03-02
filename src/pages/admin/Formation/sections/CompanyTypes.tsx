import toast from "react-hot-toast";
import instance from "../../../../http/instance";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";


export default function CompanyTypesSection() {
  const [companyTypes, setCompanyTypes] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  return (
    <div>
    
      {/* Company Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Company Types</h2>
            <p className="text-sm text-gray-500">
              General information about the company
            </p>
            </div>
            </div>
      </div>
    </div>
  );
}
