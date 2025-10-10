// src/screens/Main/HarvestTrackerListScreen.tsx

import React, { useState, useCallback } from 'react';
import styled from 'styled-components/native';
import { Text, View, ScrollView, ActivityIndicator, Alert, TouchableOpacity, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '../../navigation/types';

import CustomHeader from '../../components/CustomHeader';
import { defaultTheme } from '../../config/theme';
import { useAuth } from '../../context/AuthContext';


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
  margin-top: ${props => props.theme.spacing.large}px;
  margin-bottom: ${props => props.theme.spacing.medium}px;
`;

const AddButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.tertiary};
  border-radius: ${props => props.theme.borderRadius.pill}px;
  padding: ${props => props.theme.spacing.medium + 2}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacing.large}px;
  elevation: 5;
  shadow-color: '#000';
  shadow-offset: 0px 3px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
`;

const AddButtonText = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.lightText};
  margin-left: ${defaultTheme.spacing.small}px;
`;

const PlanCard = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  padding: ${props => props.theme.spacing.medium}px;
  margin-bottom: ${props => props.theme.spacing.medium}px;
  elevation: 3;
  shadow-color: '#000';
  shadow-offset: 0px 2px;
  shadow-opacity: 0.18;
  shadow-radius: 3px;
`;

const PlanCardHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${defaultTheme.spacing.small}px;
`;

const PlanCardTitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const PlanCardStatus = styled(Text)<{ statusColor: string }>`
  font-size: ${props => props.theme.fontSizes.small}px;
  font-weight: 600;
  color: ${props => props.statusColor};
  background-color: ${props => `${props.statusColor}20`}; /* Light background tint */
  padding: ${defaultTheme.spacing.tiny}px ${defaultTheme.spacing.small}px;
  border-radius: ${defaultTheme.borderRadius.small}px;
`;

const PlanCardDetail = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${defaultTheme.spacing.tiny}px;
`;

const EmptyStateContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${defaultTheme.spacing.large}px;
`;

const EmptyStateText = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.placeholder};
  text-align: center;
  margin-top: ${props => props.theme.spacing.medium}px;
`;

const FeedbackContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${defaultTheme.spacing.large}px;
`;

const ErrorText = styled(Text)`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSizes.medium}px;
  text-align: center;
  margin-top: ${props => props.theme.spacing.medium}px;
`;



interface CropPlan {
  _id: string;
  cropName: string;
  districtName: string;
  actualAreaPlantedHa: number;
  plantingDate: string;
  estimatedHarvestDate: string;
  estimatedTotalProductionKg: number;
  estimatedRevenueRwf: number;
  status: string; 
}

const HarvestTrackerListScreen: React.FC = () => {
  const { t } = useTranslation();
  const { authenticatedFetch } = useAuth();
  const navigation = useNavigation<MainTabNavigationProp<'HarvestTrackerTab'>>();

  const [cropPlans, setCropPlans] = useState<CropPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planted': return defaultTheme.colors.primary;
      case 'Harvested': return defaultTheme.colors.tertiary;
      case 'Planned': return defaultTheme.colors.secondary;
      case 'Cancelled': return defaultTheme.colors.error; 
      default: return defaultTheme.colors.placeholder;
    }
  };

  const fetchCropPlans = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await authenticatedFetch('/crop-plans');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCropPlans(data.data);
        } else {
          setError(String(data.message || t('tracker.fetchError'))); 
        }
      } else {
        const errorData = await response.json();
        setError(String(errorData.message || t('tracker.fetchError'))); 
      }
    } catch (err: unknown) { 
      console.error('Error fetching crop plans (catch block):', err);
      setError(String(t('common.networkError'))); 
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [authenticatedFetch, t]);

  
  useFocusEffect(
    useCallback(() => {
      fetchCropPlans();
    }, [fetchCropPlans])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCropPlans();
  }, [fetchCropPlans]);

  return (
    <Container>
      <CustomHeader title={String(t('tab.tracker'))} showBack={false} showLogo={true} showLanguageSwitcher={true}/>
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
        <AddButton onPress={() => navigation.navigate('AddCropPlan')}>
          <Ionicons name="add-circle-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
          <AddButtonText>{String(t('tracker.addPlanButton'))}</AddButtonText>
        </AddButton>

        <SectionTitle>{String(t('tracker.myCropPlansTitle'))}</SectionTitle>

        {loading ? (
          <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
        ) : error ? (
          <FeedbackContainer>
            <ErrorText>{error}</ErrorText>
          </FeedbackContainer>
        ) : cropPlans.length > 0 ? (
          cropPlans.map((plan) => (
            <PlanCard key={String(plan._id)} onPress={() => navigation.navigate('CropPlanDetail', { cropPlanId: plan._id })}>
              <PlanCardHeader>
                <PlanCardTitle>{String(plan.cropName)} (<Text>{String(plan.actualAreaPlantedHa)}</Text> {String(t('market.haUnit'))})</PlanCardTitle>
                <PlanCardStatus statusColor={getStatusColor(plan.status)}>
                  {String(t(`tracker.status${plan.status}` || plan.status))}
                </PlanCardStatus>
              </PlanCardHeader>
              <PlanCardDetail>{String(t('cropPlan.plantingDate'))}: {String(plan.plantingDate)}</PlanCardDetail>
              <PlanCardDetail>{String(t('cropPlan.estimatedHarvestDate'))}: {String(plan.estimatedHarvestDate)}</PlanCardDetail>
              <PlanCardDetail>{String(t('cropPlan.estProduction'))}: {String(plan.estimatedTotalProductionKg?.toFixed(0))} {String(t('market.kgUnit'))}</PlanCardDetail>
              <PlanCardDetail>{String(t('cropPlan.estRevenue'))}: {String(plan.estimatedRevenueRwf?.toLocaleString())} Rwf</PlanCardDetail>
            </PlanCard>
          ))
        ) : (
          <EmptyStateContainer>
            <EmptyStateText>{String(t('tracker.noPlansFound'))}</EmptyStateText>
            <AddButton onPress={() => navigation.navigate('AddCropPlan')}>
               <Ionicons name="add-circle-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
              <AddButtonText>{String(t('tracker.addFirstPlanButton'))}</AddButtonText>
            </AddButton>
          </EmptyStateContainer>
        )}
      </ContentArea>
    </Container>
  );
};

export default HarvestTrackerListScreen;