import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Card } from '../components/ui';

const AUTH_API = 'https://health-backend-az5j.onrender.com/api/auth';

export function RegisterScreen({ navigation }) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !age.trim() || !gender.trim() || !area.trim()) {
      Alert.alert('Missing fields', 'Please complete every field before continuing.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${AUTH_API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, age, gender, area }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to create account');
      }
      Alert.alert('Account created', 'Please log in to continue.');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Registration failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.screen, { backgroundColor: colors.background }]}
      keyboardShouldPersistTaps="handled"
    >
      <Card style={[styles.card, { backgroundColor: colors.surface }]}> 
        <Text style={[styles.title, { color: colors.text }]}>Create an account</Text>
        <Text style={[styles.subTitle, { color: colors.mutedText }]}>Enter the details to get started</Text>

        <View style={styles.doubleField}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Jane Doe"
              placeholderTextColor={colors.mutedText}
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Age</Text>
            <TextInput
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholder="34"
              placeholderTextColor={colors.mutedText}
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="name@example.com"
            placeholderTextColor={colors.mutedText}
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={colors.mutedText}
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          />
        </View>

        <View style={styles.doubleField}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Gender</Text>
            <TextInput
              value={gender}
              onChangeText={setGender}
              placeholder="Female"
              placeholderTextColor={colors.mutedText}
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Area</Text>
            <TextInput
              value={area}
              onChangeText={setArea}
              placeholder="City / Region"
              placeholderTextColor={colors.mutedText}
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            />
          </View>
        </View>

        <Pressable
          onPress={handleRegister}
          disabled={loading}
          style={({ pressed }) => [
            styles.actionButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed || loading ? 0.7 : 1,
            },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.actionText}>Register</Text>
          )}
        </Pressable>

        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: colors.text }]}>Already registered?</Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.linkText, { color: colors.purple }]}>Log in</Text>
          </Pressable>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    padding: 24,
    borderRadius: 20,
    gap: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  doubleField: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
