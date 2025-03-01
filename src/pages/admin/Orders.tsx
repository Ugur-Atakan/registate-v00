import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import {
  Bell,
  Search,
  Filter,
  ChevronDown,
  ArrowUpDown,
  Info,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ShoppingCart,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { getAllOrders, Order } from "../../http/requests/admin/orders";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

const getStatusColor = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-50 text-green-600 border-green-100";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-600 border-blue-100";
    case "FAILED":
      return "bg-red-50 text-red-600 border-red-100";
    case "PENDING":
      return "bg-yellow-50 text-yellow-600 border-yellow-100";
    default:
      return "bg-gray-50 text-gray-600 border-gray-100";
  }
};
const getStatusText = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "Completed";
    case "IN_PROGRESS":
      return "In Progress";
    case "Failed":
      return "bg-red-50 text-red-600 border-red-100";
    case "PENDING":
      return "Pending";
    case "FAILED":
      return "Failed";
    default:
      return "bg-gray-50 text-gray-600 border-gray-100";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle2 size={14} />;
    case "IN_PROGRESS":
      return <Clock size={14} />;
    case "FAILED":
      return <XCircle size={14} />;
    case "PENDING":
      return <AlertCircle size={14} />;
    default:
      return null;
  }
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const navigate = useNavigate();

    const location = useLocation();
  
    const companyId = location.state?.companyId;
    // if(companyId){ 
    //   return <div>Company Gönderildi</div>
    // }

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const fetchedOrders = await getAllOrders();
      setOrders(fetchedOrders || []); // Ensure we always have an array
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const filteredOrders = orders
    .filter((order) => {
      if (selectedStatus !== "ALL" && order.status !== selectedStatus)
        return false;

      const searchTerm = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchTerm) ||
        order.user.email.toLowerCase().includes(searchTerm) ||
        `${order.user.firstName} ${order.user.lastName}`
          .toLowerCase()
          .includes(searchTerm)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "date":
          comparison =
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case "amount":
          comparison = b.amount - a.amount;
          break;
        case "customer":
          comparison = `${a.user.firstName} ${a.user.lastName}`.localeCompare(
            `${b.user.firstName} ${b.user.lastName}`
          );
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredOrders.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <AdminDashboardLayout>
      <main className="lg:p-8">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Order Management</h1>
            <p className="text-gray-600">View and manage customer orders</p>
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

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-[#1649FF]" />
              </div>
              <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">
                Total
              </span>
            </div>
            <h3 className="text-2xl font-semibold mb-1">{orders.length}</h3>
            <p className="text-sm text-gray-500">Total Orders</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#1649FF]" />
              </div>
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                Pending
              </span>
            </div>
            <h3 className="text-2xl font-semibold mb-1">
              {orders.filter((o) => o.status === "PENDING").length}
            </h3>
            <p className="text-sm text-gray-500">Pending Orders</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#1649FF]" />
              </div>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                Completed
              </span>
            </div>
            <h3 className="text-2xl font-semibold mb-1">
              {orders.filter((o) => o.status === "COMPLETED").length}
            </h3>
            <p className="text-sm text-gray-500">Completed Orders</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#EEF2FF] rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#1649FF]" />
              </div>
              <span className="text-xs px-2 py-1 bg-[#E8FFF3] text-[#9EE248] rounded-full">
                Revenue
              </span>
            </div>
            <h3 className="text-2xl font-semibold mb-1">
              {formatCurrency(
                orders.reduce((sum, order) => sum + order.amount, 0),
                "USD"
              )}
            </h3>
            <p className="text-sm text-gray-500">Total Revenue</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Search */}
              <div className="relative flex-grow max-w-md">
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                    focus:ring-2 focus:ring-[#1649FF]"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg 
                    hover:bg-gray-50"
                >
                  <Filter size={16} />
                  <span>Status</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 
                    ${isFilterMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isFilterMenuOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg 
                    border border-gray-200 z-50"
                  >
                    {[
                      "ALL",
                      "PENDING",
                      "IN_PROGRESS",
                      "COMPLETED",
                      "FAILED",
                    ].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedStatus(status);
                          setIsFilterMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                          selectedStatus === status ? "bg-gray-50" : ""
                        }`}
                      >
                        {status === "ALL" ? "All Orders" : status}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[#1649FF]"
              >
                <option value="date">Sort by: Date</option>
                <option value="amount">Sort by: Amount</option>
                <option value="customer">Sort by: Customer</option>
              </select>
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
                  focus:ring-2 focus:ring-[#1649FF]"
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

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1649FF]"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4">
                        <button
                          onClick={() => handleSort("id")}
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 
                            hover:text-gray-700"
                        >
                          Order ID
                          <ArrowUpDown size={14} />
                        </button>
                      </th>
                      <th className="text-left p-4">
                        <button
                          onClick={() => handleSort("customer")}
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 
                            hover:text-gray-700"
                        >
                          Customer
                          <ArrowUpDown size={14} />
                        </button>
                      </th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">
                        <button
                          onClick={() => handleSort("amount")}
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 
                            hover:text-gray-700"
                        >
                          Amount
                          <ArrowUpDown size={14} />
                        </button>
                      </th>
                      <th className="text-left p-4">Payment</th>
                      <th className="text-left p-4">
                        <button
                          onClick={() => handleSort("date")}
                          className="flex items-center gap-2 text-sm font-medium text-gray-500 
                            hover:text-gray-700"
                        >
                          Date
                          <ArrowUpDown size={14} />
                        </button>
                      </th>
                      <th className="text-right p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentRecords.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <span className="font-mono text-sm">
                            {order.id.slice(0, 8)}...
                          </span>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">
                              {order.user.firstName} {order.user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.user.email}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                            text-xs font-medium border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusIcon(order.status)}
                           {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-medium">
                            {formatCurrency(order.amount, order.currency)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <CreditCard size={16} className="text-gray-400" />
                            <span className="text-sm">
                              {order.paymentMethod.replace("_", " ")}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() =>
                                navigate(`/admin/orders/details`, {
                                  state: { orderId: order.id },
                                })
                              }
                              className="p-2 text-gray-400 hover:text-[#1649FF] hover:bg-[#1649FF]/10 
                                rounded-lg transition-colors group relative"
                              title="View Details"
                            >
                              <ArrowUpRight className="w-5 h-5" />
                              <span
                                className="absolute bottom-full mb-2 right-0 bg-gray-800 text-white 
                                text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 
                                transition-opacity whitespace-nowrap"
                              >
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
              <div
                className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t 
                border-gray-200"
              >
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstRecord + 1} to{" "}
                  {Math.min(indexOfLastRecord, filteredOrders.length)} of{" "}
                  {filteredOrders.length} entries
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          currentPage === number
                            ? "bg-[#1649FF] text-white"
                            : "border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {number}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => paginate(currentPage + 1)}
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
              <h3 className="font-medium text-blue-900">Managing Orders</h3>
              <p className="text-sm text-blue-700 mt-1">
                View and manage all orders in one place. Click on an order to
                see detailed information including customer details, order
                items, and payment information.
              </p>
            </div>
          </div>
        </div>
      </main>
    </AdminDashboardLayout>
  );
}
