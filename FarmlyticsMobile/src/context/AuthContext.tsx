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
import i18n from '../config/i18n';

// ✅ User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'farmer' | 'buyer';
  isVerified: boolean;
  preferredDistrictName?: string;
  preferredProvinceName?: string;
  preferredLanguage?: string;
}

export interface ReferenceDataItem {
  label: string;
  value: string;
  province?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'farmer' | 'buyer') => Promise<boolean>;
  logout: () => void;
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>;
  updateUserProfile: (updates: Partial<User>) => Promise<boolean>;

  districts: ReferenceDataItem[];
  provinces: ReferenceDataItem[];
  crops: ReferenceDataItem[];
  areReferenceDataLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'https://farmlytics1-1.onrender.com/api/v1';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const [districts, setDistricts] = useState<ReferenceDataItem[]>([]);
  const [provinces, setProvinces] = useState<ReferenceDataItem[]>([]);
  const [crops, setCrops] = useState<ReferenceDataItem[]>([]);
  const [areReferenceDataLoading, setAreReferenceDataLoading] = useState(false);

  // 🔹 Logout
  const logout = async () => {
    console.log('Logging out...');
    await AsyncStorage.removeItem('userToken');
    setToken(null);
    setUser(null);
    setDistricts([]);
    setProvinces([]);
    setCrops([]);
    console.log('User logged out, state cleared.');
  };

  // 🔹 Safe JSON parser
  const parseResponseSafely = async (response: Response): Promise<any> => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError);
        const responseText = await response.text();
        console.error('Response Text that caused JSON error:', responseText.substring(0, 500)); // Log part of the response for debugging
        throw new Error('Server returned invalid JSON.');
      }
    } else {
      const textResponse = await response.text();
      console.error('Non-JSON response received:', textResponse.substring(0, 500)); // Log part of the response
      throw new Error(
        `Server returned non-JSON response. Status: ${response.status}. Message: ${textResponse.substring(0, 100)}...`
      );
    }
  };

  // 🔹 Authenticated fetch helper
  const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    if (!token) {
      if (!isLoading) {
        Alert.alert(String(t('auth.noAuthTokenTitle')), String(t('auth.noAuthTokenMessage')));
        await logout();
      }
      throw new Error(String(t('auth.noAuthToken') || 'No authentication token found.'));
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    console.log(`Authenticated fetching: ${API_BASE_URL}${url}`);
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (response.status === 401 || response.status === 403) {
      const errorText = await response.text();
      console.error(`Auth Error ${response.status} for ${url}:`, errorText);
      Alert.alert(String(t('auth.sessionExpiredTitle')), String(t('auth.sessionExpiredMessage')));
      await logout();
      throw new Error(String(t('auth.sessionExpiredTitle') || 'Session expired, please log in.'));
    }

    return response;
  };

  // 🔹 Update user profile
  const updateUserProfile = async (updates: Partial<User>): Promise<boolean> => {
    try {
      console.log('Attempting to update user profile with:', updates);
      const response = await authenticatedFetch('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      const data = await parseResponseSafely(response);

      if (response.ok && data.success) {
        setUser(data.data);
        if (updates.preferredLanguage && updates.preferredLanguage !== i18n.language) {
          i18n.changeLanguage(updates.preferredLanguage);
          console.log('Language changed to:', updates.preferredLanguage);
        }
        Alert.alert(String(t('common.success')), String(t('profile.updateSuccess')));
        console.log('User profile updated successfully:', data.data);
        return true;
      } else {
        console.error('User profile update failed:', data.message);
        Alert.alert(String(t('common.error')), String(data.message || t('profile.updateError')));
        return false;
      }
    } catch (error: unknown) {
      console.error('Update profile error (catch block):', error);
      Alert.alert(String(t('common.error')), String(t('common.networkError')));
      return false;
    }
  };

  // 🔹 Initial load (user + reference data)
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setAreReferenceDataLoading(true);
      console.log('Starting initial data load...');

      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        console.log('Stored token:', storedToken ? 'Found' : 'Not found');

        // Restore session if available
        if (storedToken) {
          setToken(storedToken);
          try {
            console.log('Attempting to fetch current user details...');
            const userResponse = await authenticatedFetch('/auth/me');
            const userData = await parseResponseSafely(userResponse);

            if (userResponse.ok && userData.success) {
              setUser(userData.data);
              if (
                userData.data.preferredLanguage &&
                userData.data.preferredLanguage !== i18n.language
              ) {
                i18n.changeLanguage(userData.data.preferredLanguage);
                console.log('User preferred language set to:', userData.data.preferredLanguage);
              }
              console.log('User data loaded:', userData.data.email);
            } else {
              console.warn('User load failed (from /auth/me):', userData.message);
              await logout(); // Logout if user data fetch fails even with a token
            }
          } catch (userFetchError) {
            console.error('Error fetching user data on initial load (catch block):', userFetchError);
            Alert.alert(String(t('common.error')), String(t('auth.sessionExpiredMessage')));
            await logout(); // Ensure logout if user data fetch fails
          }
        }

        // 🔹 Fetch reference data
        console.log('Attempting to fetch reference data (districts, provinces, crops)...');
        const endpoints = ['/districts', '/provinces', '/crops/list'];
        const responses = await Promise.all(
          endpoints.map((ep) =>
            fetch(`${API_BASE_URL}${ep}`).catch((err) => {
              console.error(`Fetch failed for ${ep}:`, err); // <<-- IMPORTANT LOG 1
              return null;
            })
          )
        );

        const parsedResults = await Promise.all(
          responses.map(async (res, index) => {
            if (!res) {
              console.warn(`No response received for ${endpoints[index]}, skipping parse.`);
              return null;
            }
            try {
              return await parseResponseSafely(res);
            } catch (err) {
              console.error(`Failed to parse response for ${endpoints[index]}:`, err); // <<-- IMPORTANT LOG 2
              return null;
            }
          })
        );

        const [districtsData, provincesData, cropsData] = parsedResults;

        console.log('Raw districtsData received:', districtsData); // <<-- IMPORTANT LOG 3

        if (districtsData) {
          const items = districtsData.data || districtsData || [];
          if (Array.isArray(items)) {
            const processedDistricts = items.map((d: any) => ({
              label: d.name || d.label || 'Unnamed',
              value: d.name || d.value || 'unknown',
            }));
            setDistricts(processedDistricts);
            console.log('Districts successfully set:', processedDistricts.length, 'items'); // <<-- IMPORTANT LOG 4
          } else {
            console.warn('districtsData.data is not an array or districtsData is not an array, cannot process districts.'); // <<-- IMPORTANT LOG 5
          }
        } else {
          console.warn('districtsData is null or undefined after parsing. No districts loaded.'); // <<-- IMPORTANT LOG 6
        }

        console.log('Raw provincesData received:', provincesData);
        if (provincesData) {
          const items = provincesData.data || provincesData || [];
          if (Array.isArray(items)) {
            setProvinces(
              items.map((p: any) => ({
                label: p.name || p.label || 'Unnamed',
                value: p.name || p.value || 'unknown',
              }))
            );
            console.log('Provinces successfully set:', items.length, 'items');
          } else {
            console.warn('provincesData.data is not an array or provincesData is not an array, cannot process provinces.');
          }
        } else {
          console.warn('provincesData is null or undefined after parsing. No provinces loaded.');
        }

        console.log('Raw cropsData received:', cropsData);
        if (cropsData) {
          const items = cropsData.data || cropsData || [];
          if (Array.isArray(items)) {
            setCrops(
              items.map((c: any) => ({
                label: c.name || c.label || 'Unnamed',
                value: c.name || c.value || 'unknown',
              }))
            );
            console.log('Crops successfully set:', items.length, 'items');
          } else {
            console.warn('cropsData.data is not an array or cropsData is not an array, cannot process crops.');
          }
        } else {
          console.warn('cropsData is null or undefined after parsing. No crops loaded.');
        }

      } catch (error: unknown) {
        console.error('Unhandled error in loadInitialData (outer catch block):', error); // <<-- IMPORTANT LOG 7
        Alert.alert(
          String(t('common.error')),
          String(t('auth.initialLoadError') || 'Failed to initialize app data.')
        );
        // Do not automatically logout here, as it might just be a reference data fetch issue, not an auth one.
      } finally {
        setIsLoading(false);
        setAreReferenceDataLoading(false);
        // Note: 'districts.length' here might not reflect the immediate update from setDistricts
        // within this same tick if checked synchronously right after setting state.
        console.log('Initial data loading finished. Final districts state length (may be async):', districts.length); // <<-- IMPORTANT LOG 8
        console.log('areReferenceDataLoading set to false.');
      }
    };

    loadInitialData();
  }, []); // Empty dependency array means this runs once on mount

  // 🔹 Login
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    console.log('Attempting login for:', email);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await parseResponseSafely(response);

      if (response.ok && data.success) {
        if (!data.user.isVerified) {
          Alert.alert(String(t('auth.verificationNeededTitle')), String(t('auth.verificationNeededMessage')));
          setIsLoading(false);
          console.warn('Login failed: User not verified.');
          return false;
        }
        await AsyncStorage.setItem('userToken', data.token);
        setToken(data.token);
        setUser(data.user);
        if (data.user.preferredLanguage && data.user.preferredLanguage !== i18n.language) {
          i18n.changeLanguage(data.user.preferredLanguage);
          console.log('User preferred language set to:', data.user.preferredLanguage);
        }
        setIsLoading(false);
        console.log('Login successful for:', email);
        return true;
      } else {
        console.error('Login failed:', data.message || 'Unknown error');
        Alert.alert(String(t('common.error')), String(data.message || t('auth.loginFailed')));
        setIsLoading(false);
        return false;
      }
    } catch (error: unknown) {
      console.error('Login error (catch block):', error);
      Alert.alert(String(t('common.error')), String(t('common.networkError')));
      setIsLoading(false);
      return false;
    }
  };

  // 🔹 Register
  const register = async (name: string, email: string, password: string, role: 'farmer' | 'buyer'): Promise<boolean> => {
    setIsLoading(true);
    console.log('Attempting registration for:', email, 'as', role);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await parseResponseSafely(response);

      if (response.ok && data.success) {
        Alert.alert(String(t('common.success')), String(t('auth.registrationSuccess')));
        setIsLoading(false);
        console.log('Registration successful for:', email);
        return true;
      } else {
        console.error('Registration failed:', data.message || 'Unknown error');
        Alert.alert(String(t('common.error')), String(data.message || t('auth.registrationFailed')));
        setIsLoading(false);
        return false;
      }
    } catch (error: unknown) {
      console.error('Register error (catch block):', error);
      Alert.alert(String(t('common.error')), String(t('common.networkError')));
      setIsLoading(false);
      return false;
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    authenticatedFetch,
    updateUserProfile,
    districts,
    provinces,
    crops,
    areReferenceDataLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};