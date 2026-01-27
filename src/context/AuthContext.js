import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_STORAGE_KEY = '@healthLens:auth';

const AuthContext = createContext({
  auth: null,
  initializing: true,
  setAuth: () => {},
});

export function AuthProvider({ children }) {
  const [auth, setAuthState] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAuth = async () => {
      try {
        const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (raw && isMounted) {
          setAuthState(JSON.parse(raw));
        }
      } catch (err) {
        console.warn('Unable to restore auth state', err);
      } finally {
        if (isMounted) {
          setInitializing(false);
        }
      }
    };

    loadAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const setAuth = useCallback(async (nextAuth) => {
    try {
      if (nextAuth) {
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
        setAuthState(nextAuth);
      } else {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthState(null);
      }
    } catch (err) {
      console.warn('Unable to persist auth state', err);
    }
  }, []);

  const value = useMemo(() => ({ auth, initializing, setAuth }), [auth, initializing, setAuth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
