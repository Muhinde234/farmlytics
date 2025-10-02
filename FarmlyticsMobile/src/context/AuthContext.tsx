// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import * as SplashScreen from 'expo-splash-screen'; // For managing splash screen during initial load

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
}

// Define the return type for the register function
interface RegisterResponse {
  success: boolean;
  message: string;
}

interface AuthContextType {
  user: User | null;
  jwtToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<RegisterResponse | undefined>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('jwtToken');
        if (storedToken) {
          setJwtToken(storedToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const response = await api.get('/auth/me'); // Use your backend's /auth/me endpoint
          if (response.data.success) {
            setUser(response.data.data);
          } else {
            await AsyncStorage.removeItem('jwtToken');
            setJwtToken(null);
            setUser(null); // Ensure user is null if token is invalid
          }
        }
      } catch (err: any) {
        console.error('Failed to load user from AsyncStorage or API:', err.message || err); // FIXED: Explicitly log err.message
        await AsyncStorage.removeItem('jwtToken');
        setJwtToken(null);
        setUser(null); // Ensure user is null on error
      } finally {
        setIsLoading(false);
        // Only hide splash screen if it's still visible and loading is complete
        SplashScreen.hideAsync(); 
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<void> => { // Explicit return type
    setError(null);
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token, user: userData } = response.data;
        await AsyncStorage.setItem('jwtToken', token);
        setJwtToken(token);
        setUser(userData);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Update Axios default
      } else {
        setError(response.data.error || 'Login failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string = 'farmer'): Promise<RegisterResponse | undefined> => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      if (response.data.success) {
        return { success: true, message: response.data.message || 'Registration successful, please verify your email.' };
      } else {
        setError(response.data.error || 'Registration failed.');
        return { success: false, message: response.data.error || 'Registration failed.' };
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'An unexpected error occurred during registration.');
      return { success: false, message: err.response?.data?.error || err.message || 'An unexpected error occurred during registration.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => { // Explicit return type
    await AsyncStorage.removeItem('jwtToken');
    setJwtToken(null);
    setUser(null);
    api.defaults.headers.common['Authorization'] = ''; // Clear Authorization header
  };

  return (
    <AuthContext.Provider value={{ user, jwtToken, isLoading, login, register, logout, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};