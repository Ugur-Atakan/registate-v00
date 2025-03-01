import toast from "react-hot-toast";
import instance from "../../../../http/instance";
import { useEffect, useState } from "react";
import { 
  Activity, Building2, DollarSign, MapPin, Users, Ticket, Briefcase 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SectionProps {
  companyId: string;
}

// Stil yardımcıları
const getStatusColor = (status: string) => {
  switch (status) {
    case "PAYMENT_PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "ACTIVE":
      return "bg-[#E8FFF3] text-[#9EE248]";
    case "INACTIVE":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function CompanyGeneralSection({ companyId }: SectionProps) {
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const goCompanyTickets = () => {
    navigate(`/admin/support`, { state: { companyId: companyId } });
  };

  const goCompanyOrders = () => {
    navigate(`/admin/orders`, { state: { companyId: companyId } });
  };

  const goCompanyTasks = () => {
    navigate(`/admin/tasks`, { state: { companyId: companyId } });
  };

  const fetchCompanyDetails = async () => {
    setLoading(true);
    try {
      const response = await instance.get(
        `/admin/company/${companyId}/details`
      );
      setCompany(response.data);
    } catch (error) {
      console.error("Error fetching company details", error);
      toast.error("Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId]);

  return (
    <div>
      {/* Quick Actions Butonları */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={goCompanyTickets}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Ticket className="w-5 h-5 mr-2" />
          Tickets
        </button>
        <button
          onClick={goCompanyOrders}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <DollarSign className="w-5 h-5 mr-2" />
          Orders
        </button>
        <button
          onClick={goCompanyTasks}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Briefcase className="w-5 h-5 mr-2" />
          Tasks
        </button>
      </div>

      {/* Company Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium">Company Overview</h2>
            <p className="text-sm text-gray-500">Basic company information</p>
          </div>
          <span
            className={`px-3 py-1 text-sm rounded-full ${getStatusColor(
              company?.status
            )}`}
          >
            {company?.status?.replace("_", " ")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-sm text-gray-500">Company Type</span>
            <p className="mt-1 font-medium flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-gray-400" />
              {company?.companyType}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500">State</span>
            <p className="mt-1 font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              {company?.state}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Business Activity</span>
            <p className="mt-1 font-medium flex items-center">
              <Activity className="w-4 h-4 mr-2 text-gray-400" />
              {company?.businessActivity}
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Monetary Value</span>
            <p className="mt-1 font-medium flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
              {company?.monetaryValue
                ? `$${company.monetaryValue.toLocaleString()}`
                : ""}
            </p>
          </div>
          <div className="md:col-span-2">
            <span className="text-sm text-gray-500">Address</span>
            <p className="mt-1 font-medium flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
              {company?.customAddress}
            </p>
          </div>
          <div className="md:col-span-2">
            <span className="text-sm text-gray-500">Hiring Plans</span>
            <p className="mt-1 font-medium flex items-center">
              <Users className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
              {company?.hiringPlans}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
