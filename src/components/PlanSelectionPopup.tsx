import { X, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Price, Product } from '../types/Product';


interface PlanSelectionPopupProps {
  product: Product;
  onClose: () => void;
  onSelectPlan: (plan: Price) => void;
}

export default function PlanSelectionPopup({ 
  product, 
  onClose, 
  onSelectPlan 
}: PlanSelectionPopupProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);


  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white w-full max-w-3xl rounded-2xl shadow-xl relative"
      >
        <button
          onClick={onClose}
          className="absolute -right-3 -top-3 p-2 bg-white text-gray-500 hover:text-gray-700 
            rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <X size={20} />
        </button>

        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{product.name} Plans</h2>
            <p className="text-gray-600">Choose the plan that best fits your needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {product.prices.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-xl border-2 border-gray-200 hover:border-[--primary] 
                  transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-[--primary]">
                      ${plan.unit_amount / 100}
                    </span>
                    <span className="text-gray-500">/{plan.recurring?.interval}</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="text-[--accent] flex-shrink-0 mt-1" size={16} />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                  disabled={plan.isActivePlan}
                    onClick={() => onSelectPlan(plan)}
                    className="w-full px-4 py-2 bg-[--primary] text-white rounded-lg font-medium 
                      hover:bg-[--primary]/90 transition-colors flex items-center justify-center gap-2"
                  >
                    {plan.isActivePlan ? 'Selected Plan' : 'Select Plan'}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-medium text-blue-900">Need Help Choosing?</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Contact our support team for guidance on selecting the best plan for your needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}