import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { PricingPlan } from '../utils/plans';

export interface RegistrationData {
  companyType: string | null;
  registrationState: string | null;
  companyName: string | null;
  companyDesignator: string | null;
  selectedPlan: PricingPlan | null;
  companySetupStarted: boolean;
  companySetupStep: string;
}

export function useRegistrationProgress() {
  const { user } = useAuth();
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrationData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const data = userDoc.data() as RegistrationData;
        setRegistrationData(data);
      } catch (error) {
        console.error('Error fetching registration data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationData();
  }, [user]);

  const getNextStep = () => {
    if (!registrationData?.companySetupStarted) return '/company-type';
    if (!registrationData?.companyType) return '/company-type';
    if (!registrationData?.registrationState) return '/registration-state';
    if (!registrationData?.companyName) return '/company-name';
    if (!registrationData?.selectedPlan) return '/pricing';
    return '/dashboard';
  };

  const isStepComplete = (step: string): boolean => {
    if (!registrationData) return false;

    switch (step) {
      case 'company-type':
        return !!registrationData.companyType;
      case 'registration-state':
        return !!registrationData.registrationState;
      case 'company-name':
        return !!registrationData.companyName;
      case 'pricing':
        return !!registrationData.selectedPlan;
      default:
        return false;
    }
  };

  return {
    registrationData,
    loading,
    getNextStep,
    isStepComplete
  };
}