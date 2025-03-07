import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminDashboardLayout from '../../components/layout/AdminDashboardLayout';
import { 
  ArrowLeft, Bell, CreditCard, Calendar, Download, 
  User, Building2, ExternalLink, CheckCircle2, XCircle,
  Clock, AlertCircle, Info, Package
} from 'lucide-react';
import { getOrderDetails, updateOrderStatus } from '../../http/requests/admin/orders';
import toast from 'react-hot-toast';
import { OrderDetails } from '../../types/OrderDetails';
import LoadingComponent from '../../components/Loading';
import AdminAvatar from '../../components/AdminAvatar';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-50 text-green-600 border-green-100';
    case 'IN_PROGRESS':
      return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'FAILED':
      return 'bg-red-50 text-red-600 border-red-100';
    case 'PENDING':
      return 'bg-yellow-50 text-yellow-600 border-yellow-100';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return <CheckCircle2 size={16} />;
    case 'IN_PROGRESS':
      return <Clock size={16} />;
    case 'FAILED':
      return <XCircle size={16} />;
    case 'PENDING':
      return <AlertCircle size={16} />;
    default:
      return null;
  }
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(new Date(dateString));
};

export default function AdminOrderDetails() {
  const [order, setOrder] = useState<OrderDetails|null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!location.state?.orderId) {
        toast.error('Order ID is missing');
        navigate('/admin/orders');
        return;
      }

      try {
        const orderDetails = await getOrderDetails(location.state.orderId);
        setOrder(orderDetails);
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [location.state?.orderId, navigate]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return;
    
    setUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus);
      setOrder(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
<LoadingComponent />

      </AdminDashboardLayout>
    );
  }

  if (!order) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">Order not found</div>
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
              onClick={() => navigate('/admin/orders')}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1.5 
                  ${getStatusColor(order.status)}`}
                >
                  {getStatusIcon(order.status)}
                  {order.status}
                </span>
              </div>
              <p className="text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>
            <AdminAvatar />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-center py-3 px-4">Quantity</th>
                      <th className="text-right py-3 px-4">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item) => (
                      <tr key={item.product.id} className="border-b border-gray-100">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Package className="w-8 h-8 text-gray-400" />
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-gray-500">{item.product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600">
                            {item.type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">{item.quantity}</td>
                        <td className="py-4 px-4 text-right font-medium">
                          {formatCurrency(item.price.unit_amount, item.price.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="py-4 px-4 text-right font-medium">Total</td>
                      <td className="py-4 px-4 text-right font-bold">
                        {formatCurrency(order.amount, order.currency)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-gray-400" size={20} />
                    <span className="font-medium">{order.paymentMethod.replace('_', ' ')}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Transaction Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-gray-400" size={20} />
                    <span className="font-medium">{formatDate(order.createdAt)}</span>
                  </div>
                </div>
                {order.stripeCheckoutSessionId && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Stripe Session ID</p>
                    <div className="flex items-center gap-2 font-mono text-sm">
                      {order.stripeCheckoutSessionId}
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {order.user.firstName} {order.user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{order.user.email}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Stripe Customer ID</p>
                  <div className="flex items-center gap-2 font-mono text-sm">
                    {order.user.customerStripeID}
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Company</p>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{order.company.companyName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Order Actions</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Update Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                    disabled={updating}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-[#1649FF]"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border 
                    border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <Download size={18} />
                  Download Invoice
                </button>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Order Created</p>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                {order.updatedAt !== order.createdAt && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-sm text-gray-500">{formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-blue-900">Managing Orders</h3>
              <p className="text-sm text-blue-700 mt-1">
                You can update the order status, download invoices, and view customer information from 
                this page. All changes are logged and can be tracked in the order timeline.
              </p>
            </div>
          </div>
        </div>
      </main>
    </AdminDashboardLayout>
  );
}