import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  FileText,
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  DollarSign,
  Bell
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AddonsProps } from '../../types/FormData';
import { addAddon } from '../../store/slices/checkoutSlice';
import { useAppDispatch } from '../../store/hooks';

export default function AnnualReportFiling({addonData,prevStep, nextStep }: AddonsProps) {
  const [includeService, setIncludeService] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const SERVICE_FEE = 150;

  const dispatch = useAppDispatch();

  const handleContinue = async () => {
    if (includeService === null) return;

    setLoading(true);
    try { 
      if(includeService){
           dispatch(addAddon({ productId: addonData.productId, selectedPriceId:null ,productTier:null,productName:addonData.productName,price:addonData.basePrice}));
      }
      if (nextStep) nextStep();
    } catch (error) {
      console.error('Error saving annual report selection:', error);
      toast.error('Failed to save your selection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid md:grid-cols-2 grid-cols-1">
      {/* Left Side - Service Selection */}
      <div className="bg-white p-8 flex items-center">
        <div className="max-w-xl mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <img
              src="https://registate.betterwp.site/wp-content/uploads/2025/01/registate-logo.webp"
              alt="Registate"
              className="h-8 mb-6"
            />
            <h1 className="text-3xl font-bold mb-2">Annual Report Filing Service</h1>
            <p className="text-gray-600">
              Stay compliant with state requirements and never miss a deadline
            </p>
          </div>

          {/* Service Fee Banner */}
          <div className="bg-[--primary]/5 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign size={24} className="text-[--primary]" />
                <div>
                  <p className="text-sm text-gray-600">Annual Service Fee</p>
                  <p className="text-2xl font-bold">${SERVICE_FEE}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-[--primary]">
                <Shield size={16} />
                <span>Includes state fees</span>
              </div>
            </div>
          </div>

          {/* Selection Options */}
          <div className="space-y-4 mb-8">
            {/* Yes Option */}
            <div
              onClick={() => setIncludeService(true)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${includeService === true
                  ? 'border-[--primary] bg-[--primary]/5 shadow-md'
                  : 'border-gray-200 hover:border-[--primary]/30 hover:shadow-sm'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${includeService === true
                    ? 'border-[--primary] bg-[--primary]'
                    : 'border-gray-300'
                  }`}
                >
                  {includeService === true && (
                    <CheckCircle2 className="text-white" size={14} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-lg">
                    Yes, I want Registate to handle my annual report filings
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Includes state fees and compliance monitoring
                  </p>
                </div>
              </div>
            </div>

            {/* No Option */}
            <div
              onClick={() => setIncludeService(false)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${includeService === false
                  ? 'border-[--primary] bg-[--primary]/5 shadow-md'
                  : 'border-gray-200 hover:border-[--primary]/30 hover:shadow-sm'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${includeService === false
                    ? 'border-[--primary] bg-[--primary]'
                    : 'border-gray-300'
                  }`}
                >
                  {includeService === false && (
                    <CheckCircle2 className="text-white" size={14} />
                  )}
                </div>
                <p className="font-medium text-lg">
                  No, I'll handle annual reports myself
                </p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          {includeService === false && (
            <div className="flex items-start gap-3 bg-amber-50 text-amber-800 p-5 rounded-xl border border-amber-100 mb-8">
              <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
              <p>
                Missing annual report deadlines can result in penalties, late fees, or even 
                administrative dissolution of your company. Consider our service to ensure 
                timely compliance.
              </p>
            </div>
          )}

          {/* Key Benefits */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-[--primary]/30 transition-colors">
              <Calendar className="text-[--primary] mb-2" size={24} />
              <h4 className="font-semibold mb-1">Never Miss a Deadline</h4>
              <p className="text-sm text-gray-600">Automatic deadline tracking</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 hover:border-[--primary]/30 transition-colors">
              <Bell className="text-[--primary] mb-2" size={24} />
              <h4 className="font-semibold mb-1">Compliance Alerts</h4>
              <p className="text-sm text-gray-600">Stay informed of requirements</p>
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={loading || includeService === null}
            className="w-full bg-[--primary] text-white py-3 px-6 rounded-xl font-medium
              transition-all duration-200 hover:bg-[--primary]/90 disabled:opacity-50 
              disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : 'Continue'} 
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Right Side - Information */}
      <div className="bg-[#1649FF]/5 p-8 flex items-center">
        <div className="max-w-xl mx-auto w-full space-y-6">
          {/* What's Included */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">What's Included?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[--accent] mt-1" size={20} />
                <div>
                  <p className="font-semibold">Annual Report Preparation & Filing</p>
                  <p className="text-sm text-gray-600 mt-1">
                    We prepare and submit your annual report to the state
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[--accent] mt-1" size={20} />
                <div>
                  <p className="font-semibold">State Fee Coverage</p>
                  <p className="text-sm text-gray-600 mt-1">
                    All state filing fees are included in the service
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[--accent] mt-1" size={20} />
                <div>
                  <p className="font-semibold">Compliance Monitoring</p>
                  <p className="text-sm text-gray-600 mt-1">
                    We track deadlines and requirements for you
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-[--accent] mt-1" size={20} />
                <div>
                  <p className="font-semibold">Email Notifications</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Get alerts about upcoming deadlines and filing status
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">Annual Report Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-[--primary]" />
                  <span>Preparation</span>
                </div>
                <span className="text-sm text-gray-600">30 days before due date</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-[--primary]" />
                  <span>Review Period</span>
                </div>
                <span className="text-sm text-gray-600">2 weeks before due date</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-[--accent]" />
                  <span>Filing</span>
                </div>
                <span className="text-sm text-gray-600">1 week before due date</span>
              </div>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-[--primary]/10">
            <div className="flex items-start gap-3">
              <Shield className="text-[--primary] flex-shrink-0" size={20} />
              <div>
                <h4 className="font-semibold text-[--primary] mb-1">Pro Tip</h4>
                <p className="text-sm text-gray-600">
                  Late or missed annual reports can result in penalties of up to $400 
                  and potential administrative dissolution. Our service helps you avoid 
                  these costly mistakes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
