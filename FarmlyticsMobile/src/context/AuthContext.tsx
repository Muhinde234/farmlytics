// src/context/AuthContext.tsx

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'farmer' | 'buyer';
  isVerified: boolean;
  // Add any other user properties from your /auth/me endpoint
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'farmer' | 'buyer') => Promise<boolean>;
  logout: () => void;
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'https://farmlytics1.onrender.com/api/v1';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setToken(null);
    setUser(null);
  };

  const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    if (!token) {
      if (!isLoading) { // Only alert if not initial app load
        Alert.alert(t('auth.noAuthTokenTitle'), t('auth.noAuthTokenMessage'));
        await logout();
      }
      throw new Error(t('auth.noAuthToken') || 'No authentication token found.');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (response.status === 401 || response.status === 403) {
      Alert.alert(t('auth.sessionExpiredTitle'), t('auth.sessionExpiredMessage'));
      await logout();
      throw new Error(t('auth.sessionExpiredTitle') || 'Session expired, please log in.');
    }

    return response;
  };


  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setToken(storedToken);
          const response = await authenticatedFetch('/auth/me'); // This will handle 401/403 and logout
          if (response.ok) {
            const data = await response.json();
            setUser(data.data);
          } else {
            // If response not ok but authenticatedFetch didn't throw (e.g. 500 from backend)
            console.error('Failed to fetch user details during loadUserFromStorage:', response.status);
            await logout(); // Ensure clean state
          }
        }
      } catch (error: unknown) { // Explicitly type error as unknown
        console.error('Failed to load user from storage (catch block):', error); // Keep console.error for debugging

        // Safely extract message
        const errorMessage = (error instanceof Error) ? error.message : String(error);

        // Don't re-alert if authenticatedFetch already handled session expiry/no token
        if (errorMessage !== (t('auth.sessionExpiredTitle') || 'Session expired, please log in.') &&
            errorMessage !== (t('auth.noAuthToken') || 'No authentication token found.')) {
            Alert.alert(t('common.error'), t('auth.initialLoadError') || 'Failed to load user session. Please log in.');
        }
        await logout(); // Ensure clean state after any error during initial load
      } finally {
        setIsLoading(false);
      }
    };
    loadUserFromStorage();
  }, []);


  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        if (!data.user.isVerified) {
          Alert.alert(t('auth.verificationNeededTitle'), t('auth.verificationNeededMessage'));
          setIsLoading(false);
          return false;
        }
        await AsyncStorage.setItem('userToken', data.token);
        setToken(data.token);
        setUser(data.user);
        setIsLoading(false);
        return true;
      } else {
        const errorMessage = data.message || t('auth.loginFailed');
        Alert.alert(t('common.error'), errorMessage);
        setIsLoading(false);
        return false;
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      Alert.alert(t('common.error'), t('common.networkError'));
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role: 'farmer' | 'buyer'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert(t('common.success'), t('auth.registrationSuccess'));
        setIsLoading(false);
        return true;
      } else {
        const errorMessage = data.message || t('auth.registrationFailed');
        Alert.alert(t('common.error'), errorMessage);
        setIsLoading(false);
        return false;
      }
    } catch (error: unknown) {
      console.error('Register error:', error);
      Alert.alert(t('common.error'), t('common.networkError'));
      setIsLoading(false);
      return false;
    }
  };


  const value = { user, token, isLoading, login, register, logout, authenticatedFetch };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};