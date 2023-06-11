import { useRootNavigationState, useRouter } from 'expo-router';
import { User } from '../types/user';
import { useEffect } from 'react';

export function useAuthNavigation(user: User | null) {
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) {
      // Temporary fix for router not being ready.
      return;
    }

    // If the user has completed the auth process, then redirect to the home page
    if (user) {
      if (user.authStep === 'complete') {
        // If the user has completed the auth process, then redirect to the home page
        router.replace('/(tabs)/home');
      }

      if (user.authStep !== 'complete') {
        switch (user.authStep) {
          case 'name':
            router.replace('/inputName');
            break;
          case 'age':
            router.replace('/inputAge');
            break;
          case 'gender':
            router.replace('/inputGender');
            break;
          case 'picture':
            router.replace('/inputPicture');
            break;
          case 'gym':
            router.replace('/inputGym');
            break;
          default:
            router.replace('/signin');
            break;
        }
      }
    }
  }, [user, user?.authStep, navigationState?.key]);
}
