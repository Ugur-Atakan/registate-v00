import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  Zap,
  Clock,
  ArrowRight,
  Shield,
  CheckCircle2,
  Calendar,
  DollarSign,
  Timer
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AddonsProps } from '../../types/FormData';

type FilingSpeed = 'standard' | '24hour' | 'sameday';

interface FilingOption {
  id: FilingSpeed;
  name: string;
  description: string;
  processingTime: string;
  additionalFee: number;
  icon: React.ElementType;
}

export default function ExpeditedFiling({ formData, setFormData, prevStep, nextStep }: AddonsProps) {
  const { user } = useAuth();
  const [selectedSpeed, setSelectedSpeed] = useState<FilingSpeed>('standard');
  const [loading, setLoading] = useState(false);

  const STATE_FEE = 109;

  const filingOptions: FilingOption[] = [
    {
      id: 'standard',
      name: 'Standard Processing',
      description: 'Standard processing with regular state filing fees',
      processingTime: '3-5 weeks',
      additionalFee: 0,
      icon: Calendar
    },
    {
      id: '24hour',
      name: '24-Hour Filing',
      description: 'Expedited processing within 24 hours',
      processingTime: '24 hours',
      additionalFee: 50,
      icon: Clock
    },
    {
      id: 'sameday',
      name: 'Same-Day Filing',
      description: 'Ultra-fast processing on the same business day',
      processingTime: 'Same business day',
      additionalFee: 100,
      icon: Zap
    }
  ];

  const handleContinue = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const selectedOption = filingOptions.find(option => option.id === selectedSpeed);
      const filingFee = STATE_FEE + (selectedOption?.additionalFee || 0);
      // Yerel formData state'ine upsell ürünü ekleme
      setFormData({
        ...formData,
        upsellProducts: [
          ...(formData.upsellProducts || []),
          { filingSpeed: selectedSpeed, filingFee: filingFee }
        ]
      });

      if (nextStep) nextStep();
      
    } catch (error) {
      console.error('Error saving filing speed:', error);
      toast.error('Failed to save your selection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid md:grid-cols-2 grid-cols-1">
      {/* Left Side - Filing Options */}
      <div className="bg-white p-6 md:p-8 flex flex-col h-full">
        <div className="max-w-xl mx-auto w-full flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0">
            <img
              src="https://registate.betterwp.site/wp-content/uploads/2025/01/registate-logo.webp"
              alt="Registate"
              className="h-8 mb-6"
            />
            <h1 className="text-2xl font-bold mb-2">Choose Your Filing Speed</h1>
            <p className="text-gray-600 mb-6">
              Select how quickly you want your company to be filed with the state
            </p>
          </div>

          {/* State Fee Banner */}
          <div className="bg-[--primary]/5 rounded-xl p-4 mb-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign size={24} className="text-[--primary]" />
                <div>
                  <p className="text-sm text-gray-600">State Filing Fee</p>
                  <p className="text-2xl font-bold">${STATE_FEE}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-[--primary]">
                <Shield size={16} />
                <span>Required by state</span>
              </div>
            </div>
          </div>

          {/* Filing Options */}
          <div className="flex-1 grid gap-4 mb-6">
            {filingOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setSelectedSpeed(option.id)}
                className={`relative rounded-xl p-4 cursor-pointer transition-all duration-300
                  ${selectedSpeed === option.id
                    ? 'bg-[--primary]/5 border-2 border-[--primary]'
                    : 'bg-white border-2 border-gray-100 hover:border-[--primary]/30'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${selectedSpeed === option.id ? 'bg-white' : 'bg-gray-50'}`}>
                    <option.icon
                      size={20}
                      className={selectedSpeed === option.id ? 'text-[--primary]' : 'text-gray-400'}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{option.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Timer size={14} />
                          <span>{option.processingTime}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {option.additionalFee > 0 ? (
                          <div className="text-lg font-bold text-[--primary]">
                            +${option.additionalFee}
                          </div>
                        ) : (
                          <span className="text-sm text-green-600 font-medium">
                            No extra fee
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={loading}
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
      <div className="bg-[#1649FF]/5 p-6 md:p-8 flex items-center">
        <div className="max-w-xl mx-auto w-full space-y-6">
          {/* Processing Time Comparison */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">Why Choose Expedited Filing?</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="text-[--accent] mt-1" size={16} />
                  <span className="text-sm text-gray-600">Start operations sooner</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="text-[--accent] mt-1" size={16} />
                  <span className="text-sm text-gray-600">Open bank accounts faster</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="text-[--accent] mt-1" size={16} />
                  <span className="text-sm text-gray-600">Begin hiring earlier</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="text-[--accent] mt-1" size={16} />
                  <span className="text-sm text-gray-600">Priority processing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Speed Comparison */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4">Processing Time Comparison</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-gray-400" />
                  <span className="text-sm">Standard</span>
                </div>
                <span className="text-sm text-gray-600">3-5 weeks</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-[--primary]" />
                  <span className="text-sm">24-Hour</span>
                </div>
                <span className="text-sm text-[--primary] font-medium">24 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-[--accent]" />
                  <span className="text-sm">Same-Day</span>
                </div>
                <span className="text-sm text-[--accent] font-medium">Same day</span>
              </div>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-[--primary]/10">
            <div className="flex items-start gap-3">
              <Shield className="text-[--primary] flex-shrink-0" size={20} />
              <p className="text-sm text-gray-600">
                Consider expedited filing if you need to open bank accounts or sign contracts soon. 
                Get your formation documents faster with priority processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
