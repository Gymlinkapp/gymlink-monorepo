'use client';
import { UserButton, useUser, SignInButton } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn } = useUser();
  return (
    <div className=''>
      {isSignedIn && <UserButton />}
      {!isSignedIn && <SignInButton mode='modal'>Sign in</SignInButton>}
      <h1>hi</h1>
    </div>
  );
}
