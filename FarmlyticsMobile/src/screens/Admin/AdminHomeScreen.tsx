

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components/native';
import { Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth, User } from '../../context/AuthContext';
import CustomHeader from '../../components/CustomHeader';
import { defaultTheme } from '../../config/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AdminTabNavigationProp } from '../../navigation/types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';


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
  padding-left: ${defaultTheme.spacing.small}px; /* Add some left padding for alignment */
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

const StatCard = styled(View)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  padding: ${props => props.theme.spacing.medium}px;
  margin-bottom: ${props => props.theme.spacing.small}px;
  flex-direction: row;
  align-items: center;
  elevation: 2;
  shadow-color: '#000';
  shadow-offset: 0px 1px;
  shadow-opacity: 0.15;
  shadow-radius: 2.22px;
`;

const StatText = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-left: ${defaultTheme.spacing.medium}px;
`;

const LoadingErrorContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${defaultTheme.spacing.large}px;
`;

const ErrorText = styled(Text)`
  color: ${props => props.theme.colors.error};
  text-align: center;
  margin-top: ${defaultTheme.spacing.medium}px;
  font-size: ${props => props.theme.fontSizes.medium}px;
`;


const AdminHomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user, isLoading, authenticatedFetch } = useAuth();
  const navigation = useNavigation<AdminTabNavigationProp<'AdminHomeTab'>>();

  const [stats, setStats] = useState({ totalUsers: 0, totalCropPlans: 0 });
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorStats, setErrorStats] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);


  const fetchAdminStats = useCallback(async () => {
    setLoadingStats(true);
    setErrorStats(null);
    try {
    
      const usersResponse = await authenticatedFetch('/admin/users');
      if (!usersResponse.ok) {
        const errorData = await usersResponse.json();
        throw new Error(errorData.error || `Failed to fetch users: Status ${usersResponse.status}`);
      }
      const usersData = await usersResponse.json();
      const totalUsers = usersData.success ? usersData.data.length : 0;
      console.log('Fetched total users:', totalUsers);

  
      const cropPlansResponse = await authenticatedFetch('/crop-plans?all=true');
      if (!cropPlansResponse.ok) {
        const errorData = await cropPlansResponse.json();
        throw new Error(errorData.error || `Failed to fetch crop plans: Status ${cropPlansResponse.status}`);
      }
      const cropPlansData = await cropPlansResponse.json();
      const totalCropPlans = cropPlansData.success ? cropPlansData.data.length : 0;
      console.log('Fetched total crop plans:', totalCropPlans);

      setStats({ totalUsers, totalCropPlans });

    } catch (err: unknown) {
      console.error('Error fetching admin stats (catch block):', err);
  
      setErrorStats(String(t('admin.loadStatsError') || 'Failed to load admin statistics.') + (err instanceof Error ? ` ${err.message}` : ''));
    } finally {
      setLoadingStats(false);
      setRefreshing(false);
    }
  }, [authenticatedFetch, t]);


  useFocusEffect(
    useCallback(() => {
      fetchAdminStats();
    }, [fetchAdminStats])
  );


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAdminStats();
  }, [fetchAdminStats]);

  
  if (isLoading) {
    return (
      <Container>
        <CustomHeader title={String(t('admin.homeTab'))} showLogo={true} showLanguageSwitcher={true}/>
        <LoadingErrorContainer>
          <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
          <Text style={{ color: defaultTheme.colors.text, marginTop: defaultTheme.spacing.medium }}>
            {String(t('common.loading'))}
          </Text>
        </LoadingErrorContainer>
      </Container>
    );
  }


  if (user?.role !== 'admin') {
    return (
      <Container>
        <CustomHeader title={String(t('admin.homeTab'))} showLogo={true} showLanguageSwitcher={true}/>
        <LoadingErrorContainer>
          <ErrorText>{String(t('admin.accessDenied') || 'You do not have administrative access.')}</ErrorText>
        </LoadingErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <CustomHeader title={String(t('admin.homeTab'))} showBack={false} showLogo={true} showLanguageSwitcher={true} />
      <ContentArea
         refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[defaultTheme.colors.primary]}
            tintColor={defaultTheme.colors.primary}
          />
        }
      >
        <WelcomeAdminCard>
          <MaterialCommunityIcons name="shield-crown-outline" size={defaultTheme.fontSizes.xxxl} color={defaultTheme.colors.lightText} />
          <WelcomeTextContainer>
            {/* Displaying user's name from AuthContext */}
            <WelcomeTextBold>{String(t('admin.welcomeAdmin'))}, {String(user?.name || t('common.userFallback'))}!</WelcomeTextBold>
            <WelcomeTextNormal>{String(t('admin.adminAccessMessage'))}</WelcomeTextNormal>
          </WelcomeTextContainer>
        </WelcomeAdminCard>

        <SectionTitle>{String(t('admin.overallStatsTitle') || 'Overall Statistics')}</SectionTitle>
        {loadingStats ? (
          <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
        ) : errorStats ? (
          <ErrorText>{errorStats}</ErrorText>
        ) : (
          <View>
            <StatCard>
              <Ionicons name="people-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.primary} />
              <StatText>{String(t('admin.totalUsers'))}: {String(stats.totalUsers.toLocaleString())}</StatText>
            </StatCard>
            <StatCard>
              <Ionicons name="leaf-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.tertiary} />
              <StatText>{String(t('admin.totalCropPlans'))}: {String(stats.totalCropPlans.toLocaleString())}</StatText>
            </StatCard>
          </View>
        )}

        <SectionTitle>{String(t('admin.managementToolsTitle'))}</SectionTitle>
        <AdminFeatureCard onPress={() => navigation.navigate('AdminApp', { screen: 'UserManagementTab' })}>
          <AdminFeatureIconContainer bgColor={defaultTheme.colors.tertiary}>
            <Ionicons name="people-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
          </AdminFeatureIconContainer>
          <AdminFeatureContent>
            <AdminFeatureTitle>{String(t('admin.userManagement'))}</AdminFeatureTitle>
            <AdminFeatureSubtitle>{String(t('admin.userManagementDesc'))}</AdminFeatureSubtitle>
          </AdminFeatureContent>
        </AdminFeatureCard>

        <AdminFeatureCard onPress={() => navigation.navigate('AdminApp', { screen: 'AnalyticsReportingTab' })}>
          <AdminFeatureIconContainer bgColor={defaultTheme.colors.secondary}>
            <Ionicons name="analytics-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
          </AdminFeatureIconContainer>
          <AdminFeatureContent>
            <AdminFeatureTitle>{String(t('admin.systemAnalytics'))}</AdminFeatureTitle>
            <AdminFeatureSubtitle>{String(t('admin.systemAnalyticsDesc'))}</AdminFeatureSubtitle>
          </AdminFeatureContent>
        </AdminFeatureCard>

        <AdminFeatureCard onPress={() => navigation.navigate('AdminApp', { screen: 'ReferenceDataManagementTab' })}>
          <AdminFeatureIconContainer>
            <Ionicons name="options-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
          </AdminFeatureIconContainer>
          <AdminFeatureContent>
            <AdminFeatureTitle>{String(t('admin.referenceDataManagement'))}</AdminFeatureTitle>
            <AdminFeatureSubtitle>{String(t('admin.referenceDataManagementDesc'))}</AdminFeatureSubtitle>
          </AdminFeatureContent>
        </AdminFeatureCard>
      </ContentArea>
    </Container>
  );
};

export default AdminHomeScreen;
