import { useEffect, useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Package,
  CheckCircle2,
  FileText,
  Briefcase
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { PricingPlan } from '../../utils/plans';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { CompanyResponse, FormationStep } from '../../types/Company';
import { getCompanyDetails } from '../../http/requests/formation';
import { setActiveCompany } from '../../store/slices/companySlice';

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

  // if (error) {
  //   return (
  //     <DashboardLayout>
  //       <div className="p-4 text-center text-red-500">{error}</div>
  //     </DashboardLayout>
  //   );
  // }

  // if (!company) {
  //   return (
  //     <DashboardLayout>
  //       <div className="p-4 text-center">No company found</div>
  //     </DashboardLayout>
  //   );
  // }

  // Hesaplanabilir progress width değeri (formation adımları varsa hesaplanır)
  
  // const getProgressWidth = () => {
  //   if (!company.formationSteps.length) return 0;
  //   const completedSteps = company.formationSteps.filter(
  //     (step) => step.status === 'completed'
  //   ).length;
  //   const inProgressSteps = company.formationSteps.filter(
  //     (step) => step.status === 'in_progress'
  //   ).length;
  //   return ((completedSteps + inProgressSteps * 0.5) / company.formationSteps.length) * 100;
  // };

  // Duruma göre renk döndüren yardımcı fonksiyon
  // const getStatusColor = (status: FormationStep['status']) => {
  //   switch (status) {
  //     case 'completed':
  //       return 'text-[--accent] bg-[--accent]/10';
  //     case 'in_progress':
  //       return 'text-[--primary] bg-[--primary]/10';
  //     default:
  //       return 'text-gray-400 bg-gray-100';
  //   }
  // };

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
      <main id="main-content">
        <header
          id="header"
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-neutral-500">
              Welcome back, John Doe
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
              <i className="fa-regular fa-bell w-5 h-5" />
            </button>
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=123"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Order Status Section */}
        <section
          id="order-status"
          className="bg-white rounded-lg shadow-sm p-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-4">
            Company Formation Status
          </h2>
          <div className="space-y-6">
            <div className="relative">
              <div className="h-2 bg-neutral-200 rounded">
                <div
                  className="h-2 bg-neutral-600 rounded"
                  style={{ width: "60%" }}
                ></div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fa-solid fa-check text-white text-sm" />
                  </div>
                  <p className="text-sm font-medium">Review</p>
                  <p className="text-xs text-neutral-500">20%</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fa-solid fa-check text-white text-sm" />
                  </div>
                  <p className="text-sm font-medium">Processing</p>
                  <p className="text-xs text-neutral-500">40%</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-neutral-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fa-solid fa-spinner text-white text-sm" />
                  </div>
                  <p className="text-sm font-medium">Forwarded</p>
                  <p className="text-xs text-neutral-500">60%</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fa-solid fa-flag text-white text-sm" />
                  </div>
                  <p className="text-sm font-medium">Completed</p>
                  <p className="text-xs text-neutral-500">100%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Recent Documents */}
          <section
            id="recent-documents"
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Documents</h2>
              <button className="text-sm text-neutral-600 hover:text-neutral-900">
                View all
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-3 hover:bg-neutral-50 rounded-lg">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fa-regular fa-file-pdf text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Articles of Organization.pdf
                  </p>
                  <p className="text-xs text-neutral-500">
                    Updated 2 days ago
                  </p>
                </div>
                <button className="p-2 text-neutral-400 hover:text-neutral-600">
                  <i className="fa-solid fa-download" />
                </button>
              </div>
              <div className="flex items-center p-3 hover:bg-neutral-50 rounded-lg">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fa-regular fa-file-word text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Operating Agreement.doc
                  </p>
                  <p className="text-xs text-neutral-500">
                    Updated 5 days ago
                  </p>
                </div>
                <button className="p-2 text-neutral-400 hover:text-neutral-600">
                  <i className="fa-solid fa-download" />
                </button>
              </div>
            </div>
          </section>

          {/* Upcoming Tasks */}
          <section
            id="upcoming-tasks"
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Upcoming Tasks</h2>
              <button className="text-sm text-neutral-600 hover:text-neutral-900">
                View all
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-3 hover:bg-neutral-50 rounded-lg">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fa-solid fa-calendar-check text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Annual Report Filing</p>
                  <p className="text-xs text-neutral-500">Due in 5 days</p>
                </div>
                <span className="px-2 py-1 text-xs bg-neutral-100 rounded-full">
                  High Priority
                </span>
              </div>
              <div className="flex items-center p-3 hover:bg-neutral-50 rounded-lg">
                <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fa-solid fa-file-signature text-neutral-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Document Review</p>
                  <p className="text-xs text-neutral-500">Due in 1 week</p>
                </div>
                <span className="px-2 py-1 text-xs bg-neutral-100 rounded-full">
                  Medium Priority
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Company Info */}
        <section
          id="company-info"
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Active Company Information</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div>
                <p className="text-sm text-neutral-500">Company Name</p>
                <p className="font-medium">Acme Corporation</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Company Type</p>
                <p className="font-medium">LLC</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Registration Date</p>
                <p className="font-medium">Jan 15, 2025</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Status</p>
                <p className="font-medium">Active</p>
              </div>
              <button className="px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-lg">
                View Details
              </button>
            </div>
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
}
