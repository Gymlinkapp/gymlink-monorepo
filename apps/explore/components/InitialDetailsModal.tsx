'use client';
import { SignInButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function InitialDetailsModal() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/home');
    }
  }, [isSignedIn]);

  return (
    <main className='h-screen overflow-hidden grid place-items-center bg-dark-500'>
      <div className='border-dark-400 rounded-xl border-1 p-12 flex flex-col gap-4 max-w-sm md:max-w-xl'>
        <div>
          <h2 className='text-xl font-medium'>Signup and get started</h2>
          <p className='text-light-400'>
            Simply sign up through your email or Google account to get started.
          </p>
        </div>
        <button className='btn btn-primary'>
          <SignInButton
            mode='modal'
            afterSignUpUrl='/home'
            afterSignInUrl='/home'
          />
        </button>
      </div>
    </main>
  );
}
