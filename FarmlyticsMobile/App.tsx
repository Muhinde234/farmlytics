// App.tsx

import 'react-native-gesture-handler';
import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, ActivityIndicator, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './src/config/i18n';

import { defaultTheme } from './src/config/theme';

import { RootStackParamList, MainTabParamList } from './src/navigation/types';

import { AuthProvider, useAuth } from './src/context/AuthContext';

import SplashScreen from './src/screens/Auth/SplashScreen';
import WelcomeScreen from './src/screens/Auth/WelcomeScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import HomeScreen from './src/screens/Main/HomeScreen';
import CropPlannerScreen from './src/screens/Main/CropPlannerScreen';
import MarketInsightsScreen from './src/screens/Main/MarketInsightsScreen';
import HarvestTrackerListScreen from './src/screens/Main/HarvestTrackerListScreen';
import AddCropPlanScreen from './src/screens/Main/AddCropPlanScreen';
import CropPlanDetailScreen from './src/screens/Main/CropPlanDetailScreen';
import ProfileScreen from './src/screens/Main/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'CropPlannerTab':
              iconName = focused ? 'leaf' : 'leaf-outline';
              break;
            case 'MarketInsightsTab':
              iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              break;
            case 'HarvestTrackerTab':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-circle-outline';
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
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: t('tab.home') || 'Home' }}
      />
      <Tab.Screen
        name="CropPlannerTab"
        component={CropPlannerScreen}
        options={{ title: t('tab.cropPlanner') || 'Planner' }}
      />
      <Tab.Screen
        name="MarketInsightsTab"
        component={MarketInsightsScreen}
        options={{ title: t('tab.market') || 'Market' }}
      />
      <Tab.Screen
        name="HarvestTrackerTab"
        component={HarvestTrackerListScreen}
        options={{ title: t('tab.tracker') || 'Tracker' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: t('tab.profile') || 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  const { user, isLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: defaultTheme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
        <Text
          style={{
            color: defaultTheme.colors.text,
            marginTop: defaultTheme.spacing.medium,
          }}
        >
          {t('common.loading') || 'Loading...'}
        </Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={user ? 'MainApp' : 'Welcome'}
      screenOptions={{ headerShown: false }}
    >
      {user ? (
        <>
          <Stack.Screen name="MainApp" component={MainTabNavigator} />
          <Stack.Screen name="AddCropPlan" component={AddCropPlanScreen} />
          <Stack.Screen name="CropPlanDetail" component={CropPlanDetailScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={defaultTheme.colors.primary}
        />
        <NavigationContainer>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default App;
