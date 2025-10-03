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
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'farmer' | 'buyer') => Promise<boolean>; // Role added
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'https://farmlytics1.onrender.com/api/v1';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setToken(storedToken);
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.data);
          } else {
            await AsyncStorage.removeItem('userToken');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Failed to load user from storage:', error);
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
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(t('common.error'), t('common.networkError'));
      setIsLoading(false);
      return false;
    }
  };

  // Updated register function to include role
  const register = async (name: string, email: string, password: string, role: 'farmer' | 'buyer'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }), // Role included in body
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
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert(t('common.error'), t('common.networkError'));
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setToken(null);
    setUser(null);
  };

  const value = { user, token, isLoading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};