import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../../components/layout/AdminDashboardLayout";
import { 
  Search, Plus, Building2, ArrowUpRight,  Filter,
  ChevronDown, ArrowUpDown, TrendingUp, TrendingDown, FileText,
  Info, User2, CheckCircle2, XCircle, Clock
} from "lucide-react";
import { getAllCompanies } from "../../../http/requests/admin/company";
import { Company } from "../../../http/requests/admin/company";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAYMENT_PENDING':
      return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    case 'ACTIVE':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    case 'SUSPENDED':
      return 'bg-red-50 text-red-700 border-red-100';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return <CheckCircle2 size={14} />;
    case 'SUSPENDED':
      return <XCircle size={14} />;
    case 'PAYMENT_PENDING':
      return <Clock size={14} />;
    default:
      return null;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount / 100);
};

export default function AdminCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{
    status: string;
    state: string;
    type: string;
  }>({
    status: "ALL",
    state: "ALL",
    type: "ALL"
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'createdAt', direction: 'desc' });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await getAllCompanies();
      setCompanies(response);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      status: "ALL",
      state: "ALL",
      type: "ALL"
    });
    setSearchQuery("");
  };

  // Filter and sort companies
  const filteredCompanies = companies.filter(company => {
    const matchesStatus = selectedFilters.status === "ALL" || company.status === selectedFilters.status;
    const matchesState = selectedFilters.state === "ALL" || company.state.name === selectedFilters.state;
    const matchesType = selectedFilters.type === "ALL" || company.companyType.name === selectedFilters.type;
    
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = 
      company.companyName.toLowerCase().includes(searchTerm) ||
      (company.businessActivity && company.businessActivity.toLowerCase().includes(searchTerm)) ||
      company.state.name.toLowerCase().includes(searchTerm);

    return matchesStatus && matchesState && matchesType && matchesSearch;
  }).sort((a, b) => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    switch (sortConfig.key) {
      case 'companyName':
        return direction * a.companyName.localeCompare(b.companyName);
      case 'state':
        return direction * a.state.name.localeCompare(b.state.name);
      case 'type':
        return direction * a.companyType.name.localeCompare(b.companyType.name);
      case 'createdAt':
        return direction * (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCompanies.slice(indexOfFirstRecord, indexOfLastRecord);

  // Stats
  const totalCompanies = companies.length;
  const newCompaniesThisWeek = companies.filter(c => {
    const createdDate = new Date(c.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdDate > weekAgo;
  }).length;

  const paymentPendingCount = companies.filter(c => c.status === "PAYMENT_PENDING").length;
  const activeCompanies = companies.filter(c => c.status === "ACTIVE").length;

  const handleExport = () => {
    // Convert companies to CSV
    const headers = ["Company Name", "State", "Type", "Status", "Created At"];
    const csvData = filteredCompanies.map(company => [
      company.companyName,
      company.state.name,
      company.companyType.name,
      company.status,
      new Date(company.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `companies_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminDashboardLayout>
      <main className="lg:p-8">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Companies</h1>
            <p className="text-gray-600">
              Manage and monitor your companies
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-[--primary] bg-[--primary]/10 
                rounded-lg hover:bg-[--primary]/20 transition-colors"
            >
              <FileText size={18} />
              Export Data
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[--primary] text-white 
                rounded-lg hover:bg-[--primary]/90 transition-colors"
            >
              <Plus size={18} />
              Add Company
            </button>
          </div>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Companies */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[--primary]/30 
            transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedFilters(prev => ({ ...prev, status: "ALL" }))}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[--primary]/10 rounded-xl flex items-center justify-center 
                group-hover:scale-110 transition-transform duration-300">
                <Building2 className="w-6 h-6 text-[--primary]" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs">
                <TrendingUp size={14} />
                <span>+{newCompaniesThisWeek} new</span>
              </div>
            </div>
            <h3 className="text-2xl font-semibold">{totalCompanies}</h3>
            <p className="text-sm text-gray-500">Total Companies</p>
          </div>

          {/* Active Companies */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[--primary]/30 
            transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedFilters(prev => ({ ...prev, status: "ACTIVE" }))}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center 
                group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs">
                <TrendingUp size={14} />
                <span>Active</span>
              </div>
            </div>
            <h3 className="text-2xl font-semibold">{activeCompanies}</h3>
            <p className="text-sm text-gray-500">Active Companies</p>
          </div>

          {/* Payment Pending */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[--primary]/30 
            transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedFilters(prev => ({ ...prev, status: "PAYMENT_PENDING" }))}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center 
                group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs">
                <TrendingDown size={14} />
                <span>Pending</span>
              </div>
            </div>
            <h3 className="text-2xl font-semibold">{paymentPendingCount}</h3>
            <p className="text-sm text-gray-500">Payment Pending</p>
          </div>

          {/* Users */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[--primary]/30 
            transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/admin/users')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[--primary]/10 rounded-xl flex items-center justify-center 
                group-hover:scale-110 transition-transform duration-300">
                <User2 className="w-6 h-6 text-[--primary]" />
              </div>
              <div className="flex items-center gap-1 text-[--primary] bg-[--primary]/10 px-2 py-1 rounded-full text-xs">
                <TrendingUp size={14} />
                <span>View All</span>
              </div>
            </div>
            <h3 className="text-2xl font-semibold">1,234</h3>
            <p className="text-sm text-gray-500">Total Users</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Search */}
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg 
                      hover:bg-gray-50"
                  >
                    <Filter size={16} />
                    <span>Filters</span>
                    <ChevronDown size={16} />
                  </button>
                  
                  {showFilters && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg 
                      border border-gray-200 p-4 z-50">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            value={selectedFilters.status}
                            onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                          >
                            <option value="ALL">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="PAYMENT_PENDING">Payment Pending</option>
                            <option value="SUSPENDED">Suspended</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <select
                            value={selectedFilters.state}
                            onChange={(e) => setSelectedFilters(prev => ({ ...prev, state: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                          >
                            <option value="ALL">All States</option>
                            <option value="Delaware">Delaware</option>
                            <option value="Wyoming">Wyoming</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          <select
                            value={selectedFilters.type}
                            onChange={(e) => setSelectedFilters(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                          >
                            <option value="ALL">All Types</option>
                            <option value="LLC">LLC</option>
                            <option value="C-Corp">C-Corp</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Active Filters */}
                {(selectedFilters.status !== "ALL" || 
                  selectedFilters.state !== "ALL" || 
                  selectedFilters.type !== "ALL") && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-[--primary] hover:text-[--primary]/80"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Records per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show</span>
              <select
                value={recordsPerPage}
                onChange={(e) => {
                  setRecordsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[--primary] focus:border-transparent"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-500">entries</span>
            </div>
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--primary]"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6">
                        <button
                          onClick={() => handleSort('companyName')}
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 
                            hover:text-gray-700"
                        >
                          Company
                          <ArrowUpDown size={14} />
                        </button>
                      </th>
                      <th className="text-left py-4 px-6">
                        <button
                          onClick={() => handleSort('state')}
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 
                            hover:text-gray-700"
                        >
                          State
                          <ArrowUpDown size={14} />
                        </button>
                      </th>
                      <th className="text-left py-4 px-6">
                        <button
                          onClick={() => handleSort('type')}
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 
                            hover:text-gray-700"
                        >
                          Type
                          <ArrowUpDown size={14} />
                        </button>
                      </th>
                      <th className="text-left py-4 px-6">Status</th>
                      <th className="text-left py-4 px-6">
                        <button
                          onClick={() => handleSort('createdAt')}
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 
                            hover:text-gray-700"
                        >
                          Created
                          <ArrowUpDown size={14} />
                        </button>
                      </th>
                      <th className="text-right py-4 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentRecords.map((company) => (
                      <tr 
                        key={company.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() =>navigate(`/admin/company/details`, { state: { companyId: company.id } })}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[--primary]/10 rounded-lg flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-[--primary]" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{company.companyName}</p>
                              {company.businessActivity && (
                                <p className="text-sm text-gray-500">{company.businessActivity}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs 
                            font-medium bg-gray-100 text-gray-700">
                            {company.state.name}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs 
                            font-medium bg-[--primary]/10 text-[--primary]">
                            {company.companyType.name}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs 
                            font-medium border ${getStatusColor(company.status)}`}>
                            {getStatusIcon(company.status)}
                            {company.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {new Date(company.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/admin/company/details`, { state: { companyId: company.id } });
                              }}
                              className="p-2 text-gray-400 hover:text-[--primary] hover:bg-[--primary]/10 
                                rounded-lg transition-colors group relative"
                              title="View Details"
                            >
                              <ArrowUpRight className="w-5 h-5" />
                              <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                                bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 
                                group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                View Details
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
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t 
                border-gray-200">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstRecord + 1} to{" "}
                  {Math.min(indexOfLastRecord, filteredCompanies.length)} of{" "}
                  {filteredCompanies.length} entries
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
                          ? 'bg-[--primary] text-white'
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
              </div>
            </>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-blue-900">Managing Companies</h3>
              <p className="text-sm text-blue-700 mt-1">
                Click on a company to view detailed information including documents, tasks, and user access.
                Use filters to quickly find specific companies or export data for reporting.
              </p>
            </div>
          </div>
        </div>
      </main>
    </AdminDashboardLayout>
  );
}