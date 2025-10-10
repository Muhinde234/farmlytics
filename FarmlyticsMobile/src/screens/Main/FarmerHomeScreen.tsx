// src/screens/Main/FarmerHomeScreen.tsx

import React, { useState, useCallback } from 'react';
import styled, { DefaultTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MainTabNavigationProp } from '../../navigation/types';
import CustomHeader from '../../components/CustomHeader';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons'; 
import { ScrollView, View, Text, ActivityIndicator, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { defaultTheme } from '../../config/theme';

import { LineChart } from 'react-native-gifted-charts';


const screenWidth = Dimensions.get('window').width;


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

const StyledWelcomeCardContainer = styled(View)`
  border-radius: ${props => props.theme.borderRadius.large}px;
  margin-top: ${props => props.theme.spacing.medium}px; /* Space from header */
  margin-bottom: ${props => props.theme.spacing.large}px;
  overflow: hidden; /* Ensure gradient respects border radius */
  elevation: 8; /* Enhanced shadow */
  shadow-color: '#000';
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px; /* Enhanced shadow */
`;

const WelcomeCardContent = styled(View)`
  padding: ${props => props.theme.spacing.xl}px;
  flex-direction: row;
  align-items: center;
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

const InfoCard = styled(TouchableOpacity)`
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
  width: 48%; /* Two columns with spacing */
  margin-bottom: ${props => props.theme.spacing.medium}px;
  padding: ${props => props.theme.spacing.small}px; /* Smaller padding for grid cards */
  flex-direction: column; /* Stack icon and text */
  align-items: center;
  justify-content: center;
  height: 120px; /* Fixed height for consistent grid items */
`;


const QuickLinkIconContainer = styled(InfoCardIconContainer)`
  margin-right: 0px; /* Center icon within its card */
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

const PlotContainer = styled(View)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.large}px;
  padding: ${props => props.theme.spacing.large}px;
  margin-bottom: ${props => props.theme.spacing.large}px;
  elevation: 4;
  shadow-color: '#000';
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
`;

const PlotTitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.medium}px;
  text-align: center;
`;

const PlotPlaceholder = styled(View)`
  background-color: ${props => props.theme.colors.border};
  height: 200px; /* Adjusted height to match chart */
  border-radius: ${props => props.theme.borderRadius.small}px;
  justify-content: center;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.medium}px;
`;

const PlotDescription = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.text};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.small}px;
`;

const PlotInsight = styled(Text)`
  font-size: ${props => props.theme.fontSizes.small}px;
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
  text-align: center;
