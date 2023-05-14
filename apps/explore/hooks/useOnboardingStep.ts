import { useState, useEffect } from 'react';

interface OnboardingStepHook {
  step: number;
  updateStep: (newStep: number) => void;
}

const useOnboardingStep = (): OnboardingStepHook => {
  const [step, setStep] = useState<number>(() => {
    const storedStep = localStorage.getItem('onboardingStep');
    return storedStep ? parseInt(storedStep, 10) : 1;
  });

  useEffect(() => {
    if (!step) {
      localStorage.setItem('onboardingStep', '1');
    }
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === 'onboardingStep') {
        setStep(parseInt(e.newValue as string, 10));
      }
    };

    window.addEventListener('storage', onStorageChange);

    return () => {
      window.removeEventListener('storage', onStorageChange);
    };
  }, []);

  const updateStep = (newStep: number) => {
    localStorage.setItem('onboardingStep', newStep.toString());
    setStep(newStep);
  };

  return { step, updateStep };
};

export default useOnboardingStep;
