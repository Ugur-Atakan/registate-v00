import { useEffect, useState } from 'react';
import { Building2, FileText, Clock, ArrowRight,AlertCircle,  File, AArrowDown as Pdf, ExternalLink, BarChart3 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { CompanyResponse } from '../../types/Company';
import { setActiveCompany } from '../../store/slices/companySlice';
import { setActiveCompanyId } from '../../utils/storage';
import { getCompanyDetails, getCompanyDocuments, getCompanyTasks } from '../../http/requests/companyRequests';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<CompanyResponse | null>(null);
  const [tasks,setTasks]=useState([]);
  const [documents,setDocuments]=useState([]);


  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const companies = useAppSelector((state) => state.company.companies);
  const user = useAppSelector((state) => state.user.userData);


  const fetchDocs=async()=>{
    try {
      const docs= await getCompanyDocuments();
      setDocuments(docs);
    } catch (error:any) {
      console.error('Error fetching company documents:', error);
      setError(error.message || 'Failed to fetch company documents.');
    }
  }

  const fetchTasks=async()=>{
    try {
      const tasks= await getCompanyTasks();
      setTasks(tasks);
    } catch (error:any) {
      console.error('Error fetching company tasks:', error);
      setError(error.message || 'Failed to fetch company tasks.');
    }
  }


  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!companies?.length) {
        setError('No companies available.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const companyDetails = await getCompanyDetails(companies[0].companyId);
        dispatch(setActiveCompany(companyDetails));
        setCompany(companyDetails);
        setActiveCompanyId(companies[0].companyId);
      } catch (err: any) {
        console.error('Error fetching company details:', err);
        setError(err.message || 'Failed to fetch company details.');
      } finally {
        setLoading(false);
      }
    };


    fetchCompanyDetails();
    fetchDocs();
    fetchTasks();
  }, [companies, dispatch]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'text-red-600 bg-red-50';
      case 'MEDIUM':
        return 'text-yellow-600 bg-yellow-50';
      case 'LOW':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-gray-500">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[--primary] to-blue-600 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, {user.firstName}! 👋
              </h1>
              <p className="text-blue-100">
                Here's what's happening with your business today
              </p>
            </div>
            <div className="hidden md:block">
              <BarChart3 size={48} className="text-white/20" />
            </div>
          </div>
        </div>

        {/* Company Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[--primary]/10 rounded-lg">
                <Building2 className="w-5 h-5 text-[--primary]" />
              </div>
              <h2 className="text-lg font-semibold">Company Information</h2>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              company?.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
            }`}>
              {company?.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Company Name</p>
              <p className="font-medium">{company?.companyName}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Company Type</p>
              <p className="font-medium">{company?.companyType}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Registration State</p>
              <p className="font-medium">{company?.state}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Registration Date</p>
              <p className="font-medium">{formatDate(company?.createdAt || '')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[--primary]/10 rounded-lg">
                  <Clock className="w-5 h-5 text-[--primary]" />
                </div>
                <h2 className="text-lg font-semibold">Upcoming Tasks</h2>
              </div>
              <button 
                onClick={() => navigate('/dashboard/tasks')}
                className="text-sm text-[--primary] hover:text-[--primary]/80 flex items-center gap-1"
              >
                View all <ArrowRight size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {tasks.map((task:any) => (
                <div 
                  key={task.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/tasks/details`, { state: { taskId: task.id } })}
                >
                  <div className={`p-2 rounded-lg ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'HIGH' ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        Due {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[--primary]/10 rounded-lg">
                  <FileText className="w-5 h-5 text-[--primary]" />
                </div>
                <h2 className="text-lg font-semibold">Recent Documents</h2>
              </div>
              <button 
                onClick={() => navigate('/dashboard/documents')}
                className="text-sm text-[--primary] hover:text-[--primary]/80 flex items-center gap-1"
              >
                View all <ArrowRight size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {documents.map((doc:any) => (
                <div 
                  key={doc.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    {doc.fileType === 'pdf' ? (
                      <Pdf className="w-5 h-5" />
                    ) : (
                      <File className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{doc.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Updated {formatDate(doc.updatedAt)}
                    </p>
                  </div>
                  <a 
                    href={doc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-[--primary] transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
   </DashboardLayout>
  );
}