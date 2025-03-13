import { useEffect, useState } from "react";
import { ArrowRight, Building2, X } from "lucide-react";
import toast from "react-hot-toast";
import { getCompanyTypes, getStates } from "../../http/requests/formation";
import instance from "../../http/instance";
import DashboardLayout from "../../components/layout/DashboardLayout";


interface CompanyType {
  id: string;
  name: string;
}

interface State {
  id: string;
  name: string;
}
   

export default function ConnectCompanyPage() {
const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState<CompanyType[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [selectedCompanyType, setSelectedCompanyType] =
    useState<CompanyType | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
 

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
    fetchData();
  }, []);


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
    
        try {
            const response =await instance.post("/company/connect", data)
            console.log(response.data);
        } catch (error) {
            console.error("Error connecting company:", error);
        }

  }
  return (
    <DashboardLayout>
    <h1 className="text-2xl font-bold">Company Connect</h1>
    {/* Şirket Türü Seçimi */}
    <div>
      <h2 className="text-lg font-semibold">Select Company Type</h2>
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
      <h2 className="text-lg font-semibold">Select State</h2>
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
      <h2 className="text-lg font-semibold">Company Name</h2>
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
  </DashboardLayout>
  );
}