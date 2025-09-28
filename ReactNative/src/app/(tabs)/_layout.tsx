import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/**
 * Renders the app's bottom tab navigator with Home and Compose tabs.
 *
 * Displays two tab screens:
 * - "Home": shows a home icon
 * - "Compose": shows an add-circle icon
 *
 * @returns A JSX element rendering a Tabs navigator containing the Home and Compose screens
 */
export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="compose"
        options={{
          title: 'Compose',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
