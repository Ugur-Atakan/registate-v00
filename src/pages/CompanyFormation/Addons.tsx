import { useEffect, useState } from "react";
import { VirtualMailbox, AnnualReportFiling, BoiReportFiling, EIN } from "../addons-pages";
import { useAppSelector } from "../../store/hooks";
import { getPlanAddons } from "../../http/requests/formation";
import { Addon } from "../../types/Addons";
import LoadingComponent from "../../components/Loading";

interface AddonsProps {
  prevStep?: () => void;
  nextStep?: () => void;
}

export default function Addons({ nextStep }: AddonsProps) {
  const [availableAddons, setAvailableAddons] = useState<Addon[]>([]);  // API'den gelen addon verileri
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
      case "96460413-500e-4f50-83e0-d4efb1eb0fea": // EIN ID
        return (
          <EIN
            prevStep={goPrevStep}
            nextStep={goNextStep}
            addonData={currentAddon}
          />
        );
      case "143afae6-69ae-43ee-9bae-fbfe2187b322": // Virtual Mailbox ID
        return (
          <VirtualMailbox
            prevStep={goPrevStep}
            nextStep={goNextStep}
            addonData={currentAddon}
          />
        );
      case "4c9b73cc-60a1-460d-ac29-1cda37ba7a8e": // Annual Report Filing ID
        return (
          <AnnualReportFiling
            prevStep={goPrevStep}
            nextStep={goNextStep}
            addonData={currentAddon}
          />
        );
      case "c50ac514-f2b3-49ca-8412-17caf0218b81": // BOI Report Filing ID
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
    return <LoadingComponent />
  }

  return renderCurrentAddon(currentIndex);
}
