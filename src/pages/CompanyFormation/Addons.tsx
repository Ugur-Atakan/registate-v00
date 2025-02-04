import { useEffect, useState } from "react";
import { VirtualMailbox, AnnualReportFiling, BoiReportFiling, EIN } from "../feature-pages";
import { useAppSelector } from "../../store/hooks";
import { getPlanAddons } from "../../http/requests/formation";

interface AddonsProps {
  prevStep?: () => void;
  nextStep?: () => void;
}

export default function Addons({ nextStep }: AddonsProps) {
  const [availableAddons, setAvailableAddons] = useState<any[]>([]);  // API'den gelen addon verileri
  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedPricingPlan = useAppSelector((state) => state.checkout.pricingPlan);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddons = async () => {
      try {
        const response = await getPlanAddons(selectedPricingPlan.id);
        setAvailableAddons(response);  // Gelen addon verisini set ediyoruz
      } catch (error) {
        console.error("Error fetching addons:", error);
      } finally {
        setLoading(false); // Yükleme tamamlandığında loading durumu bitir
      }
    };

    if (selectedPricingPlan.id) {
      fetchAddons();
    }
  }, [selectedPricingPlan.id]);

  // Eğer addon yoksa direkt olarak bir sonraki adıma geç
  useEffect(() => {
    if (!loading && availableAddons.length === 0 && nextStep) {
      nextStep();  // Addon yoksa bir sonraki adıma geçiş yap
    }
  }, [loading, availableAddons, nextStep]);

  // Kullanıcının ilerlemesini sağlayan fonksiyon
  const goNextStep = () => {
    if (currentIndex < availableAddons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if(nextStep) nextStep(); // Son addon'dan sonra "Review" sayfasına geçiş yapılır
    }
  };

  const goPrevStep = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Mevcut addon'a göre ilgili bileşeni render et
  const renderCurrentAddon = (index: number) => {
    if (!availableAddons.length || !availableAddons[index]) {
      if (nextStep) {
        nextStep(); // Eğer addon yoksa, bir sonraki adıma geç
      }
      return null;
    }
    const currentAddon = availableAddons[index];

    // **ID Bazlı Addon Seçimi**
    switch (currentAddon.productId) {
      case "6ec59714-9ce9-4c62-8c29-4e55a5bb2659": // EIN ID
        return (
          <EIN
            prevStep={goPrevStep}
            nextStep={goNextStep}
            addonData={currentAddon}
          />
        );
      case "6ab02e6b-9694-4820-bc92-df7d9d1a8846": // Virtual Mailbox ID
        return (
          <VirtualMailbox
            prevStep={goPrevStep}
            nextStep={goNextStep}
            addonData={currentAddon}
          />
        );
      case "747f5775-079e-4cb2-9025-d57cdea27376": // Annual Report Filing ID
        return (
          <AnnualReportFiling
            prevStep={goPrevStep}
            nextStep={goNextStep}
            addonData={currentAddon}
          />
        );
      case "d45c0c05-fe55-4dc5-9374-755b27d63cde": // BOI Report Filing ID
        return (
          <BoiReportFiling
            prevStep={goPrevStep}
            nextStep={goNextStep}
            addonData={currentAddon}
          />
        );
      default:
        if (nextStep) {
          nextStep(); // Eğer geçerli addon yoksa bir sonraki adıma geçiş yapılır
        }
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return renderCurrentAddon(currentIndex);
}
