// src/navigation/types.ts

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Define types for the screens within the MainTabNavigator
export type MainTabParamList = {
  HomeTab: undefined;
  CropPlannerTab: undefined;
  MarketInsightsTab: undefined;
  HarvestTrackerTab: undefined;
  ProfileTab: undefined;
};

// Define types for the RootStack Navigator
export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainApp: NavigatorScreenParams<MainTabParamList>; // This will be our tab navigator
  // Specific screens that might be pushed onto the stack *from within* tabs, if any
  // e.g., CropPlanDetail: { planId: string };
  AddCropPlan: undefined;
  CropPlanDetail: { cropPlanId: string }; // Parameter for detail screen
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

// You can create specific navigation prop types for convenience
// export type HomeScreenNavigationProp = MainTabNavigationProp<'HomeTab'>;