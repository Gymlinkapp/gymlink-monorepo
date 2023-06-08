import React, { useState } from 'react';
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth/react-native';
import { collection, doc, setDoc } from 'firebase/firestore';

import { auth, db } from '../../firebase';
import { Stack, useRouter } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import OnboardHeader from '../../components/ui/OnboardHeader';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      await setDoc(doc(db, 'users', uid), {
        email: email,
        authStep: 'name',
        uid: uid,
      });
      // router.push('/inputName');
    } catch (error) {
      console.log('Error during sign in:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View className='justify-between p-6 flex-1 bg-dark-500'>
        <Stack.Screen
          options={{
            title: 'Sign Up',
            headerLeft: () => (
              <TouchableOpacity
                className='text-light-500 flex-row items-center'
                onPress={() => {
                  router.push('/');
                }}
              >
                <CaretLeft size={24} color='#fff' />
                <Text className='text-light-500'>Sign In</Text>
              </TouchableOpacity>
            ),
          }}
        />
        <OnboardHeader
          title='Find your gym bro.'
          subtitle='Tap in with your gym community, see what everyone is doing and get big
        together.'
        />
        <View>
          <View>
            <Text className='text-light-400 font-akira-expanded text-xs'>
              Email
            </Text>
            <TextInput
              className='bg-dark-400 px-2 py-6 rounded-md text-white mb-2'
              placeholder='Email'
              onChangeText={setEmail}
              value={email}
              autoComplete='email'
              textContentType='emailAddress'
            />
          </View>

          <View>
            <Text className='text-light-400 font-akira-expanded text-xs'>
              Password
            </Text>
            <TextInput
              className='bg-dark-400 px-2 py-6 rounded-md text-white'
              placeholder='Password'
              onChangeText={setPassword}
              value={password}
              secureTextEntry
            />
          </View>
          <View className='items-center justify-center py-2'>
            <Text className='text-light-400'>
              Already have an account?{' '}
              <TouchableOpacity
                onPress={() => {
                  router.push('/signin');
                }}
              >
                <Text className='underline text-white'>Sign in</Text>
              </TouchableOpacity>
            </Text>
          </View>
          <TouchableOpacity
            className='bg-light-500 w-full py-6 rounded-md items-center mt-12'
            onPress={signUp}
          >
            <Text className='text-dark-500 font-akira-expanded'>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
