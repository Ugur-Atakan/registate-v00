import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Calendar,
  User,
  Building2,
  CreditCard,
  MessageSquare,
  ArrowUpRight,
  Shield,
  Settings,
  PackageOpen,
  Inbox,
  X,
  ToggleLeft,
  ToggleRight,
  Loader2
} from "lucide-react";
import instance from "../../http/instance";
import toast from "react-hot-toast";
import LoadingComponent from "../../components/Loading";

interface UserDetails {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  emailConfirmed: boolean;
  telephoneConfirmed: boolean;
  notifications: boolean;
  isActive: boolean;
  loginProvider: string;
  createdAt: string;
  telephone: string | null;
  customerStripeID: string | null;
  roles: string[];
  companies: {
    companyId: string;
    companyName: string;
    role: string;
    createdAt: string;
    state: string;
    companyType: string;
    status: string;
  }[];
  orders: {
    id: string;
    status: string;
    amount: number;
    currency: string;
    stripeCheckoutSessionId: string | null;
    createdAt: string;
    updatedAt: string;
    companyId: string;
    paymentMethod: string;
    orderItems: {
      product: {
        name: string;
        description: string;
      };
      price: {
        unit_amount: number;
        currency: string;
      };
    }[];
  }[];
  tickets: {
    id: string;
    ticketNo: number;
    subject: string;
    category: string;
    status: string;
    priority: string;
    createdAt: string;
  }[];
}

export default function UserDetailPage() {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    telephone: "",
    profileImage: "",
    notifications: false,
    isActive: true
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!location.state?.userId) {
        toast.error("User ID is missing");
        navigate("/admin/users");
        return;
      }

      try {
        const response = await instance.get(`/admin/users/${location.state.userId}`);
        setUser(response.data);
        
        // Initialize form data with user details
        setFormData({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          telephone: response.data.telephone || "",
          profileImage: response.data.profileImage || "",
          notifications: response.data.notifications || false,
          isActive: response.data.isActive || false
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to load user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [location.state?.userId, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const response = await instance.put(`/admin/users/${user.id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        telephone: formData.telephone,
        profileImage: formData.profileImage,
        notifications: formData.notifications,
        isActive: formData.isActive
      });
      
      // Update the user state with the new data
      setUser(prev => prev ? { ...prev, ...response.data } : null);
      toast.success("User updated successfully");
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const cancelEdit = () => {
    // Reset form data to current user values
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        telephone: user.telephone || "",
        profileImage: user.profileImage || "",
        notifications: user.notifications || false,
        isActive: user.isActive || false
      });
    }
    setIsEditMode(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
      case 'paid':
        return 'bg-green-50 text-green-700';
      case 'pending':
      case 'in_progress':
        return 'bg-blue-50 text-blue-700';
      case 'canceled':
      case 'failed':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
       <LoadingComponent />
      </AdminDashboardLayout>
    );
  }

  if (!user) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500">User not found</div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Edit Profile Modal */}
        {isEditMode && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold">Edit User Profile</h3>
                <button 
                  onClick={cancelEdit}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[--primary] focus:border-[--primary]"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[--primary] focus:border-[--primary]"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Telephone</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[--primary] focus:border-[--primary]"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Profile Image URL</label>
                  <input
                    type="text"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-[--primary] focus:border-[--primary]"
                    placeholder="Profile Picture URL"
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 border border-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Notifications</p>
                    <p className="text-sm text-gray-500">Enable user notifications</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, notifications: !prev.notifications}))}
                    className="text-[--primary]"
                  >
                    {formData.notifications ? (
                      <ToggleRight size={24} />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-2 border border-gray-100 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-700">Account Status</p>
                    <p className="text-sm text-gray-500">Set user account as active/inactive</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, isActive: !prev.isActive}))}
                    className={formData.isActive ? "text-green-500" : "text-gray-400"}
                  >
                    {formData.isActive ? (
                      <ToggleRight size={24} />
                    ) : (
                      <ToggleLeft size={24} />
                    )}
                  </button>
                </div>
                
                <div className="pt-4 border-t flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[--primary] text-white rounded-lg hover:bg-[--primary]/90 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/users")}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold">User Profile</h1>
              <p className="text-gray-600 mt-1">Manage user details and access</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Overview Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{user.email}</span>
                      {user.emailConfirmed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>

                    {user.telephone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{user.telephone}</span>
                        {user.telephoneConfirmed ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Joined {formatDate(user.createdAt)}
                      </span>
                    </div>

                    {user.customerStripeID && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-mono text-gray-600">
                          {user.customerStripeID}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {user.roles.map((role) => (
                      <span
                        key={role}
                        className="px-3 py-1 bg-[--primary]/10 text-[--primary] rounded-full text-sm font-medium"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 text-[--primary] bg-[--primary]/10 
                    rounded-lg hover:bg-[--primary]/20 transition-colors"
                >
                  <Settings size={18} />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Companies Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Associated Companies</h3>
              <div className="space-y-4">
                {user.companies.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Building2 className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No companies associated yet</p>
                    <p className="text-gray-400 text-sm mt-1">This user hasn't been added to any companies</p>
                  </div>
                ) : (
                  user.companies.map((company) => (
                    <div
                      key={company.companyId}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg 
                        hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-[--primary]/10 rounded-lg">
                          <Building2 className="w-5 h-5 text-[--primary]" />
                        </div>
                        <div>
                          <h4 className="font-medium">{company.companyName}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">
                              {company.companyType} • {company.state}
                            </span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              getStatusColor(company.status)
                            }`}>
                              {company.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/admin/company/details`, { 
                          state: { companyId: company.companyId } 
                        })}
                        className="p-2 text-gray-400 hover:text-[--primary] hover:bg-[--primary]/10 
                          rounded-lg transition-colors"
                      >
                        <ArrowUpRight size={20} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Orders Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {user.orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <PackageOpen className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No orders yet</p>
                    <p className="text-gray-400 text-sm mt-1">This user hasn't placed any orders</p>
                  </div>
                ) : (
                  user.orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Order #{order.id.slice(0, 8)}</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            getStatusColor(order.status)
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <span className="text-lg font-bold">
                          {formatCurrency(order.amount, order.currency)}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            {item.product.name} - {formatCurrency(item.price.unit_amount, item.price.currency)}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar size={16} />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <button
                          onClick={() => navigate(`/admin/orders/details`, { 
                            state: { orderId: order.id } 
                          })}
                          className="flex items-center gap-1 text-sm text-[--primary] hover:underline"
                        >
                          View Details
                          <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Account Overview</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-medium">{user.orders.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Companies</span>
                  <span className="font-medium">
                    {user.companies.filter(c => c.status === 'ACTIVE').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Open Tickets</span>
                  <span className="font-medium">
                    {user.tickets.filter(t => t.status === 'OPEN').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Support Tickets */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Support Tickets</h3>
              <div className="space-y-3">
                {user.tickets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Inbox className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No support tickets yet</p>
                    <p className="text-gray-400 text-sm mt-1">User hasn't created any support tickets</p>
                  </div>
                ) : (
                  user.tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => navigate(`/admin/support/details`, { 
                        state: { ticketId: ticket.id } 
                      })}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">#{ticket.ticketNo}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          getStatusColor(ticket.status)
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ticket.subject}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{ticket.category}</span>
                        <span>{formatDate(ticket.createdAt)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-medium text-blue-900">Account Security</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Monitor user activity and manage account access. Contact support if you notice any
                    suspicious behavior.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}