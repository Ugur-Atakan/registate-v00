import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ServiceDetailsPopup from '../../components/ServiceDetailsPopup';
import PlanSelectionPopup from '../../components/PlanSelectionPopup';
import { useNavigate } from 'react-router-dom';
import { 
  FileText,
  Building2,
  Mail,
  Package,
  FileCheck,
  Globe,
  ClipboardCheck,
  FileSignature,
  FileSearch,
  Store,
  CheckSquare,
} from 'lucide-react';
import { Price, Product } from '../../types/Product';
import ServiceCard from '../../components/ServiceCard';
import instance from '../../http/instance';

interface StaticService {
  id: string;
  icon?: JSX.Element;
  name: string;
  badge?: string;
}

interface DynamicProduct extends Product {
  icon?: JSX.Element;
  badge?: string;
}

const staticServices: StaticService[] = [
  {
    id: '2d5126bb-e312-4005-b12a-4427254a620b',
    icon: <FileSignature className="w-6 h-6 text-[--primary]" />,
    name: 'Apostille',
  },
  {
    id: '1f613af7-1426-4a07-9252-ab2a9ccf7b7b',
    icon: <Building2 className="w-6 h-6 text-[--primary]" />,
    name: 'Registered Agent',
  },
  {
    id: '143afae6-69ae-43ee-9bae-fbfe2187b322',
    icon: <Mail className="w-6 h-6 text-[--primary]" />,
    name: 'Virtual Mailbox',
  },
  {
    id: '96460413-500e-4f50-83e0-d4efb1eb0fea',
    icon: <FileText className="w-6 h-6 text-[--primary]" />,
    name: 'EIN Number',
    badge: 'New',
  },

  {
    id: 'bb71d501-ab22-4ecf-ba15-b56300e2e264',
    icon: <FileCheck className="w-6 h-6 text-[--primary]" />,
    name: 'Annual Report Filing',
  },
  {
    id: 'c50ac514-f2b3-49ca-8412-17caf0218b81',
    icon: <ClipboardCheck className="w-6 h-6 text-[--primary]" />,
    name: 'BOI Report Filing',
  },
  {
    id: 'franchise-tax-negotiation',
    icon: <Package className="w-6 h-6 text-[--primary]" />,
    name: 'Franchise Tax Negotiation',
  },
  {
    id: 'dissolution-cancellation',
    icon: <FileText className="w-6 h-6 text-[--primary]" />,
    name: 'Dissolution & Cancellation',
  },
  {
    id: 'foreign-qualification',
    icon: <Globe className="w-6 h-6 text-[--primary]" />,
    name: 'Foreign Qualification',
  },
  {
    id: 'certificate-of-amendment',
    icon: <FileSearch className="w-6 h-6 text-[--primary]" />,
    name: 'Certificate of Amendment',
  },
  {
    id: 'certified-copy-request',
    icon: <CheckSquare className="w-6 h-6 text-[--primary]" />,
    name: 'Certified Copy Request',
  },
  {
    id:'doing-business-as',
    icon: <Store className="w-6 h-6 text-[--primary]" />,
    name: 'Doing Business As',
  }
];

function mergeById(
  staticServices: StaticService[],
  dynamicProducts: Product[],
): DynamicProduct[] {
  const staticMap = new Map<string, StaticService>();
  staticServices.forEach(service => {
    staticMap.set(service.id, service);
  });

  return dynamicProducts.map(product => {
    const matchingStatic = staticMap.get(product.id);
    if (matchingStatic) {
      return { ...product, icon: matchingStatic.icon, badge: matchingStatic.badge };
    }
    return product;
  });
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
      const mergedProducts = mergeById(staticServices, dynamicProducts);
      setProducts(mergedProducts);
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
        <div className="max-w-7xl mx-auto flex justify-center items-center h-96">
          <div className="loader"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Business Services</h1>
        
        {/* Services List - Single Column */}
        <div className="space-y-4">
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