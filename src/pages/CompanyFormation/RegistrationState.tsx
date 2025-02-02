import { useState } from "react";
import {
  MapPin,
  Building2,
  Shield,
  DollarSign,
  Scale,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { FormationFormData } from "../../types/FormData";

interface CompanyStateProps {
  formData: FormationFormData;
  setFormData: any;
  prevStep?: () => void;
  nextStep?: () => void;
}


export default function RegistrationState({
  setFormData,
  formData,
  nextStep,
}: CompanyStateProps) {
  const [loading, setLoading] = useState(false);
const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!selectedState) return;

    setLoading(true);
    try {
      setFormData({
        ...formData,
        registrationState: selectedState,
      });
      nextStep && nextStep();
    } catch (error) {
      console.error("Error saving registration state:", error);
      toast.error("Failed to save your selection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div>
            <img
              src="https://registate.betterwp.site/wp-content/uploads/2025/01/registate-logo.webp"
              alt="Registate"
              className="h-12 mb-8"
            />
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              Choose Your Registration State
            </h1>
            <p className="text-gray-600">
              Select the state where you want to register your business
            </p>
          </div>

          <div className="relative w-full">
            <div className="space-y-4 w-[115%] -ml-[7.5%]">
              {/* Wyoming Option */}
              <div
                className={`w-full bg-white p-6 rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-1
                  ${
                    selectedState === "Wyoming"
                      ? "border-[--primary] shadow-md"
                      : "border-transparent hover:border-gray-200"
                  }`}
                onClick={() => setSelectedState("Wyoming")}
              >
                <div className="flex items-start gap-4">
                  <MapPin className="text-[--primary] mt-1" size={24} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">Wyoming</h3>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        Recommended for LLC
                      </span>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <Shield className="text-[--accent]" size={18} />
                        <span>Strong asset protection laws</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <DollarSign className="text-[--accent]" size={18} />
                        <span>No state income tax</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Building2 className="text-[--accent]" size={18} />
                        <span>Low filing fees and annual costs</span>
                      </li>
                    </ul>
                    <p className="mt-3 text-[--primary] font-medium">
                      Perfect for: Small businesses seeking tax benefits &
                      privacy
                    </p>
                  </div>
                </div>
              </div>

              {/* Delaware Option */}
              <div
                className={`w-full bg-white p-6 rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-1
                  ${
                    selectedState === "Delaware"
                      ? "border-[--primary] shadow-md"
                      : "border-transparent hover:border-gray-200"
                  }`}
                onClick={() => setSelectedState("Delaware")}
              >
                <div className="flex items-start gap-4">
                  <MapPin className="text-[--primary] mt-1" size={24} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">Delaware</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                        Recommended for C-Corp
                      </span>
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <Scale className="text-[--accent]" size={18} />
                        <span>Business-friendly court system</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Building2 className="text-[--accent]" size={18} />
                        <span>Preferred by investors & VCs</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Shield className="text-[--accent]" size={18} />
                        <span>Strong corporate law precedents</span>
                      </li>
                    </ul>
                    <p className="mt-3 text-[--primary] font-medium">
                      Perfect for: Startups planning to raise capital
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={!selectedState || loading}
                className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    Continue <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-image-side !bg-[#1649FF]/5">
        <div className="w-full max-w-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-[--primary]">
            State Registration Comparison
          </h2>

          <div className="space-y-6">
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-[--primary]/10">
                    <th className="py-4 px-6 text-left text-[--primary] font-semibold">
                      Feature
                    </th>
                    <th className="py-4 px-6 text-center text-[--primary] font-semibold">
                      Wyoming
                    </th>
                    <th className="py-4 px-6 text-center text-[--primary] font-semibold">
                      Delaware
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                    <td className="py-4 px-6 font-medium">Filing Speed</td>
                    <td className="py-4 px-6 text-center">2-3 business days</td>
                    <td className="py-4 px-6 text-center">3-5 business days</td>
                  </tr>
                  <tr className="border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                    <td className="py-4 px-6 font-medium">Privacy Level</td>
                    <td className="py-4 px-6 text-center">High</td>
                    <td className="py-4 px-6 text-center">Moderate</td>
                  </tr>
                  <tr className="border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                    <td className="py-4 px-6 font-medium">Investor Appeal</td>
                    <td className="py-4 px-6 text-center">Moderate</td>
                    <td className="py-4 px-6 text-center">Very High</td>
                  </tr>
                  <tr className="border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                    <td className="py-4 px-6 font-medium">Annual Fees</td>
                    <td className="py-4 px-6 text-center">Low ($60)</td>
                    <td className="py-4 px-6 text-center">Moderate ($300+)</td>
                  </tr>
                  <tr className="transition-colors hover:bg-blue-50/50">
                    <td className="py-4 px-6 font-medium">Tax Structure</td>
                    <td className="py-4 px-6 text-center">
                      No state income tax
                    </td>
                    <td className="py-4 px-6 text-center">
                      Corporate income tax
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-[--primary]/10">
              <h3 className="font-semibold text-[--primary] mb-2">Pro Tip</h3>
              <p className="text-gray-700">
                While Delaware is famous for corporations, Wyoming has become
                increasingly popular for LLCs due to its strong privacy laws and
                tax benefits. Consider your long-term business goals when
                choosing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
