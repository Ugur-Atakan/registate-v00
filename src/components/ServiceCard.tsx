import { 
  ArrowRight,
  Info,
  Clock,
} from 'lucide-react';
import { Product } from '../types/Product';

interface Service extends Product {
    badge?: string;
    icon: JSX.Element;
}

const ServiceCard = ({ 
  product, 
  onLearnMore,
  onBuyNow 
}: { 
    product: Service;
  onLearnMore: () => void;
  onBuyNow: () => void;
}) => (
  <div 
    className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-[--primary]/30 
      hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
  >
    <div className="flex flex-col h-full">
      {/* Service Badge */}
      {product.badge && (
        <span className="absolute -top-3 right-6 px-3 py-1 bg-[--accent] text-white text-xs 
          font-medium rounded-full shadow-sm">
          {product.badge}
        </span>
      )}

      {/* Icon & Title Section */}
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3.5 bg-[--primary]/10 rounded-xl group-hover:bg-[--primary]/20 
          transition-colors duration-300">
          {product.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[--primary] 
              transition-colors duration-300">
              {product.name}
            </h3>
            {product.prices.length>0 && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium 
                rounded-full">
                Multiple Plans
              </span>
            )}
          </div>
          {product.processingTime && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Clock size={14} />
              <span>{product.processingTime}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-base leading-relaxed mb-6">
        {product.description}
      </p>

      {/* Price & Actions Section */}
      <div className="mt-auto">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-[--primary]">${product.prices[0].unit_amount}</span>
          <span className="text-gray-500">
            {product.prices[0].type !== 'one_time' ? `/${product.prices[0].recurring?.interval}` : ''}
          </span>
          {Number.parseInt(product.additionalFees!)>1 &&(
            <span className="text-sm text-amber-600 font-medium ml-1">
              + {product.additionalFees} state fee
            </span>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onLearnMore}
            className="flex-1 px-4 py-3 text-[--primary] bg-[--primary]/10 rounded-xl 
              hover:bg-[--primary]/20 transition-all duration-200 text-sm font-medium 
              flex items-center justify-center gap-2 group"
          >
            Learn More
            <Info size={16} className="transition-transform duration-200 
              group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={onBuyNow}
            className="flex-1 px-4 py-3 bg-[--primary] text-white rounded-xl 
              hover:bg-[--primary]/90 transition-all duration-200 text-sm font-medium 
              flex items-center justify-center gap-2 group shadow-md hover:shadow-lg"
          >
            Buy Now
            <ArrowRight size={16} className="transition-transform duration-200 
              group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ServiceCard;