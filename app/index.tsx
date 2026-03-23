import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { palette } from '@/constants/design-system';
import { hasCompletedOnboarding } from '@/libreria/user-profile';

export default function IndexScreen() {
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    hasCompletedOnboarding().then(isComplete => {
      setDestination(isComplete ? '/(tabs)' : '/onboarding');
    });
  }, []);

  if (destination) {
    return <Redirect href={destination as '/(tabs)' | '/onboarding'} />;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={palette.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.background,
  },
});
