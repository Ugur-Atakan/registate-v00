import { Building2, Briefcase, FileText, CheckCircle2, Clock, 
  XCircle, ChevronDown 
} from 'lucide-react';
import { useEffect, useState } from 'react';
import instance from '../../../../http/instance';
import toast from 'react-hot-toast';
import { FormationStep } from '../../../../types/Company';

interface SectionProps {
  companyId: string;
}

const updateCompanyFormationStepStatus = async (companyId: string, step: string, status: string) => {
  const response = await instance.put(`/admin/company/${companyId}/formation-step`, {
    step,
    status
  });
  return response.data;
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

const getStepStatusIcon = (status: string) => {
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

export default function CompanyFormationStepsSection({companyId}: SectionProps) {
  const [formationSteps, setFormationSteps] = useState<any[]>([]);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  const fetchCompanyDetails = async () => {
    setLoading(true);
    try {
      const response = await instance.get(`/admin/company/${companyId}/details`);
      if (response.data.formationSteps) {
        setFormationSteps([...response.data.formationSteps].sort((a, b) => a.order - b.order));
      }
    } catch (error) {
      console.error("Error fetching company details", error);
      toast.error("Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

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

    useEffect(() => {
      if (companyId) {
        fetchCompanyDetails();
      }
    }, [companyId]);

    return (


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


    )
}
