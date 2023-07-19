import {useRouter} from 'expo-router';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useCurrentUser} from '../../../hooks/useCurrentUser';
import {arrayRemove, arrayUnion, doc, getDoc, setDoc} from 'firebase/firestore';
import {db} from '../../../firebase';
import {Gym, User} from '../../../types/user';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {X} from 'phosphor-react-native';

export default function Settings() {
  const {user, loading} = useCurrentUser();
  const [input, setInput] = useState('');
  const [selectedGyms, setSelectedGyms] = useState<Gym[]>([]);
  const [gyms, setGyms] = useState<Gym[]>([]);

  const router = useRouter();

  useEffect(() => {
    // If the user is loaded and has gyms, set them as the selected gyms
    if (user && user.gyms) {
      setSelectedGyms(user.gyms);
    }
    // If the user has a single gym, set it as the selected gym
    else if (user && user.gym) {
      setSelectedGyms([user.gym]);
    }
  }, [user]);

  const autoCompleteGymLocations = async (input: string) => {
    // const apiKey = process.env.GOOGLE_API_KEY;
    const URL = `https://api.gymlink.app/api/gyms/autocompleteGymLocations?input=${input}`;
    if (input === '') {
      setGyms([]);
      return;
    }
    try {
      const res = await axios.get(URL);
      setGyms(res.data.predictions);
    } catch (error) {
      console.log(error);
    }
  };

  const connectGymToUser = async () => {
    if (!user || selectedGyms.length === 0) {
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data() as User;

      const previousUserGyms = userData.gyms || [userData.gym];

      // Remove user from gyms they have unselected
      const gymsToRemove = previousUserGyms.filter(
        (gym) => !selectedGyms.includes(gym as Gym)
      );
      await Promise.all(
        gymsToRemove.map(async (gym) => {
          await setDoc(
            doc(db, 'gyms', gym?.place_id || ''),
            {
              users: arrayRemove(user.uid),
            },
            {merge: true}
          );
        })
      );

      // Connect gym to user
      await setDoc(
        userRef,
        {
          gyms: selectedGyms,
        },
        {merge: true}
      );

      // Add user to new gyms they have selected
      const gymsToAdd = selectedGyms.filter(
        (gym) => !previousUserGyms.includes(gym)
      );
      await Promise.all(
        gymsToAdd.map(async (gym) => {
          await setDoc(
            doc(db, 'gyms', gym.place_id),
            {
              users: arrayUnion(user.uid),
            },
            {merge: true}
          );
        })
      );

      router.push('/profile');
    } catch (error) {
      console.log('Error during gym update:', error);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-dark-500 px-6'>
      <View>
        <TextInput
          className='bg-dark-400 px-2 py-4 rounded-md text-white'
          placeholder='Search for gyms'
          onChangeText={(value) => {
            setInput(value);
            autoCompleteGymLocations(value);
          }}
          value={input}
        />
        {gyms.length > 0 && (
          <View className='bg-secondaryDark rounded-b-md border-2 border-tertiaryDark'>
            <FlatList
              data={gyms}
              renderItem={({item}) => (
                <TouchableOpacity
                  className='px-2 py-6 bg-dark-400 my-2 rounded-md'
                  onPress={() => {
                    setSelectedGyms([...selectedGyms, item]);
                    setGyms([]);
                  }}
                >
                  <Text className='text-light-400 text-sm font-bold'>
                    {item.description}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      <ScrollView>
        {selectedGyms.length > 0 &&
          selectedGyms.map((gym) => (
            <View
              className='px-2 py-6 bg-dark-400 flex-row w-full justify-between items-center my-2 rounded-md'
              key={gym.place_id}
            >
              <Text className='text-light-400 text-sm font-bold w-72'>
                {gym.description}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedGyms(selectedGyms.filter((g) => g !== gym));
                }}
              >
                <X size={24} color='white' />
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
      {selectedGyms.length > 0 && (
        <TouchableOpacity
          className='bg-light-500 w-full py-6 rounded-md items-center mt-12'
          onPress={connectGymToUser}
        >
          <Text className='text-dark-500 font-akira-expanded'>
            Add selected gyms
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
