import { useEffect, useState } from "react";
import { ArrowLeft, Bell, AlertCircle } from "lucide-react";
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

// Define interfaces for type safety
interface Company {
  companyId: string;
  companyName: string;
  [key: string]: any; // For other company properties
}

interface SectionTab {
  key: string;
  label: string;
}

const sections: SectionTab[] = [
  { key: "general", label: "General" },
  { key: "formation", label: "Formation Steps" },
  { key: "documents", label: "Documents" },
  { key: "users", label: "Members" },
  { key: "subscriptions", label: "Subscriptions" },
];

export default function AdminCompanyDetailPageEnhanced() {
  const [company, setCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const companyId = location.state?.companyId;

  const fetchCompanyDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get(
        `/admin/company/${companyId}/details`
      );
      setCompany(response.data);
    } catch (error) {
      console.error("Error fetching company details", error);
      setError("Failed to load company details");
      toast.error("Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchCompanyDetails();
    } else {
      setError("No company ID provided");
      toast.error("No company ID provided");
    }
  }, [companyId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Component for empty or error state
  const EmptyState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="flex flex-col items-center justify-center p-8 h-64">
      <div className="text-red-500 mb-4">
        <AlertCircle size={40} />
      </div>
      <h2 className="text-lg font-medium mb-4 text-center">{message}</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  // Function to render the appropriate tab content
  const renderTabContent = () => {
    if (error && !loading) {
      return (
        <EmptyState 
          message={error} 
          onRetry={fetchCompanyDetails} 
        />
      );
    }

    if (loading) {
      return (
        <div className="flex justify-center items-center p-12">
          <LoadingComponent />
        </div>
      );
    }

    switch (activeTab) {
      case "general":
        return <CompanyGeneralSection companyId={companyId} />;
      case "formation":
        return <CompanyFormationStepsSection companyId={companyId} />;
      case "documents":
        return <CompanyDocumentsSection companyId={companyId} />;
      case "users":
        return <CompanyMembersSection companyId={companyId} />;
      case "subscriptions":
        return <CompanySubscriptionsSection companyId={companyId} />;
      default:
        return <div>Unknown tab selected</div>;
    }
  };

  // If there's no company ID at all, show a full-page error
  if (!companyId && !loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <EmptyState 
            message="No company ID provided. Please select a company from the companies list." 
            onRetry={() => navigate('/admin/companies')} 
          />
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto px-4 sm:px-4 lg:px-8 pb-12">
          {/* Breadcrumbs - Desktop Only */}
          <nav className="hidden sm:flex py-4 text-sm text-gray-500" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <button 
                  onClick={() => navigate('/admin/dashboard')} 
                  className="hover:text-gray-700 transition-colors"
                >
                  Dashboard
                </button>
              </li>
              <li className="flex items-center">
                <span className="mx-1">/</span>
                <button 
                  onClick={() => navigate('/admin/companies')} 
                  className="hover:text-gray-700 transition-colors"
                >
                  Companies
                </button>
              </li>
              <li className="flex items-center">
                <span className="mx-1">/</span>
                <span className="text-gray-900 font-medium">{company?.companyName || 'Company Details'}</span>
              </li>
            </ol>
          </nav>

          {/* Header Card */}
          <header className="bg-white shadow-sm rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <button
                  onClick={handleGoBack}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{company?.companyName || 'Loading...'}</h1>
                  <p className="text-sm text-gray-500">Company Details</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                <AdminAvatar />
              </div>
            </div>
          </header>

          {/* Tab Menu - Desktop */}
          <div className="hidden sm:block mb-6 bg-white rounded-lg shadow-sm">
            <nav className="flex" aria-label="Tabs">
              {sections.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors flex-1 ${
                    activeTab === tab.key
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                  aria-current={activeTab === tab.key ? "page" : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Menu - Mobile */}
          <div className="sm:hidden mb-6 overflow-x-auto bg-white rounded-lg shadow-sm p-2">
            <div className="flex whitespace-nowrap">
              {sections.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2 px-4 mr-2 rounded-full text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? "bg-blue-600 text-white font-medium"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  aria-current={activeTab === tab.key ? "page" : undefined}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white shadow-sm rounded-lg min-h-[400px] transition-all duration-200 ease-in-out p-4"> 
            {renderTabContent()}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}