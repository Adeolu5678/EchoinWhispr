import { View, Text, StyleSheet } from 'react-native';

/**
 * Renders the app's Home screen with title and subtitle text.
 *
 * @returns The root JSX element containing the Home screen layout.
 */
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EchoinWhispr</Text>
      <Text style={styles.subtitle}>Home Screen</Text>
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
