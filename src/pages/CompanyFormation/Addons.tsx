import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormationFormData } from "../../types/FormData";
import {
  PlanFeature,
  planFeatures,
  PricingPlan,
  pricingPlans,
} from "../../utils/plans";
import {
  BankAccountGuide,
  Formation,
  RegisteredAgent,
  CompanyNameCheck,
  FormationDocuments,
  OnlineDashboard,
  CustomerSupport,
  VirtualMailbox,
  ComplianceReminder,
  AnnualReportFiling,
  BoiReportFiling,
  PostIncDocuments,
  EIN,
} from "../feature-pages";
import toast from "react-hot-toast";

interface AddonsProps {
  formData: FormationFormData;
  setFormData: any;
  prevStep?: () => void;
  nextStep?: () => void;
}

export default function Addons({ formData, setFormData }: AddonsProps) {
  const navigate = useNavigate();
  const [availableAddons, setAvailableAddons] = useState<PlanFeature[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Seçili pakete göre upsell ürünlerini belirleyen fonksiyon
  const getPackageUpsells = (
    selectedPlanId: "silver" | "gold" | "platinum"
  ): PlanFeature[] => {
    console.log("selectedPlanId", selectedPlanId);
    console.log("pricingPlans", pricingPlans);
    const selectedPlan: PricingPlan | undefined = pricingPlans[selectedPlanId];
    if (!selectedPlan) return [];
    const selectedFeatureIds = selectedPlan.features.map((f) => f.id);
    return Object.values(planFeatures).filter(
      (feature) => !selectedFeatureIds.includes(feature.id)
    );

  };

  useEffect(() => {
    if (formData.selectedPlan) {
      const upsellItems = getPackageUpsells(formData.selectedPlan);
      console.log("upsellItems", upsellItems);
      setAvailableAddons(upsellItems);
      setCurrentIndex(0); // Paket değiştiğinde index sıfırlansın
    }
  }, [formData.selectedPlan]);

  // Detaylar sayfasına yönlendirme
  const goDetails = () => {
    if (availableAddons[currentIndex]) {
      navigate(`/addon-details/${availableAddons[currentIndex].id}`);
    }
  };

  // "Not Now": Addonu atla, sonraki addon'a geç
  const notNow = () => {
    if (currentIndex < availableAddons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      goToNextStep();
    }
  };

  // Sepete ekleme işlemi
  const addToBasket = (item: PlanFeature) => {
    const currentUpsells = formData.upsellProducts || [];
    toast.success(`${item.name} added to basket`);
    setFormData({
      ...formData,
      upsellProducts: [...currentUpsells, item],
    });
  };

  // "Add to Basket" butonu: Addonu sepete ekler ve sonraki addon'a geçer
  const handleAddBasketAddon = () => {
    if (availableAddons[currentIndex]) {
      addToBasket(availableAddons[currentIndex]);
      if (currentIndex < availableAddons.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        goToNextStep();
      }
    }
  };

  // Tüm addonlar işlendiğinde, sonraki aşamaya geçiş
  const goToNextStep = () => {
    // TODO: Sonraki aşamaya geçiş işlemini gerçekleştir.
    // Örneğin:
    navigate("/next-step");
  };

  // Şu anki addon bileşenini render eden fonksiyon
  const renderCurrentAddon = (index: number) => {
    if (!availableAddons || availableAddons.length === 0 || !availableAddons[index]) {
      return <div>No addons available</div>;
    }
    const currentAddon = availableAddons[index];
    console.log("currentAddon", currentAddon);
    switch (currentAddon.id) {
      case "Bank Account Guide":
        return <BankAccountGuide />;
      case "Formation":
        return <Formation />;
      case "Registered Agent":
        return <RegisteredAgent />;
      case "Company Name Check":
        return <CompanyNameCheck />;
      case "Formation Documents":
        return <FormationDocuments />;
      case "Online Dashboard":
        return <OnlineDashboard />;
      case "Customer Support":
        return <CustomerSupport />;
      case "Virtual Mailbox":
        return <VirtualMailbox />;
      case "Compliance Reminder":
        return <ComplianceReminder />;
      case "Annual Report Filing":
        return <AnnualReportFiling />;
      case "Boi Report Filing":
        return <BoiReportFiling />;
      case "Post Inc Documents":
        return <PostIncDocuments />;
      case "ein":
        return <EIN />;
      default:
        return <div>No add-ons available for this package.</div>;
    }
  };

  return (
    <div>
      {/* Mevcut addon render ediliyor */}
      {renderCurrentAddon(currentIndex)}
      <div className="flex justify-between mt-4">
        <button
          onClick={notNow}
          className="px-4 py-2 bg-gray-300 text-black rounded"
        >
          Not Now
        </button>
        <button
          onClick={handleAddBasketAddon}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add to Basket
        </button>
        <button
          onClick={goDetails}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
