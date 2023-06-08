import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebase';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../context/auth';
import { styled } from 'nativewind';
import OnboardLayout from '../../components/Layouts/OnboardLayout';
import HeaderBackButton from '../../components/ui/HeaderBackButton';
import OnboardHeader from '../../components/ui/OnboardHeader';

export default function InputGender() {
  const [gender, setGender] = useState('');
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
          gender: gender,
          authStep: 'picture',
        },
        { merge: true }
      );

      console.log(gender);

      router.push('/inputPicture');
    } catch (error) {
      console.log('Error during sign in:', error);
    }
  };
  return (
    <OnboardLayout>
      <Stack.Screen
        options={{
          title: 'Your gender',
          headerLeft: () => (
            <HeaderBackButton router={() => router.back} text='Back' />
          ),
        }}
      />
      <OnboardHeader title='What do you identify as?' subtitle='' />
      <View className='justify-center flex-col-reverse flex-1 bg-dark-500'>
        <View className='gap-6'>
          <TouchableOpacity
            className='bg-dark-300 rounded-md py-6 items-center text-white'
            onPress={() => {
              setGender('male');
              if (gender.length > 0) {
                chooseName();
              }
            }}
          >
            <Text className='text-white font-bold'>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='bg-dark-300 rounded-md py-6 items-center text-white'
            onPress={() => {
              setGender('female');
              if (gender.length > 0) {
                chooseName();
              }
            }}
          >
            <Text className='text-white font-bold'>Female</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='bg-dark-300 rounded-md py-6 items-center text-white'
            onPress={() => {
              setGender('other');
              if (gender.length > 0) {
                chooseName();
              }
            }}
          >
            <Text className='text-white font-bold'>Other</Text>
          </TouchableOpacity>
        </View>
      </View>
    </OnboardLayout>
  );
}
