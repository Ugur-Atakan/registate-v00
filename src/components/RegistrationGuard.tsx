import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRegistrationProgress } from '../hooks/useRegistrationProgress';
import IncompleteRegistrationModal from './IncompleteRegistrationModal';

interface Props {
  children: React.ReactNode;
  requiredStep?: string;
}

export default function RegistrationGuard({ children, requiredStep }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { registrationData, loading, getNextStep, isStepComplete } = useRegistrationProgress();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (registrationData?.companySetupStarted && requiredStep) {
      const previousStepIncomplete = !isStepComplete(requiredStep);
      if (previousStepIncomplete) {
        setShowModal(true);
      }
    }
  }, [loading, registrationData, requiredStep]);

  const handleContinue = () => {
    const nextStep = getNextStep();
    setShowModal(false);
    navigate(nextStep, { replace: true });
  };

  const handleRestart = () => {
    setShowModal(false);
    navigate('/company-type', { replace: true });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {children}
      <IncompleteRegistrationModal
        isOpen={showModal}
        onContinue={handleContinue}
        onRestart={handleRestart}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}