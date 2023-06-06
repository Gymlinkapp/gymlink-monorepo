import { Button, Text, View } from 'react-native';
import { useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/auth';
import { useEffect } from 'react';
import { auth } from '../firebase';

export default function Home() {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const { user } = useAuth();

  // Handle unauthenticated users
  useEffect(() => {
    if (!navigationState?.key) {
      // Temporary fix for router not being ready.
      return;
    }
    const inAuthGroup = segments[0] === '(auth)';

    if (user && user.authStep === 'complete' && inAuthGroup) {
      // Redirect to the home page.
      router.replace('/');
    }

    if (!user && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace('/signin');
    }
  }, [user, segments, navigationState?.key]);

  return (
    <View className='justify-center flex-1 bg-dark-500'>
      <Button
        title='sign out'
        onPress={() => {
          auth.signOut();
          // router.push('/signin');
        }}
      />
    </View>
  );
}
