import { useState } from 'react';
import { Building2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCompanyInfo } from '../../store/slices/checkoutSlice';
import { useNavigate } from 'react-router-dom';

type Designator = string;

interface CompanyNameProps {
  prevStep?: () => void;
  nextStep?: () => void;
}

const llcDesignators = ['LLC', 'L.L.C.', 'Limited Liability Company'];
const corpDesignators = ['Inc.', 'Incorporated', 'Corp.', 'Corporation', 'Co.'];

export default function CompanyName({nextStep }: CompanyNameProps) {
  const [companyName, setCompanyName] = useState('');
  const [selectedDesignator, setSelectedDesignator] = useState<Designator>('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  const selectedCompanyType = useAppSelector((state) => state.checkout.companyType);

  const dispatch=useAppDispatch();

  const handleHelpNameChoice = () => {
    navigate('/name-guide');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleConfirm = async () => {
    if (!companyName || !selectedDesignator) return;
    setLoading(true);
    try {
      dispatch(setCompanyInfo({companyName,designator:selectedDesignator}));

      triggerConfetti();
      setTimeout(() => {
       nextStep && nextStep();
      }, 1000);
    } catch (error) {
      console.error('Error saving company name:', error);
      toast.error('Failed to save company name. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDesignators = () => {
    return selectedCompanyType.name === 'LLC' ? llcDesignators : corpDesignators;
  };

  return (
    <div className="auth-container">
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div>
            <img
              src="https://registate.betterdemo.com.tr/wp-content/uploads/2025/01/registate-logo.webp"
              alt="Registate"
              className="h-12 mb-8"
            />
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Choose Your Company Name</h1>
            <p className="text-gray-600">Select a unique name and legal designator for your business</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={handleNameChange}
                />
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[--accent]" />
                We'll check name availability for you
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Legal Designator
              </label>
              <div className="grid grid-cols-2 gap-3">
                {getDesignators().map((designator) => (
                  <button
                    key={designator}
                    onClick={() => setSelectedDesignator(designator)}
                    className={`p-3 rounded-lg border-2 text-center transition-all duration-300
                      ${selectedDesignator === designator
                        ? 'border-[--primary] bg-[--primary]/5 text-[--primary]'
                        : 'border-gray-200 hover:border-[--primary]/30'}`}
                  >
                    {designator}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!companyName || !selectedDesignator || loading}
              className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                'Saving...'
              ) : (
                <>
                  Confirm Company Name <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="auth-image-side !bg-[#1649FF]/5">
        <div className="w-full max-w-2xl p-8">
          <div className="relative">
            <div className={`bg-white p-8 rounded-xl shadow-sm border border-[--primary]/10 transform transition-all duration-500
              ${isTyping ? 'translate-y-2' : 'translate-y-0'}`}>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-24 h-8 bg-[--primary]/10 rounded" />
                  <div className="w-32 h-12 bg-[--primary]/5 rounded" />
                </div>
                
                <div className="space-y-4">
                  <div className="h-px bg-gray-200" />
                  
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-center space-y-2">
                      <p className="text-gray-500 text-sm">COMPANY NAME</p>
                      <h2 className="text-2xl font-bold text-[--primary]">
                        {companyName || 'Your Company Name'} {selectedDesignator}
                      </h2>
                    </div>
                  </div>
                  
                  <div className="h-px bg-gray-200" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="h-8 bg-[--primary]/5 rounded" />
                  <div className="h-8 bg-[--primary]/5 rounded" />
                </div>

                <div className="space-y-2">
                  <div className="h-4 bg-[--primary]/5 rounded w-3/4" />
                  <div className="h-4 bg-[--primary]/5 rounded w-1/2" />
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[--accent]/10 rounded-full" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-[--primary]/10 rounded-full" />
          </div>

          <div className="mt-8 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Naming Guidelines</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[--accent] mt-1" size={18} />
                  <span>Must be distinguishable from existing businesses</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[--accent] mt-1" size={18} />
                  <span>Cannot include restricted words without approval</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-[--accent] mt-1" size={18} />
                  <span>Must include appropriate legal designator</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-[--primary]/10">
              <h3 className="font-semibold text-[--primary] mb-2">Pro Tip</h3>
              <p className="text-gray-700">
                Choose a name that's memorable and reflects your business values. 
                Consider trademark availability and domain name options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}