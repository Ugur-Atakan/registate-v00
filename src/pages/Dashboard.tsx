import { useEffect, useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Package,
  CheckCircle2,
  FileText,
  Briefcase
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { PricingPlan } from '../utils/plans';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { CompanyResponse, FormationStep } from '../types/Company';
import { getCompanyDetails } from '../http/requests/formation';
import { setActiveCompany } from '../store/slices/companySlice';

interface UserData {
  companyType: string;
  registrationState: string;
  companyName: string;
  companyDesignator: string;
  selectedPlan: PricingPlan;
}

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [formationSteps, setFormationSteps] = useState<FormationStep[]>([]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const companies = useAppSelector((state) => state.company.companies);
  const user = useAppSelector((state) => state.user.userData);

  console.log('Companies:', companies);
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!companies) {
        setError('No companies available.');
        return;
      }
      setFetching(true);
      setError(null);
      try {
        const companyDetails = await getCompanyDetails(companies[0].companyId);
        console.log('Company details:', companyDetails);  
        setCompany(companyDetails);
        dispatch(setActiveCompany(companyDetails));
      } catch (err: any) {
        console.error('Error fetching company details:', err);
        setError(err.message || 'Failed to fetch company details.');
      } finally {
        setFetching(false);
      }
    };

    fetchCompanyDetails();
  }, []);

  if (fetching) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center">API den veriler getiriliyor...</div>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center">Loading...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center text-red-500">{error}</div>
      </DashboardLayout>
    );
  }

  if (!company) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center">No company found</div>
      </DashboardLayout>
    );
  }

  // Hesaplanabilir progress width değeri (formation adımları varsa hesaplanır)
  const getProgressWidth = () => {
    if (!company.formationSteps.length) return 0;
    const completedSteps = company.formationSteps.filter(
      (step) => step.status === 'completed'
    ).length;
    const inProgressSteps = company.formationSteps.filter(
      (step) => step.status === 'in_progress'
    ).length;
    return ((completedSteps + inProgressSteps * 0.5) / company.formationSteps.length) * 100;
  };

  // Duruma göre renk döndüren yardımcı fonksiyon
  const getStatusColor = (status: FormationStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-[--accent] bg-[--accent]/10';
      case 'in_progress':
        return 'text-[--primary] bg-[--primary]/10';
      default:
        return 'text-gray-400 bg-gray-100';
    }
  };

  // Adım ikonunu döndüren yardımcı bileşen
  const GetStepIcon = ({ icon }: { icon: string }) => {
    switch (icon) {
      case 'FileText':
        return <FileText className="text-[--primary]" size={24} />;
      case 'Briefcase':
        return <Briefcase className="text-[--primary]" size={24} />;
      default:
        return <FileText className="text-[--primary]" size={24} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-[--primary] to-blue-600 rounded-xl shadow-lg p-6 md:p-8 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-blue-100">
            We're currently processing your company formation. Track the progress below.
          </p>
        </div>

        {
          companies?.map((company) => (
            <div key={company.companyId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[--primary]/10">
                  <Building2 className="text-[--primary]" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Company Name</h3>
                  <p className="text-gray-600">
                    {company.companyName}
                  </p>
                </div>
              </div>
            </div>
          ))
        }

        {/* Eksik Bilgiler Card */}
        <div className="flex items-start px-6 py-4 border-b border-gray-200">
          <div className="p-3 rounded-full">
            <Building2 className="text-[--accent]" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Eksik Bilgiler var</h3>
              <span
                className="text-sm font-medium capitalize text-[--primary] text-blue-400 cursor-pointer"
                onClick={() =>
                  navigate('/after-billing', { replace: true, state: { planId: 'platinum' } })
                }
              >
                Soruları cevapla
              </span>
            </div>
            <p className="text-gray-600">
              Şirket kurulumuna devam edebilmemiz için bazı bilgileri paylaşman gerekiyor.
            </p>
          </div>
        </div>

        {/* Formation Progress Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Formation Progress</h2>
              <span className="text-sm font-medium text-[--primary]">
                {Math.round(getProgressWidth())}% Complete
              </span>
            </div>
            {/* Progress Bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[--primary] transition-all duration-500 ease-out"
                style={{ width: `${getProgressWidth()}%` }}
              />
            </div>
          </div>

          {/* Formation Steps */}
          <div className="divide-y divide-gray-200">
            {company?.formationSteps && company?.formationSteps?.map((step) => (
              <div
                key={step.id}
                className={`p-6 transition-colors duration-200 ${
                  step.status === 'in_progress' ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${getStatusColor(step.status)}`}>
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="text-[--accent]" size={24} />
                    ) : step.status === 'in_progress' ? (
                      <div className="animate-pulse">
                        <GetStepIcon icon={step.icon || 'FileText'} />
                      </div>
                    ) : (
                      <GetStepIcon icon={step.icon || 'FileText'} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      <span
                        className={`text-sm font-medium capitalize ${
                          step.status === 'completed'
                            ? 'text-[--accent]'
                            : step.status === 'in_progress'
                            ? 'text-[--primary]'
                            : 'text-gray-400'
                        }`}
                      >
                        {step.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Company Type */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[--primary]/10">
                <Building2 className="text-[--primary]" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Company Type</h3>
                <p className="text-gray-600">
                  {company?.companyType}
                </p>
              </div>
            </div>
          </div>

          {/* Company Name */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[--primary]/10">
                <Building2 className="text-[--primary]" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Company Name</h3>
                <p className="text-gray-600">
                  {company?.companyName}
                </p>
              </div>
            </div>
          </div>

          {/* Registration State */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[--primary]/10">
                <MapPin className="text-[--primary]" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Registration State</h3>
                <p className="text-gray-600">{company?.state}</p>
              </div>
            </div>
          </div>

          {/* Selected Package */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[--primary]/10">
                <Package className="text-[--primary]" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Selected Package</h3>
                <p className="text-gray-600 capitalize">
                  {company.purchasedPricingPlan || 'No package selected'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
