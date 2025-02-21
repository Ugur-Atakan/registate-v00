import { 
  ArrowRight,
  Info,
  Clock,
  Package,
} from 'lucide-react';
import { Product } from '../types/Product';

interface DynamicProduct extends Product {
  icon?: JSX.Element;
  badge?: string;
}

const ServiceCard = ({ 
  product, 
  onLearnMore,
  onBuyNow 
}: { 
  product: DynamicProduct;
  onLearnMore: () => void;
  onBuyNow: () => void;
}) => (
  <div 
    className="group bg-white rounded-xl border border-gray-200 hover:border-[--primary]/30 
      hover:shadow-lg transition-all duration-300 h-full flex flex-col"
  >
    <div className="p-6 flex-1">
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3.5 bg-[--primary]/10 rounded-xl group-hover:bg-[--primary]/20 
          transition-colors duration-300 flex-shrink-0">
          {product?.icon ?? <Package size={24} className="text-[--primary]" />}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[--primary] 
              transition-colors duration-300 truncate">
              {product.name}
            </h3>
            {product.prices.length > 1 && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium 
                rounded-full flex-shrink-0">
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
      <p className="text-gray-600 text-sm mb-6 line-clamp-2">
        {product.description}
      </p>

      {/* Price Section */}
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-2xl font-bold text-[--primary]">
          ${product.prices[0].unit_amount/100}
        </span>
        <span className="text-gray-500">
          {product.prices[0].type !== 'one_time' ? 
            `/${product.prices[0].recurring?.interval}` : ''}
        </span>
      </div>

      {/* Additional Fees */}
      {product.additionalFees! > 0 && (
        <div className="mb-4">
          <span className="text-sm text-amber-600 font-medium block">
            + ${Number(product.additionalFees)/100} state fee
          </span>
        </div>
      )}
    </div>

    {/* Action Buttons - Fixed at bottom */}
    <div className="p-6 pt-0 mt-auto">
      <div className="flex flex-col gap-2">
        <button
          onClick={onBuyNow}
          className="w-full px-4 py-2.5 bg-[--primary] text-white rounded-lg 
            hover:bg-[--primary]/90 transition-all duration-200 text-sm font-medium 
            flex items-center justify-center gap-2 group shadow-sm hover:shadow-md"
        >
          Buy Now
          <ArrowRight size={16} className="transition-transform duration-200 
            group-hover:translate-x-0.5" />
        </button>
        <button
          onClick={onLearnMore}
          className="w-full px-4 py-2.5 border border-[--primary] text-[--primary] rounded-lg 
            hover:bg-[--primary]/5 transition-all duration-200 text-sm font-medium 
            flex items-center justify-center gap-2 group"
        >
          Learn More
          <Info size={16} className="transition-transform duration-200 
            group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  </div>
);

export default ServiceCard;