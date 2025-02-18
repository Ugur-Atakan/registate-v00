import { useState } from 'react';
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

const staticServices =[
  {
    id: 'ein-number',

    icon: <FileText className="w-6 h-6 text-[--primary]" />,
    name: 'EIN Number',
  },
  {
    id: 'registered-agent',
    icon: <Building2 className="w-6 h-6 text-[--primary]" />,
    name: 'Registered Agent',
  },
  {
    id: 'virtual-mailbox',
    icon: <Mail className="w-6 h-6 text-[--primary]" />,
    name: 'Virtual Mailbox',
  },
  {
    id: 'annual-report-filing',
    icon: <FileCheck className="w-6 h-6 text-[--primary]" />,
    name: 'Annual Report Filing',
  },
  {
    id: 'franchise-tax-negotiation',
    icon: <Package className="w-6 h-6 text-[--primary]" />,
    name: 'Franchise Tax Negotiation',
  },
  {
    id: 'boi-report-filing',
    icon: <ClipboardCheck className="w-6 h-6 text-[--primary]" />,
    name: 'BOI Report Filing',
  },
  {
    icon: <FileSignature className="w-6 h-6 text-[--primary]" />,
    name: 'Apostille',
  },
  {
    id: 'dissolution-cancellation',
    icon: <FileText className="w-6 h-6 text-[--primary]" />,
    name: 'Dissolution & Cancellation',
    additionalFees: '+ $224 state fee'
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
    icon: <Store className="w-6 h-6 text-[--primary]" />,
    name: 'Doing Business As',
  }
];


export default function Services() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product|null>();
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [products,setProducts] = useState<Product[]>();
  const [checkOut,setCheckOut] = useState({});


  const handlePlanSelection = (price:Price) => {
    setShowPlanSelection(false);
    handleBuy(price);
  };


  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product);
    if(product.defaultPriceId){
      const defaultPrice = product.prices.find((price) => price.id === product.defaultPriceId);
      handleBuy(defaultPrice!);
    } else {
      setShowPlanSelection(true);
    }

  }


const handleBuy = (price:Price) => {
  if(selectedProduct){
    setCheckOut(selectedProduct);
    navigate('/dashboard/checkout');
    setCheckOut({...price});
  }
}




  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Business Services</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {products&&products?.length>0&&products.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              onLearnMore={() => setSelectedProduct(service)}
              onBuyNow={() => handleBuyNow(service)}
            />
          ))}
        </div>
      </div>

      {/* Service Details Popup */}
      {selectedProduct && !showPlanSelection && (
        <ServiceDetailsPopup
          service={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onBuyNow={() => handleBuyNow(selectedProduct)}
        />
      )}

      {/* Plan Selection Popup */}
      {showPlanSelection && selectedProduct && (
        <PlanSelectionPopup
        product={selectedProduct}
          onClose={() => setShowPlanSelection(false)}
          onSelectPlan={handlePlanSelection}
        />
      )}
    </DashboardLayout>
  );
}