import { useEffect, useState } from "react";
import { getCompanyTypes, getStates } from "../http/requests/formation";
import { ArrowRight, Building2, X } from "lucide-react";
import { useAppSelector } from "../store/hooks";
import instance from "../http/instance";
import Modal from "react-modal";
import toast from "react-hot-toast";


interface CompanyType {
  id: string;
  name: string;
}

interface State {
  id: string;
  name: string;
}
    

const CompanyConnect = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState<CompanyType[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [selectedCompanyType, setSelectedCompanyType] =
    useState<CompanyType | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [newMember, setNewMember] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    role: "OWNER",
  });

  const userData = useAppSelector((state) => state.user.userData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedTypes, fetchedStates] = await Promise.all([
          getCompanyTypes(),
          getStates(),
        ]);
        setTypes(fetchedTypes);
        setStates(fetchedStates);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);


  const handleCompanyConnect = async () => {
    if (
      !selectedCompanyType ||
      !companyName ||
      !selectedState
    )
      return;
    let data ={
        companyName,
        companyTypeId: selectedCompanyType?.id,
        stateId: selectedState?.id,
    }
    if(userData?.roles.includes("ADMIN")){
        try {
            data = {...data, ...newMember}
            const response =await instance.post("admin/company/connect", data)
            console.log(response.data);
            toast.success("Company connected successfully")
            
        } catch (error) {
            console.error("Error connecting company:", error);
        }
    } else {
        try {
            const response =await instance.post("/company/connect", data)
            console.log(response.data);
        } catch (error) {
            console.error("Error connecting company:", error);
        }
    }
  }

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    ariaHideApp={false}
  >
    <X className="absolute top-4 right-4 text-white" size={24} onClick={onClose} />
    <div>
      <h1 className="text-2xl font-bold text-white">Company Connect</h1>

      {/* Şirket Türü Seçimi */}
      <div>
        <h2 className="text-lg font-semibold text-white">Select Company Type</h2>
        <div className="grid grid-cols-2 gap-4">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedCompanyType(type)}
              className={`p-4 border-2 rounded-lg transition-all text-center 
                ${
                  selectedCompanyType?.id === type.id
                    ? "border-[--primary] bg-[--primary]/5"
                    : "border-gray-200 hover:border-[--primary]/30"
                }`}
            >
              {type.name}
            </button>
          ))}
        </div>
      </div>
      {/* Eyalet Seçimi */}
      <div>
        <h2 className="text-lg font-semibold text-white">Select State</h2>
        <div className="grid grid-cols-2 gap-4">
          {states.map((state) => (
            <button
              key={state.id}
              onClick={() => setSelectedState(state)}
              className={`p-4 border-2 rounded-lg transition-all text-center 
                ${
                  selectedState?.id === state.id
                    ? "border-[--primary] bg-[--primary]/5"
                    : "border-gray-200 hover:border-[--primary]/30"
                }`}
            >
              {state.name}
            </button>
          ))}
        </div>
      </div>

      {/* Şirket Adı Girişi */}
      <div>
        <h2 className="text-lg font-semibold text-white">Company Name</h2>
        <div className="relative">
          <Building2
            className="absolute left-3 top-3.5 text-gray-400"
            size={20}
          />
          <input
            type="text"
            className="w-full p-3 border-2 rounded-lg pl-10"
            placeholder="Enter your company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
      </div>

      {/* Yeni Üye Ekleme */}
      {userData?.roles.map((role) => role == "ADMIN") && (
        <div>
          <p className="text-white font-medium text-lg">Create Owner Account for Company</p>
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={newMember.firstName}
                onChange={(e) =>
                  setNewMember((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-[--primary]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={newMember.lastName}
                onChange={(e) =>
                  setNewMember((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-[--primary]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={newMember.email}
                onChange={(e) =>
                  setNewMember((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-[--primary]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={newMember.password}
                onChange={(e) =>
                  setNewMember((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                        focus:ring-2 focus:ring-[--primary]"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Gönderme Butonu */}
      <button
        onClick={handleCompanyConnect}
        disabled={
          !companyName ||
          loading ||
          !selectedCompanyType ||
          !selectedState
        }
        className="w-full p-3 bg-[--primary] text-white rounded-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
      >
        {loading ? (
          "Saving..."
        ) : (
          <>
            <span>Add Your Company</span> <ArrowRight size={20} />
          </>
        )}
      </button>
    </div>
    </Modal>
  );
};
export default CompanyConnect;
