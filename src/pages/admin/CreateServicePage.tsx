import React, { useState } from 'react';
import { ArrowLeft, Bell, Plus, Star, Package, X, Radio } from 'lucide-react';
import { ServiceInput, ServicePriceInput } from '../../types/Product';
import AdminDashboardLayout from '../../components/layout/AdminDashboardLayout';

interface CreateServicePageProps {
  onBack: () => void;
}

const emptyPrice: ServicePriceInput = {
  name: '',
  isDefault: false,
  stripePriceId: '',
  type: 'one_time',
  unit_amount: 0,
  currency: 'usd',
  lookup_key: '',
  description: '',
  recurring: {
    interval: 'month',
    interval_count: 1
  }
};

export default function CreateServicePage({ onBack }: CreateServicePageProps) {
  const [formData, setFormData] = useState<ServiceInput>({
    name: '',
    description: '',
    features: [''],
    isFeatured: false,
    productType: 'SERVICE', // Default value
    prices: [{ ...emptyPrice, isDefault: true }]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would make the API call with formData
    console.log('Form Data:', formData);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addPrice = () => {
    setFormData(prev => ({
      ...prev,
      prices: [...prev.prices, { ...emptyPrice }]
    }));
  };

  const removePrice = (index: number) => {
    setFormData(prev => {
      const newPrices = prev.prices.filter((_, i) => i !== index);
      // If we removed the default price, make the first remaining price default
      if (prev.prices[index].isDefault && newPrices.length > 0) {
        newPrices[0].isDefault = true;
      }
      return { ...prev, prices: newPrices };
    });
  };

  const handlePriceChange = (index: number, field: keyof ServicePriceInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      prices: prev.prices.map((price, i) => {
        if (i === index) {
          if (field === 'recurring' && typeof value === 'object') {
            return {
              ...price,
              recurring: { ...price.recurring, ...value }
            };
          }
          return { ...price, [field]: value };
        }
        return price;
      })
    }));
  };

  const setDefaultPrice = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prices: prev.prices.map((price, i) => ({
        ...price,
        isDefault: i === index
      }))
    }));
  };

  return (
    <AdminDashboardLayout>
    <main className="lg:p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-[#333333]">Create Service</h1>
            <p className="text-sm text-gray-500">Add a new service or product</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
          </button>
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
            alt="Admin"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info & Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium">Basic Information</h2>
                  <p className="text-sm text-gray-500">Service details and description</p>
                </div>
                <Package className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                    placeholder="Enter service name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    id="productType"
                    value={formData.productType}
                    onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value as 'PRODUCT' | 'SERVICE' }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                    required
                  >
                    <option value="PRODUCT">Product</option>
                    <option value="SERVICE">Service</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                    placeholder="Enter service description"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="stripeProductId" className="block text-sm font-medium text-gray-700 mb-1">
                    Stripe Product ID (Optional)
                  </label>
                  <input
                    type="text"
                    id="stripeProductId"
                    value={formData.stripeProductId || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, stripeProductId: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                    placeholder="Enter Stripe Product ID"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="rounded border-gray-300 text-[#1649FF] focus:ring-[#1649FF]"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 flex items-center">
                    Featured Service
                    <Star className="w-4 h-4 text-yellow-400 ml-2" />
                  </label>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-medium">Features</h2>
                  <p className="text-sm text-gray-500">List the features of this service</p>
                </div>
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-3 py-1 text-sm bg-[#EEF2FF] text-[#1649FF] rounded-lg hover:bg-blue-50 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Feature
                </button>
              </div>

              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                      placeholder="Enter feature"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      disabled={formData.features.length === 1}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#1649FF] text-white rounded-lg hover:bg-blue-600"
              >
                Create Service
              </button>
            </div>
          </div>

          {/* Right Column - Pricing */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-medium">Pricing</h2>
                    <p className="text-sm text-gray-500">Set up pricing options</p>
                  </div>
                  <button
                    type="button"
                    onClick={addPrice}
                    className="px-3 py-1 text-sm bg-[#EEF2FF] text-[#1649FF] rounded-lg hover:bg-blue-50 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Price
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.prices.map((price, index) => (
                    <div key={index} className="relative border border-gray-200 rounded-lg p-4">
                      <div className="absolute right-2 top-2 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setDefaultPrice(index)}
                          className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs ${
                            price.isDefault
                              ? 'bg-[#E8FFF3] text-[#9EE248]'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Radio className="w-3 h-3" />
                          <span>{price.isDefault ? 'Default' : 'Make Default'}</span>
                        </button>
                        {formData.prices.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePrice(index)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-4 mt-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price Name
                          </label>
                          <input
                            type="text"
                            value={price.name}
                            onChange={(e) => handlePriceChange(index, 'name', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                            placeholder="e.g., Basic Plan"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stripe Price ID
                          </label>
                          <input
                            type="text"
                            value={price.stripePriceId}
                            onChange={(e) => handlePriceChange(index, 'stripePriceId', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                            placeholder="Enter Stripe Price ID"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price Type
                          </label>
                          <select
                            value={price.type}
                            onChange={(e) => handlePriceChange(index, 'type', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                          >
                            <option value="one_time">One Time</option>
                            <option value="recurring">Recurring</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount (in cents)
                          </label>
                          <input
                            type="number"
                            value={price.unit_amount}
                            onChange={(e) => handlePriceChange(index, 'unit_amount', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                            placeholder="e.g., 1000 for $10.00"
                            required
                          />
                        </div>

                        {price.type === 'recurring' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Billing Interval
                              </label>
                              <select
                                value={price.recurring?.interval}
                                onChange={(e) => handlePriceChange(index, 'recurring', { interval: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                              >
                                <option value="day">Daily</option>
                                <option value="week">Weekly</option>
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
                                value={price.recurring?.interval_count}
                                onChange={(e) => handlePriceChange(index, 'recurring', { interval_count: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                                min="1"
                                required
                              />
                            </div>
                          </>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <input
                            type="text"
                            value={price.description}
                            onChange={(e) => handlePriceChange(index, 'description', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                            placeholder="e.g., Monthly subscription price"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lookup Key (Optional)
                          </label>
                          <input
                            type="text"
                            value={price.lookup_key || ''}
                            onChange={(e) => handlePriceChange(index, 'lookup_key', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
                            placeholder="e.g., basic"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </main>
    </AdminDashboardLayout>
  );
}