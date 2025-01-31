import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormationFormData } from "../../types/FormData";
import {
  PlanFeature,
  planFeatures,
  PricingPlan,
  pricingPlans,
} from "../../utils/plans";
import toast from "react-hot-toast";

// Props Tipi
interface UpsellsProps {
  formData: FormationFormData;
  setFormData:any;
  prevStep?: () => void;
  nextStep?: () => void;
}

export default function Upsells({ formData, setFormData }: UpsellsProps) {
  const navigate = useNavigate();
  const [upsellItems, setUpsellItems] = useState<PlanFeature[]>([]); // ✅ useState için doğru tip ayarlandı

  // ✅ Upsell ürünlerini belirleyen fonksiyon
  const getPackageUpsells = (
    selectedPlanId: "silver" | "gold" | "platinum"
  ): PlanFeature[] => {
    const selectedPlan: PricingPlan | undefined = pricingPlans[selectedPlanId];
    if (!selectedPlan) return [] as PlanFeature[];

    // Seçili paketin sahip olduğu feature id'leri
    const selectedFeatureIds = selectedPlan.features.map((f) => f.id);

    // Upsell olacak ürünleri belirle (pakette olmayanlar)
    return Object.values(planFeatures).filter(
      (feature) => !selectedFeatureIds.includes(feature.id)
    );
  };

  useEffect(() => {
    if (formData.selectedPlan) {
      const upsellItem = getPackageUpsells(formData.selectedPlan);
      setUpsellItems(upsellItem);
    }
  }, [formData.selectedPlan]); // ✅ Bağımlılık listesi eklendi

  const addToBasket = (item: PlanFeature) => {
    // Eğer `upsellProducts` undefined ise, boş bir dizi olarak başlat
    const currentUpsells = formData.upsellProducts || [];
  
    toast.success(`${item.name} added to basket`);
  
    setFormData({
      ...formData,
      upsellProducts: [...currentUpsells, item], // Önceki upsell ürünleri + yeni ürün
    });
  };
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Enhance Your Package</h2>
      <p className="text-gray-600 mb-6">
        Upgrade your formation package with these additional features.
      </p>

      <div className="space-y-4">
        {upsellItems.map((item: PlanFeature) => (
          <div
            key={item.id}
            className="p-4 bg-white shadow rounded-lg flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/features/${item.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Learn More
              </button>
              <button
                onClick={() => addToBasket(item)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add to Basket
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
