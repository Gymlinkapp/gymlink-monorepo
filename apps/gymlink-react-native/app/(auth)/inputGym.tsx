import { arrayUnion, doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../firebase';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBackButton from '../../components/ui/HeaderBackButton';
import OnboardHeader from '../../components/ui/OnboardHeader';
import { useCurrentUser } from '../../hooks/useCurrentUser';

type Gym = {
  description: string;
  place_id: string;
};

export default function InputGym() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [input, setInput] = useState('');
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [gym, setGym] = useState<Gym | null>(null);

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
    if (!user || !gym) {
      return;
    }
    try {
      // Connect gym to user
      await setDoc(
        doc(db, 'users', user.uid),
        {
          gym: gym,
          authStep: 'complete',
        },
        { merge: true }
      );

      // Save gym to Firestore
      await setDoc(
        doc(db, 'gyms', gym.place_id),
        {
          ...gym,
          users: arrayUnion(user.uid),
        },
        { merge: true }
      );

      router.replace('/(tabs)/home');
    } catch (error) {
      console.log('Error during sign in:', error);
    }
  };
  return (
    <SafeAreaView className='flex-1 justify-between bg-dark-500 px-6'>
      <Stack.Screen
        options={{
          title: 'Your gender',
          headerLeft: () => (
            <HeaderBackButton router={() => router.back} text='Back' />
          ),
        }}
      />
      <View>
        <OnboardHeader
          title='Tap into your gym.'
          subtitle='Tap in with your gym community, see what everyone is doing and get big together.'
        />
        <TextInput
          className='bg-dark-400 px-2 py-4 rounded-md text-white'
          placeholder='Power House, Dallas, Texas'
          onChangeText={(value) => {
            setInput(value);
            autoCompleteGymLocations(value);
          }}
          value={gym ? gym.description : input}
        />
        {gyms.length > 0 && (
          <View className='bg-secondaryDark rounded-b-md border-2 border-tertiaryDark'>
            <FlatList
              data={gyms}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className='px-2 py-6 bg-dark-400 my-2 rounded-md'
                  onPress={() => {
                    setGym(item);
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
      {gym && (
        <TouchableOpacity
          className='bg-light-500 w-full py-6 rounded-md items-center mt-12'
          onPress={connectGymToUser}
        >
          <Text className='text-dark-500 font-akira-expanded'>
            Find your gym bro
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
