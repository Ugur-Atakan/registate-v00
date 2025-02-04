import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
  Star,
  Crown,
  DollarSign,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { getPricingPlans } from "../../http/requests/formation"; // API çağrısı
import {PricingPlan } from "../../utils/plans"; // Statik özellik listesi
import { useAppDispatch } from "../../store/hooks";
import { setPricingPlan } from "../../store/slices/checkoutSlice";
import { allFeatures, staticPricingplans } from "../../statics/pricingPlans";

interface PlanSelectionProps {
  nextStep?: () => void;
  prevStep?: () => void;
}

export default function PlanSelection({ nextStep }: PlanSelectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchPricingPlans = async () => {
      try {
        const apiData = await getPricingPlans();
        const mergedPlans = staticPricingplans.map((staticPlan) => {
          const apiPlan = apiData.find((p: any) => p.name === staticPlan.name);
          return {
            ...staticPlan,
            id: apiPlan?.id || staticPlan.id, // ID'yi API'den
            stripeId: apiPlan?.stripeId || staticPlan.stripeId, // Stripe ID'yi API'den
          };
        });

        setPricingPlans(mergedPlans);
      } catch (error) {
        console.error("Error fetching pricing plans:", error);
      }
    };

    fetchPricingPlans();
  }, []);
  const handleSelectPlan = async (plan:PricingPlan ) => {
    setLoading(true);
    try {
      dispatch(setPricingPlan({ pricingPlanId: plan.id, pricingPlanName: plan.name,price:plan.price }));
      setSelectedPlan(plan);
      nextStep && nextStep();
    } catch (error) {
      console.error("Error saving plan selection:", error);
      toast.error("Failed to save your selection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "e8ee0cbd-039e-4ade-a9cf-8c9cc3d91994":
        return <Zap size={24} className="text-gray-600" />;
      case "f2f0bcca-d1bc-4ae5-ae3b-82974c2790d6":
        return <Star size={24} className="text-yellow-500" />;
      case "7d2a54f7-2d9a-452b-b6d7-1b90fca21f54":
        return <Crown size={24} className="text-purple-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-bold mb-4">
            Choose Your C-Corporation Package
          </h1>
          <p className="text-gray-600 mb-6">
            Select the package that best fits your business needs. All plans
            include state formation fees.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-[--primary]" />
              <span>State formation fee included</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[--primary]" />
              <span>100% accuracy guarantee</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl p-6 transition-all duration-300
                ${
                  selectedPlan?.id === plan.id
                    ? "ring-2 ring-[--primary] shadow-lg transform scale-[1.02]"
                    : "hover:shadow-lg border border-gray-100"
                }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-gray-50">
                  {getPlanIcon(plan.id)}
                </div>
                {plan.id === "f2f0bcca-d1bc-4ae5-ae3b-82974c2790d6" && (
                  <span className="absolute -top-3 right-6 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{plan.subtitle}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-600">/year</span>
              </div>

              <div>
                <h4 className="font-medium mb-3">What's Included:</h4>
                <ul className="space-y-3">
                  {allFeatures.map((feature) => {
                    const isIncluded = plan.features.some(
                      (pf: any) => pf.name === feature.name
                    );
                    return (
                      <li key={feature.name} className="flex items-start gap-2">
                        {isIncluded ? (
                          <CheckCircle2
                            className="text-[--accent] flex-shrink-0 mt-1"
                            size={18}
                          />
                        ) : (
                          <X
                            className="text-gray-300 flex-shrink-0 mt-1"
                            size={18}
                          />
                        )}
                        <span
                          className={
                            isIncluded ? "text-gray-600" : "text-gray-300"
                          }
                        >
                          {feature.name}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 
    flex items-center justify-center gap-2 mt-6
    ${
      plan.id === "f2f0bcca-d1bc-4ae5-ae3b-82974c2790d6"
        ? "bg-[--primary] text-white hover:bg-[--primary]/90"
        : "border-2 border-[--primary] text-[--primary] hover:bg-[--primary]/10"
    } 
    ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Processing..." : "Select Plan"}
                <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
