import {
  Redirect,
  Stack, // Import `SplashScreen` from `expo-router` instead of `expo-splash-screen`
  SplashScreen,

  // This example uses a basic Layout component, but you can use any Layout.
  Slot,
  Tabs,
  useRouter,
} from 'expo-router';
import HeaderBackButton from '../../components/ui/HeaderBackButton';
import { TouchableOpacity } from 'react-native';
import { CaretLeft } from 'phosphor-react-native';

export default function AuthRoot() {
  const router = useRouter();
  return (
    // Setup the auth context and render our layout inside of it.
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#070707',
        },
        headerTitleStyle: {
          color: '#fff',
        },
      }}
    >
      <Stack.Screen
        name='signin'
        options={{
          title: 'Sign In',
          headerLeft: () => (
            <HeaderBackButton router={() => router.back()} text='Back' />
          ),
        }}
      />
      <Stack.Screen
        name='signup'
        options={{
          headerTitle: 'Sign Up',
          title: 'Sign Up',
          headerLeft: () => (
            <HeaderBackButton router={() => router.back()} text='Back' />
          ),
        }}
      />
    </Stack>
  );
}
