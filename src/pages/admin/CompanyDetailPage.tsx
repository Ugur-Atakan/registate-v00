import { useEffect, useState } from 'react';
import { 
  ArrowLeft, Bell, Building2, Briefcase, FileText, CheckCircle2, Clock, 
  XCircle, Users, DollarSign, MapPin, Activity, User2, ChevronDown
} from 'lucide-react';
import { FormationStep } from '../../types/types';
import AdminDashboardLayout from '../../components/layout/AdminDashboardLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import instance from '../../http/instance';
import toast from 'react-hot-toast';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAYMENT_PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'ACTIVE':
      return 'bg-[#E8FFF3] text-[#9EE248]';
    case 'INACTIVE':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getStepIcon = (iconName: string) => {
  switch (iconName) {
    case 'Building2':
      return <Building2 className="w-5 h-5" />;
    case 'Briefcase':
      return <Briefcase className="w-5 h-5" />;
    case 'FileText':
      return <FileText className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

const getStepStatusIcon = (status: FormationStep['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-5 h-5 text-[#9EE248]" />;
    case 'pending':
      return <Clock className="w-5 h-5 text-[#1649FF]" />;
    case 'failed':
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Clock className="w-5 h-5 text-[#1649FF]" />;
  }
};

export default function AdminCompanyDetailPage() {
  // Başlangıçta formationSteps boş bir dizi olarak tanımlandı
  const [formationSteps, setFormationSteps] = useState<FormationStep[]>([]);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<any>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchCompanyDetails = async () => {
    setLoading(true);
    try {
      const response = await instance.get(
        `/admin/company/${location.state?.companyId}/details`
      );
      setCompany(response.data);
      // Eğer formationSteps bilgisi varsa, sıralı şekilde state'e aktar
      if (response.data.formationSteps) {
        setFormationSteps([...response.data.formationSteps].sort((a, b) => a.order - b.order));
      } else {
        setFormationSteps([]);
      }
    } catch (error) {
      console.error("Error fetching Company details:", error);
      toast.error("Failed to load Company details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
  }, [location.state?.companyId]);

  const handleStatusChange = (stepId: string, newStatus: FormationStep['status']) => {
    setFormationSteps(steps =>
      steps.map(step =>
        step.id === stepId
          ? { ...step, status: newStatus, updatedAt: new Date().toISOString() }
          : step
      )
    );
    setEditingStepId(null);
    // API entegrasyonu ekleyebilirsin
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <main className="lg:p-8">
          <h1>Loading...</h1>
        </main>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <main className="lg:p-8">
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
                {company?.companyName}
              </h1>
              <p className="text-sm text-gray-500">Company Details</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Company Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Overview Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium">Company Overview</h2>
                  <p className="text-sm text-gray-500">Basic company information</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(company?.status)}`}>
                  {company?.status?.replace('_', ' ')}
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
                    {company?.monetaryValue ? `$${company.monetaryValue.toLocaleString()}` : ''}
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

            {/* Formation Progress */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium">Formation Progress</h2>
                  <p className="text-sm text-gray-500">Track company formation status</p>
                </div>
                <button 
                  className="text-sm text-[#1649FF] text-blue-700 font-medium"
                  onClick={() => setEditingStepId(null)}
                >
                  {editingStepId ? 'Cancel Editing' : ''}
                </button>
              </div>
              <div className="space-y-6">
                {formationSteps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {index !== formationSteps.length - 1 && (
                      <div className={`absolute left-6 top-14 bottom-0 w-0.5 ${
                        step.status === 'completed' ? 'bg-[#9EE248]' : 'bg-gray-200'
                      }`} />
                    )}
                    <div className="flex items-start group">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === 'completed' 
                          ? 'bg-[#E8FFF3]' 
                          : step.status === 'pending'
                          ? 'bg-[#EEF2FF]'
                          : 'bg-red-50'
                      }`}>
                        {getStepIcon(step.icon)}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">{step.title}</h3>
                          <div className="flex items-center space-x-2">
                            {editingStepId === step.id ? (
                              <div className="relative">
                                <button
                                  className="flex items-center space-x-2 px-3 py-1 bg-white border border-gray-200 rounded-lg bg-gray-50"
                                  onClick={() => setEditingStepId(null)}
                                >
                                  <span className="text-sm font-medium capitalize">{step.status}</span>
                                  <ChevronDown className="w-4 h-4" />
                                </button>
                                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  {['pending', 'completed', 'failed'].map((status) => (
                                    <button
                                      key={status}
                                      className="w-full px-4 py-2 text-left text-sm bg-gray-50 first:rounded-t-lg last:rounded-b-lg flex items-center space-x-2"
                                      onClick={() => handleStatusChange(step.id, status as FormationStep['status'])}
                                    >
                                      <span>{getStepStatusIcon(status as FormationStep['status'])}</span>
                                      <span className="capitalize">{status}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingStepId(step.id)}
                                className="flex items-center space-x-2 opacity-0 opacity-100 transition-opacity"
                              >
                                {getStepStatusIcon(step.status)}
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-500 mt-1">{step.description}</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Last updated: {new Date(step.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Team Members */}
          <div className="space-y-6">
            {/* Team Members Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium">Team Members</h2>
                  <p className="text-sm text-gray-500">People with access</p>
                </div>
                <button className="text-[#1649FF] hover:text-blue-700 text-sm font-medium">
                  Add Member
                </button>
              </div>

              <div className="space-y-4">
                {company?.companyUsers?.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <img
                        src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-3">
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs bg-[#EEF2FF] text-[#1649FF] rounded-full">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-[#1649FF] mr-3" />
                    <span>View Documents</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <User2 className="w-5 h-5 text-[#1649FF] mr-3" />
                    <span>Manage Team</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 text-[#1649FF] mr-3" />
                    <span>Company Settings</span>
                  </div>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AdminDashboardLayout>
  );
}
