import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { HomeScreen } from '../screens/HomeScreen';
import { HabitLogScreen } from '../screens/HabitLogScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SymptomCheckerScreen } from '../screens/SymptomCheckerScreen';
import { LoginScreen } from '../screens/LoginScreen';
import StepCounter from '../screens/StepCounter';
import { RegisterScreen } from '../screens/RegisterScreen';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function EmptyScreen() {
  return null;
}

function ThemeToggleButton() {
  const { mode, toggleMode, colors } = useTheme();
  return (
    <Pressable
      onPress={toggleMode}
      hitSlop={10}
      style={({ pressed }) => ({ paddingHorizontal: 10, opacity: pressed ? 0.7 : 1 })}
    >
      <Ionicons
        name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
        size={22}
        color={colors.text}
      />
    </Pressable>
  );
}

function PlusTabButton({ onPress }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} hitSlop={10} style={{ flex: 1, alignItems: 'center' }}>
      <View
        style={{
          width: 58,
          height: 58,
          borderRadius: 29,
          marginTop: -18,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.shadow,
          shadowOpacity: 1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 4,
          borderWidth: 2,
          borderColor: colors.background,
        }}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}

function Tabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleStyle: { fontWeight: '700' },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerRight: () => <ThemeToggleButton />,
        tabBarStyle: {
          height: 70,
          paddingBottom: 12,
          paddingTop: 10,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedText,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Tracking"
        component={HabitLogScreen}
        options={{
          title: 'Tracking',
          tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Steps"
        component={StepCounter}
        options={{
          title: 'Steps',
          tabBarIcon: ({ color, size }) => <Ionicons name="walk-outline" color={color} size={size} />,
        }}
      />

      <Tab.Screen
        name="Plus"
        component={EmptyScreen}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => null,
          tabBarButton: (props) => <PlusTabButton {...props} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.getParent()?.navigate('SymptomChecker');
          },
        })}
      />

      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

const stackScreenOptions = (colors) => ({
  headerShadowVisible: false,
  headerStyle: { backgroundColor: colors.background },
  headerTintColor: colors.text,
  headerTitleStyle: { fontWeight: '700' },
});

function LoadingScreen() {
  const { colors } = useTheme();
  return (
    <View
      style={[styles.loadingContainer, { backgroundColor: colors.background }]}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

function AuthStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={stackScreenOptions(colors)}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Create an account',
          headerRight: () => <ThemeToggleButton />,
        }}
      />
    </Stack.Navigator>
  );
}

function AppStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={stackScreenOptions(colors)}>
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="SymptomChecker"
        component={SymptomCheckerScreen}
        options={{
          title: 'Symptom Checker',
          headerRight: () => <ThemeToggleButton />,
        }}
      />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  const { auth, initializing } = useAuth();

  if (initializing) {
    return <LoadingScreen />;
  }

  return auth ? <AppStack /> : <AuthStack />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

