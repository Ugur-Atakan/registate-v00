import { useEffect, useState } from "react";
import { ArrowLeft, Bell } from "lucide-react";
import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../../../http/instance";
import toast from "react-hot-toast";
import CompanyGeneralSection from "./sections/General";
import CompanyFormationStepsSection from "./sections/FormationSteps";
import CompanyMembersSection from "./sections/Members";
import CompanySubscriptionsSection from "./sections/Subscriptions";
import CompanyDocumentsSection from "./sections/Documents";
import LoadingComponent from "../../../components/Loading";
import AdminAvatar from "../../../components/AdminAvatar";

const sections = [
  { key: "general", label: "General" },
  { key: "formation", label: "Formation Steps" },
  { key: "documents", label: "Documents" },
  { key: "users", label: "Members" },
  { key: "subscriptions", label: "Subscriptions" },
];
export default function AdminCompanyDetailPageEnhanced() {
  const [company, setCompany] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const companyId = location.state?.companyId;

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

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading || !company) {
    return (
      <AdminDashboardLayout>
       <LoadingComponent />
       
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <main className="p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGoBack}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold">{company.companyName}</h1>
              <p className="text-sm text-gray-500">Company Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>
            <AdminAvatar />
          </div>
        </header>

        {/* Tab Menüsü */}
        <div className="mb-6 border-b">
          <nav className="flex space-x-4">
            {sections.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-2 px-4 ${
                  activeTab === tab.key
                    ? "border-b-2 border-blue-600 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div>
          {/* General: Şirket Status, State, Pricing Plan */}
          {activeTab === "general" && (
            <CompanyGeneralSection companyId={companyId} />
          )}

          {/* Formation Steps */}
          {activeTab === "formation" && (
            <CompanyFormationStepsSection companyId={companyId} />
          )}

          {/* Documents */}
          {activeTab === "documents" && (
            <CompanyDocumentsSection companyId={companyId} />
          )}

          {/* Users */}
          {activeTab === "users" && (
            <CompanyMembersSection companyId={companyId} />
          )}

          {/* Subscriptions */}
          {activeTab === "subscriptions" && (
            <CompanySubscriptionsSection companyId={companyId} />
          )}
        </div>
      </main>
    </AdminDashboardLayout>
  );
}
