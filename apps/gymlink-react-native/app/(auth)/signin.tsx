import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth/react-native';
import { auth } from '../../firebase';
import { Stack, useRouter } from 'expo-router';
import Button from '../../components/ui/Button';
import OnboardHeader from '../../components/ui/OnboardHeader';
import { CaretLeft } from 'phosphor-react-native';
import HeaderBackButton from '../../components/ui/HeaderBackButton';
import { useSignIn } from '../../hooks/useSignIn';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useAuthNavigation } from '../../hooks/useAuthNavigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const { user } = useCurrentUser();
  useAuthNavigation(user);

  useEffect(() => {
    if (user) {
      router.push('/(tabs)/home');
    }
  }, []);

  const signIn = useSignIn();

  const handleSignIn = async () => {
    try {
      const user = await signIn(email, password);

      if (user) {
        router.push('/(tabs)/home');
      }
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View className='flex-1 bg-dark-500 p-6 justify-between'>
        <OnboardHeader
          title='Find your gym bro.'
          subtitle='Tap in with your gym community, see what everyone is doing and get big
        together.'
        />
        <View>
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
          </View>
          <View className='items-center justify-center py-2'>
            <Text className='text-light-400'>
              Don't have an account?{' '}
              <TouchableOpacity
                onPress={() => {
                  router.replace('/signup');
                }}
              >
                <Text className='underline text-white'>Sign up</Text>
              </TouchableOpacity>
            </Text>
          </View>
          <TouchableOpacity
            className='bg-light-500 w-full py-6 rounded-md items-center mt-12'
            onPress={handleSignIn}
          >
            <Text className='text-dark-500 font-akira-expanded'>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
