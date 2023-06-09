import useSaveUser from '@/hooks/useSaveUser';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignUpPage() {
  const { user, isSignedIn } = useUser();
  const { savedUser } = useSaveUser();
  const router = useRouter();

  useEffect(() => {
    if (savedUser || isSignedIn) {
      router.push(`/onboarding/basics`);
    }
  }, [isSignedIn, user, savedUser]);

  return (
    <main className='h-screen grid place-items-center bg-dark-500'>
      {!isSignedIn && (
        <div className='border-1 border-dark-400 rounded-xl p-12'>
          <h1 className='font-medium text-2xl'>Sign up</h1>
          <p className='text-light-400 mb-12'>
            Sign up to get active together.
          </p>
          <SignInButton mode='modal'>
            <button className='btn btn-primary w-full'>Sign Up</button>
          </SignInButton>
        </div>
      )}
    </main>
  );
}
