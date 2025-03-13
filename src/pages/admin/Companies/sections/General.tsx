import toast from "react-hot-toast";
import instance from "../../../../http/instance";
import { useEffect, useState } from "react";
import { 
  Activity, Building2, DollarSign, MapPin, Users, Ticket, Briefcase,
  Save, X, Edit
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../../../../components/Loading";
import { businessCategories } from "../../../../utils/businessCategories";

interface SectionProps {
  companyId: string;
}

interface CompanyState {
  id: string;
  name: string;
}

interface CompanyType {
  id: string;
  name: string;
}

export default function CompanyGeneralSection({ companyId }: SectionProps) {
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [states, setStates] = useState<CompanyState[]>([]);
  const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    companyTypeId: "",
    stateId: "",
    businessActivity: "",
    monetaryValue: 0,
    addressPreference: "PROVIDED" as "PROVIDED" | "CUSTOM",
    customAddress: "",
    hiringPlans: ""
  });

  const navigate = useNavigate();

  const goCompanyTickets = () => {
    navigate(`/admin/support`, { state: { companyId: companyId } });
  };

  const goCompanyOrders = () => {
    navigate(`/admin/orders`, { state: { companyId: companyId } });
  };

  const goCompanyTasks = () => {
    navigate(`/admin/tasks`, { state: { companyId: companyId } });
  };

  const fetchCompanyDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get(
        `/admin/company/${companyId}/details`
      );
      setCompany(response.data);
      setEditForm({
        companyTypeId: response.data.companyTypeId || "",
        stateId: response.data.stateId || "",
        businessActivity: response.data.businessActivity || "",
        monetaryValue: response.data.monetaryValue || 0,
        addressPreference: response.data.addressPreference || "PROVIDED",
        customAddress: response.data.customAddress || "",
        hiringPlans: response.data.hiringPlans || ""
      });
    } catch (error) {
      console.error("Error fetching company details", error);
      toast.error("Failed to load company details");
    } finally {
      setLoading(false);
    }
  };

  const fetchStatesAndTypes = async () => {
    try {
      const [statesResponse, typesResponse] = await Promise.all([
        instance.get('/formation/state/all'),
        instance.get('/formation/company-type/all')
      ]);
      setStates(statesResponse.data);
      setCompanyTypes(typesResponse.data);
    } catch (error) {
      console.error("Error fetching states and types:", error);
      toast.error("Failed to load form data");
    }
  };

  useEffect(() => {
    fetchCompanyDetails();
    fetchStatesAndTypes();
  }, [companyId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await instance.put(`/admin/company/${companyId}`, {
        ...editForm,
        status: company.status
      });
      
      await fetchCompanyDetails();
      setIsEditing(false);
      toast.success("Company details updated successfully");
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company details");
    } finally {
      setSaving(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAYMENT_PENDING':
        return 'Payment Pending';
      case 'PAID':
        return 'Paid';
      case 'INPROGRESS':
        return 'In Progress';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'ACTIVE':
        return 'Active';
      case 'INACTIVE':
        return 'Inactive';
      case 'PENDING':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div>
      {/* Quick Actions Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={goCompanyTickets}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Ticket className="w-5 h-5 mr-2" />
          Tickets
        </button>
        <button
          onClick={goCompanyOrders}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <DollarSign className="w-5 h-5 mr-2" />
          Orders
        </button>
        <button
          onClick={goCompanyTasks}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Briefcase className="w-5 h-5 mr-2" />
          Tasks
        </button>
      </div>

      {/* Company Information Card */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[--primary]/10 rounded-lg">
              <Building2 className="w-5 h-5 text-[--primary]" />
            </div>
            <h2 className="text-lg font-semibold">Company Information</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${
              company?.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
            }`}>
              {company && getStatusText(company.status)}
            </span>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-[--primary] bg-[--primary]/10 
                  rounded-lg hover:bg-[--primary]/20 transition-colors"
              >
                <Edit size={16} />
                Edit Details
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-gray-600 bg-gray-100 
                    rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-3 py-1.5 text-white bg-[--primary] 
                    rounded-lg hover:bg-[--primary]/90 transition-colors disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Company Type */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Company Type</p>
            {isEditing ? (
              <select
                value={editForm.companyTypeId}
                onChange={(e) => setEditForm(prev => ({ ...prev, companyTypeId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[--primary]"
              >
                {companyTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            ) : (
              <p className="font-medium">{company?.companyType}</p>
            )}
          </div>

          {/* State */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Registration State</p>
            {isEditing ? (
              <select
                value={editForm.stateId}
                onChange={(e) => setEditForm(prev => ({ ...prev, stateId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[--primary]"
              >
                {states.map(state => (
                  <option key={state.id} value={state.id}>{state.name}</option>
                ))}
              </select>
            ) : (
              <p className="font-medium">{company?.state}</p>
            )}
          </div>

          {/* Business Activity */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Business Activity</p>
            {isEditing ? (
              <select
                value={editForm.businessActivity}
                onChange={(e) => setEditForm(prev => ({ ...prev, businessActivity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[--primary]"
              >
                <option value="">Select Activity</option>
                {businessCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            ) : (
              <p className="font-medium">{company?.businessActivity || "Not specified"}</p>
            )}
          </div>

          {/* Monetary Value */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Monetary Value</p>
            {isEditing ? (
              <input
                type="number"
                value={editForm.monetaryValue}
                onChange={(e) => setEditForm(prev => ({ 
                  ...prev, 
                  monetaryValue: parseInt(e.target.value) || 0 
                }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[--primary]"
              />
            ) : (
              <p className="font-medium">
                ${company?.monetaryValue?.toLocaleString() || "0"}
              </p>
            )}
          </div>

          {/* Address Preference */}
          <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Address</p>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={editForm.addressPreference === "PROVIDED"}
                      onChange={() => setEditForm(prev => ({
                        ...prev,
                        addressPreference: "PROVIDED",
                        customAddress: ""
                      }))}
                      className="text-[--primary]"
                    />
                    <span>Use Registate Address</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={editForm.addressPreference === "CUSTOM"}
                      onChange={() => setEditForm(prev => ({
                        ...prev,
                        addressPreference: "CUSTOM"
                      }))}
                      className="text-[--primary]"
                    />
                    <span>Use Custom Address</span>
                  </label>
                </div>
                {editForm.addressPreference === "CUSTOM" && (
                  <input
                    type="text"
                    value={editForm.customAddress}
                    onChange={(e) => setEditForm(prev => ({ 
                      ...prev, 
                      customAddress: e.target.value 
                    }))}
                    placeholder="Enter custom address"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-2 focus:ring-[--primary]"
                  />
                )}
              </div>
            ) : (
              <p className="font-medium">
                {company?.addressPreference === "CUSTOM" 
                  ? company.customAddress 
                  : "Using Registate Address"}
              </p>
            )}
          </div>

          {/* Hiring Plans */}
          <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Hiring Plans</p>
            {isEditing ? (
              <textarea
                value={editForm.hiringPlans}
                onChange={(e) => setEditForm(prev => ({ 
                  ...prev, 
                  hiringPlans: e.target.value 
                }))}
                placeholder="Describe your hiring plans..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                  focus:ring-2 focus:ring-[--primary] min-h-[100px] resize-none"
              />
            ) : (
              <p className="font-medium">{company?.hiringPlans || "No hiring plans specified"}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}