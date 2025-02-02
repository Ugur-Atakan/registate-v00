import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  Mail,
  ArrowRight,
  CheckCircle2,
  Scan,
  Package,
  Shield,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AddonsProps } from '../../types/FormData';

type MailboxPlan = 'basic' | 'standard' | 'premium';

interface MailboxPackage {
  id: MailboxPlan;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export default function VirtualMailbox({ formData, setFormData, nextStep }: AddonsProps) {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<MailboxPlan | null>(null);
  const [loading, setLoading] = useState(false);

  // Tüm mailbox paketleri
  const packages: MailboxPackage[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 120,
      features: [
        '1 incoming item / month',
        '1 scan / month',
        '$1.20 / item for shredding'
      ]
    },
    {
      id: 'standard',
      name: 'Standard',
      price: 240,
      popular: true,
      features: [
        '30 incoming items / month',
        '10 scan / month',
        '10 item shreds / month'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 750,
      features: [
        '100 incoming items / month',
        '100 scans / month',
        '100 item shreds / month'
      ]
    }
  ];

  // Eğer formation paketi platinum ise, "basic" planı gizle.
  // (formData.selectedPlan!.id, formation paketinin id'si, platinum ise Virtual Mailbox için "basic" seçeneğini göstermiyoruz)
  const filteredPackages = formData.selectedPlan!.id === "platinum"
    ? packages.filter(pkg => pkg.id !== "basic")
    : packages;

  const commonFeatures = [
    'No deposit or setup fees',
    'No additional commitments',
    "Junk mail doesn't count",
    'Free mail pick up'
  ];

  const handleContinue = async () => {
    if (!user || !selectedPlan) return;

    setLoading(true);
    try {
      const selectedPackage = filteredPackages.find(pkg => pkg.id === selectedPlan);

      // Yerel formData state'ini güncelle
      setFormData({
        ...formData,
        upsellProducts: [
          ...(formData.upsellProducts || []),
          { mailboxPlan: selectedPlan, mailboxFee: selectedPackage?.price || 0 }
        ]
      });

      if (nextStep) nextStep();

    } catch (error) {
      console.error('Error saving mailbox selection:', error);
      toast.error('Failed to save your selection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen grid md:grid-cols-2 grid-cols-1">
      {/* Left Side - Package Selection */}
      <div className="bg-white p-6 flex items-center">
        <div className="max-w-xl mx-auto w-full">
          {/* Header */}
          <div className="mb-6">
            <img
              src="https://registate.betterwp.site/wp-content/uploads/2025/01/registate-logo.webp"
              alt="Registate"
              className="h-8 mb-4"
            />
            <h1 className="text-2xl font-bold mb-2">
              {formData.selectedPlan!.id === "platinum" ? "Upgrade Your Virtual Mailbox" : "Virtual Mailbox"}
            </h1>
            <p className="text-gray-600">
              Get a professional business address with mail handling services
            </p>
          </div>

          {/* Common Features */}
          <div className="bg-[--primary]/5 rounded-xl p-4 mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Info size={18} className="text-[--primary]" />
              All Plans Include:
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {commonFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[--accent]" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Package Cards */}
          <div className="space-y-4 mb-6">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPlan(pkg.id)}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                  ${selectedPlan === pkg.id
                    ? 'border-[--primary] bg-[--primary]/5 shadow-md'
                    : 'border-gray-200 hover:border-[--primary]/30 hover:shadow-sm'
                  }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2.5 right-4 px-2 py-0.5 bg-[--accent] text-white text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                )}

                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1
                    ${selectedPlan === pkg.id
                      ? 'border-[--primary] bg-[--primary]'
                      : 'border-gray-300'
                    }`}
                  >
                    {selectedPlan === pkg.id && (
                      <CheckCircle2 className="text-white" size={12} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold">{pkg.name}</h3>
                      <div className="text-right">
                        <span className="text-lg font-bold">${pkg.price}</span>
                        <span className="text-sm text-gray-600">/year</span>
                      </div>
                    </div>

                    <ul className="space-y-1.5">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="text-[--accent]" size={16} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={loading || !selectedPlan}
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
      <div className="bg-[#1649FF]/5 p-6 flex items-center">
        <div className="max-w-xl mx-auto w-full space-y-6">
          {/* Features */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">What's Included?</h3>
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[--primary]/10">
                  <Mail className="text-[--primary]" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Professional Address</h4>
                  <p className="text-sm text-gray-600">
                    Get a prestigious business address for your company
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[--primary]/10">
                  <Scan className="text-[--primary]" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Mail Scanning</h4>
                  <p className="text-sm text-gray-600">
                    View your mail online from anywhere in the world
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[--primary]/10">
                  <Package className="text-[--primary]" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Package Receiving</h4>
                  <p className="text-sm text-gray-600">
                    Secure handling of all your business packages
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-[--primary]/10">
            <div className="flex items-start gap-3">
              <Shield className="text-[--primary] flex-shrink-0" size={18} />
              <p className="text-sm text-gray-600">
                All mail is handled in a secure facility with 24/7 surveillance. 
                Your privacy and security are our top priorities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
