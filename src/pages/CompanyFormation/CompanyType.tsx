import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, CheckCircle2, ArrowRight, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch} from "../../store/hooks";
import { getCompanyTypes } from "../../http/requests/formation";
import { setCompanyType } from "../../store/slices/checkoutSlice";

interface CompanyTypeProps {
  recommendation?: string;
  fromQuiz?: boolean;
  prevStep?: () => void;
  nextStep?: () => void;
}

// **Statik Şirket Tipi Özellikleri**
const companyTypesFeatures = [
  {
    name: "LLC",
    features: [
      "Suitable for freelancers, startups, and small businesses",
      "Limited liability protection & pass-through taxation",
      "Less paperwork, easy to manage",
    ],
    bestFor: "Best for: Entrepreneurs who want flexibility & protection",
  },
  {
    name: "C-Corp",
    features: [
      "Ideal for scaling businesses & attracting investors",
      "Ability to issue shares & raise venture capital",
      "More formal structure with taxation at the corporate level",
    ],
    bestFor: "Companies planning to raise funds & expand",
  },
];

interface SelectedType{
  id: string;
  name: string;
  features: string[];
  bestFor: string;
}


export default function CompanyType({
  recommendation,
  fromQuiz,
  nextStep,
}: CompanyTypeProps) {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<SelectedType | null>();
const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [companyTypes, setCompanyTypes] = useState<{ id: string; name: string }[]
  >([]);

  // **Şirket tiplerini API’den al**
  useEffect(() => {
    const fetchCompanyTypes = async () => {
      try {
        const types = await getCompanyTypes();
        console.log("Company types:", types);
        setCompanyTypes(types);
        if(recommendation && fromQuiz){
          setSelectedType(types.find((type:any) => type.name == recommendation));
        }
      } catch (error) {
        console.error("Error fetching company types: ", error);
      }
    };
    fetchCompanyTypes();
  }, []);

  // **API’den gelen veriyi statik özelliklerle eşleştir**
  const mergedCompanyTypes = companyTypes.map((type) => {
    const matchingFeature = companyTypesFeatures.find(
      (feature) => feature.name === type.name
    );
    return {
      ...type,
      features: matchingFeature?.features || [],
      bestFor: matchingFeature?.bestFor || "",
    };
  });

  const updateFields = async () => {
    try {
      if (!selectedType) {
        toast.error("Please select a company type");
        return;
      }
      dispatch(setCompanyType({companyTypeId: selectedType.id, companyType: selectedType.name}));
      setLoading(true);
      if (nextStep) {
        nextStep();
      }
      toast.success("Company type saved successfully");
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div>
            <img
              src="https://registate.betterdemo.com.tr/wp-content/uploads/2025/01/registate-logo.webp"
              alt="Registate"
              className="h-12 mb-8"
            />
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              Choose Your Company Type
            </h1>
            <p className="text-gray-600">
              Select the best structure for your business
            </p>
          </div>

          <div className="relative w-full">
            <div className="space-y-4 w-[115%] -ml-[7.5%]">
              {mergedCompanyTypes.map((type) => (
                <div
                  key={type.id}
                  className={`w-full bg-white p-6 rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-1
                    ${
                      selectedType?.id === type.id
                        ? "border-[--primary] shadow-md"
                        : "border-transparent hover:border-gray-200"
                    }`}
                  onClick={() => setSelectedType(type)}
                >
                  <div className="flex items-start gap-4">
                    <Building2 className="text-[--primary] mt-1" size={24} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold">{type.name}</h3>
                        {recommendation === type.name && fromQuiz && (
                          <span className="px-4 py-1.5 bg-[--primary]/40 text-[--primary] text-sm font-bold rounded-lg border border-[--primary]/50 shadow-sm">
  Recommended
</span>

                        )}
                      </div>
                      <ul className="space-y-2">
                        {type.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="text-[--accent]" size={18} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-[--primary] font-medium">{type.bestFor}</p>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={updateFields}
                disabled={!selectedType || loading}
                className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
              >
                {loading ? "Saving..." : <>Continue <ArrowRight size={20} /></>}
              </button>

              <div className="flex items-center justify-center gap-2 text-gray-600">
                <HelpCircle size={18} />
                <span>Still not sure?</span>
                <button
                  onClick={() => navigate("/company-type-quiz")}
                  className="text-[--primary] font-medium hover:underline transition-colors duration-300"
                >
                  Take our 60-second quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-image-side !bg-[#1649FF]/5">
        <div className="w-full max-w-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-[--primary]">
            LLC vs C Corporation Comparison
          </h2>

          <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-[--primary]/10">
                  <th className="py-4 px-6 text-left text-[--primary] font-semibold">
                    Feature
                  </th>
                  <th className="py-4 px-6 text-center text-[--primary] font-semibold">
                    LLC
                  </th>
                  <th className="py-4 px-6 text-center text-[--primary] font-semibold">
                    C Corporation
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                  <td className="py-4 px-6 font-medium">
                    Formation Complexity
                  </td>
                  <td className="py-4 px-6 text-center">Simple</td>
                  <td className="py-4 px-6 text-center">Complex</td>
                </tr>
                <tr className="border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                  <td className="py-4 px-6 font-medium">
                    Liability Protection
                  </td>
                  <td className="py-4 px-6 text-center">Yes</td>
                  <td className="py-4 px-6 text-center">Yes</td>
                </tr>
                <tr className="border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                  <td className="py-4 px-6 font-medium">Taxation</td>
                  <td className="py-4 px-6 text-center">Pass-through</td>
                  <td className="py-4 px-6 text-center">Double taxation</td>
                </tr>
                <tr className="border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                  <td className="py-4 px-6 font-medium">
                    Ownership Flexibility
                  </td>
                  <td className="py-4 px-6 text-center">Limited</td>
                  <td className="py-4 px-6 text-center">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                  <td className="py-4 px-6 font-medium">Raising Capital</td>
                  <td className="py-4 px-6 text-center">Moderate</td>
                  <td className="py-4 px-6 text-center">Excellent</td>
                </tr>
                <tr className="border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                  <td className="py-4 px-6 font-medium">
                    Management Structure
                  </td>
                  <td className="py-4 px-6 text-center">Flexible</td>
                  <td className="py-4 px-6 text-center">Formal</td>
                </tr>
                <tr className="transition-colors hover:bg-blue-50/50">
                  <td className="py-4 px-6 font-medium">Paperwork</td>
                  <td className="py-4 px-6 text-center">Minimal</td>
                  <td className="py-4 px-6 text-center">Extensive</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-[--primary]/10">
            <h3 className="font-semibold text-[--primary] mb-2">Pro Tip</h3>
            <p className="text-gray-700">
              Most small businesses start as LLCs due to simplicity and tax
              benefits. Consider converting to a C Corporation later if you plan
              to seek venture capital.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