`;



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

interface MyYieldPerformanceAPIDataPoint {
  _id: {
    year: number;
    crop: string;
  };
  avgEstimatedYieldKgPerHa: number;
  avgActualYieldKgPerHa: number;
  totalEstimatedProductionKg: number;
  totalActualProductionKg: number;
  count: number;
}

interface GeneralYieldTrendAPIDataPoint { 
  year: number;
  district: string;
  crop: string;
  average_yield_kg_per_ha: number;
  total_production_kg: number;
}

interface DemandTrendAPIDataPoint {
  year: number;
  location: string;
  location_type: string;
  crop: string;
  total_weighted_consumption_qty_kg: number;
  total_weighted_consumption_value_rwf: number;
}


const FarmerHomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user, authenticatedFetch } = useAuth();
  const navigation = useNavigation<MainTabNavigationProp<'HomeTab'>>(); 

  const [nextHarvest, setNextHarvest] = useState<CropPlanSummary | null>(null);
  const [topDemandCrop, setTopDemandCrop] = useState<MarketDemandSummary | null>(null);
  const [yieldPerformanceData, setYieldPerformanceData] = useState<MyYieldPerformanceAPIDataPoint[]>([]);
  const [demandTrendsData, setDemandTrendsData] = useState<DemandTrendAPIDataPoint[]>([]); 

 
  const [generalYieldTrends, setGeneralYieldTrends] = useState<GeneralYieldTrendAPIDataPoint[]>([]);
  const [generalDemandTrends, setGeneralDemandTrends] = useState<DemandTrendAPIDataPoint[]>([]);


  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

 
  const chartVisibleWidth = screenWidth - (defaultTheme.spacing.medium * 2) - (defaultTheme.spacing.large * 2);


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

     
      const userDistrict = user.preferredDistrictName || (user.role === 'farmer' ? 'Gasabo' : 'Kigali City');
      const userProvince = user.preferredProvinceName || (user.role === 'farmer' ? 'Kigali City' : 'Eastern Province');

      let demandDataFound = false;
      if (userDistrict) {
          const marketDemandResponse = await authenticatedFetch(`/market/demand?top_n=1&location_name=${userDistrict}&location_type=District`);
          if (marketDemandResponse.ok) {
              const demandData = await marketDemandResponse.json();
              if (demandData.success && demandData.data.length > 0) {
                  setTopDemandCrop(demandData.data[0]);
                  demandDataFound = true;
              }
          } else {
              console.error('Failed to fetch market demand for district:', marketDemandResponse.status);
          }
      }

      if (!demandDataFound && userProvince) {
          const marketDemandResponse = await authenticatedFetch(`/market/demand?top_n=1&location_name=${userProvince}&location_type=Province`);
          if (marketDemandResponse.ok) {
              const demandData = await marketDemandResponse.json();
              if (demandData.success && demandData.data.length > 0) {
                  setTopDemandCrop(demandData.data[0]);
              } else {
                  setTopDemandCrop(null);
              }
          } else {
              console.error('Failed to fetch market demand for province:', marketDemandResponse.status);
              setTopDemandCrop(null);
          }
      } else if (!demandDataFound) {
          setTopDemandCrop(null);
      }

      
      const yieldPerformanceResponse = await authenticatedFetch('/analytics/my-yield-performance');
      if (yieldPerformanceResponse.ok) {
        const yieldData = await yieldPerformanceResponse.json();
        setYieldPerformanceData(yieldData.success ? yieldData.data : []);
      } else {
        console.error('Failed to fetch yield performance trends:', yieldPerformanceResponse.status);
        setYieldPerformanceData([]);
      }

     
      const defaultCropForPersonalDemand = 'Maize'; 
      const defaultLocationForPersonalDemand = userDistrict || userProvince || 'Gasabo';
      const defaultLocationTypeForPersonalDemand = userDistrict ? 'District' : (userProvince ? 'Province' : 'District');

      const demandTrendsResponse = await authenticatedFetch(
        `/analytics/demand-trends?crop=${defaultCropForPersonalDemand}&location=${defaultLocationForPersonalDemand}&location_type=${defaultLocationTypeForPersonalDemand}`
      );
      if (demandTrendsResponse.ok) {
        const demandData = await demandTrendsResponse.json();
       
        setDemandTrendsData(demandData.success ? demandData.data : []); 
      } else {
        console.error('Failed to fetch demand trends (personal):', demandTrendsResponse.status);
        setDemandTrendsData([]);
      }


      const generalAnalyticsCrop = 'Maize'; 
      const generalAnalyticsDistrict = 'Gasabo'; 

      const generalYieldTrendsResponse = await authenticatedFetch(
        `/analytics/yield-trends?district=${generalAnalyticsDistrict}&crop=${generalAnalyticsCrop}`
      );
      if (generalYieldTrendsResponse.ok) {
        const generalYieldData = await generalYieldTrendsResponse.json();
        setGeneralYieldTrends(generalYieldData.success ? generalYieldData.data : []);
      } else {
        console.error('Failed to fetch general yield trends:', generalYieldTrendsResponse.status);
        setGeneralYieldTrends([]);
      }

      
      const generalAnalyticsDemandLocation = 'Kigali City'; 
      const generalAnalyticsDemandLocationType = 'Province';
      const generalAnalyticsDemandCrop = 'Beans';

      const generalDemandTrendsResponse = await authenticatedFetch(
        `/analytics/demand-trends?location=${generalAnalyticsDemandLocation}&location_type=${generalAnalyticsDemandLocationType}&crop=${generalAnalyticsDemandCrop}`
      );
      if (generalDemandTrendsResponse.ok) {
        const generalDemandData = await generalDemandTrendsResponse.json();
        setGeneralDemandTrends(generalDemandData.success ? generalDemandData.data : []);
      } else {
        console.error('Failed to fetch general demand trends:', generalDemandTrendsResponse.status);
        setGeneralDemandTrends([]);
      }


    } catch (error: unknown) {
      console.error('Error fetching dashboard data (catch block):', error);
    } finally {
      setLoadingDashboard(false);
      setRefreshing(false);
    }
  }, [user, authenticatedFetch, chartVisibleWidth]);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [fetchDashboardData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, [fetchDashboardData]);

  
  const getYieldChartData = () => {
    if (yieldPerformanceData.length === 0) {
      return [{ value: 0, label: '' }];
    }
    return yieldPerformanceData.map(item => ({
      value: item.totalActualProductionKg || item.totalEstimatedProductionKg || 0,
      label: String(item._id.year),
    }));
  };

  
  const getDemandChartData = () => {
    if (demandTrendsData.length === 0) {
      return [{ value: 0, label: '' }];
    }
    return demandTrendsData.map(item => ({
      value: item.total_weighted_consumption_qty_kg,
      label: String(item.year),
    }));
  };

  
  const getGeneralYieldChartData = () => {
    if (generalYieldTrends.length === 0) {
      return [{ value: 0, label: '' }];
    }
    return generalYieldTrends.map(item => ({
      value: item.total_production_kg, 
      label: String(item.year),
    }));
  };

  
  const getGeneralDemandChartData = () => {
    if (generalDemandTrends.length === 0) {
      return [{ value: 0, label: '' }];
    }
    return generalDemandTrends.map(item => ({
      value: item.total_weighted_consumption_qty_kg,
      label: String(item.year),
    }));
  };

  const commonChartProps = {
    areaChart: true,
    curved: true,
    hideDataPoints: false, 
    
    spacing: chartVisibleWidth / (Math.max(
      yieldPerformanceData.length,
      demandTrendsData.length,
      generalYieldTrends.length,
      generalDemandTrends.length,
      2 
    ) + 1), 
    initialSpacing: 20,
    endSpacing: 20,
    rulesColor: defaultTheme.colors.border,
    rulesType: 'dash' as 'dash' | 'solid' | 'dotted',
    xAxisColor: defaultTheme.colors.placeholder,
    yAxisColor: defaultTheme.colors.placeholder,
    xAxisLabelTextStyle: { color: defaultTheme.colors.placeholder, fontSize: defaultTheme.fontSizes.small },
    yAxisTextStyle: { color: defaultTheme.colors.placeholder, fontSize: defaultTheme.fontSizes.small },
    yAxisLabelSuffix: ` ${String(t('market.kgUnit'))}`,
    pointerConfig: {
      pointerStripUptoDataPoint: true,
      pointerStripColor: defaultTheme.colors.placeholder,
      pointerStripWidth: 2,
      pointerColor: defaultTheme.colors.primary,
      radius: 6,
      pointerLabelWidth: 100,
      pointerLabelHeight: 90,
      pointerLabelComponent: (items: any) => (
        <View style={{ width: 100, padding: 6, backgroundColor: defaultTheme.colors.cardBackground, borderRadius: 8 }}>
          <Text style={{ color: defaultTheme.colors.text, fontSize: defaultTheme.fontSizes.small, fontWeight: 'bold' }}>
            {items[0].label}
          </Text>
          <Text style={{ color: defaultTheme.colors.primary, fontSize: defaultTheme.fontSizes.small }}>
            {items[0].value} {String(t('market.kgUnit'))}
          </Text>
        </View>
      ),
    },
  };

  return (
    <Container>
      <CustomHeader title={String(t('tab.home'))} showLogo={true} showLanguageSwitcher={true} />
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
          <StyledWelcomeCardContainer>
            <LinearGradient
              colors={[defaultTheme.colors.primary, defaultTheme.colors.darkGreen]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: defaultTheme.spacing.xl, flexDirection: 'row', alignItems: 'center' }}
            >
              <MaterialCommunityIcons name="hand-wave-outline" size={defaultTheme.fontSizes.xxxl} color={defaultTheme.colors.lightText} />
              <WelcomeTextContainer>
                <WelcomeTextBold>{String(t('common.welcome'))}, {String(user?.name || t('common.userFallback'))}!</WelcomeTextBold>
                <WelcomeTextNormal>{String(t('home.welcomeTagline'))}</WelcomeTextNormal>
              </WelcomeTextContainer>
            </LinearGradient>
          </StyledWelcomeCardContainer>
        </Animated.View>

        {loadingDashboard ? (
          <EmptyStateContainer>
            <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
            <Text style={{ color: defaultTheme.colors.text, marginTop: defaultTheme.spacing.medium }}>
              {String(t('common.loading'))}
            </Text>
          </EmptyStateContainer>
        ) : (
          <>
            {/* --- Next Harvest Summary (Card) --- */}
            <Animated.View entering={FadeInUp.delay(400).duration(800)}>
              <SectionTitle>{String(t('home.nextHarvestTitle'))}</SectionTitle>
              {nextHarvest ? (
                <InfoCard onPress={() => navigation.navigate('CropPlanDetail', { cropPlanId: nextHarvest._id })}>
                  <InfoCardIconContainer>
                    <Ionicons name="calendar-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
                  </InfoCardIconContainer>
                  <InfoCardContent>
                    <InfoCardTitle>{nextHarvest.cropName}</InfoCardTitle>
                    <InfoCardSubtitle>{String(t('cropPlan.plantingDate'))}: {nextHarvest.plantingDate}</InfoCardSubtitle>
                    <InfoCardSubtitle>{String(t('cropPlan.estimatedHarvestDate'))}: {nextHarvest.estimatedHarvestDate}</InfoCardSubtitle>
                  </InfoCardContent>
                  <InfoCardValue>{nextHarvest.estimatedTotalProductionKg} {String(t('market.kgUnit'))}</InfoCardValue>
                </InfoCard>
              ) : (
                <EmptyStateText>{String(t('home.noHarvestsFound'))}</EmptyStateText>
              )}
            </Animated.View>
            
            {/* NEW: General Yield Trends Plot */}
            <Animated.View entering={FadeInUp.delay(500).duration(800)}> {/* Adjusted delay */}
              <SectionTitle>{String(t('home.generalYieldTrendTitle'))}</SectionTitle>
              <PlotContainer>
                <PlotTitle>{String(t('home.generalYieldTrendPlotTitle'))}</PlotTitle>
                {generalYieldTrends.length === 0 || (generalYieldTrends.length === 1 && getGeneralYieldChartData()[0].value === 0) ? (
                  <PlotPlaceholder style={{ backgroundColor: defaultTheme.colors.tertiary + '20' }}>
                    <Text style={{ color: defaultTheme.colors.placeholder }}>
                      {String(t('home.noGeneralYieldData'))}
                    </Text>
                  </PlotPlaceholder>
                ) : (
                  <LineChart
                    data={getGeneralYieldChartData()}
                    height={200}
                    width={chartVisibleWidth}
                    showVerticalLines
                    color={defaultTheme.colors.tertiary} // Different color for general trend
                    startFillColor={defaultTheme.colors.tertiary + '30'}
                    endFillColor={defaultTheme.colors.tertiary + '00'}
                    startOpacity={0.8}
                    endOpacity={0.3}
                    backgroundColor={defaultTheme.colors.cardBackground}
                    {...commonChartProps}
                    maxValue={Math.max(...getGeneralYieldChartData().map(item => item.value), 1) * 1.2}
                    noOfSections={4}
                    yAxisLabelTexts={
                      Array.from({ length: 5 }, (_, i) =>
                        String(Math.round(i * (Math.max(...getGeneralYieldChartData().map(item => item.value), 1) * 1.2 / 4)))
                      )
                    }
                  />
                )}
                <PlotDescription>{String(t('home.generalYieldTrendDescription'))}</PlotDescription>
                <PlotInsight>{String(t('home.generalYieldTrendInsight'))}</PlotInsight>
              </PlotContainer>
            </Animated.View>

            {/* NEW: General Market Demand Trends Plot */}
            <Animated.View entering={FadeInUp.delay(600).duration(800)}> {/* Adjusted delay */}
              <SectionTitle>{String(t('home.generalDemandForecastTitle'))}</SectionTitle>
              <PlotContainer>
                <PlotTitle>{String(t('home.generalDemandForecastPlotTitle'))}</PlotTitle>
                {generalDemandTrends.length === 0 || (generalDemandTrends.length === 1 && getGeneralDemandChartData()[0].value === 0) ? (
                  <PlotPlaceholder style={{ backgroundColor: defaultTheme.colors.primary + '20' }}>
                    <Text style={{ color: defaultTheme.colors.placeholder }}>
                      {String(t('home.noGeneralDemandData'))}
                    </Text>
                  </PlotPlaceholder>
                ) : (
                  <LineChart
                    data={getGeneralDemandChartData()}
                    height={200}
                    width={chartVisibleWidth}
                    showVerticalLines
                    color={defaultTheme.colors.secondary} 
                    startFillColor={defaultTheme.colors.primary + '30'}
                    endFillColor={defaultTheme.colors.gradientEnd + '00'}
                    startOpacity={0.8}
                    endOpacity={0.3}
                    backgroundColor={defaultTheme.colors.cardBackground}
                    {...commonChartProps}
                    maxValue={Math.max(...getGeneralDemandChartData().map(item => item.value), 1) * 1.2}
                    noOfSections={4}
                    yAxisLabelTexts={
                      Array.from({ length: 5 }, (_, i) =>
                        String(Math.round(i * (Math.max(...getGeneralDemandChartData().map(item => item.value), 1) * 1.2 / 4)))
                      )
                    }
                  />
                )}
                <PlotDescription>{String(t('home.generalDemandForecastDescription'))}</PlotDescription>
                <PlotInsight>{String(t('home.generalDemandForecastInsight'))}</PlotInsight>
              </PlotContainer>
            </Animated.View>

            {/* --- User's Local Market Demand Forecast Plot --- */}
            <Animated.View entering={FadeInUp.delay(700).duration(800)}> {/* Adjusted delay */}
              <SectionTitle>{String(t('home.myDemandForecastTitle'))}</SectionTitle>
              <PlotContainer>
                <PlotTitle>{String(t('home.myDemandForecastPlotTitle'))}</PlotTitle>
                {demandTrendsData.length === 0 || (demandTrendsData.length === 1 && getDemandChartData()[0].value === 0) ? (
                  <PlotPlaceholder style={{ backgroundColor: defaultTheme.colors.secondary + '20' }}>
                    <Text style={{ color: defaultTheme.colors.placeholder }}>
                      {String(t('home.noDemandData'))}
                    </Text>
                  </PlotPlaceholder>
                ) : (
                  <LineChart
                    data={getDemandChartData()}
                    height={200}
                    width={chartVisibleWidth}
                    showVerticalLines
                    color={defaultTheme.colors.secondary} // Blue for demand
                    startFillColor={defaultTheme.colors.secondary + '30'}
                    endFillColor={defaultTheme.colors.secondary + '00'}
                    startOpacity={0.8}
                    endOpacity={0.3}
                    backgroundColor={defaultTheme.colors.cardBackground}
                    {...commonChartProps}
                    maxValue={Math.max(...getDemandChartData().map(item => item.value), 1) * 1.2}
                    noOfSections={4}
                    yAxisLabelTexts={
                      Array.from({ length: 5 }, (_, i) =>
                        String(Math.round(i * (Math.max(...getDemandChartData().map(item => item.value), 1) * 1.2 / 4)))
                      )
                    }
                  />
                )}
                <PlotDescription>{String(t('home.myDemandForecastDescription'))}</PlotDescription>
                <PlotInsight>{String(t('home.myDemandForecastInsight'))}</PlotInsight>
              </PlotContainer>
            </Animated.View>

            {/* --- Top Market Demand (Existing InfoCard, distinct from trend plots) --- */}
            <Animated.View entering={FadeInUp.delay(800).duration(800)}> {/* Adjusted delay */}
              <SectionTitle>{String(t('home.topDemandTitle'))}</SectionTitle>
              {topDemandCrop ? (
                <InfoCard onPress={() => navigation.navigate('MainApp', { screen: 'MarketInsightsTab' })}>
                  <InfoCardIconContainer bgColor={defaultTheme.colors.tertiary}>
                    <Ionicons name="stats-chart-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
                  </InfoCardIconContainer>
                  <InfoCardContent>
                    <InfoCardTitle>{topDemandCrop.CropName}</InfoCardTitle>
                    <InfoCardSubtitle>{String(t('market.totalDemand'))}</InfoCardSubtitle>
                  </InfoCardContent>
                  <InfoCardValue>{topDemandCrop.Total_Weighted_Consumption_Qty_Kg} {String(t('market.kgUnit'))}</InfoCardValue>
                </InfoCard>
              ) : (
                <EmptyStateText>{String(t('home.noDemandFound'))}</EmptyStateText>
              )}
            </Animated.View>

            {/* --- Quick Links (Existing) --- */}
            <Animated.View entering={FadeInUp.delay(1000).duration(800)}> {/* Adjusted delay */}
              <SectionTitle>{String(t('home.quickLinksTitle'))}</SectionTitle>
              <QuickLinksGrid>
                <QuickLinkCard onPress={() => navigation.navigate('MainApp', { screen: 'CropPlannerTab' })}>
                  <QuickLinkIconContainer>
                    <Ionicons name="leaf-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
                  </QuickLinkIconContainer>
                  <InfoCardContent>
                    <QuickLinkTitle>{String(t('home.cropPlannerTitle'))}</QuickLinkTitle>
                    <QuickLinkSubtitle>{String(t('home.cropPlannerSubtitle'))}</QuickLinkSubtitle>
                  </InfoCardContent>
                </QuickLinkCard>

                <QuickLinkCard onPress={() => navigation.navigate('MainApp', { screen: 'MarketInsightsTab' })}>
                  <QuickLinkIconContainer bgColor={defaultTheme.colors.tertiary}>
                    <Ionicons name="analytics-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
                  </QuickLinkIconContainer>
                  <InfoCardContent>
                    <QuickLinkTitle>{String(t('home.marketInsightsTitle'))}</QuickLinkTitle>
                    <QuickLinkSubtitle>{String(t('home.marketInsightsSubtitle'))}</QuickLinkSubtitle>
                  </InfoCardContent>
                </QuickLinkCard>

                <QuickLinkCard onPress={() => navigation.navigate('MainApp', { screen: 'HarvestTrackerTab' })}>
                  <QuickLinkIconContainer bgColor={defaultTheme.colors.secondary}>
                    <Ionicons name="calendar-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
                  </QuickLinkIconContainer>
                  <InfoCardContent>
                    <QuickLinkTitle>{String(t('home.harvestTrackerTitle'))}</QuickLinkTitle>
                    <QuickLinkSubtitle>{String(t('home.harvestTrackerSubtitle'))}</QuickLinkSubtitle>
                  </InfoCardContent>
                </QuickLinkCard>

                {/* NEW: Record Harvest Quick Link */}
                <QuickLinkCard onPress={() => navigation.navigate('RecordHarvest', {})}> 
                  <QuickLinkIconContainer bgColor={defaultTheme.colors.darkGreen}>
                    <FontAwesome5 name="tractor" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
                  </QuickLinkIconContainer>
                  <InfoCardContent>
                    <QuickLinkTitle>{String(t('home.recordHarvestTitle'))}</QuickLinkTitle>
                    <QuickLinkSubtitle>{String(t('home.recordHarvestSubtitle'))}</QuickLinkSubtitle>
                  </InfoCardContent>
                </QuickLinkCard>

              </QuickLinksGrid>
            </Animated.View>

            {/* --- User's Personal Yield Trend Plot (LAST CHART) --- */}
            <Animated.View entering={FadeInUp.delay(1100).duration(800)}> {/* Adjusted delay to be last */}
              <SectionTitle>{String(t('home.myYieldTrendTitle'))}</SectionTitle>
              <PlotContainer>
                <PlotTitle>{String(t('home.myYieldTrendPlotTitle'))}</PlotTitle>
                {yieldPerformanceData.length === 0 || (yieldPerformanceData.length === 1 && getYieldChartData()[0].value === 0) ? (
                  <PlotPlaceholder>
                    <Text style={{ color: defaultTheme.colors.placeholder }}>
                      {String(t('home.noYieldData'))}
                    </Text>
                  </PlotPlaceholder>
                ) : (
                  <LineChart
                    data={getYieldChartData()}
                    height={200}
                    width={chartVisibleWidth}
                    showVerticalLines
                    color={defaultTheme.colors.primary} // Green for yield
                    startFillColor={defaultTheme.colors.primary + '30'}
                    endFillColor={defaultTheme.colors.primary + '00'}
                    startOpacity={0.8}
                    endOpacity={0.3}
                    backgroundColor={defaultTheme.colors.cardBackground}
                    {...commonChartProps}
                    maxValue={Math.max(...getYieldChartData().map(item => item.value), 1) * 1.2}
                    noOfSections={4}
                    yAxisLabelTexts={
                      Array.from({ length: 5 }, (_, i) =>
                        String(Math.round(i * (Math.max(...getYieldChartData().map(item => item.value), 1) * 1.2 / 4)))
                      )
                    }
                  />
                )}
                <PlotDescription>{String(t('home.myYieldTrendDescription'))}</PlotDescription>
                <PlotInsight>{String(t('home.myYieldTrendInsight'))}</PlotInsight>
              </PlotContainer>
            </Animated.View>
          </>
        )}
      </ContentArea>
    </Container>
  );
};
export default FarmerHomeScreen;