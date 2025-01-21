// Import your global CSS file
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppStateStatus } from 'react-native';
import '../global.css';

import { useAppState } from '@hooks/useAppState';
import { useOnlineManager } from '@hooks/useOnlineManager';
import { focusManager } from '@tanstack/react-query';
import { Stack } from 'expo-router';
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

export default function RootLayout() {
  useOnlineManager();

  useAppState(onAppStateChange);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen
          name='book/[id]'
          options={{
            presentation: 'fullScreenModal', // This makes the screen cover the entire screen
            headerShown: false, // Optional: Hide the header if you want a full-screen experience
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
