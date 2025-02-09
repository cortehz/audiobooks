// Import your global CSS file
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppStateStatus } from 'react-native';
import '../global.css';

import {
  CrimsonText_400Regular,
  CrimsonText_600SemiBold,
  CrimsonText_700Bold,
  useFonts,
} from '@expo-google-fonts/crimson-text';
import { useAppState } from '@hooks/useAppState';
import { useOnlineManager } from '@hooks/useOnlineManager';
import { focusManager } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';

function onAppStateChange(status: AppStateStatus) {
  // React Query already supports in web browser refetch on window focus by default
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    CrimsonText: CrimsonText_400Regular,
    'CrimsonText-SemiBold': CrimsonText_600SemiBold,
    'CrimsonText-Bold': CrimsonText_700Bold,
  });

  useOnlineManager();
  useAppState(onAppStateChange);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen
          name='(modals)/allbooks/[type]'
          options={{ headerShown: false, presentation: 'fullScreenModal' }}
          initialParams={{ type: 'all' }}
        />
        <Stack.Screen
          name='(modals)/book/[id]'
          options={{
            presentation: 'fullScreenModal',
            headerShown: false,
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
