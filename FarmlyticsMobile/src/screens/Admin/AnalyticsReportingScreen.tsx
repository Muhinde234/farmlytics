

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components/native';
import { Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth, ReferenceDataItem } from '../../context/AuthContext'; // Import ReferenceDataItem
import CustomHeader from '../../components/CustomHeader';
import { defaultTheme } from '../../config/theme';
import { Ionicons } from '@expo/vector-icons';
import { AdminTabNavigationProp } from '../../navigation/types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';


const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ContentArea = styled(ScrollView).attrs({
  contentContainerStyle: {
    padding: defaultTheme.spacing.medium,
    paddingBottom: defaultTheme.spacing.xxl,
    flexGrow: 1,
  },
})`
  flex: 1;
`;

const SectionTitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-top: ${props => props.theme.spacing.xl}px;
  margin-bottom: ${props => props.theme.spacing.medium}px;
  padding-left: ${defaultTheme.spacing.tiny}px; /* Added for consistency */
`;

const AnalyticsCard = styled(View)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  padding: ${props => props.theme.spacing.medium}px;
  margin-bottom: ${props => props.theme.spacing.large}px; /* Increased for better separation */
  elevation: 3;
  shadow-color: '#000';
  shadow-offset: 0px 2px;
  shadow-opacity: 0.18;
  shadow-radius: 3px;
`;

const AnalyticsItem = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: ${defaultTheme.spacing.small}px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const AnalyticsLabel = styled(Text)`
  font-size: ${defaultTheme.fontSizes.medium}px;
  color: ${defaultTheme.colors.text};
  font-weight: 600;
`;

const AnalyticsValue = styled(Text)`
  font-size: ${defaultTheme.fontSizes.medium}px;
  color: ${defaultTheme.colors.primary};
  font-weight: normal;
`;

const PlotPlaceholder = styled(View)`
  background-color: ${props => props.theme.colors.border};
  height: 150px;
  border-radius: ${props => props.theme.borderRadius.small}px;
  justify-content: center;
  align-items: center;
  margin-top: ${props => props.theme.spacing.small}px; /* Adjusted margin */
  margin-bottom: ${props => props.theme.spacing.medium}px;
`;

const PlotText = styled(Text)`
  color: ${props => props.theme.colors.placeholder};
  font-size: ${props => props.theme.fontSizes.medium}px;
`;

const ErrorText = styled(Text)`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSizes.medium}px;
  text-align: center;
  margin-top: ${props => props.theme.spacing.medium}px;
`;

const EmptyStateText = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.placeholder};
  text-align: center;
  margin-top: ${props => props.theme.spacing.large}px;
`;

const FilterContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${defaultTheme.spacing.medium}px; /* Adjusted margin */
  padding-horizontal: ${defaultTheme.spacing.tiny}px; /* Adjusted padding */
`;

const FilterPickerWrapper = styled(View)`
  flex: 1;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  background-color: ${props => props.theme.colors.background};
  overflow: hidden;
  margin-horizontal: ${defaultTheme.spacing.tiny}px;
`;

const StyledPicker = styled(Picker)`
  width: 100%;
  color: ${props => props.theme.colors.text};
  height: 50px;
`;

const FetchButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.primary};
  padding: ${defaultTheme.spacing.medium}px;
  border-radius: ${defaultTheme.borderRadius.medium}px;
  align-items: center;
  margin-bottom: ${defaultTheme.spacing.large}px;
  margin-horizontal: ${defaultTheme.spacing.medium}px;
  elevation: 3;
  shadow-color: '#000';
  shadow-offset: 0px 2px;
  shadow-opacity: 0.18;
  shadow-radius: 3px;
`;

const FetchButtonText = styled(Text)`
  color: ${props => props.theme.colors.lightText};
  font-weight: bold;
  font-size: ${defaultTheme.fontSizes.medium}px;
