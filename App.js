import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function AppInner() {
  const { navTheme, statusBarStyle } = useTheme();

  return (
    <NavigationContainer theme={navTheme}>
      <RootNavigator />
      <StatusBar style={statusBarStyle} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
    </AuthProvider>
  );
}
