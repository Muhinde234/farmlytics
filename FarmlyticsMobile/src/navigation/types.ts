

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'; 


export type MainTabParamList = {
  HomeTab: undefined;
  CropPlannerTab: undefined;
  MarketInsightsTab: undefined;
  HarvestTrackerTab: undefined;
  ProfileTab: undefined;
};


export type AdminTabParamList = {
  AdminHomeTab: undefined; 
  UserManagementTab: undefined; 
  AnalyticsReportingTab: undefined; 
  ReferenceDataManagementTab: undefined; 
  AdminProfileTab: undefined; 
};


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
 
  RecordHarvest: { cropPlanId?: string; cropName?: string }; 
};


export type RootStackNavigationProp<RouteName extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, RouteName>;


export type MainTabNavigationProp<RouteName extends keyof MainTabParamList> =
  CompositeNavigationProp<
    BottomTabNavigationProp<MainTabParamList, RouteName>,
    RootStackNavigationProp<keyof RootStackParamList>
  >;


export type AdminTabNavigationProp<RouteName extends keyof AdminTabParamList> =
  CompositeNavigationProp<
    BottomTabNavigationProp<AdminTabParamList, RouteName>, 
    RootStackNavigationProp<keyof RootStackParamList>
  >;
