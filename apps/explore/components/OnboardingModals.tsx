'use client';
import { useState } from 'react';
import FindGymLocationModal from './FindGymLocationModal';

export default function OnboardingModals() {
  // create an array of modals and state to track which modal is open
  const [modal, setModal] = useState(0);
  const modals = [<FindGymLocationModal key={0} />];
  return (
    <main className='h-screen overflow-hidden grid place-items-center bg-dark-500'>
      {modals[modal]}
    </main>
  );
}
