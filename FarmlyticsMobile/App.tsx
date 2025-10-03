// App.tsx

import 'react-native-gesture-handler';
import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Import createBottomTabNavigator
import { StatusBar, ActivityIndicator, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons'; // For tab icons

// Import our i18n configuration (initializes i18n)
import './src/config/i18n'; 

// Import our theme
import { defaultTheme } from './src/config/theme';

// Import our navigation types
import { RootStackParamList, MainTabParamList } from './src/navigation/types';

// Import AuthProvider and useAuth
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Import our screens
import SplashScreen from './src/screens/Auth/SplashScreen';
import WelcomeScreen from './src/screens/Auth/WelcomeScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import HomeScreen from './src/screens/Main/HomeScreen';
import CropPlannerScreen from './src/screens/Main/CropPlannerScreen'; 
import MarketInsightsScreen from './src/screens/Main/MarketInsightsScreen'; 
// import HarvestTrackerListScreen from './src/screens/Main/HarvestTrackerListScreen'; 
import AddCropPlanScreen from './src/screens/Main/AddCropPlanScreen'; 
import CropPlanDetailScreen from './src/screens/Main/CropPlanDetailScreen'
import ProfileScreen from './src/screens/Main/ProfileScreen'; 

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>(); // Create Tab Navigator

// --- Main App Tab Navigator ---
const MainTabNavigator = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CropPlannerTab') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'MarketInsightsTab') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'HarvestTrackerTab') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-circle-outline'; // Default or fallback icon
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: defaultTheme.colors.primary,
        tabBarInactiveTintColor: defaultTheme.colors.text,
        tabBarStyle: {
          backgroundColor: defaultTheme.colors.cardBackground,
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
        tabBarLabelStyle: {
          fontSize: defaultTheme.fontSizes.xsmall,
          fontWeight: '600',
        },
        headerShown: false, // Hide header from tabs, screens inside tabs will have their own or custom header
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: t('tab.home') || 'Home' }} />
      <Tab.Screen name="CropPlannerTab" component={CropPlannerScreen} options={{ title: t('tab.cropPlanner') || 'Planner' }} />
      <Tab.Screen name="MarketInsightsTab" component={MarketInsightsScreen} options={{ title: t('tab.market') || 'Market' }} />
      {/* <Tab.Screen name="HarvestTrackerTab" component={HarvestTrackerListScreen} options={{ title: t('tab.tracker') || 'Tracker' }} /> */}
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: t('tab.profile') || 'Profile' }} />
    </Tab.Navigator>
  );
};


// --- Root Navigator Component (handles auth flow) ---
const RootNavigator = () => {
  const { user, isLoading } = useAuth();
  const { i18n } = useTranslation();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: defaultTheme.colors.background }}>
        <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={user ? 'MainApp' : 'Welcome'}>
      {user ? (
        // User is authenticated
        <>
          <Stack.Screen name="MainApp" component={MainTabNavigator} options={{ headerShown: false }} />
          {/* Screens that are part of the main app stack but outside the tabs */}
          <Stack.Screen name="AddCropPlan" component={AddCropPlanScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CropPlanDetail" component={CropPlanDetailScreen} options={{ headerShown: false }} />
        </>
      ) : (
        // User is not authenticated
        <>
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};

// --- Main App Component ---
const App = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <StatusBar barStyle="light-content" backgroundColor={defaultTheme.colors.primary} />
      <NavigationContainer>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;