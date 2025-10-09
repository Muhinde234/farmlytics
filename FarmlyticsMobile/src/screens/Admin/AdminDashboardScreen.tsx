// src/screens/Admin/AdminDashboardScreen.tsx

import React from 'react';
import styled from 'styled-components/native';
import { Text, View, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native'; // Added ScrollView
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext'; // Correct path assumed
import CustomHeader from '../../components/CustomHeader';
import { defaultTheme } from '../../config/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Added MaterialCommunityIcons

const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ContentArea = styled(ScrollView).attrs({
  contentContainerStyle: {
    padding: defaultTheme.spacing.medium,
    paddingBottom: defaultTheme.spacing.xxl,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
})`
  flex: 1;
`;

const WelcomeAdminCard = styled(View)`
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.large}px;
  padding: ${props => props.theme.spacing.xl}px;
  margin-top: ${props => props.theme.spacing.medium}px;
  margin-bottom: ${props => props.theme.spacing.large}px;
  flex-direction: row;
  align-items: center;
  elevation: 8;
  shadow-color: '#000';
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
`;

const WelcomeTextContainer = styled(View)`
  flex: 1;
  margin-left: ${defaultTheme.spacing.medium}px;
`;

const WelcomeTextBold = styled(Text)`
  font-size: ${props => props.theme.fontSizes.xxl}px;
  font-weight: bold;
  color: ${props => props.theme.colors.lightText};
`;

const WelcomeTextNormal = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.lightText};
  margin-top: ${props => props.theme.spacing.tiny}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-top: ${props => props.theme.spacing.xl}px;
  margin-bottom: ${props => props.theme.spacing.medium}px;
`;

const AdminFeatureCard = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  padding: ${props => props.theme.spacing.medium}px;
  margin-bottom: ${props => props.theme.spacing.medium}px;
  flex-direction: row;
  align-items: center;
  elevation: 3;
  shadow-color: '#000';
  shadow-offset: 0px 2px;
  shadow-opacity: 0.18;
  shadow-radius: 3px;
`;

const AdminFeatureIconContainer = styled(View)<{ bgColor?: string }>`
  background-color: ${props => props.bgColor || props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.small}px;
  padding: ${props => props.theme.spacing.small}px;
  margin-right: ${defaultTheme.spacing.medium}px;
  align-items: center;
  justify-content: center;
  width: ${defaultTheme.fontSizes.xl * 1.6}px;
  height: ${defaultTheme.fontSizes.xl * 1.6}px;
`;

const AdminFeatureContent = styled(View)`
  flex: 1;
`;

const AdminFeatureTitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const AdminFeatureSubtitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.placeholder};
  margin-top: ${props => props.theme.spacing.tiny}px;
`;


const LogoutButton = styled(TouchableOpacity)`
  padding-horizontal: ${defaultTheme.spacing.large}px;
  padding-vertical: ${defaultTheme.spacing.small}px;
  background-color: ${defaultTheme.colors.error};
  border-radius: ${defaultTheme.borderRadius.pill}px;
  align-items: center;
  justify-content: center;
  margin-top: ${defaultTheme.spacing.xxl}px;
  margin-bottom: ${defaultTheme.spacing.xl}px;
  align-self: center;
  flex-direction: row;
  elevation: 4;
  shadow-color: '#000';
  shadow-offset: 0px 3px;
  shadow-opacity: 0.22;
  shadow-radius: 3.84px;
`;

const LogoutButtonText = styled(Text)`
  color: ${defaultTheme.colors.lightText};
  font-size: ${defaultTheme.fontSizes.medium}px;
  font-weight: bold;
  margin-left: ${defaultTheme.spacing.small}px;
`;


const AdminDashboardScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <Container>
        <CustomHeader title={String(t('admin.dashboardTitle'))} showLogo={true} showLanguageSwitcher={true} />
        <ContentArea>
          <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
          <Text style={{ color: defaultTheme.colors.text, marginTop: defaultTheme.spacing.medium }}>
            {String(t('common.loading'))}
          </Text>
        </ContentArea>
      </Container>
    );
  }

  return (
    <Container>
      <CustomHeader title={String(t('admin.dashboardTitle'))} showLogo={true} showLanguageSwitcher={true} />
      <ContentArea>
        <WelcomeAdminCard>
          <MaterialCommunityIcons name="shield-crown-outline" size={defaultTheme.fontSizes.xxxl} color={defaultTheme.colors.lightText} />
          <WelcomeTextContainer>
            <WelcomeTextBold>{String(t('admin.welcomeAdmin'))}, {String(user?.name || t('common.userFallback'))}!</WelcomeTextBold>
            <WelcomeTextNormal>{String(t('admin.adminAccessMessage'))}</WelcomeTextNormal>
          </WelcomeTextContainer>
        </WelcomeAdminCard>

        <SectionTitle>{String(t('admin.managementToolsTitle')) || 'Management Tools'}</SectionTitle>
        <AdminFeatureCard onPress={() => console.log('Navigate to User Management')}>
          <AdminFeatureIconContainer bgColor={defaultTheme.colors.tertiary}>
            <Ionicons name="people-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
          </AdminFeatureIconContainer>
          <AdminFeatureContent>
            <AdminFeatureTitle>{String(t('admin.userManagement')) || 'User Management'}</AdminFeatureTitle>
            <AdminFeatureSubtitle>{String(t('admin.userManagementDesc')) || 'View, edit, and manage all user accounts.'}</AdminFeatureSubtitle>
          </AdminFeatureContent>
        </AdminFeatureCard>

        <AdminFeatureCard onPress={() => console.log('Navigate to System Analytics')}>
          <AdminFeatureIconContainer bgColor={defaultTheme.colors.secondary}>
            <Ionicons name="analytics-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
          </AdminFeatureIconContainer>
          <AdminFeatureContent>
            <AdminFeatureTitle>{String(t('admin.systemAnalytics')) || 'System Analytics'}</AdminFeatureTitle>
            <AdminFeatureSubtitle>{String(t('admin.systemAnalyticsDesc')) || 'Access app usage statistics and performance metrics.'}</AdminFeatureSubtitle>
          </AdminFeatureContent>
        </AdminFeatureCard>

        <AdminFeatureCard onPress={() => console.log('Navigate to Reference Data Management')}>
          <AdminFeatureIconContainer>
            <Ionicons name="options-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
          </AdminFeatureIconContainer>
          <AdminFeatureContent>
            <AdminFeatureTitle>{String(t('admin.referenceDataManagement')) || 'Reference Data Management'}</AdminFeatureTitle>
            <AdminFeatureSubtitle>{String(t('admin.referenceDataManagementDesc')) || 'Manage dynamic lists of crops, districts, and provinces.'}</AdminFeatureSubtitle>
          </AdminFeatureContent>
        </AdminFeatureCard>
        
        <LogoutButton onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={defaultTheme.fontSizes.medium} color={defaultTheme.colors.lightText} />
          <LogoutButtonText>{String(t('auth.logout'))}</LogoutButtonText>
        </LogoutButton>
      </ContentArea>
    </Container>
  );
};

export default AdminDashboardScreen;