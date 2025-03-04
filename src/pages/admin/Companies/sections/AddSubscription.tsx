import { useEffect, useState } from "react";
import { 
  Package, 
  Search, 
  ArrowRight, 
  Calendar,
  CheckCircle2,
  Info,
  X,
  DollarSign
} from "lucide-react";
import instance from "../../../../http/instance";
import toast from "react-hot-toast";

interface Price {
  id: string;
  name: string;
  unit_amount: number;
  currency: string;
  type: string;
  description: string;
  stripePriceId: string;
  recurring: {
    interval?: string;
    interval_count?: number;
  } | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  productType: string;
  active: boolean;
  prices: Price[];
}

interface AddSubscriptionProps {
  companyId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddSubscription({ companyId, onClose, onSuccess }: AddSubscriptionProps) {
  const [step, setStep] = useState<'products' | 'details'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<string>('active');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await instance.get('/admin/products/all');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setStep('details');
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !selectedPrice) {
      toast.error('Please select a product and price');
      return;
    }

    try {
      await instance.post(`/admin/company/${companyId}/subscriptions`, {
        productId: selectedProduct.id,
        productPriceId: selectedPrice.id,
        status,
        startDate,
        endDate: endDate || null
      });

      toast.success('Subscription added successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding subscription:', error);
      toast.error('Failed to add subscription');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (step === 'products') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Add Subscription</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Search */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[--primary]"
              />
            </div>
          </div>

          {/* Products List */}
          <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                <div className="col-span-2 text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--primary] mx-auto"></div>
                  <p className="mt-4 text-gray-500">Loading products...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[--primary] 
                      hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[--primary]/10 rounded-lg">
                        <Package className="w-6 h-6 text-[--primary]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                        <div className="space-y-2">
                          {product.prices.map((price) => (
                            <div key={price.id} className="flex items-center gap-2 text-sm">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">${price.unit_amount / 100}</span>
                              {price.recurring && (
                                <span className="text-gray-500">
                                  /{price.recurring.interval}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-12">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your search terms</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add Subscription</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Selected Product Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[--primary]/10 rounded-lg">
                <Package className="w-5 h-5 text-[--primary]" />
              </div>
              <div>
                <h3 className="font-medium">{selectedProduct?.name}</h3>
                <p className="text-sm text-gray-600">{selectedProduct?.description}</p>
              </div>
            </div>
          </div>

          {/* Price Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Price Plan
            </label>
            <div className="space-y-3">
              {selectedProduct?.prices.map((price) => (
                <div
                  key={price.id}
                  onClick={() => setSelectedPrice(price)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${selectedPrice?.id === price.id
                      ? 'border-[--primary] bg-[--primary]/5'
                      : 'border-gray-200 hover:border-[--primary]/30'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{price.name}</p>
                      <p className="text-sm text-gray-600">{price.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${price.unit_amount / 100}</p>
                      {price.recurring && (
                        <p className="text-sm text-gray-500">
                          per {price.recurring.interval}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dates and Status */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-[--primary]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-[--primary]"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[--primary]"
              >
                <option value="active">Active</option>
                <option value="canceled">Canceled</option>
                <option value="past_due">Past Due</option>
                <option value="unpaid">Unpaid</option>
                <option value="incomplete">Incomplete</option>
                <option value="incomplete_expired">Incomplete Expired</option>
              </select>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="font-medium text-blue-900">Important Note</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Adding a subscription manually will not process any payments. Make sure to handle billing
                  separately if required.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setStep('products')}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Back to Products
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2 bg-[--primary] text-white rounded-lg 
                hover:bg-[--primary]/90 transition-colors"
            >
              Add Subscription
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}