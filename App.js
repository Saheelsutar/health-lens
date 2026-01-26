import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
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
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
