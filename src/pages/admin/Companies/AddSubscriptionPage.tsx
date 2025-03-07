import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  Package, 
  Search, 
  ArrowRight, 
  Calendar,
  Info,
  ArrowLeft,
  DollarSign,
  Bell,
  ChevronRight
} from "lucide-react";
import instance from "../../../http/instance";
import toast from "react-hot-toast";
import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";
import AdminAvatar from "../../../components/AdminAvatar";

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

export default function AddSubscriptionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const companyId = location.state?.companyId;

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
    if (!companyId) {
      navigate('/admin/companies');
      return;
    }

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
  }, [companyId, navigate]);

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
      await instance.post(`/admin/company/subscribe-item`, {
        companyId: companyId,
        productId: selectedProduct.id,
        priceId: selectedPrice.id,
        status,
        startDate: new Date("2025-03-07"),
        endDate:  new Date(endDate) || null
      });

      toast.success('Subscription added successfully');
      navigate(-1);
    } catch (error) {
      console.error('Error adding subscription:', error);
      toast.error('Failed to add subscription');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminDashboardLayout>
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (step === 'details') {
                setStep('products');
                setSelectedProduct(null);
                setSelectedPrice(null);
              } else {
                navigate(-1);
              }
            }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Add Subscription</h1>
            <p className="text-gray-600 mt-1">
              {step === 'products' ? 'Select a product' : 'Configure subscription details'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
          <AdminAvatar />
        </div>
      </header>

      {step === 'products' ? (
        <div className="space-y-6">
          {/* Search */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="relative">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-200">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--primary] mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-[--primary]/10 rounded-lg">
                        <Package className="w-5 h-5 text-[--primary]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.description}</p>
                        <div className="flex items-center gap-4 mt-1">
                          {product.prices.map((price) => (
                            <div key={price.id} className="flex items-center gap-1 text-sm text-gray-600">
                              <DollarSign className="w-4 h-4" />
                              <span>${price.unit_amount / 100}</span>
                              {price.recurring && (
                                <span>/{price.recurring.interval}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
      )}
    </AdminDashboardLayout>
  );
}