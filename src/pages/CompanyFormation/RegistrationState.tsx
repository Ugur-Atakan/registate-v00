import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { getStates } from "../../http/requests/formation";
import {
  MapPin,
  Shield,
  DollarSign,
  Building2,
  Scale,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { setCompanyState } from "../../store/slices/checkoutSlice";
import LoadingComponent from "../../components/Loading";

interface CompanyStateProps {
  nextStep?: () => void;
  prevStep?: () => void;
}

// **Statik eyalet özellikleri**
const stateFeatures = [
  {
    name: "Delaware",
    order: 2, // Delaware üstte olacak
    features: [
      {
        icon: <Scale size={18} className="text-[--accent]" />,
        text: "Business-friendly court system",
      },
      {
        icon: <Building2 size={18} className="text-[--accent]" />,
        text: "Preferred by investors & VCs",
      },
      {
        icon: <Shield size={18} className="text-[--accent]" />,
        text: "Strong corporate law precedents",
      },
    ],
    recommendedFor: "Recommended for C-Corp",
    recommendedColor: "bg-blue-100 text-blue-700",
    bestFor: "Perfect for: Startups planning to raise capital",
  },
  {
    name: "Wyoming",
    order: 1, // Wyoming altta olacak
    features: [
      {
        icon: <Shield size={18} className="text-[--accent]" />,
        text: "Strong asset protection laws",
      },
      {
        icon: <DollarSign size={18} className="text-[--accent]" />,
        text: "No state income tax",
      },
      {
        icon: <Building2 size={18} className="text-[--accent]" />,
        text: "Low filing fees and annual costs",
      },
    ],
    recommendedFor: "Recommended for LLC",
    recommendedColor: "bg-green-100 text-green-700",
    bestFor: "Perfect for: Small businesses seeking tax benefits & privacy",
  },
];

interface SelectedState{
  id: string;
  name: string;
}

export default function RegistrationState({ nextStep }: CompanyStateProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState<SelectedState|null>(null);
  const [states, setStates] = useState<{ id: string; name: string }[]>([]);

  // **Eyaletleri API’den al**
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const fetchedStates = await getStates();
        setStates(fetchedStates);
      } catch (error) {
        console.error("Error fetching states: ", error);
      }
    };
    fetchStates();
  }, []);

  // **API’den gelen eyaletleri statik özelliklerle birleştir**
  const mergedStates = states.map((state) => {
    const matchingFeature = stateFeatures.find(
      (feature) => feature.name === state.name
    );
    return {
      ...state,
      order: matchingFeature?.order || 0,
      features: matchingFeature?.features || [],
      recommendedFor: matchingFeature?.recommendedFor || "",
      bestFor: matchingFeature?.bestFor || "",
      recommendedColor: matchingFeature?.recommendedColor || "",
    };
  });

  const handleContinue = async () => {
    if (!selectedState) return;

    setLoading(true);
    try {
      dispatch(
        setCompanyState({ stateId: selectedState.id, stateName: selectedState.name })
      );
      nextStep && nextStep();
      toast.success("State selection saved successfully");
    } catch (error) {
      console.error("Error saving registration state:", error);
      toast.error("Failed to save your selection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

    if (loading) return <LoadingComponent />;


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
              Choose Your Registration State
            </h1>
            <p className="text-gray-600">
              Select the state where you want to register your business
            </p>
          </div>

          <div className="relative w-full">
            <div className="space-y-4 w-[115%] -ml-[7.5%]">
              {mergedStates
                .sort((a, b) => a.order - b.order) // Order'a göre sıralama
                .map((state) => (
                  <div
                    key={state.id}
                    className={`w-full bg-white p-6 rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-1
                    ${
                      selectedState?.id === state.id
                        ? "border-[--primary] shadow-md"
                        : "border-transparent hover:border-gray-200"
                    }`}
                    onClick={() => setSelectedState(state)}
                  >
                    <div className="flex items-start gap-4">
                      <MapPin className="text-[--primary] mt-1" size={24} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold">
                            {state.name}
                          </h3>
                          {state.recommendedFor && (
                            <span
                              className={`px-3 py-1 text-sm font-medium rounded-full ${
                                state.recommendedFor === "Recommended for LLC"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {state.recommendedFor}
                            </span>
                          )}
                        </div>
                        <ul className="space-y-3">
                          {state.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              {feature.icon}
                              <span>{feature.text}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 text-[--primary] font-medium">
                          {state.bestFor}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

              <button
                onClick={handleContinue}
                disabled={!selectedState || loading}
                className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    Continue <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-image-side !bg-[#1649FF]/5">
        <div className="w-full max-w-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-[--primary]">
            State Registration Comparison
          </h2>

          <div className="space-y-6">
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-[--primary]/10">
                    <th className="py-4 px-6 text-left text-[--primary] font-semibold">
                      Feature
                    </th>
                    <th className="py-4 px-6 text-center text-[--primary] font-semibold">
                      Wyoming
                    </th>
                    <th className="py-4 px-6 text-center text-[--primary] font-semibold">
                      Delaware
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                    <td className="py-4 px-6 font-medium">Filing Speed</td>
                    <td className="py-4 px-6 text-center">2-3 business days</td>
                    <td className="py-4 px-6 text-center">3-5 business days</td>
                  </tr>
                  <tr className="border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                    <td className="py-4 px-6 font-medium">Privacy Level</td>
                    <td className="py-4 px-6 text-center">High</td>
                    <td className="py-4 px-6 text-center">Moderate</td>
                  </tr>
                  <tr className="border-b border-gray-100 transition-colors hover:bg-blue-50/50">
                    <td className="py-4 px-6 font-medium">Investor Appeal</td>
                    <td className="py-4 px-6 text-center">Moderate</td>
                    <td className="py-4 px-6 text-center">Very High</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-[--primary]/10">
              <h3 className="font-semibold text-[--primary] mb-2">Pro Tip</h3>
              <p className="text-gray-700">
                While Delaware is famous for corporations, Wyoming has become
                increasingly popular for LLCs due to its strong privacy laws and
                tax benefits. Consider your long-term business goals when
                choosing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
