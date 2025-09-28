import { Stack } from 'expo-router';
import { Providers } from '@/components/Providers';

/**
 * App root layout that provides application-wide context and declares the main navigation stack.
 *
 * Renders Providers around a Stack containing the "(tabs)" and "(auth)" screens with their headers hidden.
 *
 * @returns The JSX element for the application's root layout.
 */
export default function RootLayout() {
  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}
