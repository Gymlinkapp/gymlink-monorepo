import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebase';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import OnboardLayout from '../../components/Layouts/OnboardLayout';
import OnboardHeader from '../../components/ui/OnboardHeader';
import HeaderBackButton from '../../components/ui/HeaderBackButton';

export default function InputName() {
  const [name, setName] = useState('');
  const { authUser } = useAuth();
  const router = useRouter();

  const chooseName = async () => {
    if (!authUser) {
      return;
    }
    try {
      await setDoc(
        doc(db, 'users', authUser.uid),
        {
          name: name,
          authStep: 'age',
        },
        { merge: true }
      );

      router.push('/inputAge');
    } catch (error) {
      console.log('Error during sign in:', error);
    }
  };
  return (
    <OnboardLayout>
      <Stack.Screen
        options={{
          title: 'Choose a name',
          headerLeft: () => (
            <HeaderBackButton router={() => router.back} text='Back' />
          ),
        }}
      />
      <OnboardHeader title='Choose a name.' subtitle='Strive for greatness.' />

      <View>
        <Text className='text-light-400 font-akira-expanded text-xs'>Name</Text>
        <TextInput
          className='bg-dark-400 px-2 py-6 rounded-md text-white'
          placeholder='Christopher Bumsted'
          onChangeText={setName}
          value={name}
          autoComplete='name'
          textContentType='name'
        />
      </View>
      <TouchableOpacity
        className='bg-light-500 w-full py-6 rounded-md items-center mt-12'
        onPress={chooseName}
      >
        <Text className='text-dark-500 font-akira-expanded'>Continue</Text>
      </TouchableOpacity>
    </OnboardLayout>
  );
}
