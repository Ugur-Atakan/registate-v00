import { useState } from "react";
import {
  ChevronDown,
  Building2,
  CheckCircle,
  PlusCircle,
  Rocket,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { changeActiveCompany } from "../store/slices/companySlice";
import { useNavigate } from "react-router-dom";

const CompanyChanger = ({showModal,setShowModal}:any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const selectedCompany = useAppSelector(
    (state) => state.company.selectedCompany
  );
  const companies = useAppSelector((state) => state.company.companies);

  const handleCompanySelect = async (company: any) => {
    try {
      dispatch(changeActiveCompany(company.companyId));
      console.log("Selected company:", company);
    } catch (err: any) {
      console.error("Error fetching company details:", err);
    }
    setIsOpen(false);
  };

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  // If there are no companies, show a special button to create one
  if (!companies || companies.length === 0) {
    return (
      <div className="relative px-3 py-4">
        <button
          onClick={() => navigate("/company-formation")}
          className="w-full flex items-center gap-3 px-4 py-3 bg-[--primary]/5 text-[--primary] 
            rounded-xl hover:bg-[--primary]/10 transition-all duration-200 group"
        >
          <div
            className="w-10 h-10 bg-[--primary]/10 rounded-xl flex items-center justify-center 
            group-hover:scale-110 transition-transform duration-200"
          >
            <Rocket className="w-5 h-5" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium">Create Your First Company</p>
          </div>
          <PlusCircle className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>
    );
  }

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
              {selectedCompany?.companyName ||
                (companies && companies[0]?.companyName)}
            </p>
            <p className="text-xs text-gray-500">
              {selectedCompany?.state || (companies && companies[0]?.state)}
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
          {companies &&
            companies.map((company) => (
              <button
                key={company.companyId}
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
                    {company.state} • {company.companyName}
                  </p>
                </div>
                {selectedCompany?.id === company.companyId && (
                  <CheckCircle className="w-4 h-4 text-[--primary] absolute right-3" />
                )}
              </button>
            ))}

          {/* Add New Company Button */}
          <button
            onClick={() => handleShowModal()}
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
