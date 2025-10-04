// src/screens/Main/HomeScreen.tsx

import React, { useState, useCallback } from 'react';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MainTabNavigationProp } from '../../navigation/types';
import CustomHeader from '../../components/CustomHeader';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { defaultTheme } from '../../config/theme';

// ---------------------- Styled Components ----------------------
const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ContentArea = styled(ScrollView).attrs({
  contentContainerStyle: {
    paddingHorizontal: defaultTheme.spacing.medium,
    paddingBottom: defaultTheme.spacing.xxl,
  },
})`
  flex: 1;
`;

const WelcomeCard = styled(LinearGradient).attrs(props => ({
  colors: [props.theme.colors.primary, props.theme.colors.darkGreen], // Use primary and dark green for depth
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
  border-radius: ${props => props.theme.borderRadius.large}px;
  padding: ${props => props.theme.spacing.xl}px;
  margin-top: ${props => props.theme.spacing.medium}px; /* Space from header */
  margin-bottom: ${props => props.theme.spacing.large}px;
  flex-direction: row;
  align-items: center;
  elevation: 8; /* Enhanced shadow */
  shadow-color: '#000';
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px; /* Enhanced shadow */
`;

const WelcomeTextContainer = styled(View)`
  flex: 1;
  margin-left: ${defaultTheme.spacing.medium}px;
`;

const WelcomeTextBold = styled(Text)`
  font-size: ${props => props.theme.fontSizes.xxl}px; /* Larger font for welcome */
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

const InfoCard = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  padding: ${props => props.theme.spacing.medium}px;
  margin-bottom: ${props => props.theme.spacing.small}px;
  flex-direction: row;
  align-items: center;
  elevation: 3;
  shadow-color: '#000';
  shadow-offset: 0px 2px;
  shadow-opacity: 0.18;
  shadow-radius: 3px;
`;

const InfoCardIconContainer = styled(View)<{ bgColor?: string }>`
  background-color: ${props => props.bgColor || props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.small}px;
  padding: ${props => props.theme.spacing.small}px;
  margin-right: ${defaultTheme.spacing.medium}px;
  align-items: center;
  justify-content: center;
  width: ${defaultTheme.fontSizes.xl * 1.6}px;
  height: ${defaultTheme.fontSizes.xl * 1.6}px;
`;

const InfoCardContent = styled(View)`
  flex: 1;
`;

const InfoCardTitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const InfoCardSubtitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.placeholder};
  margin-top: ${props => props.theme.spacing.tiny}px;
`;

const InfoCardValue = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-top: ${props => props.theme.spacing.tiny}px;
`;

const EmptyStateContainer = styled(View)`
  justify-content: center;
  align-items: center;
  padding-vertical: ${defaultTheme.spacing.large}px;
`;

const EmptyStateText = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.placeholder};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.medium}px;
  padding: ${defaultTheme.spacing.medium}px;
`;

const QuickLinksGrid = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: ${defaultTheme.spacing.medium}px;
`;

const QuickLinkCard = styled(InfoCard)`
  width: 48%;
  margin-bottom: ${props => props.theme.spacing.medium}px;
  padding: ${props => props.theme.spacing.small}px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
`;

const QuickLinkIconContainer = styled(InfoCardIconContainer)`
  margin-right: 0px;
  margin-bottom: ${props => props.theme.spacing.small}px;
`;

const QuickLinkTitle = styled(InfoCardTitle)`
  text-align: center;
  font-size: ${props => props.theme.fontSizes.medium}px;
  margin-bottom: ${props => props.theme.spacing.tiny}px;
`;

const QuickLinkSubtitle = styled(InfoCardSubtitle)`
  text-align: center;
  font-size: ${props => props.theme.fontSizes.small - 2}px;
  margin-top: 0px;
`;

const LogoutButton = styled.TouchableOpacity`
  padding-horizontal: ${props => props.theme.spacing.large}px;
  padding-vertical: ${props => props.theme.spacing.small}px;
  background-color: ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.pill}px;
  align-items: center;
  justify-content: center;
  margin-top: ${props => props.theme.spacing.xxl}px;
  margin-bottom: ${props => props.theme.spacing.xl}px;
  align-self: center;
  flex-direction: row;
  elevation: 4;
  shadow-color: '#000';
  shadow-offset: 0px 3px;
  shadow-opacity: 0.22;
  shadow-radius: 3.84px;
`;

const LogoutButtonText = styled(Text)`
  color: ${props => props.theme.colors.lightText};
  font-size: ${props => props.theme.fontSizes.medium}px;
  font-weight: bold;
  margin-left: ${props => props.theme.spacing.small}px;
`;

// ---------------------- Component Logic ----------------------
interface CropPlanSummary {
  _id: string;
  cropName: string;
  plantingDate: string;
  estimatedHarvestDate: string;
  estimatedTotalProductionKg: number;
}

interface MarketDemandSummary {
  CropName: string;
  Total_Weighted_Consumption_Qty_Kg: number;
}

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user, authenticatedFetch } = useAuth(); // Removed logout as it's not used directly here
  const navigation = useNavigation<MainTabNavigationProp<'HomeTab'>>();

  const [nextHarvest, setNextHarvest] = useState<CropPlanSummary | null>(null);
  const [topDemandCrop, setTopDemandCrop] = useState<MarketDemandSummary | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;

    setLoadingDashboard(true);
    try {
      const cropPlansResponse = await authenticatedFetch('/crop-plans?limit=1&status=planted');
      if (cropPlansResponse.ok) {
        const plansData = await cropPlansResponse.json();
        setNextHarvest(plansData.success && plansData.data.length > 0 ? plansData.data[0] : null);
      } else {
        console.error('Failed to fetch crop plans:', cropPlansResponse.status);
        setNextHarvest(null);
      }

      const userDistrict = user.role === 'farmer' ? 'Gasabo' : 'Kigali City'; // Placeholder: Replace with actual user.district from profile
      
      const marketDemandResponse = await authenticatedFetch(`/market/demand?top_n=1&location_name=${userDistrict}&location_type=District`);
      if (marketDemandResponse.ok) {
        const demandData = await marketDemandResponse.json();
        setTopDemandCrop(demandData.success && demandData.data.length > 0 ? demandData.data[0] : null);
      } else {
        console.error('Failed to fetch market demand:', marketDemandResponse.status);
        setTopDemandCrop(null);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingDashboard(false);
      setRefreshing(false);
    }
  }, [user, authenticatedFetch]);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [fetchDashboardData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <Container>
      <CustomHeader title={t('tab.home')} showLogo={true} showLanguageSwitcher={false} />
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
        {/* Welcome Card */}
        <Animated.View entering={FadeInUp.delay(200).duration(800)}>
          <WelcomeCard colors={[defaultTheme.colors.primary, defaultTheme.colors.darkGradientEnd]}>
            <MaterialCommunityIcons name="hand-wave-outline" size={defaultTheme.fontSizes.xxxl} color={defaultTheme.colors.lightText} />
            <WelcomeTextContainer>
              <WelcomeTextBold>{t('common.welcome')}, {user?.name || t('common.userFallback')}!</WelcomeTextBold>
              <WelcomeTextNormal>{t('home.welcomeTagline')}</WelcomeTextNormal>
            </WelcomeTextContainer>
          </WelcomeCard>
        </Animated.View>

        {loadingDashboard ? (
          <EmptyStateContainer>
            <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
            <Text style={{ color: defaultTheme.colors.text, marginTop: defaultTheme.spacing.medium }}>
              {t('common.loading')}
            </Text>
          </EmptyStateContainer>
        ) : (
          <>
            {/* --- Next Harvest Summary --- */}
            <Animated.View entering={FadeInUp.delay(400).duration(800)}>
              <SectionTitle>{t('home.nextHarvestTitle')}</SectionTitle>
              {nextHarvest ? (
                <InfoCard onPress={() => navigation.navigate('CropPlanDetail', { cropPlanId: nextHarvest._id })}>
                  <InfoCardIconContainer>
                    <Ionicons name="calendar-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
                  </InfoCardIconContainer>
                  <InfoCardContent>
                    <InfoCardTitle>{nextHarvest.cropName}</InfoCardTitle>
                    <InfoCardSubtitle>{t('cropPlan.plantingDate')}: {nextHarvest.plantingDate}</InfoCardSubtitle>
                    <InfoCardSubtitle>{t('cropPlan.estimatedHarvestDate')}: {nextHarvest.estimatedHarvestDate}</InfoCardSubtitle>
                  </InfoCardContent>
                  <InfoCardValue>{nextHarvest.estimatedTotalProductionKg} {t('market.kgUnit')}</InfoCardValue>
                </InfoCard>
              ) : (
                <EmptyStateText>{t('home.noHarvestsFound')}</EmptyStateText>
              )}
            </Animated.View>

            {/* --- Top Market Demand --- */}
            <Animated.View entering={FadeInUp.delay(600).duration(800)}>
              <SectionTitle>{t('home.topDemandTitle')}</SectionTitle>
              {topDemandCrop ? (
                <InfoCard onPress={() => navigation.navigate('MainApp', { screen: 'MarketInsightsTab' })}>
                  <InfoCardIconContainer bgColor={defaultTheme.colors.tertiary}>
                    <Ionicons name="stats-chart-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
                  </InfoCardIconContainer>
                  <InfoCardContent>
                    <InfoCardTitle>{topDemandCrop.CropName}</InfoCardTitle>
                    <InfoCardSubtitle>{t('market.totalDemand')}</InfoCardSubtitle>
                  </InfoCardContent>
                  <InfoCardValue>{topDemandCrop.Total_Weighted_Consumption_Qty_Kg} {t('market.kgUnit')}</InfoCardValue>
                </InfoCard>
              ) : (
                <EmptyStateText>{t('home.noDemandFound')}</EmptyStateText>
              )}
            </Animated.View>

            {/* --- Quick Links --- */}
            <Animated.View entering={FadeInUp.delay(800).duration(800)}>
              <SectionTitle>{t('home.quickLinksTitle')}</SectionTitle>
              <QuickLinksGrid>
                <QuickLinkCard onPress={() => navigation.navigate('MainApp', { screen: 'CropPlannerTab' })}>
                  <QuickLinkIconContainer>
                    <Ionicons name="leaf-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
                  </QuickLinkIconContainer>
                  <InfoCardContent>
                    <QuickLinkTitle>{t('home.cropPlannerTitle')}</QuickLinkTitle>
                    <QuickLinkSubtitle>{t('home.cropPlannerSubtitle')}</QuickLinkSubtitle>
                  </InfoCardContent>
                </QuickLinkCard>

                <QuickLinkCard onPress={() => navigation.navigate('MainApp', { screen: 'MarketInsightsTab' })}>
                  <QuickLinkIconContainer bgColor={defaultTheme.colors.tertiary}>
                    <Ionicons name="analytics-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
                  </QuickLinkIconContainer>
                  <InfoCardContent>
                    <QuickLinkTitle>{t('home.marketInsightsTitle')}</QuickLinkTitle>
                    <QuickLinkSubtitle>{t('home.marketInsightsSubtitle')}</QuickLinkSubtitle>
                  </InfoCardContent>
                </QuickLinkCard>

                <QuickLinkCard onPress={() => navigation.navigate('MainApp', { screen: 'HarvestTrackerTab' })}>
                  <QuickLinkIconContainer bgColor={defaultTheme.colors.secondary}>
                    <Ionicons name="calendar-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
                  </QuickLinkIconContainer>
                  <InfoCardContent>
                    <QuickLinkTitle>{t('home.harvestTrackerTitle')}</QuickLinkTitle>
                    <QuickLinkSubtitle>{t('home.harvestTrackerSubtitle')}</QuickLinkSubtitle>
                  </InfoCardContent>
                </QuickLinkCard>
              </QuickLinksGrid>
            </Animated.View>
          </>
        )}
      </ContentArea>
    </Container>
  );
};

export default HomeScreen;