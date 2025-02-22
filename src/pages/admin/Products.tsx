//@ts-nocheck
import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import instance from "../../http/instance";
import { Bell, Plus, Search, Eye, Trash, Menu, X, DollarSign, Tag, Package, Star } from 'lucide-react';
import axios from "axios";
import CreateServicePage from "./CreateServicePage";


const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0
  }).format(amount / 100);
};

const getTypeColor = (type: string | null) => {
  switch (type) {
    case 'PRODUCT':
      return 'bg-purple-100 text-purple-600';
    case 'SERVICE':
      return 'bg-blue-100 text-blue-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fetchProducts = async () => {
    const response = await instance.get("admin/products/all");
    setProducts(response.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePriceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      // FormData'daki unit_amount'ı integer ve features'ı array'e dönüştürüyoruz
      const submissionData = {
        ...formData,
        price: {
          ...formData.price,
          unit_amount: parseInt(formData.price.unit_amount, 10),
        },
        features: formData.features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f.length > 0),
      };

      await axios.post(
        "http://localhost:5001/api/product/create-priced-product",
        submissionData
      );
      fetchProducts();
    } catch (error) {
      alert("Error: " + error.message);
      console.error(error);
    }
  };

  const filteredServices = products.filter(service => {
      if (selectedFilter === 'ACTIVE' && !service.active) return false;
      if (selectedFilter === 'INACTIVE' && service.active) return false;
      if (selectedFilter === 'FEATURED' && !service.isFeatured) return false;
      
      const searchTerm = searchQuery.toLowerCase();
      return (
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        (service.productType?.toLowerCase() || '').includes(searchTerm)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          const aPrice = a.prices[0]?.unit_amount || 0;
          const bPrice = b.prices[0]?.unit_amount || 0;
          return bPrice - aPrice;
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });




  if (isCreating) {
    return <CreateServicePage onBack={() => setIsCreating(false)} />;
  }

  return (
    <AdminDashboardLayout>
      <main className="lg:p-8">
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-[#333333]">Services</h1>
          <p className="text-sm text-gray-500">Manage your products and services</p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-[#1649FF] text-white rounded-lg flex items-center hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </button>
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-[#1649FF]" />
            </div>
            <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">+2 new</span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">12</h3>
          <p className="text-sm text-gray-500">Total Services</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-[#1649FF]" />
            </div>
            <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">5 active</span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">8</h3>
          <p className="text-sm text-gray-500">Featured Services</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-[#1649FF]" />
            </div>
            <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">+3 today</span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">15</h3>
          <p className="text-sm text-gray-500">Active Subscriptions</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-[#1649FF]" />
            </div>
            <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">2 pending</span>
          </div>
          <h3 className="text-2xl font-semibold mb-1">4</h3>
          <p className="text-sm text-gray-500">Draft Services</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        {/* Mobile Filter Toggle */}
        <div className="flex lg:hidden justify-between items-center w-full">
          <button
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            className="px-4 py-2 bg-white text-gray-600 rounded-lg border border-gray-200"
          >
            {isFilterMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span className="ml-2">Filters</span>
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
          >
            <option value="name">Sort by: Name</option>
            <option value="price">Sort by: Price</option>
            <option value="recent">Sort by: Recent</option>
          </select>
        </div>

        {/* Filter Buttons */}
        <div className={`flex flex-wrap gap-2 ${isFilterMenuOpen ? 'block' : 'hidden'} lg:flex`}>
          {['ALL', 'ACTIVE', 'INACTIVE', 'FEATURED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedFilter === filter
                  ? 'bg-[#1649FF] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filter === 'ALL' ? 'All Services' : filter.charAt(0) + filter.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search and Sort - Desktop */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
            />
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
          >
            <option value="name">Sort by: Name</option>
            <option value="price">Sort by: Price</option>
            <option value="recent">Sort by: Recent</option>
          </select>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden relative">
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
          />
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header - Desktop */}
        <div className="hidden lg:grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50 text-sm font-medium">
          <div className="col-span-4">Service</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Actions</div>
        </div>

        {/* Services */}
        <div className="divide-y divide-gray-200">
          {filteredServices.map((service) => (
            <div key={service.id} className="p-4">
              {/* Desktop View */}
              <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                <div className="col-span-4">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{service.name}</p>
                        {service.isFeatured && (
                          <Star className="w-4 h-4 text-yellow-400 ml-2 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{service.description}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(service.productType)}`}>
                    {service.productType || 'Unknown'}
                  </span>
                </div>
                <div className="col-span-2">
                  {service.prices[0] ? (
                    <div className="text-sm">
                      <span className="font-medium">
                        {formatCurrency(service.prices[0].unit_amount, service.prices[0].currency)}
                      </span>
                      {service.prices[0].type === 'recurring' && service.prices[0].recurring && (
                        <span className="text-gray-500">
                          /{service.prices[0].recurring.interval}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">No price set</span>
                  )}
                </div>
                <div className="col-span-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    service.active
                      ? 'bg-[#E8FFF3] text-[#9EE248]'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {service.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="col-span-2 flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile View */}
              <div className="lg:hidden space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="flex items-center">
                        <p className="font-medium">{service.name}</p>
                        {service.isFeatured && (
                          <Star className="w-4 h-4 text-yellow-400 ml-2 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(service.productType)}`}>
                    {service.productType || 'Unknown'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    service.active
                      ? 'bg-[#E8FFF3] text-[#9EE248]'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {service.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  {service.prices[0] ? (
                    <div>
                      <span className="font-medium">
                        {formatCurrency(service.prices[0].unit_amount, service.prices[0].currency)}
                      </span>
                      {service.prices[0].type === 'recurring' && service.prices[0].recurring && (
                        <span className="text-gray-500">
                          /{service.prices[0].recurring.interval}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500">No price set</span>
                  )}
                  <span className="text-gray-500">
                    Created {new Date(service.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-6 gap-4">
        <p className="text-sm text-gray-600 text-center lg:text-left">
          Showing {filteredServices.length} of {products.length} services
        </p>
        <div className="flex justify-center space-x-2">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            Previous
          </button>
          <button className="px-4 py-2 bg-[#1649FF] text-white rounded-lg">1</button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            2
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            3
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </main>
    </AdminDashboardLayout>
  );
}

const ProductCard = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const deleteProduct = async () => {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      await instance.delete(`admin/products/${product.id}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      <p className="text-gray-600 text-sm mt-2">{product.description}</p>

      {isExpanded && (
        <div className="mt-4 border-t pt-4">
          <h3 className="font-medium">Prices</h3>
          <div className="mt-2">
            {product.prices.length > 0 ? (
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Type</th>
                    <th className="py-2">Amount (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {product.prices.map((price) => (
                    <tr key={price.id} className="border-b">
                      <td className="py-2">{price.type}</td>
                      <td className="py-2">
                        ${(price.unit_amount / 100).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No pricing details available.</p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded flex items-center">
          <Pencil size={16} className="mr-1" /> Edit
        </button>
        <button
          onClick={deleteProduct}
          className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded flex items-center"
        >
          <Trash size={16} className="mr-1" /> Delete
        </button>
      </div>
    </div>
  );
};
