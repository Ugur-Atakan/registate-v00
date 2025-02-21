import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import baseApi from "../http";
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  MessageSquare, 
  ListTodo,
  XCircle,
  ShieldAlert
} from 'lucide-react';

type OrderStatus = 'success' | 'cancelled' | 'error' | 'invalid' | 'loading';
type PaymentType = 'companyFormation' | 'singleItemPurchase' | '';

export default function PostOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<OrderStatus>('loading');
  const [type, setType] = useState<PaymentType>('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    if (!sessionId) {
      setStatus('invalid');
      setType('');
      return;
    }

    const fetchPaymentStatus = async () => {
      try {
        const response = await baseApi.get(
          `/checkout/checkout-completed?session_id=${sessionId}`
        );
        
        if (response.data.success) {
          setStatus('success');
          if (response.data.paymentType === "companyFormation") {
            setType('companyFormation');
          } else if (response.data.paymentType === "singleItemPurchase") {
            setType('singleItemPurchase');
          }
          
          // Redirect to dashboard after success
          setTimeout(() => {
            navigate("/dashboard");
          }, 10000);
        } else {
          setStatus('cancelled');
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus('error');
      }
    };

    fetchPaymentStatus();
  }, [location.search, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {type === 'companyFormation' 
                ? 'Company Formation Process Started!' 
                : 'Order Completed Successfully!'}
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              {type === 'companyFormation' 
                ? "We're excited to help you establish your company. Our team will begin processing your formation immediately."
                : "Thank you for your purchase! Your order has been successfully processed."}
            </p>

            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-8">
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[--primary]/30 transition-all">
                <ListTodo className="w-8 h-8 text-[--primary] mb-4" />
                <h3 className="font-semibold mb-2">Track Your Progress</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {type === 'companyFormation'
                    ? "Monitor your company formation progress and submit required documents through your dashboard."
                    : "Track your order status and manage your services through your dashboard."}
                </p>
                <button 
                  onClick={() => navigate('/dashboard/tasks')}
                  className="text-[--primary] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View Tasks <ArrowRight size={16} />
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[--primary]/30 transition-all">
                <MessageSquare className="w-8 h-8 text-[--primary] mb-4" />
                <h3 className="font-semibold mb-2">Need Assistance?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions? Our support team is available 24/7 to help you.
                </p>
                <button 
                  onClick={() => navigate('/dashboard/support')}
                  className="text-[--primary] text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Contact Support <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'cancelled':
        return (
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
        );

      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Error</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              We encountered an error processing your payment. Don't worry - no charges have been made.
              Please contact our support team for assistance.
            </p>
            <button
              onClick={() => navigate('/dashboard/support')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[--primary] text-white rounded-lg 
                hover:bg-[--primary]/90 transition-colors"
            >
              Contact Support <ArrowRight size={20} />
            </button>
          </div>
        );

      case 'invalid':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <ShieldAlert className="w-8 h-8 text-gray-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Invalid Access</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              This page is only accessible after completing a purchase. Please return to our services
              page to start your order.
            </p>
            <button
              onClick={() => navigate('/dashboard/services')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[--primary] text-white rounded-lg 
                hover:bg-[--primary]/90 transition-colors"
            >
              View Services <ArrowRight size={20} />
            </button>
          </div>
        );

      case 'loading':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto mb-2">
              <div className="w-full h-full border-4 border-gray-200 border-t-[--primary] rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">Verifying your payment...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {renderContent()}
      </div>
    </div>
  );
}