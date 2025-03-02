import { useEffect, useState } from "react";
import { Company } from "../http/requests/admin/company";
import { Building2, Check, Search } from "lucide-react";
import instance from "../http/instance";

const CompanyList: React.FC = () => {
  const [companySearchQuery, setCompanySearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await instance.get("/admin/company/all");
      setCompanies(res.data);
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) =>
    company.companyName.toLowerCase().includes(companySearchQuery.toLowerCase())
  );

  return (
    <div className="lg:w-80">
      <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
        <h2 className="text-lg font-medium mb-4">Select Company</h2>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search companies..."
              value={companySearchQuery}
              onChange={(e) => setCompanySearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1649FF]"
            />
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          </div>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredCompanies.map((company) => (
              <button
                key={company.id}
                type="button"
                onClick={() => setSelectedCompany(company)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  selectedCompany?.id === company.id
                    ? "bg-[#EEF2FF] text-[#1649FF]"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="text-sm font-medium">
                    {company.companyName}
                  </span>
                </div>
                {selectedCompany?.id === company.id && (
                  <Check className="w-5 h-5 text-[#1649FF]" />
                )}
              </button>
            ))}
          </div>
          {selectedCompany && (
            <div className="mt-4 p-4 bg-[#EEF2FF] rounded-lg">
              <p className="text-sm font-medium text-[#1649FF]">
                Selected Company
              </p>
              <p className="text-sm mt-1">{selectedCompany.companyName}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyList;
