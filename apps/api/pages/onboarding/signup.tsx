import { SignInButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignUpPage() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user && isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn, user]);

  return (
    <main className='h-screen grid place-items-center bg-dark-500'>
      {!isSignedIn && (
        <div className='border-1 border-dark-400 rounded-xl p-12'>
          <h1 className='font-medium text-2xl'>Sign up</h1>
          <p className='text-light-400'>Sign up to see the dashboard</p>
          <SignInButton mode='modal'>
            <button className='btn btn-primary'>Sign Up</button>
          </SignInButton>
        </div>
      )}
    </main>
  );
}
