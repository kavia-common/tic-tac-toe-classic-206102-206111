import { Stack } from 'expo-router';

// PUBLIC_INTERFACE
export default function RootLayout() {
  /** Root navigation layout for the app. */
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Tic Tac Toe' }} />
    </Stack>
  );
}
