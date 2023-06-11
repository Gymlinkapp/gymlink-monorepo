import {
  Stack,
  usePathname,
  useRootNavigationState,
  useRouter,
  useSegments,
} from 'expo-router';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../context/auth';
import { Text, View } from 'react-native';
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function Index() {
  const { user, loading, isLoggedIn } = useCurrentUser();

  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const currentRoute = usePathname();

  useEffect(() => {
    if (!navigationState?.key) {
      // Temporary fix for router not being ready.
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (isLoggedIn && inAuthGroup && currentRoute !== '/(tabs)/home') {
      // Redirect to the home page.
      router.replace('/(tabs)/home');
    }

    if (!isLoggedIn && !inAuthGroup && currentRoute !== '/signin') {
      // Redirect to the sign-in page.
      router.replace('/signin');
    }
  }, [user, segments, loading, isLoggedIn]); // Use 'isLoggedIn' as a dependency

  useEffect(() => {
    if (!navigationState?.key) {
      // Temporary fix for router not being ready.
      return;
    }
    // If the user has completed the auth process, then redirect to the home page
    if (user) {
      if (user.authStep === 'complete') {
        // If the user has completed the auth process, then redirect to the home page
        router.replace('/');
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

  console.log('userrr', user);

  return <View>{!navigationState?.key ? <Text>LOADING...</Text> : <></>}</View>;
}
