import { Button, Text, View } from 'react-native';
import {
  SplashScreen,
  useRootNavigationState,
  useRouter,
  useSegments,
} from 'expo-router';
import { AuthProvider, useAuth } from '../context/auth';
import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, doc, getDoc, where } from 'firebase/firestore';
import { query } from 'firebase/database';
import { User } from '../types/user';

export default function Home() {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const { authUser, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!authUser) {
        return <SplashScreen />;
      }
      const userId = authUser.uid;
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      const currentUsersGymId = (userDoc.data() as User).gym.place_id;
      const gymRef = doc(db, 'gyms', currentUsersGymId);
      const gymSnap = await getDoc(gymRef);

      if (gymSnap.exists()) {
        const userIds = gymSnap.data().users;
        const userRefs = userIds.map((id: string) => doc(db, 'users', id));
        const userSnaps = await Promise.all(userRefs.map(getDoc));

        const users = userSnaps.map((snap) => snap.data());
        setUsers(users.filter((u) => u.email !== user?.email)); // store the users in state
      }
    };

    fetchUsers();
  }, []); // dependency array is empty so this effect runs once on mount

  console.log(
    'u',
    users.map((u) => u.name)
  );
  console.log('me', user?.name);

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
