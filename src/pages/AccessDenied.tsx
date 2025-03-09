import { useNavigate } from "react-router-dom";
import { Lock, ArrowLeft, MessageSquare } from "lucide-react";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-red-600" />
          </div>

          {/* Content */}
          <h1 className="text-2xl font-bold text-red-600 mb-3">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. If you believe this is a mistake, 
            please contact our support team for assistance.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard", { replace: true })}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[--primary] text-white 
                rounded-xl font-medium transition-all duration-200 hover:bg-[--primary]/90 group"
            >
              <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
              Return to Dashboard
            </button>

            <button
              onClick={() => navigate("/dashboard/support")}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-[--primary] 
                text-[--primary] rounded-xl font-medium hover:bg-[--primary]/5 transition-all duration-200"
            >
              <MessageSquare className="w-5 h-5" />
              Contact Support
            </button>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need immediate assistance? Our support team is available 24/7 to help you resolve any access issues.
        </p>
      </div>
    </div>
  );
}