`;


interface YieldTrendData {
  CropName: string;
  Year: number;
  AvgYieldKgPerHa: number;
}

interface DemandTrendData {
  CropName: string;
  Year: number;
  TotalDemandKg: number;
}


const AnalyticsReportingScreen: React.FC = () => {
  const { t } = useTranslation();
  // Destructure `areReferenceDataLoading` from useAuth
  const { authenticatedFetch, isLoading: authLoading, crops, districts, areReferenceDataLoading } = useAuth();
  const navigation = useNavigation<AdminTabNavigationProp<'AnalyticsReportingTab'>>();

  const [yieldTrends, setYieldTrends] = useState<YieldTrendData[]>([]);
  const [demandTrends, setDemandTrends] = useState<DemandTrendData[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [errorAnalytics, setErrorAnalytics] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Consolidated filter states
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');


  // Set initial filters once reference data is loaded
  useEffect(() => {
    // Only set initial values if reference data is loaded and filters are not already set
    if (!areReferenceDataLoading) { // Use areReferenceDataLoading here
      if (crops.length > 0 && !selectedCrop) {
        setSelectedCrop(crops[0].value);
      }
      if (districts.length > 0 && !selectedDistrict) {
        setSelectedDistrict(districts[0].value);
      }
    }
  }, [areReferenceDataLoading, crops, districts, selectedCrop, selectedDistrict]); // Depend on areReferenceDataLoading

  const fetchAnalyticsData = useCallback(async () => {
    // Check if filters are selected
    if (!selectedCrop || !selectedDistrict) {
        setErrorAnalytics(String(t('admin.selectAnalyticsFilters') || 'Please select both a crop and a district to view analytics.'));
        setYieldTrends([]);
        setDemandTrends([]);
        return;
    }

    setLoadingAnalytics(true);
    setErrorAnalytics(null); // Clear previous errors
    try {
      // Fetch Yield Trends
      const yieldTrendsResponse = await authenticatedFetch(
          `/analytics/yield-trends?district_name=${encodeURIComponent(selectedDistrict)}&crop_name=${encodeURIComponent(selectedCrop)}`
      );
      const yieldTrendsData = await yieldTrendsResponse.json();
      if (yieldTrendsResponse.ok && yieldTrendsData.success) {
        setYieldTrends(yieldTrendsData.data);
      } else {
        console.error('Failed to fetch yield trends:', yieldTrendsData.error || yieldTrendsData.message);
        setYieldTrends([]);
      }


      // Fetch Demand Trends
      const demandTrendsResponse = await authenticatedFetch(
          `/analytics/demand-trends?location_name=${encodeURIComponent(selectedDistrict)}&location_type=District&crop_name=${encodeURIComponent(selectedCrop)}`
      );
      const demandTrendsData = await demandTrendsResponse.json();
      if (demandTrendsResponse.ok && demandTrendsData.success) {
        setDemandTrends(demandTrendsData.data);
      } else {
        console.error('Failed to fetch demand trends:', demandTrendsData.error || demandTrendsData.message);
        setDemandTrends([]);
      }

    } catch (err: unknown) {
      console.error('Error fetching analytics (catch block):', err);
      setErrorAnalytics(String(t('admin.loadAnalyticsError') || 'Failed to load analytics data.'));
      setYieldTrends([]);
      setDemandTrends([]);
    } finally {
      setLoadingAnalytics(false);
      setRefreshing(false);
    }
  }, [authenticatedFetch, t, selectedCrop, selectedDistrict]);

  useFocusEffect(
    useCallback(() => {
     
      if (!areReferenceDataLoading && selectedCrop && selectedDistrict) { 
        fetchAnalyticsData();
      } else if (!areReferenceDataLoading && (!selectedCrop || !selectedDistrict)) { 
     
        setErrorAnalytics(String(t('admin.selectAnalyticsFilters') || 'Please select filters to view analytics.'));
        setYieldTrends([]);
        setDemandTrends([]);
      }
     
      if (!areReferenceDataLoading && selectedCrop && selectedDistrict && errorAnalytics === String(t('admin.selectAnalyticsFilters'))) {
        setErrorAnalytics(null);
      }
    }, [fetchAnalyticsData, areReferenceDataLoading, selectedCrop, selectedDistrict, t, errorAnalytics])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);


  if (authLoading || areReferenceDataLoading) {
    return (
      <Container>
        <CustomHeader title={String(t('admin.analyticsTab'))} showLogo={true} showLanguageSwitcher={true} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
          <Text style={{ color: defaultTheme.colors.text, marginTop: defaultTheme.spacing.medium }}>
            {String(t('common.loading'))}
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <CustomHeader title={String(t('admin.analyticsTab'))} showBack={true} showLogo={true} showLanguageSwitcher={true} />
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
        <SectionTitle>{String(t('admin.analyticsFiltersTitle') || 'Analytics Filters')}</SectionTitle>
        <FilterContainer>
            <FilterPickerWrapper>
                <StyledPicker
                    selectedValue={selectedCrop}
                    onValueChange={(itemValue: unknown) => setSelectedCrop(itemValue as string)}
                    enabled={!loadingAnalytics && !areReferenceDataLoading} // Use areReferenceDataLoading
                >
                    <Picker.Item label={String(t('cropPlanner.selectCropPlaceholder') || 'Select Crop')} value="" />
                    {areReferenceDataLoading ? ( // Use areReferenceDataLoading for Picker loading state
                        <Picker.Item key="loading-crops" label={String(t('common.loading'))} value="" />
                    ) : crops.length > 0 ? (
                        crops.map(crop => <Picker.Item key={String(crop.value)} label={String(crop.label)} value={String(crop.value)} />)
                    ) : (
                        <Picker.Item key="no-crops" label={String(t('cropPlanner.noCropsFound') || "No crops available")} value="" />
                    )}
                </StyledPicker>
            </FilterPickerWrapper>
            <FilterPickerWrapper>
                <StyledPicker
                    selectedValue={selectedDistrict}
                    onValueChange={(itemValue: unknown) => setSelectedDistrict(itemValue as string)}
                    enabled={!loadingAnalytics && !areReferenceDataLoading} // Use areReferenceDataLoading
                >
                    <Picker.Item label={String(t('cropPlanner.selectDistrictPlaceholder') || 'Select District')} value="" />
                    {areReferenceDataLoading ? ( // Use areReferenceDataLoading for Picker loading state
                        <Picker.Item key="loading-districts" label={String(t('common.loading'))} value="" />
                    ) : districts.length > 0 ? (
                        districts.map(district => <Picker.Item key={String(district.value)} label={String(district.label)} value={String(district.value)} />)
                    ) : (
                        <Picker.Item key="no-districts" label={String(t('cropPlanner.noDistrictsFound') || "No districts available")} value="" />
                    )}
                </StyledPicker>
            </FilterPickerWrapper>
        </FilterContainer>
        {/* Disable fetch button if analytics are loading, reference data is loading, or filters are not selected */}
        <FetchButton onPress={fetchAnalyticsData} disabled={loadingAnalytics || areReferenceDataLoading || !selectedCrop || !selectedDistrict}>
            {loadingAnalytics ? (
                <ActivityIndicator color={defaultTheme.colors.lightText} />
            ) : (
                <FetchButtonText>{String(t('admin.fetchAnalyticsButton') || 'Fetch Analytics')}</FetchButtonText>
            )}
        </FetchButton>


        {loadingAnalytics ? (
          <ActivityIndicator size="large" color={defaultTheme.colors.primary} style={{ marginTop: defaultTheme.spacing.large }}/>
        ) : errorAnalytics ? (
          <ErrorText>{errorAnalytics}</ErrorText>
        ) : (
          <View>
            <SectionTitle>{String(t('admin.yieldTrendsTitle') || 'Yield Trends')}</SectionTitle>
            {yieldTrends.length > 0 ? (
              <AnalyticsCard>
                <PlotPlaceholder>
                  <PlotText>{String(t('home.plotPlaceholder') || 'Yield Trend Plot')}</PlotText>
                </PlotPlaceholder>
                {yieldTrends.map((trend, index) => (
                  <AnalyticsItem key={`${trend.Year}-${trend.CropName}`} style={index === yieldTrends.length - 1 ? { borderBottomWidth: 0 } : {}}>
                    <AnalyticsLabel>{String(trend.Year)} ({String(trend.CropName)})</AnalyticsLabel>
                    <AnalyticsValue>{String(trend.AvgYieldKgPerHa?.toFixed(2))} {String(t('market.kgPerHaUnit'))}</AnalyticsValue>
                  </AnalyticsItem>
                ))}
              </AnalyticsCard>
            ) : (
              <EmptyStateText>{String(t('admin.noYieldTrendsFound') || 'No yield trends found for the selected filters.')}</EmptyStateText>
            )}

            <SectionTitle>{String(t('admin.demandTrendsTitle') || 'Demand Trends')}</SectionTitle>
            {demandTrends.length > 0 ? (
              <AnalyticsCard>
                <PlotPlaceholder style={{ backgroundColor: defaultTheme.colors.secondary + '20' }}>
                  <PlotText>{String(t('home.plotPlaceholder') || 'Demand Trend Plot')}</PlotText>
                </PlotPlaceholder>
                {demandTrends.map((trend, index) => (
                  <AnalyticsItem key={`${trend.Year}-${trend.CropName}`} style={index === demandTrends.length - 1 ? { borderBottomWidth: 0 } : {}}>
                    <AnalyticsLabel>{String(trend.Year)} ({String(trend.CropName)})</AnalyticsLabel>
                    <AnalyticsValue>{String(trend.TotalDemandKg?.toLocaleString())} {String(t('market.kgUnit'))}</AnalyticsValue>
                  </AnalyticsItem>
                ))}
              </AnalyticsCard>
            ) : (
              <EmptyStateText>{String(t('admin.noDemandTrendsFound') || 'No demand trends found for the selected filters.')}</EmptyStateText>
            )}
          </View>
        )}
      </ContentArea>
    </Container>
  );
};

export default AnalyticsReportingScreen;
