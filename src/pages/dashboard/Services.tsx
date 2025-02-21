import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ServiceDetailsPopup from '../../components/ServiceDetailsPopup';
import PlanSelectionPopup from '../../components/PlanSelectionPopup';
import { useNavigate } from 'react-router-dom';
import { Price, Product } from '../../types/Product';
import ServiceCard from '../../components/ServiceCard';
import instance from '../../http/instance';

interface DynamicProduct extends Product {
  icon?: JSX.Element;
  badge?: string;
}

export default function Services() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<DynamicProduct | null>(null);
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [products, setProducts] = useState<DynamicProduct[]>();
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await instance.get('/product/products');
      const dynamicProducts = response.data;
      setProducts(dynamicProducts);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handlePlanSelection = (price: Price) => {
    setShowPlanSelection(false);
    handleBuy(price);
  };

  const handleBuyNow = (product: DynamicProduct) => {
    setLoading(true);
    setSelectedProduct(product);
    if (product.defaultPriceId) {
      const defaultPrice = product.prices.find((price) => price.id === product.defaultPriceId);
      handleBuy(defaultPrice!);
    } else {
      setShowPlanSelection(true);
    }
    setLoading(false);
  };

  const handleBuy = (price: Price) => {
    if (selectedProduct) {
      navigate('/dashboard/checkout', { 
        state: { 
          product: selectedProduct,
          selectedPrice: price 
        }
      });
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