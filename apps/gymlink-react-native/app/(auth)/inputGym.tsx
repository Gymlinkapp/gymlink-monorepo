import {arrayUnion, doc, setDoc} from 'firebase/firestore';
import {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {db} from '../../firebase';
import {Stack, useRouter} from 'expo-router';
import {useAuth} from '../../context/auth';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import HeaderBackButton from '../../components/ui/HeaderBackButton';
import OnboardHeader from '../../components/ui/OnboardHeader';
import {useCurrentUser} from '../../hooks/useCurrentUser';
import {X} from 'phosphor-react-native';

type Gym = {
  description: string;
  place_id: string;
};

export default function InputGym() {
  const router = useRouter();
  const {user} = useCurrentUser();
  const [input, setInput] = useState('');
  const [selectedGyms, setSelectedGyms] = useState<Gym[]>([]);
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
    if (!user || selectedGyms.length === 0) {
      return;
    }
    try {
      // Connect gym to user
      await setDoc(
        doc(db, 'users', user.uid),
        {
          gyms: selectedGyms,
          authStep: 'complete',
        },
        {merge: true}
      );

      // Save gym to Firestore
      // await setDoc(
      //   doc(db, 'gyms', gym.place_id),
      //   {
      //     ...gym,
      //     users: arrayUnion(user.uid),
      //   },
      //   {merge: true}
      // );
      console.log('hello');
      // multiple gyms
      await Promise.all(
        selectedGyms.map(async (gym) => {
          await setDoc(
            doc(db, 'gyms', gym.place_id),
            {
              ...gym,
              users: arrayUnion(user.uid),
            },
            {merge: true}
          );
        })
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
          title: 'Connect to your gym',
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
            <View className='px-2 py-6 bg-dark-400 flex-row w-full justify-between items-center my-2 rounded-md'>
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
            Find your gym bro
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
