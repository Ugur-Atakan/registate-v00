import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { ArrowLeft } from 'lucide-react';
import CompanyType from './CompanyType';
import RegistrationState from './RegistrationState';
import CompanyName from './CompanyName';
import PlanSelection from './PlanSelection';
import Review from './Review';
import Addons from './Addons';
import ExpeditedFiling from './ExpeditedFiling';
import { useAppSelector } from '../../store/hooks';


const steps = [
  {
    id: 1, title: 'Company Type', description: 'Choose your business structure',
  },
  { id: 2, title: 'Registration State', description: 'Select formation state' },
  { id: 3, title: 'Company Name', description: 'Name your company' },
  { id: 4, title: 'Select Plan', description: 'Choose your package' },
  { id: 5,title: 'Expedited Filing', description: 'Choose your filing speed'},
  { id: 6,title: 'Upsells', description: 'Upsell products for selectedPackage'},
  { id: 7, title: 'Review', description: 'Review your information' },
];

export default function CompanyFormation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

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
    console.log('CompanyFormation sayfasına gelindi.');
    console.log('Geliş Yeri:', location.state?.from || 'Bilinmiyor');
    console.log('Parametreler:', location.state || 'Yok');
  }, [location]);


  const handleSubmit = async () => {
    setLoading(true);
    try {


      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        navigate('/payment', { replace: true });
      }, 1000);
    } catch (error) {
      console.error('Error saving company formation:', error);
      toast.error('Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkout=useAppSelector(state=>state.checkout);


  useEffect(() => {
    console.log('checkout:', checkout);
  }, [checkout]);

  useEffect(() => {
    console.log('currentStep:', currentStep);
  }, [currentStep]);

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
        return (
          <RegistrationState
            prevStep={back}
            nextStep={next}
          />
        );
      case 3:
        return (
          <CompanyName
            prevStep={back}
            nextStep={next}
          />
        );
      case 4:
        return (
          <PlanSelection
            prevStep={back}
            nextStep={next}
          />
        );

        case 5:
          return (
            <ExpeditedFiling
              prevStep={back}
              nextStep={next}
            />
          );
          
      case 6:
        return (
          <Addons
            prevStep={back}
            nextStep={next}
          />
        );
      case 7:
        return (
          <Review
            prevStep={back}
            nextStep={next}
          />
        );
      default:
        return null;
    }
  };

  return (
   
       renderStep()
  );
}

// Step Components will be added in subsequent actions
