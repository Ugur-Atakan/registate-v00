import { useState } from 'react';
import { ArrowLeft, Bell, FileText, Headphones, ListTodo, Building2, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

import CompanyDetailPage from './CompanyDetailPage';
import AdminDashboardLayout from '../../components/layout/AdminDashboardLayout';

// Demo data
const demoUserDetail = {
  id: "c8f3de36-c259-4e8f-b944-9f37b8c161fb",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  telephone: "+1 234 567 8900",
  profileImage: null,
  notifications: true,
  emailConfirmed: true,
  telephoneConfirmed: false,
  createdAt: "2025-02-03T19:03:20.019Z",
  customerStripeID: "cus_123456789",
  enableToken: "d44e4e54-8890-4c2a-acf3-7b710897ae35",
  deletedAt: null,
  isActive: true,
  loginProvider: "LOCAL",
  companies: [
    {
      id: "96bfeb59-0870-4bac-b2d2-0c9ee5e96db6",
      userId: "c8f3de36-c259-4e8f-b944-9f37b8c161fb",
      companyId: "38b625e2-c13d-47db-b2e5-08fd07a77fbe",
      role: "OWNER",
      createdAt: "2025-02-03T20:48:19.088Z"
    }
  ],
  roles: ["USER"],
  tickets: []
};

// Demo company data
const demoCompanies = [
  {
    id: "38b625e2-c13d-47db-b2e5-08fd07a77fbe",
    name: "Tech Solutions LLC",
    type: "LLC",
    state: "Delaware",
    role: "OWNER"
  },
  {
    id: "45a736c1-1234-5678-90ab-cdef12345678",
    name: "Digital Innovations Corp",
    type: "C-Corp",
    state: "Wyoming",
    role: "OFFICER"
  }
];

interface UserDetailPageProps {
  onBack: () => void;
}

export default function UserDetailPage({ onBack }: UserDetailPageProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (selectedCompanyId) {
    return <CompanyDetailPage onBack={() => setSelectedCompanyId(null)} />;
  }

  return (
    <AdminDashboardLayout>
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-[#333333]">User Profile</h1>
            <p className="text-sm text-gray-500">View and manage user details</p>
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
                src={demoUserDetail.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${demoUserDetail.id}`}
                alt={`${demoUserDetail.firstName} ${demoUserDetail.lastName}`}
                className="w-24 h-24 rounded-full"
              />
              <span className={`mt-4 px-3 py-1 text-sm rounded-full ${
                demoUserDetail.isActive 
                  ? 'bg-[#E8FFF3] text-[#9EE248]'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {demoUserDetail.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Right side - User Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold text-[#333333]">
                  {demoUserDetail.firstName} {demoUserDetail.lastName}
                </h2>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <span className="text-gray-600">{demoUserDetail.email}</span>
                    {demoUserDetail.emailConfirmed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#9EE248] ml-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 ml-2" />
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600">{demoUserDetail.telephone || 'No phone number'}</span>
                    {demoUserDetail.telephoneConfirmed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#9EE248] ml-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 ml-2" />
                    )}
                  </div>
                  {demoUserDetail.customerStripeID && (
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Stripe ID: {demoUserDetail.customerStripeID}</span>
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-200">
                <div>
                  <span className="text-sm text-gray-500">Member Since</span>
                  <p className="mt-1 font-medium">{formatDate(demoUserDetail.createdAt)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Login Provider</span>
                  <p className="mt-1 font-medium">{demoUserDetail.loginProvider}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Notifications</span>
                  <p className="mt-1 font-medium">{demoUserDetail.notifications ? 'Enabled' : 'Disabled'}</p>
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
              <button className="flex items-center px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <ListTodo className="w-5 h-5 text-[#1649FF] mr-3" />
                <span>Tasks</span>
              </button>
            </div>
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium">Associated Companies</h3>
            <p className="text-sm text-gray-500 mt-1">Companies where the user has roles</p>
          </div>
          
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left text-sm font-medium text-gray-500 p-4">Company Name</th>
                  <th className="text-left text-sm font-medium text-gray-500 p-4">Type</th>
                  <th className="text-left text-sm font-medium text-gray-500 p-4">State</th>
                  <th className="text-left text-sm font-medium text-gray-500 p-4">Role</th>
                  <th className="text-right text-sm font-medium text-gray-500 p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {demoCompanies.map((company) => (
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
                        onClick={() => setSelectedCompanyId(company.id)}
                        className="text-[#1649FF] hover:text-blue-700 font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Table */}
          <div className="lg:hidden divide-y divide-gray-200">
            {demoCompanies.map((company) => (
              <div key={company.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{company.name}</h4>
                    <p className="text-sm text-gray-500">{company.type} • {company.state}</p>
                  </div>
                  <span className="px-2 py-1 text-xs bg-[#EEF2FF] text-[#1649FF] rounded-full">
                    {company.role}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedCompanyId(company.id)}
                  className="text-[#1649FF] hover:text-blue-700 font-medium text-sm"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      </AdminDashboardLayout>
  );
}