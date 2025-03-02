import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  FileText,
  Headphones,
  ListTodo,
  Building2,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";

import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import instance from "../../http/instance";
import { useLocation, useNavigate } from "react-router-dom";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function UserDetailPage() {
  const [userDetail, setUserDetail] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [errors, setErrors] = useState(null);
  const userId = location.state?.userId;

  const fetchUserDetails = async () => {
    try {
      const response = await instance.get(`/admin/users/${userId}`);
      setUserDetail(response.data.user);
    } catch (error:any) {
      console.error(error);
      setErrors(error.message);
      
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const goCompanDetailsPage = (companyId: string) => {
    navigate(`/admin/company/details`, { state: { companyId } });
  };

  if (!userDetail) {
    return (
      <AdminDashboardLayout>
        <div className="p-8">{errors}</div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
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
            <h1 className="text-xl lg:text-2xl font-semibold text-[#333333]">
              User Profile
            </h1>
            <p className="text-sm text-gray-500">
              View and manage user details
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
            alt="Admin"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </header>

      <div className="space-y-6">
        {/* User Profile Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
            {/* Left side - Avatar and Status */}
            <div className="flex flex-col items-center lg:items-start mb-6 lg:mb-0">
              <img
                src={
                  userDetail.profileImage ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${userDetail.id}`
                }
                alt={`${userDetail.firstName} ${userDetail.lastName}`}
                className="w-24 h-24 rounded-full"
              />
              <span
                className={`mt-4 px-3 py-1 text-sm rounded-full ${
                  userDetail.isActive
                    ? "bg-[#E8FFF3] text-[#9EE248]"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {userDetail.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Right side - User Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#333333]">
                  {userDetail.firstName} {userDetail.lastName}
                </h2>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <span className="text-gray-600">{userDetail.email}</span>
                    {userDetail.emailConfirmed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#9EE248] ml-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 ml-2" />
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600">
                      {userDetail.telephone || "No phone number"}
                    </span>
                    {userDetail.telephoneConfirmed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#9EE248] ml-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 ml-2" />
                    )}
                  </div>
                  {userDetail.customerStripeID && (
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Stripe ID: {userDetail.customerStripeID}</span>
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-200">
                <div>
                  <span className="text-sm text-gray-500">Member Since</span>
                  <p className="mt-1 font-medium">
                    {formatDate(userDetail.createdAt)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Login Provider</span>
                  <p className="mt-1 font-medium">{userDetail.loginProvider}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Notifications</span>
                  <p className="mt-1 font-medium">
                    {userDetail.notifications ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <h3 className="text-lg font-medium mb-4 lg:mb-0">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="w-5 h-5 text-[#1649FF] mr-3" />
                <span>Orders</span>
              </button>
              <button className="flex items-center px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Building2 className="w-5 h-5 text-[#1649FF] mr-3" />
                <span>Files</span>
              </button>
              <button className="flex items-center px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Headphones className="w-5 h-5 text-[#1649FF] mr-3" />
                <span>Tickets</span>
              </button>
            </div>
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium">Associated Companies</h3>
            <p className="text-sm text-gray-500 mt-1">
              Companies where the user has roles
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-sm font-medium text-gray-500 p-4">
                    Company Name
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500 p-4">
                    Type
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500 p-4">
                    State
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500 p-4">
                    Role
                  </th>
                  <th className="text-right text-sm font-medium text-gray-500 p-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userDetail.companies && userDetail.companies.length > 0 ? (
                  userDetail.companies.map((company: any) => (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-medium">{company.name}</span>
                      </td>
                      <td className="p-4">{company.type}</td>
                      <td className="p-4">{company.state}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs bg-[#EEF2FF] text-[#1649FF] rounded-full">
                          {company.role}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => goCompanDetailsPage(company.id)}
                          className="text-[#1649FF] hover:text-blue-700 font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center">
                      No companies found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Table */}
          <div className="lg:hidden divide-y divide-gray-200">
            {userDetail.companies && userDetail.companies.length > 0 ? (
              userDetail.companies.map((company: any) => (
                <div key={company.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{company.name}</h4>
                      <p className="text-sm text-gray-500">
                        {company.type} • {company.state}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-[#EEF2FF] text-[#1649FF] rounded-full">
                      {company.role}
                    </span>
                  </div>
                  <button
                    onClick={() => goCompanDetailsPage(company.id)}
                    className="text-[#1649FF] hover:text-blue-700 font-medium text-sm"
                  >
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <p className="p-4">No companies found.</p>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
