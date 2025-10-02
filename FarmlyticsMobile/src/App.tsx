// App.tsx
import 'react-native-gesture-handler'; // Required for React Navigation
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import './config/i18n'; // Import i18n configuration
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { AuthProvider } from './context/AuthContext';
import { StatusBar } from 'expo-status-bar';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    // Add custom fonts here if needed.
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Safe fallback while fonts are loading
  if (!fontsLoaded) {
    return <View />; // Prevents "Text strings must be rendered" errors
  }

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
