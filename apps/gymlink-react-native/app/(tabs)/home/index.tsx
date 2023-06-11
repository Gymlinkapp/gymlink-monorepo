import {
  useSegments,
  useRouter,
  useRootNavigationState,
  SplashScreen,
} from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/auth';
import { db } from '../../../firebase';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { User } from '../../../types/user';
import { Plus } from 'phosphor-react-native';
import GymPlanModal from '../../../components/ui/GymPlanModal';
import { SwipeableUserCard } from '../../../components/ui/SwipableUserCard';
import { useCurrentUser } from '../../../hooks/useCurrentUser';

const { height } = Dimensions.get('window');

export default function Home() {
  const [index, setIndex] = useState(0);
  const [swipedUsers, setSwipedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
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

  const { user, isLoggedIn } = useCurrentUser();
  const [users, setUsers] = useState<User[]>([]);

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
          ); // store the users in state
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();
  }, []); // dependency array is empty so this effect runs once on mount

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

  return (
    <View className='bg-dark-500 h-full'>
      <View className='w-full h-12 flex-row justify-end px-4 items-center'>
        <TouchableOpacity
          onPress={openModal}
          className='h-10 w-10 rounded-full items-center justify-center bg-light-500'
        >
          <Plus size={18} color='#000' weight='bold' />
        </TouchableOpacity>
      </View>
      <GymPlanModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
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
