import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Package,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Shield,
  Receipt,
} from "lucide-react";
import { useAppSelector } from "../../store/hooks";

interface ReviewProps {
  prevStep?: () => void;
  nextStep?: () => void;
}

export default function Review({nextStep }: ReviewProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const checkoutData=useAppSelector((state)=>state.checkout);

  const upsellProducts =checkoutData.addons;

  const calculateTotalPrice = () => {
    let total = checkoutData.pricingPlan?.price || 0;

    for (let i = 0; i < upsellProducts.length; i++) {
      total += upsellProducts[i].amount/100;
    }

    return total;
  }
  const totalPrice = calculateTotalPrice();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        //burada ödeme sayfasına geçmemiz gerekecek
        nextStep && nextStep();
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);



  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 grid-cols-1">
      {/* Left Side - Review Details */}
      <div className="bg-white p-4 md:p-6 flex flex-col h-screen">
        <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0">
            <img
              src="https://registate.betterdemo.com.tr/wp-content/uploads/2025/01/registate-logo.webp"
              alt="Registate"
              className="h-8 mb-4"
            />
            <div className="mb-4">
              <h1 className="text-2xl font-bold">Review Your Formation</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Shield size={14} />
                <span>Your information is secure and encrypted</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4 flex-shrink-0">
            <div className="flex justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-600">
                Formation Progress
              </span>
              <span className="text-xs font-medium text-[--primary]">90%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[--primary] rounded-full transition-all duration-500"
                style={{ width: "90%" }}
              />
            </div>
          </div>

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2">
            {/* Company Details Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Company Type */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-[--primary] transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-md bg-[--primary]/10">
                    <Building2 className="text-[--primary]" size={18} />
                  </div>
                  <h2 className="font-medium">Company Type</h2>
                </div>
                <p className="text-[--primary] font-medium">
                  {checkoutData.companyType.name}
                </p>
              </div>

              {/* Registration State */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-[--primary] transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-md bg-[--primary]/10">
                    <MapPin className="text-[--primary]" size={18} />
                  </div>
                  <h2 className="font-medium">State</h2>
                </div>
                <p className="text-[--primary] font-medium">
                  {checkoutData.state.name}
                </p>
              </div>
            </div>

            {/* Company Name */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-[--primary] transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-md bg-[--primary]/10">
                  <Building2 className="text-[--primary]" size={18} />
                </div>
                <h2 className="font-medium">Company Name</h2>
              </div>
              <p className="text-lg font-medium text-[--primary]">
                {checkoutData.companyInfo.name} {checkoutData.companyInfo.designator}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-green-600 mt-2">
                <CheckCircle2 size={14} />
                <span>Name availability verified</span>
              </div>
            </div>

            {/* Selected Package */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-[--primary] transition-all duration-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-md bg-[--primary]/10">
                  <Package className="text-[--primary]" size={18} />
                </div>
                <div>
                  <h2 className="font-medium">Formation Package</h2>
                  <p className="text-sm text-[--primary] capitalize">
                    {checkoutData.pricingPlan?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Package Price</span>
                <span className="text-lg font-bold">
                  ${checkoutData.pricingPlan?.price}
                </span>
              </div>
              <div className="space-y-1.5 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <CheckCircle2 className="text-[--accent]" size={14} />
                  <span>Same-day processing included</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <CheckCircle2 className="text-[--accent]" size={14} />
                  <span>Registered agent service (1 year)</span>
                </div>
              </div>
            </div>

            {/* Upsell Products */}
            {upsellProducts.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-[--primary] transition-all duration-300 mt-4">
                <h3 className="text-lg font-semibold mb-3">
                  Additional Features
                </h3>
                <ul className="space-y-2">
                  {upsellProducts.map((upsell) => (
                    <li
                      key={upsell.productId}
                      className="flex justify-between items-center text-sm text-gray-600"
                    >
                      <span>{upsell.productName} {upsell?.priceName}</span>
                      <span className="font-medium">${upsell.amount/100}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 pt-4">
            <button
              onClick={() => navigate("/payment")}
              className="w-full bg-[--primary] text-white py-3 px-6 rounded-lg font-medium 
                transition-all duration-200 hover:bg-[--primary]/90 flex items-center justify-center gap-2
                shadow-sm hover:shadow-md"
            >
              Continue to Payment <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Summary */}
      <div className="bg-[#1649FF]/5 p-4 md:p-6 flex flex-col h-screen">
        <div className="max-w-xl mx-auto w-full flex-1 flex flex-col">
          {/* Order Summary Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-4 flex-shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="text-[--primary]" size={20} />
              <h2 className="text-xl font-bold">Order Summary</h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Formation Package</span>
                <span className="font-medium">
                  ${checkoutData.pricingPlan?.price}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">State Filing Fees</span>
                <span className="font-medium">Included</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Registered Agent (1 Year)</span>
                <span className="font-medium">Included</span>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold">${totalPrice} USD</span>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 -mr-2">
            {/* Next Steps Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="text-[--primary] flex-shrink-0"
                  size={20}
                />
                <div>
                  <h3 className="font-semibold mb-2">Next Steps</h3>
                  <p className="text-sm text-gray-600">
                    After payment, we'll begin processing your company formation
                    immediately. You'll receive updates on each step through
                    your dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Features Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-3">Package Includes</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2
                    className="text-[--accent] flex-shrink-0"
                    size={16}
                  />
                  <span>Same-day business formation processing</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2
                    className="text-[--accent] flex-shrink-0"
                    size={16}
                  />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2
                    className="text-[--accent] flex-shrink-0"
                    size={16}
                  />
                  <span>Full year of registered agent service</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle2
                    className="text-[--accent] flex-shrink-0"
                    size={16}
                  />
                  <span>Lifetime customer support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
