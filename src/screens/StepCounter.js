import React, { useEffect, useState } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function StepCounter() {
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    let subscription;

    const init = async () => {
      try {
        const available = await Pedometer.isAvailableAsync();
        setIsAvailable(available);
        if (!available) {
          console.log('Pedometer not available');
          return;
        }

        // Live step updates (Android only tracks while app is running)
        subscription = Pedometer.watchStepCount((event) => {
          console.log('Step update:', event.steps);
          setSteps((prev) => prev + event.steps);
        });
      } catch (error) {
        console.error('Pedometer error:', error);
      }
    };

    init();

    return () => subscription && subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Counter</Text>
      <Text style={[styles.subtitle, { fontSize: 12, color: '#666', marginBottom: 10 }]}>
        (Tracks steps while app is open)
      </Text>

      {isAvailable ? (
        <Text style={styles.steps}>{steps}</Text>
      ) : (
        <Text>Step counter not available</Text>
      )}

      <Pressable style={styles.button} onPress={() => setSteps(0)}>
        <Text style={styles.buttonText}>Reset</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700' },
  steps: { fontSize: 48, fontWeight: '900', marginVertical: 20 },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#5A6CFF',
    borderRadius: 14,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
});
