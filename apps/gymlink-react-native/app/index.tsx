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
import Loading from '../components/ui/Loading';

export default function Index() {
  const { user, loading, isLoggedIn } = useCurrentUser();
  useAuthNavigation(user);

  return (
    <View className='bg-dark-500 h-full'>
      {loading ? <Loading /> : <Text className='text-white'>Idek</Text>}
    </View>
  );
}
