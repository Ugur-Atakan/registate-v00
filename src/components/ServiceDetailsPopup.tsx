import { X, ArrowRight, CheckCircle2, Clock, Shield, Info } from "lucide-react";
import { useEffect, useRef } from "react";
import { Product } from "../types/Product";

interface DynamicProduct extends Product {
  icon?: JSX.Element;
  badge?: string;
}
interface productDetailsPopupProps {
  product: DynamicProduct;
  onClose: () => void;
  onBuyNow: () => void;
}

export default function productDetailsPopup({
  product,
  onClose,
  onBuyNow,
}: productDetailsPopupProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll to top when popup opens
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
    // Lock body scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const defaultFeatures = [
    "Professional support from our expert team",
    "Fast processing and quick turnaround time",
    "Secure handling of your documents",
  ];

  const defaultBenefits = [
    "Save time and effort with our streamlined process",
    "Ensure compliance with all legal requirements",
    "Get expert guidance throughout the process",
  ];

  const defaultRequirements = [
    "Valid business information",
    "Required documentation",
    "Authorization to proceed",
  ];

  const defaultFAQ = [
    {
      question: "How long does the process take?",
      answer:
        "Processing time varies by product. Standard processing typically takes 3-5 business days.",
    },
    {
      question: "What happens after I purchase?",
      answer:
        "You'll receive detailed instructions and our team will guide you through the next steps.",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="product-details-title"
    >
      <div className="min-h-screen flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative bg-white w-full max-w-5xl rounded-2xl shadow-xl transform transition-all 
            duration-300 ease-out md:h-[90vh] h-[95vh] flex flex-col"
        >
          <button
            onClick={onClose}
            className="absolute -right-3 -top-3 p-2 bg-white text-gray-500 hover:text-gray-700 
              rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none 
              focus:ring-2 focus:ring-[--primary] z-10 md:flex hidden"
          >
            <X size={20} />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="md:hidden absolute right-4 top-4 p-2 text-gray-500 hover:text-gray-700 
              rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 
              focus:ring-[--primary] z-10"
          >
            <X size={24} />
          </button>

          {/* Scrollable Content Area */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto overscroll-contain"
            style={{ scrollBehavior: "smooth" }}
          >
            <div className="p-6 md:p-8">
              {/* Header Section - Sticky on Mobile */}
              <div
                className="md:static sticky top-0 bg-white z-10 -mx-6 md:mx-0 px-6 md:px-0 
                py-4 md:py-0 border-b md:border-b-0 border-gray-100 mb-6"
              >
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-[--primary]/10 rounded-2xl hidden md:block">
                    {product.icon}
                  </div>
                  <div className="flex-1">
                    <h2
                      id="product-details-title"
                      className="text-xl md:text-2xl font-bold mb-3 text-gray-900"
                    >
                      {product.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl md:text-3xl font-bold text-[--primary]">
                          ${product.prices[0].unit_amount / 100}
                        </span>
                        <span className="text-gray-500">
                          {product.prices[0].recurring?.interval !== "one_time"
                            ? `/${product.prices[0].recurring?.interval}`
                            : ""}
                        </span>
                      </div>
                      {product.processingTime && (
                        <div
                          className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 
                          rounded-full text-sm"
                        >
                          <Clock size={14} />
                          <span className="font-medium">
                            {product.processingTime}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid - Responsive Layout */}
              <div className="grid md:grid-cols-5 gap-6 md:gap-8">
                {/* Left Column */}
                <div className="md:col-span-3 space-y-6 md:space-y-8">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 flex items-center gap-2">
                      About This product
                      <Info size={18} className="text-gray-400" />
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      Key Features
                    </h3>
                    <div className="grid gap-4">
                      {(product.features || defaultFeatures).map(
                        (feature, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 
                            transition-colors duration-200"
                          >
                            <CheckCircle2
                              className="text-[--accent] flex-shrink-0 mt-1"
                              size={18}
                            />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      Requirements
                    </h3>
                    <div className="space-y-3">
                      {(product.requirements || defaultRequirements).map(
                        (req, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl"
                          >
                            <Shield
                              className="text-[--primary] flex-shrink-0 mt-1"
                              size={18}
                            />
                            <span className="text-gray-700">{req}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* FAQ */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-4">
                      {defaultFAQ.map((item, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                        >
                          <h4 className="font-medium text-gray-900 mb-2">
                            {item.question}
                          </h4>
                          <p className="text-gray-600">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Sticky Sidebar on Desktop */}
                <div className="md:col-span-2 space-y-6">
                  <div className="md:sticky md:top-8">
                    {/* Benefits Card */}
                    <div className="bg-gradient-to-br from-[--primary]/5 to-[--primary]/10 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">
                        Benefits
                      </h3>
                      <div className="space-y-4">
                     
                        {(product.benefits && product.benefits.length > 0 ? product.benefits: defaultBenefits).map(
                          (benefit, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle2
                                className="text-[--accent] flex-shrink-0 mt-1"
                                size={18}
                              />
                              <span className="text-gray-700">{benefit}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Multiple Plans Notice */}
                    {product.prices.length > 1 && (
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                        <h3 className="font-semibold text-blue-900 mb-2">
                          Multiple Plans Available
                        </h3>
                        <p className="text-sm text-blue-700">
                          Choose from different plans tailored to your specific
                          needs. Click "Buy Now" to view and compare all
                          available options.
                        </p>
                      </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">
                        Price Breakdown
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                          <span className="text-gray-600">product Fee</span>
                          <span className="font-medium">
                            ${product.prices[0].unit_amount / 100}
                          </span>
                        </div>
                        {product.additionalFees &&
                        product.additionalFees > 0 ? (
                          <div className="flex justify-between items-center p-3 bg-amber-50 text-amber-700 rounded-xl">
                            <span>Additional Fees</span>
                            <span>
                              +{product.additionalFees / 100} state fee
                            </span>
                          </div>
                        ) : null}
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex justify-between items-center p-3 bg-[--primary]/5 rounded-xl">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-bold text-[--primary]">
                              $
                              {product.prices[0].unit_amount / 100 +
                                (product.additionalFees ?? 0) / 100}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Fixed on Mobile */}
                    <div
                      className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto 
                      bg-white md:bg-transparent border-t md:border-t-0 p-4 md:p-0"
                    >
                      <div className="flex flex-col gap-3 max-w-5xl mx-auto">
                        <button
                          onClick={onBuyNow}
                          className="w-full px-6 py-4 bg-[--primary] text-white rounded-xl font-medium 
                            hover:bg-[--primary]/90 transition-all duration-200 transform hover:scale-[1.02] 
                            focus:outline-none focus:ring-2 focus:ring-[--primary] focus:ring-offset-2
                            shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                          Buy Now
                          <ArrowRight size={20} />
                        </button>
                        <button
                          onClick={onClose}
                          className="w-full px-6 py-4 text-gray-600 bg-gray-100 rounded-xl font-medium 
                            hover:bg-gray-200 transition-all duration-200 focus:outline-none 
                            focus:ring-2 focus:ring-gray-400 md:block hidden"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
