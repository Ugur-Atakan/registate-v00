import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  CreditCard, 
  Lock, 
  Calendar, 
  User,
  Shield,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Payment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Payment successful! Redirecting to dashboard...');
      
      // Wait for toast to be visible
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 2000);
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Basic input formatting
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
    } else if (name === 'expiry') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
    } else if (name === 'cvc') {
      formattedValue = value.slice(0, 3);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 grid-cols-1">
      {/* Left Side - Payment Form */}
      <div className="bg-white p-6 md:p-12 overflow-auto">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <img
              src="https://registate.betterdemo.com.tr/wp-content/uploads/2025/01/registate-logo.webp"
              alt="Registate"
              className="h-12"
            />
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Payment Details</h1>
            <p className="text-gray-600">
              Enter your payment information to complete your registration
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                      focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                      focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                        focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none 
                        focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[--primary] text-white py-4 px-6 rounded-xl font-medium 
                transition-all duration-200 hover:bg-[--primary]/90 disabled:opacity-50 
                disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  Complete Payment
                  <Lock size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
            <Lock size={16} />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>
      </div>

      {/* Right Side - Security Info */}
      <div className="bg-[#1649FF]/5 p-6 md:p-12 overflow-auto">
        <div className="max-w-xl mx-auto space-y-8">
          {/* Security Features */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-start gap-3 mb-6">
              <Shield className="text-[--primary] flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-lg mb-2">Secure Payment</h3>
                <p className="text-gray-600">
                  Your payment is protected with industry-standard encryption and security measures
                </p>
              </div>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-[--accent] flex-shrink-0 mt-1" size={20} />
                <div>
                  <span className="font-medium">256-bit SSL Encryption</span>
                  <p className="text-sm text-gray-600">
                    Your data is encrypted using bank-level security standards
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-[--accent] flex-shrink-0 mt-1" size={20} />
                <div>
                  <span className="font-medium">PCI DSS Compliant</span>
                  <p className="text-sm text-gray-600">
                    We adhere to strict payment card industry standards
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="text-[--accent] flex-shrink-0 mt-1" size={20} />
                <div>
                  <span className="font-medium">Fraud Prevention</span>
                  <p className="text-sm text-gray-600">
                    Advanced fraud detection and prevention systems
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Money-back Guarantee */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-start gap-3">
              <Shield className="text-[--primary] flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-lg mb-2">100% Money-back Guarantee</h3>
                <p className="text-gray-600">
                  If you're not satisfied with our service within the first 60 days, 
                  we'll refund your payment in full.
                </p>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h3 className="font-semibold text-lg mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              Our support team is available 24/7 to assist you with any questions about your payment
            </p>
            <button className="text-[--primary] font-medium hover:underline">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}