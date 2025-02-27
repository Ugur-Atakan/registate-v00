import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import instance from "../../http/instance";
import { Search, Plus, Bell, User } from "lucide-react";

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
};

export default function AdminCompanies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/admin/company/all");
      setCompanies(response.data);
      setTotalPages(Math.ceil(response.data.length / recordsPerPage));
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Update total pages when records per page changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredCompanies.length / recordsPerPage));
    setCurrentPage(1); // Reset to first page when changing records per page
  }, [recordsPerPage, companies, selectedFilter, searchQuery]);

  // Filtre ve aramaya göre listelenen şirketler
  const filteredCompanies = companies.filter((company) => {
    if (selectedFilter !== "ALL" && company.status !== selectedFilter) return false;
    const searchTerm = searchQuery.toLowerCase();
    return (
      company.companyName.toLowerCase().includes(searchTerm) ||
      (company.businessActivity &&
        company.businessActivity.toLowerCase().includes(searchTerm)) ||
      (company.companyType?.name &&
        company.companyType.name.toLowerCase().includes(searchTerm))
    );
  });

  // Get current page records
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCompanies.slice(indexOfFirstRecord, indexOfLastRecord);

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Overview kartları için metrikler
  const totalCompanies = companies.length;
  const paymentPendingCount = companies.filter(
    (c) => c.status === "PAYMENT_PENDING"
  ).length;

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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
          <div className="flex items-center space-x-4">
            <button
              className="px-4 py-2 bg-[#1649FF] text-white rounded-lg flex items-center hover:bg-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Company
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-[#1649FF]" />
              </div>
              <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">
                Total Companies
              </span>
            </div>
            <h3 className="text-2xl font-semibold">{totalCompanies}</h3>
            <p className="text-sm text-gray-500">
              Companies in the system
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-[#1649FF]" />
              </div>
              <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">
                Payment Pending
              </span>
            </div>
            <h3 className="text-2xl font-semibold">{paymentPendingCount}</h3>
            <p className="text-sm text-gray-500">
              Companies awaiting payment
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
            >
              <option value="ALL">All Companies</option>
              <option value="PAYMENT_PENDING">Payment Pending</option>
            </select>
            <div className="relative">
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
              />
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Records per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <select
              value={recordsPerPage}
              onChange={(e) => setRecordsPerPage(Number(e.target.value))}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-500">entries</span>
          </div>
        </div>

        {/* Companies Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 text-left">Company Name</th>
                <th className="py-2 px-4 text-left">State</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Business Activity</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1649FF]"></div>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((company) => (
                  <tr key={company.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{company.companyName}</td>
                    <td className="py-2 px-4">
                      {company.state
                        ? `${company.state.name} (${company.state.abbreviation})`
                        : "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      {company.companyType
                        ? company.companyType.name
                        : "N/A"}
                    </td>
                    <td className="py-2 px-4">
                      {company.businessActivity || "N/A"}
                    </td>
                    <td className="py-2 px-4">{company.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          {/* Records info */}
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstRecord + 1} to{" "}
            {Math.min(indexOfLastRecord, filteredCompanies.length)} of{" "}
            {filteredCompanies.length} entries
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === number
                    ? "bg-[#1649FF] text-white"
                    : "border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </AdminDashboardLayout>
  );
}