import { useState } from "react";
import {
  FileText,
  ArrowRight,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
  Info,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { AddonsProps } from "../../types/FormData";
import { useAppDispatch } from "../../store/hooks";
import { addAddon } from "../../store/slices/checkoutSlice";

export default function BoiReportFiling({addonData,nextStep }: AddonsProps) {
  const [includeService, setIncludeService] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const SERVICE_FEE = 199;
  const dispatch = useAppDispatch();

  const handleContinue = async () => {
    console.log("addonData", addonData);
    if (includeService === null) return;
    console.log("includeService", includeService);
    setLoading(true);
    try {
      if (includeService) {
        dispatch(
          addAddon({ productId: addonData.productId, selectedPriceId: null ,productTier:null,productName:addonData.productName,price:addonData.basePrice})
        );
      }
      nextStep();
    } catch (error) {
      console.error("Error saving BOI report selection:", error);
      toast.error("Failed to save your selection. Please try again.");
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
            <h1 className="text-3xl font-bold mb-2">
              Beneficial Ownership Information Filing
            </h1>
            <p className="text-gray-600">
              Comply with FinCEN's BOI reporting requirements effortlessly
            </p>
          </div>

          {/* Service Fee Banner */}
          <div className="bg-[--primary]/5 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign size={24} className="text-[--primary]" />
                <div>
                  <p className="text-sm text-gray-600">One-Time Service Fee</p>
                  <p className="text-2xl font-bold">${SERVICE_FEE}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-[--primary]">
                <Shield size={16} />
                <span>Compliance guaranteed</span>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="text-amber-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">
                  New Legal Requirement
                </h3>
                <p className="text-sm text-amber-700">
                  Starting January 1, 2024, most companies must file BOI reports
                  with FinCEN. Failure to comply may result in civil and
                  criminal penalties.
                </p>
              </div>
            </div>
          </div>

          {/* Selection Options */}
          <div className="space-y-4 mb-8">
            {/* Yes Option */}
            <div
              onClick={() => setIncludeService(true)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${
                  includeService === true
                    ? "border-[--primary] bg-[--primary]/5 shadow-md"
                    : "border-gray-200 hover:border-[--primary]/30 hover:shadow-sm"
                }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${
                    includeService === true
                      ? "border-[--primary] bg-[--primary]"
                      : "border-gray-300"
                  }`}
                >
                  {includeService === true && (
                    <CheckCircle2 className="text-white" size={14} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-lg">
                    Yes, help me file my BOI report
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    We'll handle the entire filing process for you
                  </p>
                </div>
              </div>
            </div>

            {/* No Option */}
            <div
              onClick={() => setIncludeService(false)}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${
                  includeService === false
                    ? "border-[--primary] bg-[--primary]/5 shadow-md"
                    : "border-gray-200 hover:border-[--primary]/30 hover:shadow-sm"
                }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${
                    includeService === false
                      ? "border-[--primary] bg-[--primary]"
                      : "border-gray-300"
                  }`}
                >
                  {includeService === false && (
                    <CheckCircle2 className="text-white" size={14} />
                  )}
                </div>
                <p className="font-medium text-lg">
                  No, I'll handle the BOI filing myself
                </p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          {includeService === false && (
            <div className="flex items-start gap-3 bg-red-50 text-red-800 p-5 rounded-xl border border-red-100 mb-8">
              <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />
              <p>
                BOI reporting requires detailed information about company
                ownership and control. Incorrect or late filings can result in
                civil penalties up to $500 per day and criminal penalties up to
                $10,000.
              </p>
            </div>
          )}

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={loading || includeService === null}
            className="w-full bg-[--primary] text-white py-3 px-6 rounded-xl font-medium
              transition-all duration-200 hover:bg-[--primary]/90 disabled:opacity-50 
              disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : "Continue"}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Right Side - Information */}
      <div className="bg-[#1649FF]/5 p-8 flex items-center">
        <div className="max-w-xl mx-auto w-full space-y-6">
          {/* What's Included */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4">Service Includes</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="text-[--primary] mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Complete Filing</p>
                    <p className="text-sm text-gray-600">
                      Full report preparation
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="text-[--primary] mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Compliance Review</p>
                    <p className="text-sm text-gray-600">Expert verification</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="text-[--primary] mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Data Collection</p>
                    <p className="text-sm text-gray-600">Owner information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="text-[--primary] mt-1" size={20} />
                  <div>
                    <p className="font-semibold">Fast Processing</p>
                    <p className="text-sm text-gray-600">3-4 business days</p>
                  </div>
                </div>
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
                  Our service ensures accurate and timely filing, helping you
                  avoid costly penalties and maintain compliance with FinCEN
                  requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
