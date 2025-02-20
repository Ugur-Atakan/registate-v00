import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CompanyType from "./CompanyType";
import RegistrationState from "./RegistrationState";
import CompanyName from "./CompanyName";
import PlanSelection from "./PlanSelection";
import Review from "./Review";
import Addons from "./Addons";
import ExpeditedFiling from "./ExpeditedFiling";

const steps = [
  {
    id: 1,
    title: "Company Type",
    description: "Choose your business structure",
  },
  { id: 2, title: "Registration State", description: "Select formation state" },
  { id: 3, title: "Company Name", description: "Name your company" },
  { id: 4, title: "Select Plan", description: "Choose your package" },
  { id: 5, title: "Expedited Filing", description: "Choose your filing speed" },
  {
    id: 6,
    title: "Upsells",
    description: "Upsell products for selectedPackage",
  },
  { id: 7, title: "Review", description: "Review your information" },
];

export default function CompanyFormation() {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);

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


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CompanyType
            prevStep={back}
            nextStep={next}
            fromQuiz={location.state?.fromQuiz}
            recommendation={location.state?.recommendation}
          />
        );
      case 2:
        return <RegistrationState prevStep={back} nextStep={next} />;
      case 3:
        return <CompanyName prevStep={back} nextStep={next} />;
      case 4:
        return <PlanSelection prevStep={back} nextStep={next} />;

      case 5:
        return <ExpeditedFiling prevStep={back} nextStep={next} />;

      case 6:
        return <Addons prevStep={back} nextStep={next} />;
      case 7:
        return <Review />;
      default:
        return null;
    }
  };

  return renderStep();
}

// Step Components will be added in subsequent actions
