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
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

type Gym = {
  description: string;
  place_id: string;
};

export default function InputGym() {
  const router = useRouter();
  const { authUser } = useAuth();
  const [input, setInput] = useState('');
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [gym, setGym] = useState<Gym | null>(null);

  const autoCompleteGymLocations = async (input: string) => {
    // const apiKey = process.env.GOOGLE_API_KEY;
    const apiKey = 'AIzaSyBeVNaKylQx0vKkZ4zW8T_J01s2rUK7KQA';
    const URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=gym&key=${apiKey}`;
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
    if (!authUser || !gym) {
      return;
    }
    try {
      // Connect gym to user
      await setDoc(
        doc(db, 'users', authUser.uid),
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
          users: arrayUnion(authUser.uid),
        },
        { merge: true }
      );

      router.replace('/');
    } catch (error) {
      console.log('Error during sign in:', error);
    }
  };
  return (
    <SafeAreaView className='flex-1 justify-between bg-dark-500'>
      <View>
        <TextInput
          className='bg-dark-400 px-2 py-6 rounded-md text-white'
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
                  className='px-2 py-6'
                  onPress={() => {
                    setGym(item);
                    setGyms([]);
                  }}
                >
                  <Text className='text-white font-MontserratMedium'>
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
          className='bg-white rounded-xl w-full py-6 items-center'
          onPress={connectGymToUser}
        >
          <Text className='font-bold text-dark-500'>Find your gym bro</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
