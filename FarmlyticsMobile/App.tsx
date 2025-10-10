// App.tsx

import 'react-native-gesture-handler';
import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import { StatusBar, ActivityIndicator, View, Text, Platform } from 'react-native'; 
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './src/config/i18n'; 

import { defaultTheme } from './src/config/theme';

import { RootStackParamList, MainTabParamList, AdminTabParamList } from './src/navigation/types'; 

import { AuthProvider, useAuth } from './src/context/AuthContext'; 

// Import Auth Screens
import SplashScreen from './src/screens/Auth/SplashScreen';
import WelcomeScreen from './src/screens/Auth/WelcomeScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import ForgotPasswordScreen from './src/screens/Auth/ForgetPasswordScreen';
import UpdatePasswordScreen from './src/screens/Auth/UpdatePasswordScreen';

// Import Main App Screens (for Farmer/Buyer)
import FarmerHomeScreen from './src/screens/Main/FarmerHomeScreen';
import CropPlannerScreen from './src/screens/Main/CropPlannerScreen';
import MarketInsightsScreen from './src/screens/Main/MarketInsightsScreen';
import HarvestTrackerListScreen from './src/screens/Main/HarvestTrackerListScreen';
import ProfileScreen from './src/screens/Main/ProfileScreen';

// Import Screens accessible from Main App Stack
import AddCropPlanScreen from './src/screens/Main/AddCropPlanScreen';
import CropPlanDetailScreen from './src/screens/Main/CropPlanDetailScreen';
import RecordHarvestScreen from './src/screens/Main/RecordHarvestScreen'; // NEW: File will be provided

// Admin Dashboard Screens
import AdminHomeScreen from './src/screens/Admin/AdminHomeScreen';
import UserManagementScreen from './src/screens/Admin/UserManagementScreen';
import AnalyticsReportingScreen from './src/screens/Admin/AnalyticsReportingScreen';
import ReferenceDataManagementScreen from './src/screens/Admin/ReferenceDataManagementScreen';
import AdminProfileScreen from './src/screens/Admin/AdminProfileScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();
const MainBottomTab = createBottomTabNavigator<MainTabParamList>(); 
const AdminBottomTab = createBottomTabNavigator<AdminTabParamList>(); 


// --- Main App Bottom Tab Navigator (for Farmer/Buyer) ---
const MainUserTabNavigator = () => {
  const { t } = useTranslation();
  return (
    <MainBottomTab.Navigator
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
      <MainBottomTab.Screen name="HomeTab" component={FarmerHomeScreen} options={{ title: String(t('tab.home')) }} />
      <MainBottomTab.Screen name="CropPlannerTab" component={CropPlannerScreen} options={{ title: String(t('tab.cropPlanner')) }} />
      <MainBottomTab.Screen name="MarketInsightsTab" component={MarketInsightsScreen} options={{ title: String(t('tab.market')) }} />
      <MainBottomTab.Screen name="HarvestTrackerTab" component={HarvestTrackerListScreen} options={{ title: String(t('tab.tracker')) }} />
      <MainBottomTab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: String(t('tab.profile')) }} />
    </MainBottomTab.Navigator>
  );
};

// --- NEW: Admin Bottom Tab Navigator ---
const AdminTabNavigator = () => {
  const { t } = useTranslation();
  return (
    <AdminBottomTab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'AdminHomeTab') { 
            iconName = focused ? 'apps' : 'apps-outline';
          } else if (route.name === 'UserManagementTab') { 
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'AnalyticsReportingTab') { 
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'ReferenceDataManagementTab') { 
            iconName = focused ? 'options' : 'options-outline';
          } else if (route.name === 'AdminProfileTab') { 
            iconName = focused ? 'person' : 'person-outline';
          }
          else {
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
      <AdminBottomTab.Screen name="AdminHomeTab" component={AdminHomeScreen} options={{ title: String(t('admin.homeTab') || 'Admin Home') }} />
      <AdminBottomTab.Screen name="UserManagementTab" component={UserManagementScreen} options={{ title: String(t('admin.userManagement')) || 'Users' }} />
      <AdminBottomTab.Screen name="AnalyticsReportingTab" component={AnalyticsReportingScreen} options={{ title: String(t('admin.analyticsTab') || 'Analytics') }} />
      <AdminBottomTab.Screen name="ReferenceDataManagementTab" component={ReferenceDataManagementScreen} options={{ title: String(t('admin.referenceDataTab') || 'Reference') }} />
      <AdminBottomTab.Screen name="AdminProfileTab" component={AdminProfileScreen} options={{ title: String(t('tab.profile')) || 'Profile' }} />
    </AdminBottomTab.Navigator>
  );
};


const RootNavigator = () => {
  const { user, isLoading, areReferenceDataLoading } = useAuth();
  const { t } = useTranslation();

  if (isLoading || areReferenceDataLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: defaultTheme.colors.background }}>
        <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
        <Text style={{ color: defaultTheme.colors.text, marginTop: defaultTheme.spacing.medium }}>
          {String(t('common.loading'))}
        </Text>
      </View>
    );
  }

  let initialAuthRoute: keyof RootStackParamList; 
  if (!user) { // Unauthenticated
    initialAuthRoute = 'Welcome';
  } else if (user.role === 'admin') {
    initialAuthRoute = 'AdminApp'; 
  } else { // Farmer/Buyer
    initialAuthRoute = 'MainApp'; 
  }

  return (
    <Stack.Navigator 
      initialRouteName={initialAuthRoute}
      screenOptions={{
        headerShown: false, 
      }}
    >
      {user ? (
        user.role === 'admin' ? (
          <Stack.Screen name="AdminApp" component={AdminTabNavigator} /> 
        ) : (
          <React.Fragment>
            <Stack.Screen name="MainApp" component={MainUserTabNavigator} />
            <Stack.Screen name="AddCropPlan" component={AddCropPlanScreen} />
            <Stack.Screen name="CropPlanDetail" component={CropPlanDetailScreen} />
            <Stack.Screen name="RecordHarvest" component={RecordHarvestScreen} /> 
            <Stack.Screen name="UpdatePassword" component={UpdatePasswordScreen} /> 
          </React.Fragment>
        )
      ) : (
        <React.Fragment>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> 
        </React.Fragment>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <SafeAreaProvider> 
        <StatusBar barStyle="light-content" backgroundColor={defaultTheme.colors.primary} />
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