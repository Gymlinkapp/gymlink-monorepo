import { useState } from 'react';
import { Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth/react-native';
import { auth } from '../../firebase';
import { useRouter } from 'expo-router';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log('Error during sign in:', error);
    }
  };

  // const handleSignUp = async () => {
  //   try {
  //     await signIn(email, password);
  //     // redirect user to another page
  //   } catch (error) {
  //     console.log('Error during sign up:', error);
  //     // handle error
  //   }
  // };

  return (
    <View className='justify-center flex-1 bg-dark-500'>
      <TextInput
        className='bg-dark-400 px-2 py-6 rounded-md text-white'
        placeholder='Email'
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
      <Button title='Sign in' onPress={signIn} />
      <View>
        <Text className='text-light-400'>
          Don't have an account?{' '}
          <TouchableOpacity
            onPress={() => {
              router.push('/signup');
            }}
          >
            <Text className='font-bold text-white'>Sign up</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
}
