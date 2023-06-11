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
import { useAuthNavigation } from '../hooks/useAuthNavigation';

export default function Index() {
  const { user, loading, isLoggedIn } = useCurrentUser();
  useAuthNavigation(user);

  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const currentRoute = usePathname();

  console.log('userrr', user);

  return (
    <View className='bg-dark-500 h-full'>
      {!navigationState?.key ? <Text>LOADING...</Text> : <></>}
    </View>
  );
}
