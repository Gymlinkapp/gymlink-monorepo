import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { MapPin } from 'phosphor-react-native';
import Loading from '../../../components/ui/Loading';
import { LinearGradient } from 'expo-linear-gradient';
import { findUsersPlansToday } from '../../../utils/findUsersGymPlansForToday';
import { auth, db } from '../../../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { Stack } from 'expo-router';

export default function Profile() {
  const { user, loading } = useCurrentUser();

  if (!user || loading) return <Loading />;

  let todayPlan = findUsersPlansToday(user.gymPlans);

  const deleteUser = async () => {
    const authUser = auth.currentUser;
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await authUser?.delete();
      auth.signOut();
    } catch (error) {
      console.log('Error deleting user:', error);
    }
  };

  return (
    <View className='bg-dark-500 h-full'>
      <Stack.Screen
        options={{ headerShown: false, title: user ? user.name : 'Profile' }}
      />
      <View className='w-full h-[70%] overflow-hidden rounded-2xl justify-end'>
        <Image
          source={{ uri: user.image }}
          className='w-full h-full absolute top-0 left-0'
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.25)']}
          style={{
            zIndex: 10,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
          }}
        />

        {/* user info */}
        <View className='z-20 p-8'>
          <View className='flex-row items-center'>
            {/* name & age */}
            <Text className='text-white font-akira-expanded mr-4 text-lg'>
              {user.name}
            </Text>
            <View className='bg-dark-300 p-2 px-2 rounded-full overflow-hidden'>
              <Text className='text-white '>{user.age}</Text>
            </View>
          </View>

          {/* location */}
          <View className='flex-row items-center'>
            <MapPin size={20} color='white' />
            <Text className='text-white'>{user.gym?.description}</Text>
          </View>

          {/* their gym plans */}
          {/* if a user has gym      plans today [{date: string}] */}
          {todayPlan && (
            <View className='flex-row items-center'>
              {user.gymPlans &&
                todayPlan.movements.map((movement) => (
                  <View
                    key={movement.label}
                    className='rounded-full px-4 py-2 bg-light-500 mt-2 mx-1'
                  >
                    <Text className='text-dark-500 text-xs'>
                      {movement.label}
                    </Text>
                  </View>
                ))}
            </View>
          )}
        </View>
      </View>

      <View>
        <TouchableOpacity className='bg-red-700 rounded-xl'>
          <Text className='text-white text-center text-lg font-bold py-4'>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
