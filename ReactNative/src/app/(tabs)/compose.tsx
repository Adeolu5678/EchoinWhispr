import { View, Text, StyleSheet } from 'react-native';

/**
 * Screen component that renders a centered placeholder UI for composing a whisper.
 *
 * Renders a container with a title ("Compose Whisper") and a subtitle ("Compose screen placeholder") centered vertically and horizontally.
 *
 * @returns The rendered JSX elements for the Compose screen
 */
export default function ComposeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compose Whisper</Text>
      <Text style={styles.subtitle}>Compose screen placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginTop: 8,
  },
});
