import {
  Redirect,
  Stack, // Import `SplashScreen` from `expo-router` instead of `expo-splash-screen`
  SplashScreen,

  // This example uses a basic Layout component, but you can use any Layout.
  Slot,
} from 'expo-router';
import { useFonts } from 'expo-font';

import { AuthProvider } from '../context/auth';

export default function Root() {
  const [loaded] = useFonts({
    AkiraExpanded: require('../assets/fonts/Akira-Expanded.otf'),
  });

  if (!loaded) {
    return <SplashScreen />;
  }
  return (
    // Setup the auth context and render our layout inside of it.
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AuthProvider>
  );
}
