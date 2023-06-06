import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth/react-native';
import { collection, doc, setDoc } from 'firebase/firestore';

import { auth, db } from '../../firebase';
import { useRouter } from 'expo-router';

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
      });

      router.push('/inputName');
    } catch (error) {
      console.log('Error during sign in:', error);
    }
  };

  return (
    <View className='justify-center flex-1 bg-dark-500'>
      <TextInput
        placeholder='Email'
        className='bg-dark-400 px-2 py-6 rounded-md text-white'
        onChangeText={setEmail}
        value={email}
        autoComplete='email'
        textContentType='emailAddress'
      />
      <TextInput
        className='bg-dark-400 px-2 py-6 rounded-md text-white'
        placeholder='Password'
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title='Sign up' onPress={signUp} />
    </View>
  );
}
