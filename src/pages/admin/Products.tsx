import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import instance from "../../http/instance";
import { 
  Bell, Plus, Search, Eye, Trash, Menu, X, DollarSign, Tag, Package, 
  Star, Info, ChevronDown, Filter, ArrowUpDown, CheckCircle2 
} from 'lucide-react';
import CreateServicePage from "./CreateServicePage";
import toast from "react-hot-toast";

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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await instance.get("admin/products/all");
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleBulkAction = async (action: 'delete' | 'toggleActive') => {
    if (!selectedItems.length) return;
    
    try {
      if (action === 'delete') {
        await Promise.all(selectedItems.map(id => 
          instance.delete(`admin/products/${id}`)
        ));
        toast.success("Selected items deleted successfully");
      } else {
        await Promise.all(selectedItems.map(id => 
          instance.patch(`admin/products/${id}/toggle-active`)
        ));
        toast.success("Status updated successfully");
      }
      fetchProducts();
      setSelectedItems([]);
    } catch (error) {
      toast.error("Failed to perform bulk action");
    }
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const filteredServices = products
    .filter(service => {
      if (selectedFilter === 'ACTIVE' && !service.active) return false;
      if (selectedFilter === 'INACTIVE' && service.active) return false;
      if (selectedFilter === 'FEATURED' && !service.isFeatured) return false;
      if (selectedTypes.length && !selectedTypes.includes(service.productType)) return false;
      
      const searchTerm = searchQuery.toLowerCase();
      return (
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm) ||
        (service.productType?.toLowerCase() || '').includes(searchTerm)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = (a.prices[0]?.unit_amount || 0) - (b.prices[0]?.unit_amount || 0);
          break;
        case 'type':
          comparison = (a.productType || '').localeCompare(b.productType || '');
          break;
        case 'recent':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
              <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">
                +2 new
              </span>
            </div>
            <h3 className="text-2xl font-semibold mb-1">
              {products.length}
            </h3>
            <p className="text-sm text-gray-500">Total Services</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-[#1649FF]" />
              </div>
              <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">
                Featured
              </span>
            </div>
            <h3 className="text-2xl font-semibold mb-1">
              {products.filter(p => p.isFeatured).length}
            </h3>
            <p className="text-sm text-gray-500">Featured Services</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#1649FF]" />
              </div>
              <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">
                Active
              </span>
            </div>
            <h3 className="text-2xl font-semibold mb-1">
              {products.filter(p => p.active).length}
            </h3>
            <p className="text-sm text-gray-500">Active Services</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-[#1649FF]" />
              </div>
              <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">
                Types
              </span>
            </div>
            <h3 className="text-2xl font-semibold mb-1">
              {new Set(products.map(p => p.productType)).size}
            </h3>
            <p className="text-sm text-gray-500">Service Types</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-[#1649FF]"
                />
              </div>

              {/* Type Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg 
                    hover:bg-gray-50"
                >
                  <Filter size={16} />
                  <span>Type</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 
                    ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg 
                    border border-gray-200 z-50">
                    {['PRODUCT', 'SERVICE'].map(type => (
                      <label
                        key={type}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => {
                            setSelectedTypes(prev =>
                              prev.includes(type)
                                ? prev.filter(t => t !== type)
                                : [...prev, type]
                            );
                          }}
                          className="rounded border-gray-300 text-[#1649FF] focus:ring-[#1649FF]"
                        />
                        <span>{type}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[#1649FF]"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="FEATURED">Featured</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction('toggleActive')}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                >
                  Toggle Active
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1649FF]"></div>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-8 p-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === paginatedServices.length}
                          onChange={(e) => {
                            setSelectedItems(
                              e.target.checked
                                ? paginatedServices.map(s => s.id)
                                : []
                            );
                          }}
                          className="rounded border-gray-300 text-[#1649FF] focus:ring-[#1649FF]"
                        />
                      </th>
                      <th className="text-left p-4">
                        <button
                          onClick={() => handleSort('name')}
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 
                            hover:text-gray-700"
                        >
                          Service
                          <ArrowUpDown size={14} />
                        </button>
                      </th>
                      <th className="text-left p-4">
                        <button
                          onClick={() => handleSort('type')}
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 
                            hover:text-gray-700"
                        >
                          Type
                          <ArrowUpDown size={14} />
                        </button>
                      </th>
                      <th className="text-left p-4">
                        <button
                          onClick={() => handleSort('price')}
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 
                            hover:text-gray-700"
                        >
                          Price
                          <ArrowUpDown size={14} />
                        </button>
                      </th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedServices.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(service.id)}
                            onChange={(e) => {
                              setSelectedItems(prev =>
                                e.target.checked
                                  ? [...prev, service.id]
                                  : prev.filter(id => id !== service.id)
                              );
                            }}
                            className="rounded border-gray-300 text-[#1649FF] focus:ring-[#1649FF]"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Package className="w-8 h-8 text-gray-400" />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900">{service.name}</p>
                                {service.isFeatured && (
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500 line-clamp-2">
                                {service.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            getTypeColor(service.productType)
                          }`}>
                            {service.productType || 'Unknown'}
                          </span>
                        </td>
                        <td className="p-4">
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
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              service.active ? 'bg-green-500' : 'bg-gray-300'
                            }`} />
                            <span className="text-sm font-medium">
                              {service.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="p-2 text-gray-400 hover:text-[#1649FF] hover:bg-[#1649FF]/10 
                                rounded-lg transition-colors group relative"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                                bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 
                                group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                View Details
                              </span>
                            </button>
                            <button
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 
                                rounded-lg transition-colors group relative"
                              title="Delete Service"
                            >
                              <Trash className="w-5 h-5" />
                              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                                bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 
                                group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Delete Service
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t 
                border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 border border-gray-200 rounded-lg text-sm"
                  >
                    {[10, 25, 50, 100].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-500">entries</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        currentPage === page
                          ? 'bg-[#1649FF] text-white'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>

                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredServices.length)} of{' '}
                  {filteredServices.length} entries
                </div>
              </div>
            </>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-blue-900">Managing Services</h3>
              <p className="text-sm text-blue-700 mt-1">
                Use bulk actions to efficiently manage multiple services at once. You can toggle their 
                active status or delete them in bulk.
              </p>
            </div>
          </div>
        </div>
      </main>
    </AdminDashboardLayout>
  );
}