import { useState } from 'react';
import { 
  ArrowRight,
  Shield,
  CheckCircle2,
  Building2,
  Users,
  Briefcase,
  AlertCircle,
  CreditCard,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AddonsProps } from '../../types/FormData';
import { useAppDispatch } from '../../store/hooks';
import { addAddon } from '../../store/slices/checkoutSlice';

export default function EIN({addonData,prevStep,nextStep }: AddonsProps) {
  const [includeEIN, setIncludeEIN] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const EIN_FEE = 70;

  const dispatch=useAppDispatch();

  const handleContinue = async () => {
    if (includeEIN === null) return;

    setLoading(true);
    try {
      // Yerel formData state'ini güncellemek için: mevcut upsellProducts dizisine yeni EIN ürünü ekleniyor.
      dispatch(addAddon({productId:addonData.productId,selectedPriceId:null,productName: addonData.productName,productTier:null,price:addonData.basePrice}));
      if (nextStep) nextStep();

    } catch (error) {
      console.error('Error saving EIN selection:', error);
      toast.error('Failed to save your selection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 grid-cols-1">
      {/* Left Side - EIN Selection */}
      <div className="bg-white p-8 md:p-12 flex flex-col min-h-screen">
        <div className="max-w-xl mx-auto w-full flex flex-col flex-1">
          {/* Header */}
          <div>
            <img
              src="https://registate.betterwp.site/wp-content/uploads/2025/01/registate-logo.webp"
              alt="Registate"
              className="h-8 mb-8"
            />
            <h1 className="text-3xl font-bold mb-3">EIN Number</h1>
            <p className="text-gray-600 text-lg mb-8">
              Secure Your Employer Identification Number Effortlessly
            </p>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-8">
              {/* Selection Boxes */}
              <div className="space-y-4">
                {/* Yes Option */}
                <div
                  onClick={() => setIncludeEIN(true)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                    ${includeEIN === true
                      ? 'border-[--primary] bg-[--primary]/5 shadow-md'
                      : 'border-gray-200 hover:border-[--primary]/30 hover:shadow-sm'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${includeEIN === true
                        ? 'border-[--primary] bg-[--primary]'
                        : 'border-gray-300'
                      }`}
                    >
                      {includeEIN === true && (
                        <CheckCircle2 className="text-white" size={14} />
                      )}
                    </div>
                    <p className="font-medium text-lg">
                      Yes, I would like Registate to obtain my EIN electronically for ${EIN_FEE}
                    </p>
                  </div>
                </div>

                {/* No Option */}
                <div
                  onClick={() => setIncludeEIN(false)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                    ${includeEIN === false
                      ? 'border-[--primary] bg-[--primary]/5 shadow-md'
                      : 'border-gray-200 hover:border-[--primary]/30 hover:shadow-sm'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${includeEIN === false
                        ? 'border-[--primary] bg-[--primary]'
                        : 'border-gray-300'
                      }`}
                    >
                      {includeEIN === false && (
                        <CheckCircle2 className="text-white" size={14} />
                      )}
                    </div>
                    <p className="font-medium text-lg">
                      No, I don't need Registate to obtain my EIN
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning Message */}
              {includeEIN === false && (
                <div className="flex items-start gap-3 bg-amber-50 text-amber-800 p-5 rounded-xl border border-amber-100">
                  <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
                  <p>
                    Without an EIN, you may face delays in opening bank accounts and hiring employees.
                    Consider adding this essential service to streamline your business setup.
                  </p>
                </div>
              )}

              {/* Key Benefits */}
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-[--primary]/30 transition-colors">
                  <CreditCard className="text-[--primary] mb-3" size={24} />
                  <h4 className="font-semibold text-lg mb-2">Bank Ready</h4>
                  <p className="text-gray-600">Open accounts immediately</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-[--primary]/30 transition-colors">
                  <Users className="text-[--primary] mb-3" size={24} />
                  <h4 className="font-semibold text-lg mb-2">Hire Employees</h4>
                  <p className="text-gray-600">Start building your team</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 hover:border-[--primary]/30 transition-colors">
                  <Clock className="text-[--primary] mb-3" size={24} />
                  <h4 className="font-semibold text-lg mb-2">Fast Processing</h4>
                  <p className="text-gray-600">Get your EIN quickly</p>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={loading || includeEIN === null}
              className="w-full bg-[--primary] text-white py-4 px-6 rounded-xl font-medium text-lg
                transition-all duration-200 hover:bg-[--primary]/90 disabled:opacity-50 
                disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
            >
              {loading ? 'Processing...' : 'Continue'} 
              <ArrowRight size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Information */}
      <div className="bg-[#1649FF]/5 p-8 md:p-12 flex items-center">
        <div className="max-w-xl mx-auto w-full space-y-8">
          {/* What is EIN? */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-2xl font-bold mb-4">What is an EIN?</h3>
            <p className="text-gray-600 text-lg mb-8">
              An Employer Identification Number (EIN) is a unique nine-digit number assigned by the IRS to identify your business.
              Think of it as a Social Security Number for your company.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Building2 className="text-[--primary] mt-1" size={20} />
                  <span className="text-gray-600">Required for business bank accounts</span>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="text-[--primary] mt-1" size={20} />
                  <span className="text-gray-600">Needed for hiring employees</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Briefcase className="text-[--primary] mt-1" size={20} />
                  <span className="text-gray-600">Essential for tax filing</span>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="text-[--primary] mt-1" size={20} />
                  <span className="text-gray-600">Protects your SSN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Our Service */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h3 className="text-2xl font-bold mb-6">Why Choose Our Service?</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-[--accent] mt-1" size={24} />
                <div>
                  <p className="font-semibold text-lg">Expert Application Handling</p>
                  <p className="text-gray-600 mt-1">
                    Our professionals ensure accurate and timely filing.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-[--accent] mt-1" size={24} />
                <div>
                  <p className="font-semibold text-lg">Save Time and Effort</p>
                  <p className="text-gray-600 mt-1">
                    Skip the paperwork and complex IRS procedures.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-[--accent] mt-1" size={24} />
                <div>
                  <p className="font-semibold text-lg">Quick Processing</p>
                  <p className="text-gray-600 mt-1">
                    Receive your EIN in as little as one business day.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
