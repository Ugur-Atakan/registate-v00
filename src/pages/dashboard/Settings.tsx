import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  User,
  Phone,
  Bell,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Lock,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import toast from "react-hot-toast";
import instance from "../../http/instance";
import { logOut, setUserData } from "../../store/slices/userSlice";
import { uploadProfilePicture } from "../../utils/fileUpload";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const user = useAppSelector((state) => state.user.userData);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    telephone: user.telephone || "",
    profileImage: user.profileImage || "",
    notifications: user.notifications || false,
  });

  const [emailChange, setEmailChange] = useState({
    newEmail: "",
    currentPassword: "",
    showForm: false,
  });


  const navigate=useNavigate();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadedUrl = await uploadProfilePicture(file, user.id);
    console.log("Uploaded URL:", uploadedUrl);
    setFormData((prev) => ({ ...prev, profileImage: uploadedUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await instance.post("/user/update-me", formData);
      dispatch(setUserData({ ...response.data,profileImage:formData.profileImage }));
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async () => {
    if (!emailChange.newEmail || !emailChange.currentPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    setEmailChangeLoading(true);

    try {
      console.log("Email change data:", emailChange);
      await instance.post("/user/update-email", {
        newEmail: emailChange.newEmail,
        currentPassword: emailChange.currentPassword,
      });
      toast.success("Email updated successfully, logging out...");
      setTimeout(() => {
        dispatch(logOut());
        navigate("/");
      }, 3000);
      setEmailChange({ newEmail: "", currentPassword: "", showForm: false });
    } catch (error) {
      console.error("Error changing email:", error);
      toast.error("Failed to change email");
    } finally {
      setEmailChangeLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Profile Image</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {formData.profileImage ? (
                    <img
                      src={formData.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <label
                  className="absolute bottom-0 right-0 p-1.5 bg-[--primary] text-white rounded-full cursor-pointer 
                  hover:bg-[--primary]/90 transition-colors"
                >
                  <Camera size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h3 className="font-medium mb-1">Profile Photo</h3>
                <p className="text-sm text-gray-500">
                  Upload a new profile photo. Recommended size: 400x400px
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none 
                      focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none 
                      focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        telephone: e.target.value,
                      }))
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none 
                      focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Mail className="text-[--primary]" size={24} />
                <div>
                  <h2 className="text-lg font-semibold">Email Address</h2>
                  <p className="text-sm text-gray-500">
                    Your current email: {user.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEmailChange((prev) => ({
                    ...prev,
                    showForm: !prev.showForm,
                  }))
                }
                className="text-[--primary] text-sm font-medium hover:underline"
              >
                Change Email
              </button>
            </div>

            {emailChange.showForm && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-3 text-gray-400"
                        size={20}
                      />
                      <input
                        type="email"
                        value={emailChange.newEmail}
                        onChange={(e) =>
                          setEmailChange((prev) => ({
                            ...prev,
                            newEmail: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none 
                          focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                        placeholder="Enter new email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-3 text-gray-400"
                        size={20}
                      />
                      <input
                        type="password"
                        value={emailChange.currentPassword}
                        onChange={(e) =>
                          setEmailChange((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none 
                          focus:ring-2 focus:ring-[--primary] focus:border-transparent"
                        placeholder="Enter your current password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setEmailChange({
                          newEmail: "",
                          currentPassword: "",
                          showForm: false,
                        })
                      }
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={emailChangeLoading}
                      onClick={handleEmailChange}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[--primary] text-white rounded-lg 
                        hover:bg-[--primary]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {emailChangeLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          Updating...
                        </>
                      ) : (
                        "Update Email"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="text-[--primary]" size={24} />
                <div>
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  <p className="text-sm text-gray-500">
                    Manage your email notification preferences
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      notifications: e.target.checked,
                    }))
                  }
                  className="sr-only peer"
                />
                <div
                  className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                  peer-focus:ring-[--primary]/20 rounded-full peer peer-checked:after:translate-x-full 
                  rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] 
                  after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 
                  after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                  peer-checked:bg-[--primary]"
                ></div>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {loading ? (
                <Loader2 className="animate-spin text-gray-500" size={16} />
              ) : (
                <CheckCircle2 className="text-[--accent]" size={16} />
              )}
              <span className="text-gray-500">
                {loading
                  ? "Saving changes..."
                  : "All changes will be saved automatically"}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[--primary] text-white rounded-lg 
                font-medium hover:bg-[--primary]/90 transition-colors disabled:opacity-50 
                disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="text-blue-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div>
              <h3 className="font-medium text-blue-900">Need Help?</h3>
              <p className="text-sm text-blue-700 mt-1">
                If you need assistance with your account settings, please
                contact our support team. We're available 24/7 to help you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
