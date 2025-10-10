// src/navigation/types.ts

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'; 

// Define types for the screens within the MainTabParamList (Farmer/Buyer)
export type MainTabParamList = {
  HomeTab: undefined;
  CropPlannerTab: undefined;
  MarketInsightsTab: undefined;
  HarvestTrackerTab: undefined;
  ProfileTab: undefined;
};

// NEW: Define types for the screens within the AdminTabNavigator (also Bottom Tabs)
export type AdminTabParamList = {
  AdminHomeTab: undefined; 
  UserManagementTab: undefined; 
  AnalyticsReportingTab: undefined; 
  ReferenceDataManagementTab: undefined; 
  AdminProfileTab: undefined; 
};

// Define types for the RootStack Navigator
export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined; 
  ForgotPassword: undefined; 
  UpdatePassword: undefined; 

  MainApp: NavigatorScreenParams<MainTabParamList>; 
  AdminApp: NavigatorScreenParams<AdminTabParamList>; 

  AddCropPlan: undefined;
  CropPlanDetail: { cropPlanId: string };
  // Make cropPlanId and cropName optional for RecordHarvest
  RecordHarvest: { cropPlanId?: string; cropName?: string }; 
};

// Generic navigation prop for any screen in the RootStack
export type RootStackNavigationProp<RouteName extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, RouteName>;

// Navigation prop for screens within the MainTabNavigator
export type MainTabNavigationProp<RouteName extends keyof MainTabParamList> =
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, RouteName>,
    RootStackNavigationProp<keyof RootStackParamList>
  >;

// NEW: Navigation prop for screens within the AdminTabNavigator
export type AdminTabNavigationProp<RouteName extends keyof AdminTabParamList> =
  CompositeNavigationProp<
    BottomTabNavigationProp<AdminTabParamList, RouteName>, 
    RootStackNavigationProp<keyof RootStackParamList>
  >;