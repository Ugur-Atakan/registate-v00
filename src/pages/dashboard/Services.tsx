import {useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ServiceDetailsPopup from '../../components/ServiceDetailsPopup';
import PlanSelectionPopup from '../../components/PlanSelectionPopup';
import { Price, Product } from '../../types/Product';
import ServiceCard from '../../components/ServiceCard';
import { buySingleItem } from '../../http/requests/companyRequests';
import { useDynamicProducts } from '../../hooks/useDynamicProducts';

interface DynamicProduct extends Product {
  icon?: JSX.Element;
  badge?: string;
  isActiveProduct?: boolean;
  isActivePlan?: boolean;
}

export default function Services() {
  const [selectedProduct, setSelectedProduct] = useState<DynamicProduct | null>(null);
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const { products,loading,setLoading } = useDynamicProducts();

  const handlePlanSelection = (price: Price) => {
    setShowPlanSelection(false);
    handleBuy(price);
  };

  const handleBuyNow = async (product: DynamicProduct) => {
    console.log("Selected Product:", product);
    setSelectedProduct(product);
    if (product.prices.length === 1) {
      setLoading(true);
      const checkoutLink= await buySingleItem({productId: product.id, priceId: product.prices[0].id});
      setLoading(false);
      window.location.href = checkoutLink;
    } else {
      setShowPlanSelection(true);
    }
    };
  


  const handleBuy = async (price: Price) => {
    if (selectedProduct) {
      setLoading(true);
      const checkoutLink= await buySingleItem({productId: selectedProduct.id, priceId: price.id});
      setLoading(false);
      window.location.href = checkoutLink;
    }
  };

  const handleLearnMore = (product: DynamicProduct) => {
    setSelectedProduct(product);
    setShowServiceDetails(true);
  };

  const handleClose = () => {
    setShowServiceDetails(false);
    setSelectedProduct(null);
    setShowPlanSelection(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-[--primary] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Business Services</h1>
        
        {/* Services Grid - 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products && products.length > 0 && products.map((product) => (
            <ServiceCard
              key={product.id}
              product={product}
              onLearnMore={() => handleLearnMore(product)}
              onBuyNow={() => handleBuyNow(product)}
            />
          ))}
        </div>

        {/* Popups */}
        {selectedProduct && !showPlanSelection && showServiceDetails && (
          <ServiceDetailsPopup
            product={selectedProduct}
            onClose={() => handleClose()}
            onBuyNow={() => handleBuyNow(selectedProduct)}
          />
        )}

        {showPlanSelection && selectedProduct && (
          <PlanSelectionPopup
            product={selectedProduct}
            onClose={() => handleClose()}
            onSelectPlan={handlePlanSelection}
          />
        )}
      </div>
    </DashboardLayout>
  );
}