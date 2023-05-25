'use client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const gym = localStorage.getItem('selectedGym');

    if (user && !gym) {
      router.push('/onboarding/1-gym-selection');
    }

    if (!user && !gym) {
      router.push('/onboarding/1-gym-selection');
    }

    if (isSignedIn && user) {
      router.push('/home');
    }
  }, [user]);
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'></div>
  );
}
