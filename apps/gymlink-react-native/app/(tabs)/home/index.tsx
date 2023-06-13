import {
  useSegments,
  useRouter,
  useRootNavigationState,
  SplashScreen,
  Stack,
} from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { User } from '../../../types/user';
import { ArrowsCounterClockwise, Plus } from 'phosphor-react-native';
import GymPlanModal from '../../../components/ui/GymPlanModal';
import { SwipeableUserCard } from '../../../components/ui/SwipableUserCard';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import Loading from '../../../components/ui/Loading';
import { findUsersPlansToday } from '../../../utils/findUsersGymPlansForToday';
import UserActionsModal from '../../../components/ui/modals/UserActions';

const { height } = Dimensions.get('window');

export default function Home() {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const { user, isLoggedIn } = useCurrentUser();
  const [users, setUsers] = useState<User[]>([]);

  const [index, setIndex] = useState(0);
  const [swipedUsers, setSwipedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGymPlanModalVisible, setIsGymPlanModalVisible] = useState(false);

  const translateY = new Animated.Value(height);

  const openModal = () => {
    setIsGymPlanModalVisible(true);
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
      setIsGymPlanModalVisible(false);
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      if (!user) {
        return <SplashScreen />;
      }
      try {
        const userId = user.uid;
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
          setUsers(
            users
              .filter((u) => u !== undefined)
              .filter((u) => u.uid !== user?.uid)
              // make sure that the users that the current user blocked are not shown in the feed.
              .filter((u) => !user?.blockedUsers?.includes(u?.uid))
          ); // store the users in state
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, [user]); // dependency array is empty so this effect runs once on mount

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

  const resetFeed = () => {
    setUsers(swipedUsers);
    setSwipedUsers([]);
  };

  if (loading) return <Loading />;

  const todayPlans = findUsersPlansToday(user?.gymPlans);

  return (
    <View className='bg-dark-500 h-full'>
      <Stack.Screen options={{ headerShown: false }} />
      <View className='w-full h-12 flex-row justify-end px-4 items-center'>
        <TouchableOpacity onPress={resetFeed}>
          <ArrowsCounterClockwise size={18} color='#fff' weight='bold' />
        </TouchableOpacity>
        {!todayPlans && (
          <TouchableOpacity
            onPress={openModal}
            className='h-10 w-10 rounded-full items-center justify-center bg-light-500'
          >
            <Plus size={18} color='#000' weight='bold' />
          </TouchableOpacity>
        )}
      </View>

      <GymPlanModal
        isModalVisible={isGymPlanModalVisible}
        setIsModalVisible={setIsGymPlanModalVisible}
      />
      <View style={styles.container}>
        {users.map((user, i) => (
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
