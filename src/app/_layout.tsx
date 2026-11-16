import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';

import { Baloo2_700Bold } from '@expo-google-fonts/baloo-2';
import { Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { AppStateProvider } from '@/lib/app-state';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Baloo2_700Bold, Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold });

  if (!fontsLoaded && !fontError) return null;

  return (
    <AppStateProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 260,
          gestureEnabled: true,
          animationMatchesGesture: true,
        }}
      />
    </AppStateProvider>
  );
}
