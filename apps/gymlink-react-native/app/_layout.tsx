import {
  Redirect,
  Stack, // Import `SplashScreen` from `expo-router` instead of `expo-splash-screen`
  SplashScreen,

  // This example uses a basic Layout component, but you can use any Layout.
  Slot,
  Tabs,
} from 'expo-router';
import { useFonts } from 'expo-font';

import { AuthProvider } from '../context/auth';
import { ChatCircle, House } from 'phosphor-react-native';

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
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#070707',
          },
          headerStyle: {
            backgroundColor: '#070707',
          },
          tabBarShowLabel: false,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name='home'
          options={{
            tabBarIcon: ({ focused }) => (
              <House
                size={24}
                color='#fff'
                weight={focused ? 'fill' : 'bold'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='chats'
          options={{
            tabBarIcon: ({ focused }) => (
              <ChatCircle
                size={24}
                color='#fff'
                weight={focused ? 'fill' : 'bold'}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='chats/[chat]'
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name='(auth)'
          options={{
            href: null,
          }}
        />
      </Tabs>
    </AuthProvider>
  );
}
