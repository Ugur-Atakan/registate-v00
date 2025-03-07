import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";
import {
  ArrowLeft,
  Bell,
  Package,
  Plus,
  Trash2,
  Save,
  X,
  AlertCircle,
  Info,
  Star,
  DollarSign
} from "lucide-react";
import instance from "../../../http/instance";
import toast from "react-hot-toast";
import LoadingComponent from "../../../components/Loading";

interface Price {
  id: string;
  name: string;
  unit_amount: number;
  currency: string;
  type: string;
  description: string;
  features: string[];
  recurring?: {
    interval: string;
    interval_count: number;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  stripeProductId: string;
  active: boolean;
  features: string[];
  productType: string;
  isFeatured: boolean;
  prices: Price[];
}

export default function EditProduct() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!location.state?.productId) {
        toast.error("Product ID is missing");
        navigate("/admin/products");
        return;
      }

      try {
        const response = await instance.get(
          `/admin/product/${location.state.productId}/details`
        );
        setProduct(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [location.state?.productId, navigate]);

  const handleSave = async () => {
    if (!product || !formData) return;

    setSaving(true);
    try {
      await instance.put(`/admin/product/${product.id}`, formData);
      toast.success("Product updated successfully");
      navigate(`/admin/products/details`, { state: { productId: product.id } });
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    if (!formData.features) return;
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    if (!formData.features) return;
    setFormData({
      ...formData,
      features: [...formData.features, ""]
    });
  };

  const removeFeature = (index: number) => {
    if (!formData.features) return;
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handlePriceChange = (priceId: string, field: keyof Price, value: any) => {
    if (!formData.prices) return;
    const newPrices = formData.prices.map(price =>
      price.id === priceId ? { ...price, [field]: value } : price
    );
    setFormData({ ...formData, prices: newPrices });
  };

  const handleDiscard = () => {
    setShowDiscardConfirm(false);
    navigate(`/admin/products/details`, { state: { productId: product?.id } });
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
<LoadingComponent />

      </AdminDashboardLayout>
    );
  }

  if (!product || !formData) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Product not found</div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <main className="lg:p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDiscardConfirm(true)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Edit Product</h1>
              <p className="text-gray-600 mt-1">{product.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-[--primary] text-white 
                rounded-lg hover:bg-[--primary]/90 transition-colors disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[--primary]/10 rounded-lg">
                  <Package className="w-5 h-5 text-[--primary]" />
                </div>
                <h2 className="text-lg font-semibold">Basic Information</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-[--primary] focus:border-transparent resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Type
                    </label>
                    <select
                      value={formData.productType}
                      onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                    >
                      <option value="PRODUCT">Product</option>
                      <option value="SERVICE">Service</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stripe Product ID
                    </label>
                    <input
                      type="text"
                      value={formData.stripeProductId}
                      onChange={(e) => setFormData({ ...formData, stripeProductId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="rounded border-gray-300 text-[--primary] focus:ring-[--primary]"
                    />
                    <span>Active</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded border-gray-300 text-[--primary] focus:ring-[--primary]"
                    />
                    <span>Featured</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[--primary]/10 rounded-lg">
                    <Star className="w-5 h-5 text-[--primary]" />
                  </div>
                  <h2 className="text-lg font-semibold">Features</h2>
                </div>
                <button
                  onClick={addFeature}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-[--primary] 
                    bg-[--primary]/10 rounded-lg hover:bg-[--primary]/20 transition-colors"
                >
                  <Plus size={16} />
                  Add Feature
                </button>
              </div>

              <div className="space-y-4">
                {formData.features?.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                      placeholder="Enter feature"
                    />
                    <button
                      onClick={() => removeFeature(index)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg 
                        transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Plans */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[--primary]/10 rounded-lg">
                    <DollarSign className="w-5 h-5 text-[--primary]" />
                  </div>
                  <h2 className="text-lg font-semibold">Pricing Plans</h2>
                </div>
              </div>

              <div className="space-y-6">
                {formData.prices?.map((price) => (
                  <div key={price.id} className="p-6 bg-gray-50 rounded-xl">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Plan Name
                        </label>
                        <input
                          type="text"
                          value={price.name}
                          onChange={(e) => handlePriceChange(price.id, 'name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                            focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                          <input
                            type="number"
                            value={price.unit_amount / 100}
                            onChange={(e) => handlePriceChange(
                              price.id,
                              'unit_amount',
                              parseFloat(e.target.value) * 100
                            )}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg 
                              focus:outline-none focus:ring-2 focus:ring-[--primary] 
                              focus:border-transparent"
                          />
                        </div>
                      </div>

                      {price.recurring && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Interval
                            </label>
                            <select
                              value={price.recurring.interval}
                              onChange={(e) => handlePriceChange(
                                price.id,
                                'recurring',
                                { ...price.recurring, interval: e.target.value }
                              )}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                focus:outline-none focus:ring-2 focus:ring-[--primary] 
                                focus:border-transparent"
                            >
                              <option value="month">Monthly</option>
                              <option value="year">Yearly</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Interval Count
                            </label>
                            <input
                              type="number"
                              value={price.recurring.interval_count}
                              onChange={(e) => handlePriceChange(
                                price.id,
                                'recurring',
                                { ...price.recurring, interval_count: parseInt(e.target.value) }
                              )}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                focus:outline-none focus:ring-2 focus:ring-[--primary] 
                                focus:border-transparent"
                            />
                          </div>
                        </>
                      )}

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={price.description}
                          onChange={(e) => handlePriceChange(price.id, 'description', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                            focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Save Changes Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Save Changes</h3>
              <p className="text-gray-600 text-sm mb-6">
                Make sure to save your changes before leaving this page. Unsaved changes will be lost.
              </p>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[--primary] 
                  text-white rounded-lg hover:bg-[--primary]/90 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-medium text-blue-900">Editing Products</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Update your product information carefully. Changes will be reflected immediately
                    for all users. Make sure to review all changes before saving.
                  </p>
                </div>
              </div>
            </div>

            {/* Warning Card */}
            <div className="bg-amber-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-medium text-amber-900">Important Note</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Changing prices will only affect new subscriptions. Existing subscriptions will
                    continue with their current pricing until their next renewal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Discard Changes Confirmation Modal */}
        {showDiscardConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Discard Changes</h3>
                  <p className="text-sm text-gray-500">You have unsaved changes</p>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to leave? All unsaved changes will be lost.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDiscardConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Keep Editing
                </button>
                <button
                  onClick={handleDiscard}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 
                    transition-colors"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </AdminDashboardLayout>
  );
}