import {
  Animated,
  Modal,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SplashScreen,
  Stack,
  Tabs,
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
import { House, Plus, SignOut, X } from 'phosphor-react-native';
import { SwipeableUserCard } from '../components/ui/SwipableUserCard';

const { height } = Dimensions.get('window');

export default function Home() {
  const [index, setIndex] = useState(0);
  const [swipedUsers, setSwipedUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const translateY = new Animated.Value(height);

  const openModal = () => {
    setIsModalVisible(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIsModalVisible(false);
    });
  };

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
      try {
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
          console.log('users', users);
          setUsers(
            users
              .filter((u) => u !== undefined)
              .filter((u) => u.uid !== user?.uid)
          ); // store the users in state
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []); // dependency array is empty so this effect runs once on mount

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

  const handleSwipe = (swipedUserId: string) => {
    // Find the swiped user from the users state
    const swipedUser = users.find((user) => user.uid === swipedUserId);

    // If the user is found, add them to the swipedUsers state
    if (swipedUser) {
      setSwipedUsers((prevSwipedUsers) => [...prevSwipedUsers, swipedUser]);
    }

    // Remove the swiped user from the users state
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.uid !== swipedUserId)
    );
  };

  // router.replace('/inputPicture');

  return (
    <View className='flex-1 bg-dark-500'>
      <Tabs.Screen
        options={{
          headerStyle: {
            backgroundColor: '#070707',
            shadowColor: '#070707',
            borderBottomColor: '#070707',
          },
          tabBarStyle: {
            backgroundColor: '#070707',
            borderTopColor: '#070707',
          },
          tabBarIcon: ({ focused }) => (
            <House size={24} color='#fff' weight={focused ? 'fill' : 'bold'} />
          ),
          headerTitle: '',
          headerShown: true,

          headerLeft: () => (
            <Text className='font-akira-expanded text-light-500'>Gymlink</Text>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                auth.signOut();
                // router.push('/signin');
              }}
            >
              <SignOut size={24} color='#fff' weight='bold' />
            </TouchableOpacity>
          ),
        }}
      />
      <View className='w-full h-12 flex-row justify-end px-4 items-center'>
        <TouchableOpacity
          onPress={openModal}
          className='h-10 w-10 rounded-full items-center justify-center bg-light-500'
        >
          <Plus size={18} color='#000' weight='bold' />
        </TouchableOpacity>
      </View>
      <Modal
        visible={isModalVisible}
        animationType='slide'
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className='flex-1 justify-end items-end w-full'>
          <View className='bg-dark-500 border-1 border-dark-400 w-full h-1/2 p-12 rounded-3xl'>
            <View className='m-2 flex-row items-center w-full justify-between'>
              <Text className='text-white text-md font-akira-expanded'>
                Your gym plans
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                }}
              >
                <X color='#fff' />
              </TouchableOpacity>
            </View>
            <View className='flex-row flex-wrap flex-1'></View>
            <View className='flex-row w-full'></View>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        {users.slice(index, index + 3).map((user, i) => (
          <SwipeableUserCard
            key={i}
            user={user}
            onSwipe={() => handleSwipe(user.uid)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
});
