'use client';
import OnboardingModals from '@/components/OnboardingModals';
import useOnboardingStep from '@/hooks/useOnboardingStep';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Input = {
  token: string;
  gym: {
    name: string;
    latitude: number;
    longitude: number;
  };
  authSteps: number;
  longitude: number;
  latitude: number;
};

export default function Home() {
  // const { isSignedIn, user } = useUser();
  const { step } = useOnboardingStep();
  const router = useRouter();

  useEffect(() => {
    switch (step) {
      case 1:
        router.push('/onboarding/findyourgym');
        break;
      case 2:
        router.push('/onboarding/step2');
        break;
      case 3:
        router.push('/onboarding/step3');
        break;
      default:
        console.error('Invalid onboarding step');
    }
  }, [step, router]);
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      {/* <Banner /> */}
      <OnboardingModals />
    </div>
  );
}
