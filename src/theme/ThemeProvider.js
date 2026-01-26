import React from 'react';
import { Appearance } from 'react-native';
import { DarkTheme as NavDarkTheme, DefaultTheme as NavDefaultTheme } from '@react-navigation/native';
import { darkColors, lightColors } from './theme';

const ThemeContext = React.createContext(null);

export function ThemeProvider({ children }) {
  const system = Appearance.getColorScheme();
  const [mode, setMode] = React.useState(system === 'dark' ? 'dark' : 'light');

  const colors = mode === 'dark' ? darkColors : lightColors;

  const navTheme = React.useMemo(() => {
    const base = mode === 'dark' ? NavDarkTheme : NavDefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        primary: colors.primary,
        notification: colors.primary,
      },
    };
  }, [mode, colors]);

  const value = React.useMemo(
    () => ({
      mode,
      setMode,
      toggleMode: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
      colors,
      navTheme,
      statusBarStyle: mode === 'dark' ? 'light' : 'dark',
    }),
    [mode, colors, navTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

