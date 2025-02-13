import { useState } from "react";
import { ChevronDown, Building2, CheckCircle, PlusCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setActiveCompany } from "../store/slices/companySlice";
import { useNavigate } from "react-router-dom";

// Demo data
const demoCompanies = [
  {
    id: "269eef1d-5af2-4e67-a2e2-0cde8884eb65",
    companyName: "Better 360 Company",
    state: {
      name: "Delaware",
      abbreviation: "DE"
    },
    companyType: {
      name: "C-Corp"
    }
  },
  {
    id: "369eef1d-5af2-4e67-a2e2-0cde8884eb66",
    companyName: "Tech Solutions Inc",
    state: {
      name: "Wyoming",
      abbreviation: "WY"
    },
    companyType: {
      name: "LLC"
    }
  }
];

const CompanyChanger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedCompany = useAppSelector((state) => state.company.selectedCompany);

  const handleCompanySelect = (company: any) => {
    dispatch(setActiveCompany(company));
    setIsOpen(false);
  };

  return (
    <div className="relative px-3 py-4">
      {/* Selected Company Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[--primary]/10 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-[--primary]" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium truncate max-w-[180px]">
              {selectedCompany?.companyName || demoCompanies[0].companyName}
            </p>
            <p className="text-xs text-gray-500">
              {selectedCompany?.state || demoCompanies[0].state.name}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mx-3 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg divide-y divide-gray-100">
          {demoCompanies.map((company) => (
            <button
              key={company.id}
              onClick={() => handleCompanySelect(company)}
              className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors relative"
            >
              <div className="w-8 h-8 bg-[--primary]/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-[--primary]" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {company.companyName}
                </p>
                <p className="text-xs text-gray-500">
                  {company.state.name} • {company.companyType.name}
                </p>
              </div>
              {selectedCompany?.id === company.id && (
                <CheckCircle className="w-4 h-4 text-[--primary] absolute right-3" />
              )}
            </button>
          ))}
          
          {/* Add New Company Button */}
          <button
            onClick={() => navigate('/company-formation')}
            className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-[--primary]"
          >
            <div className="w-8 h-8 bg-[--primary]/10 rounded-lg flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Add New Company</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyChanger;