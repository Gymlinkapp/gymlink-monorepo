import { usePathname, useRootNavigationState, useRouter } from 'expo-router';
import { User } from '../types/user';
import { useEffect, useState } from 'react';

export function useAuthNavigation(user: User | null) {
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const pathname = usePathname();
  // console.log(user);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!navigationState?.key) {
      // Temporary fix for router not being ready.
      return;
    }
    // Set ready state to true when the navigation state key is available.
    setReady(true);
  }, [navigationState?.key]);

  useEffect(() => {
    if (!ready) {
      // Don't do anything until the navigation state is ready.
      return;
    }
    if (!user) {
      // If the user is not logged in, then redirect to the signin page
      if (pathname !== '/signin') {
        router.replace('/signin');
        console.log('user not logged in');
      }
    }
    // If the user has completed the auth process, then redirect to the home page
    else {
      if (user.authStep === 'complete' && pathname !== '/(tabs)/home') {
        // If the user has completed the auth process, then redirect to the home page
        router.replace('/(tabs)/home');
      }
      if (user.authStep !== 'complete') {
        const paths = {
          name: '/inputName',
          age: '/inputAge',
          gender: '/inputGender',
          picture: '/inputPicture',
          gym: '/inputGym',
        };

        const currentPath = paths[user.authStep as keyof typeof paths];
        if (pathname !== currentPath) {
          router.replace(currentPath);
        }
      }
    }
  }, [user, ready, pathname]); // React only on user, ready state change and current path change
}
