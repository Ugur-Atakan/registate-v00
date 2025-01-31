import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { ArrowRight, ArrowLeft } from "lucide-react";
import CompanyType from "./CompanyType";
import RegistrationState from "./RegistrationState";
import CompanyName from "./CompanyName";
import PlanSelection from "./PlanSelection";
import Upsells from "./Upsells";
import Review from "./Review";
import { FormationFormData } from "../../types/FormData";


const INITIAL_DATA: FormationFormData = {
  companyType: null,
  registrationState: null,
  companyName: "",
  companyDesignator: null,
  selectedPlan: null,
  upsellProducts: [],
};

const steps = [
  {
    id: 1,
    title: "Company Type",
    description: "Choose your business structure",
  },
  { id: 2, title: "Registration State", description: "Select formation state" },
  { id: 3, title: "Company Name", description: "Name your company" },
  { id: 4, title: "Select Plan", description: "Choose your package" },
  {
    id: 5,
    title: "Upsells",
    description: "Upsell products for selectedPackage",
  },
  { id: 6, title: "Review", description: "Review your information" },
];

export default function CompanyFormation() {

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormationFormData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);

  const next = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const back = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  useEffect(() => {
    console.log("CompanyFormation sayfasına gelindi.");
    console.log("Geliş Yeri:", location.state?.from || "Bilinmiyor");
    console.log("Parametreler:", location.state || "Yok");
  }, [location]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);


  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...formData,
        companySetupStarted: true,
        companySetupStep: "completed",
        updatedAt: new Date().toISOString(),
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        navigate("/payment", { replace: true });
      }, 1000);
    } catch (error) {
      console.error("Error saving company formation:", error);
      toast.error("Failed to save your information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CompanyType formData={formData} setFormData={setFormData} prevStep={back} nextStep={next} fromQuiz={location.state?.fromQuiz} recommendation={location.state?.recommendation}  />;
      case 2:
        return (
          <RegistrationState formData={formData} setFormData={setFormData} prevStep={back} nextStep={next}  />
        );
      case 3:
        return <CompanyName formData={formData} setFormData={setFormData} prevStep={back} nextStep={next}  />;
      case 4:
        return <PlanSelection formData={formData} setFormData={setFormData} prevStep={back} nextStep={next}  />;
      case 5:
        return <Upsells formData={formData} setFormData={setFormData} prevStep={back} nextStep={next}  />;
      case 6:
        return <Review formData={formData} setFormData={setFormData} prevStep={back} nextStep={next}  />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto">
          <div className="bg-white shadow-lg rounded-xl p-6">
            {renderStep()}
            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between">
              {currentStep !== 1 && (
                <button
                  type="button"
                  onClick={back}
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 bg-gray-100 
                    rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
              )}
              <button
                onClick={currentStep === steps.length ? handleSubmit : next}
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-3 text-white bg-[--primary] 
                  rounded-lg hover:bg-[--primary]/90 transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${currentStep === 1 ? "ml-auto" : ""}`}
              >
                {currentStep === steps.length ? (
                  loading ? (
                    "Processing..."
                  ) : (
                    "Complete"
                  )
                ) : (
                  <>
                    Continue <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      

  );
}

// Step Components will be added in subsequent actions
