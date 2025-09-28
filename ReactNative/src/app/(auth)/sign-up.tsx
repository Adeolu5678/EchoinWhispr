import { View, Text, StyleSheet } from 'react-native';

/**
 * Renders a simple sign-up screen placeholder showing a title and subtitle.
 *
 * @returns The root React element containing a container View with a title Text ("Sign Up") and subtitle Text ("Sign up screen placeholder").
 */
export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Sign up screen placeholder</Text>
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
