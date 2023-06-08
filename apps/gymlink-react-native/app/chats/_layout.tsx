import {
  Redirect,
  Stack, // Import `SplashScreen` from `expo-router` instead of `expo-splash-screen`
  SplashScreen,

  // This example uses a basic Layout component, but you can use any Layout.
  Slot,
  Tabs,
} from 'expo-router';

import { AuthProvider } from '../../context/auth';

export default function AuthRoot() {
  return (
    // Setup the auth context and render our layout inside of it.
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#070707',
          },
          headerTitleStyle: {
            color: '#fff',
          },
          //   title: 'Gymlink',
        }}
      />
    </AuthProvider>
  );
}
