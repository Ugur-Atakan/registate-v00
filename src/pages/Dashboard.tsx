import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
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

interface UserData {
  companyType: string;
  registrationState: string;
  companyName: string;
  companyDesignator: string;
  selectedPlan: PricingPlan;
}

interface FormationStep {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  icon: React.ElementType;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 // BURASI BACKENDDEN GELECEK
  const formationSteps: FormationStep[] = [
    {
      id: 1,
      title: 'Application Review',
      description: 'Your company formation request has been received and verified',
      status: 'completed',
      icon: FileText
    },
    {
      id: 2,
      title: 'State Filing',
      description: 'Filing your company documents with the state',
      status: 'in-progress',
      icon: Building2
    },
    {
      id: 3,
      title: 'EIN Application',
      description: 'Applying for your Federal Tax ID (EIN)',
      status: 'pending',
      icon: Briefcase
    },
    {
      id: 4,
      title: 'Document Preparation',
      description: 'Preparing your company documents and compliance materials',
      status: 'pending',
      icon: FileText
    }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const data = userDoc.data() as UserData;
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const getStatusColor = (status: FormationStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-[--accent] bg-[--accent]/10';
      case 'in-progress':
        return 'text-[--primary] bg-[--primary]/10';
      default:
        return 'text-gray-400 bg-gray-100';
    }
  };

  const getProgressWidth = () => {
    const completedSteps = formationSteps.filter(
      step => step.status === 'completed'
    ).length;
    const inProgressSteps = formationSteps.filter(
      step => step.status === 'in-progress'
    ).length;
    
    return ((completedSteps + inProgressSteps * 0.5) / formationSteps.length) * 100;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-[--primary] to-blue-600 rounded-xl shadow-lg p-6 md:p-8 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {user?.displayName?.split(' ')[0]}
          </h1>
          <p className="text-blue-100">
            We're currently processing your company formation. Track the progress below.
          </p>
        </div>

        <div className="flex items-start px-6 py-4 border-b border-gray-200 border border-gray-200">
                  <div className={`p-3 rounded-full`}>
                    <Building2 className="text-[--accent]" size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mx-auto justify-center">
                      <h3 className="font-semibold">Eksik Bilgiler var</h3>
                      <span className={"text-sm font-medium capitalize text-[--primary] text-blue-400"} onClick={() => navigate('/after-billing', { replace: true, state: { planId: 'platinum' } })}>
                       Soruları cevapla
                      </span>
                    </div>
                    <p className="text-gray-600">Şirket kurulumuna devam edebilmemiz için bazı bilgieri paylaşman gerekiyor</p>
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



          
          {/* Steps */}
          <div className="divide-y divide-gray-200">

            
            {formationSteps.map((step, index) => (
              <div 
                key={step.id}
                className={`p-6 transition-colors duration-200 ${
                  step.status === 'in-progress' ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${getStatusColor(step.status)}`}>
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="text-[--accent]" size={24} />
                    ) : step.status === 'in-progress' ? (
                      <div className="animate-pulse">
                        <step.icon className="text-[--primary]" size={24} />
                      </div>
                    ) : (
                      <step.icon size={24} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      <span className={`text-sm font-medium capitalize ${
                        step.status === 'completed' 
                          ? 'text-[--accent]' 
                          : step.status === 'in-progress'
                          ? 'text-[--primary]'
                          : 'text-gray-400'
                      }`}>
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
                  {userData?.companyType} in {userData?.registrationState}
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
                  {userData?.companyName} {userData?.companyDesignator}
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
                <p className="text-gray-600">{userData?.registrationState}</p>
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
                <p className="text-gray-600 capitalize">{userData?.selectedPlan} Plan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}