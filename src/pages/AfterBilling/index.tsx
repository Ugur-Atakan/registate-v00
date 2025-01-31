import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Building2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Director,
  AfterBillingFormData,
} from "../../types/AfterBilling";
import { PlanType } from "../../types/FormData";

const initialDirector: Director = {
  id: crypto.randomUUID(),
  name: "",
  email: "",
  phone: "",
  address: "",
  role: "Founder",
};

export default function AfterBilling() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("silver");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AfterBillingFormData>({
    totalShares: 10000000,
    parValuePerShare: 0.0001,
    directors: [{ ...initialDirector }],
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof AfterBillingFormData, string>>
  >({});
  const [directorErrors, setDirectorErrors] = useState<
    Record<string, Partial<Record<keyof Director, string>>>
  >({});

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^\+?[\d\s-()]{10,}$/.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AfterBillingFormData, string>> = {};
    const newDirectorErrors: Record<
      string,
      Partial<Record<keyof Director, string>>
    > = {};
    let isValid = true;

    if (!formData.totalShares || formData.totalShares <= 0) {
      newErrors.totalShares = "Total shares must be greater than 0";
      isValid = false;
    }

    if (!formData.parValuePerShare || formData.parValuePerShare <= 0) {
      newErrors.parValuePerShare = "Par value must be greater than 0";
      isValid = false;
    }

    formData.directors.forEach((director) => {
      const directorError: Partial<Record<keyof Director, string>> = {};

      if (!director.name.trim()) {
        directorError.name = "Name is required";
        isValid = false;
      }

      if (!director.email.trim()) {
        directorError.email = "Email is required";
        isValid = false;
      } else if (!validateEmail(director.email)) {
        directorError.email = "Invalid email format";
        isValid = false;
      }

      if (!director.phone.trim()) {
        directorError.phone = "Phone is required";
        isValid = false;
      } else if (!validatePhone(director.phone)) {
        directorError.phone = "Invalid phone format";
        isValid = false;
      }

      if (!director.address.trim()) {
        directorError.address = "Address is required";
        isValid = false;
      }

      if (Object.keys(directorError).length > 0) {
        newDirectorErrors[director.id] = directorError;
      }
    });

    setErrors(newErrors);
    setDirectorErrors(newDirectorErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);
    try {
      toast.success("Company information saved successfully");
      if (selectedPlan === "platinum") {
        navigate("/after-billing-details");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error saving company information:", error);
      toast.error("Failed to save company information");
    } finally {
      setLoading(false);
    }
  };

  const addDirector = () => {
    setFormData((prev) => ({
      ...prev,
      directors: [
        ...prev.directors,
        { ...initialDirector, id: crypto.randomUUID() },
      ],
    }));
  };

  const removeDirector = (id: string) => {
    if (formData.directors.length === 1) {
      toast.error("At least one director is required");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      directors: prev.directors.filter((director) => director.id !== id),
    }));

    const newDirectorErrors = { ...directorErrors };
    delete newDirectorErrors[id];
    setDirectorErrors(newDirectorErrors);
  };

  const updateDirector = (id: string, field: keyof Director, value: string) => {
    setFormData((prev) => ({
      ...prev,
      directors: prev.directors.map((director) =>
        director.id === id ? { ...director, [field]: value } : director
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Company Setup
          </h1>
          <p className="text-gray-600">
            Please provide the required information to finalize your company
            formation
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white p-8 rounded-xl shadow-sm"
        >
          {/* Share Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="text-[--primary]" size={24} />
              <h2 className="text-xl font-semibold">Share Structure</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Number of Shares
                </label>
                <input
                  type="number"
                  value={formData.totalShares}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      totalShares: parseFloat(e.target.value),
                    }))
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.totalShares ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[--primary] focus:border-transparent`}
                />
                {errors.totalShares && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.totalShares}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Par Value Per Share
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.parValuePerShare}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      parValuePerShare: parseFloat(e.target.value),
                    }))
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.parValuePerShare
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-[--primary] focus:border-transparent`}
                />
                {errors.parValuePerShare && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.parValuePerShare}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Directors Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="text-[--primary]" size={24} />
                <h2 className="text-xl font-semibold">Board of Directors</h2>
              </div>
              <button
                type="button"
                onClick={addDirector}
                className="flex items-center gap-2 px-4 py-2 text-[--primary] bg-[--primary]/10 
                  rounded-lg hover:bg-[--primary]/20 transition-colors duration-200"
              >
                <Plus size={18} />
                Add Director
              </button>
            </div>

            <div className="space-y-6">
              {formData.directors.map((director, index) => (
                <div
                  key={director.id}
                  className="p-6 bg-gray-50 rounded-lg border border-gray-200 relative"
                >
                  <div className="absolute -top-3 left-4 bg-[--primary] text-white px-3 py-1 rounded-full text-sm">
                    Director {index + 1}
                  </div>

                  {formData.directors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDirector(director.id)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-red-500 
                        transition-colors duration-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}

                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={director.name}
                        onChange={(e) =>
                          updateDirector(director.id, "name", e.target.value)
                        }
                        className={`w-full px-4 py-3 rounded-lg border ${
                          directorErrors[director.id]?.name
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-[--primary] focus:border-transparent`}
                      />
                      {directorErrors[director.id]?.name && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {directorErrors[director.id].name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={director.email}
                        onChange={(e) =>
                          updateDirector(director.id, "email", e.target.value)
                        }
                        className={`w-full px-4 py-3 rounded-lg border ${
                          directorErrors[director.id]?.email
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-[--primary] focus:border-transparent`}
                      />
                      {directorErrors[director.id]?.email && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {directorErrors[director.id].email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={director.phone}
                        onChange={(e) =>
                          updateDirector(director.id, "phone", e.target.value)
                        }
                        className={`w-full px-4 py-3 rounded-lg border ${
                          directorErrors[director.id]?.phone
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-[--primary] focus:border-transparent`}
                      />
                      {directorErrors[director.id]?.phone && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {directorErrors[director.id].phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={director.address}
                        onChange={(e) =>
                          updateDirector(director.id, "address", e.target.value)
                        }
                        className={`w-full px-4 py-3 rounded-lg border ${
                          directorErrors[director.id]?.address
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-[--primary] focus:border-transparent`}
                      />
                      {directorErrors[director.id]?.address && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {directorErrors[director.id].address}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Role
                      </label>
                      <div className="flex gap-6">
                        {["Founder", "Investor"].map((role) => (
                          <label
                            key={role}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`role-${director.id}`}
                              value={role}
                              checked={director.role === role}
                              onChange={() =>
                                updateDirector(
                                  director.id,
                                  "role",
                                  role as "Founder" | "Investor"
                                )
                              }
                              className="w-4 h-4 text-[--primary] border-gray-300 focus:ring-[--primary]"
                            />
                            <span>{role}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-[--primary] text-white rounded-lg
                font-medium transition-all duration-200 hover:bg-[--primary]/90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  {selectedPlan === "platinum" ? "Next" : "Complete Setup"}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2
              className="text-[--primary] flex-shrink-0 mt-0.5"
              size={20}
            />
            <div>
              <h3 className="font-medium text-[--primary]">Need Assistance?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Our support team is available 24/7 to help you complete your
                company setup. Contact us if you have any questions about the
                required information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
