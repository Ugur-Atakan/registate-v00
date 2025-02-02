import { useEffect, useState } from 'react';
import { FormationFormData } from '../../types/FormData';
import { PlanFeature } from '../../utils/plans';

import {
  VirtualMailbox,
  AnnualReportFiling,
  BoiReportFiling,
  EIN,
  ExpeditedFiling
} from '../feature-pages';

interface AddonsProps {
  formData: FormationFormData;
  setFormData: any;
  prevStep?: () => void;
  nextStep?: () => void;
}

export default function Addons({ formData, setFormData,nextStep }: AddonsProps) {
  const [availableAddons, setAvailableAddons] = useState<PlanFeature[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if(formData.selectedPlan && formData.selectedPlan.addons ) {
    const orderedAddons = formData.selectedPlan.addons.sort((a, b) => a.order! - b.order!);
    setAvailableAddons(orderedAddons);
    } else {
      setAvailableAddons([]);
    }
    // Plan addons'larını al
  }, [formData]);

  // Tüm addonlar işlendiğinde, sonraki aşamaya geçiş
  const goNextStep = () => {
    if (currentIndex < availableAddons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (currentIndex === availableAddons.length - 1) {
      nextStep && nextStep();
    }
  };

  const goPrevStep = () => {
    if (currentIndex < availableAddons.length - 1) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Şu anki addon bileşenini render eden fonksiyon
  const renderCurrentAddon = (index: number) => {
    if (
      !availableAddons ||
      availableAddons.length === 0 ||
      !availableAddons[index]
    ) {
      return <div>No addons available</div>;
    }

    const currentAddon = availableAddons[index];
    console.log('currentAddon', currentAddon);
    console.log('aviale addons', availableAddons);
    switch (currentAddon.id) {
      case "ein":
        return <EIN formData={formData} setFormData={setFormData} prevStep={goPrevStep} nextStep={goNextStep}  />;
      case "virtual-mailbox":
        return <VirtualMailbox formData={formData} setFormData={setFormData} prevStep={goPrevStep} nextStep={goNextStep}  />;
      case "annual-report-filing":
        return <AnnualReportFiling formData={formData} setFormData={setFormData} prevStep={goPrevStep} nextStep={goNextStep} />;
      case "boi-report-filing":
        return <BoiReportFiling formData={formData} setFormData={setFormData} prevStep={goPrevStep} nextStep={goNextStep}   />;
      case "expedited-filing":
        return <ExpeditedFiling formData={formData} setFormData={setFormData} prevStep={goPrevStep} nextStep={goNextStep}/>;
      default:
        return <div>No add-ons available for this package.</div>;
    }
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <main className="container mx-auto px-4">
      {renderCurrentAddon(currentIndex)}
    </main>
  );
}
