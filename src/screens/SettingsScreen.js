import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Card } from '../components/ui';
import { useAuth } from '../context/AuthContext';

export function SettingsScreen() {
  const { colors, mode, toggleMode } = useTheme();
  const { setAuth } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Do you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => setAuth(null) },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      <Card style={{ marginTop: 12 }}>
        <Pressable onPress={toggleMode} style={styles.row}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name={mode === 'dark' ? 'moon' : 'sunny'} size={18} color={colors.text} />
            <Text style={{ color: colors.text, fontWeight: '800' }}>Theme</Text>
          </View>
          <Text style={{ color: colors.mutedText, fontWeight: '800' }}>{mode === 'dark' ? 'Dark' : 'Light'}</Text>
        </Pressable>
      </Card>

      <Text style={{ marginTop: 10, color: colors.mutedText, fontWeight: '600' }}>
        UI-only template for now.
      </Text>
      <Card style={{ marginTop: 12 }}>
        <Pressable onPress={handleSignOut} style={styles.row}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="log-out-outline" size={18} color={colors.orange} />
            <Text style={{ color: colors.orange, fontWeight: '800' }}>Sign out</Text>
          </View>
        </Pressable>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  title: { fontSize: 22, fontWeight: '900' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

