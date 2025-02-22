import { ArrowRight, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CancelOrder() {
  const navigate = useNavigate();


  useEffect(() => {
    setTimeout(() => {
      navigate('/dashboard');
    }, 10000);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
      <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <XCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Order Cancelled</h1>
              <p className="text-gray-600 max-w-md mx-auto">
                Your order has been cancelled. If this was unintentional or you have any questions,
                our support team is here to help.
              </p>
              <button
                onClick={() => navigate('/dashboard/support')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[--primary] text-white rounded-lg 
                  hover:bg-[--primary]/90 transition-colors"
              >
                Contact Support <ArrowRight size={20} />
              </button>
            </div>
      </div>
    </div>
  );
}