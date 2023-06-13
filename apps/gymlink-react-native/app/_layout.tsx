import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';

import { NativeWindStyleSheet } from 'nativewind';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

export default function Layout() {
  const [fontsLoaded] = useFonts({
    AkiraExpanded: require('../assets/fonts/Akira-Expanded.otf'),
  });
  console.log('hi');

  if (!fontsLoaded) {
    // The native splash screen will stay visible for as long as there
    // are `<SplashScreen />` components mounted. This component can be nested.

    return <SplashScreen />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
