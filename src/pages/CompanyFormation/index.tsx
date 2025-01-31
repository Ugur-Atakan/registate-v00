import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
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
        return <CompanyType formData={formData} setFormData={setFormData} prevStep={back} nextStep={next}  />;
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-medium text-[--primary]">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="relative">
            <div className="overflow-hidden h-2 flex rounded-full bg-gray-200">
              <div
                className="transition-all duration-500 ease-out bg-[--primary]"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
            <div className="absolute top-4 w-full flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    index === 0
                      ? "items-start"
                      : index === steps.length - 1
                      ? "items-end"
                      : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 
                      transition-all duration-300 ${
                        currentStep > step.id
                          ? "bg-[--primary] border-[--primary] text-white"
                          : currentStep === step.id
                          ? "border-[--primary] text-[--primary] bg-white"
                          : "border-gray-300 text-gray-300 bg-white"
                      }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <span className="text-sm">{step.id}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div
                      className={`text-sm font-medium ${
                        currentStep >= step.id
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </div>
                    <div
                      className={`text-xs ${
                        currentStep >= step.id
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="mx-auto">
          <div className="bg-white shadow-lg rounded-xl">
            {renderStep()}
            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
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
      </div>
    </div>
  );
}

// Step Components will be added in subsequent actions
