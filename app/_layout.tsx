// Import your global CSS file
import '../global.css';

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
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
  );
}
