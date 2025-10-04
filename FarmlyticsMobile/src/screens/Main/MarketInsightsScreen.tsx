// src/screens/Main/MarketInsightsScreen.tsx
import React, { useState, useCallback } from 'react';
import styled from 'styled-components/native';
import { Text, View, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import CustomHeader from '../../components/CustomHeader';
import { defaultTheme } from '../../config/theme';
import { RWANDA_DISTRICTS, RWANDA_PROVINCES } from '../../config/districts';
import { useAuth } from '../../context/AuthContext';

// ---------------------- Styled Components ----------------------
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

// A card with shadow + elevation cross-platform
const Card = styled(View)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.large}px;
  padding: ${props => props.theme.spacing.large}px;
  margin-bottom: ${props => props.theme.spacing.large}px;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-opacity: 0.15;
      shadow-radius: 6px;
      shadow-offset: 0px 3px;
    `,
    android: `
      elevation: 5;
    `,
  })}
`;

const FormTitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.xl}px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.large}px;
  text-align: center;
`;

const Label = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.small}px;
  font-weight: 600;
`;

const PickerContainer = styled(View)`
  width: 100%;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  background-color: ${props => props.theme.colors.background};
  margin-bottom: ${props => props.theme.spacing.large}px;
  overflow: hidden;
`;

const StyledPicker = styled(Picker)`
  width: 100%;
  color: ${props => props.theme.colors.text};
  height: 50px;
`;

const SubmitButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.gradientEnd};
  border-radius: ${props => props.theme.borderRadius.pill}px;
  padding: ${props => props.theme.spacing.medium + 4}px;
  align-items: center;
  justify-content: center;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-opacity: 0.2;
      shadow-radius: 5px;
      shadow-offset: 0px 2px;
    `,
    android: `
      elevation: 5;
    `,
  })}
`;

const SubmitButtonText = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.lightText};
`;

const SectionSeparator = styled(View)`
  height: 1px;
  background-color: ${props => props.theme.colors.border};
  margin-vertical: ${defaultTheme.spacing.large}px;
`;

const ResultsSection = styled(Card)`
  margin-top: ${defaultTheme.spacing.large}px;
`;

const ResultsHeader = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.medium}px;
`;

const InfoCard = styled(View)`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
  padding-vertical: ${props => props.theme.spacing.medium}px;
  flex-direction: row;
  align-items: center;
`;

const InfoContent = styled(View)`
  flex: 1;
`;

const InfoTitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const InfoSubtitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.placeholder};
  margin-top: ${props => props.theme.spacing.tiny}px;
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

// ---------------------- Types ----------------------
interface MarketDemandItem {
  CropName: string;
  Total_Weighted_Consumption_Qty_Kg: number;
  Total_Weighted_Consumption_Value_Rwf: number;
}

interface BusinessInfo {
  ISIC_Section_Name: string;
  Total_workers: number;
  Annual_Turnover_2022: number;
}

interface MarketInsights {
  demand: MarketDemandItem[];
  cooperatives: BusinessInfo[];
  buyersProcessors: {
    Potential_Buyers: BusinessInfo[];
    Food_Processors: BusinessInfo[];
  };
  exporters: BusinessInfo[];
}

// ---------------------- Screen ----------------------
const MarketInsightsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { authenticatedFetch } = useAuth();

  const [locationType, setLocationType] = useState<'District' | 'Province'>('District');
  const [selectedLocation, setSelectedLocation] = useState(RWANDA_DISTRICTS[0]?.value || '');
  const [insights, setInsights] = useState<MarketInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const resetForm = useCallback(() => {
    setLocationType('District');
    setSelectedLocation(RWANDA_DISTRICTS[0]?.value || '');
    setInsights(null);
    setError(null);
    setLoading(false);
  }, []);

  useFocusEffect(resetForm);

  const handleLocationTypeChange = useCallback((newType: 'District' | 'Province') => {
    setLocationType(newType);
    setSelectedLocation(newType === 'District' ? RWANDA_DISTRICTS[0]?.value || '' : RWANDA_PROVINCES[0]?.value || '');
  }, []);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setInsights(null);

    if (!selectedLocation) {
      setError(t('market.locationValidationError') || 'Please select a valid location.');
      return;
    }

    setLoading(true);
    try {
      const demandResponse = await authenticatedFetch(
        `/market/demand?location_name=${selectedLocation}&location_type=${locationType}&top_n=5&sort_by=quantity`
      );
      const coopResponse = await authenticatedFetch(
        `/market/cooperatives?location_name=${selectedLocation}&location_type=${locationType}`
      );
      const buyersProcResponse = await authenticatedFetch(
        `/market/buyers-processors?location_name=${selectedLocation}&location_type=${locationType}&min_workers=10&min_turnover=5000000`
      );
      const exportersResponse = await authenticatedFetch(
        `/market/exporters?location_name=${selectedLocation}&location_type=${locationType}`
      );

      const demandData = demandResponse.ok ? await demandResponse.json() : { success: false };
      const coopData = coopResponse.ok ? await coopResponse.json() : { success: false };
      const buyersProcData = buyersProcResponse.ok ? await buyersProcResponse.json() : { success: false };
      const exportersData = exportersResponse.ok ? await exportersResponse.json() : { success: false };

      if (demandData.success || coopData.success || buyersProcData.success || exportersData.success) {
        setInsights({
          demand: demandData.success ? demandData.data : [],
          cooperatives: coopData.success ? coopData.data : [],
          buyersProcessors: buyersProcData.success ? buyersProcData.data : { Potential_Buyers: [], Food_Processors: [] },
          exporters: exportersData.success ? exportersData.data : [],
        });
      } else {
        setError(t('market.noInsightsFound') || 'No market insights available.');
      }
    } catch (err) {
      console.error('Market insights error:', err);
      setError(t('common.networkError'));
    } finally {
      setLoading(false);
    }
  }, [selectedLocation, locationType, authenticatedFetch, t]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    resetForm();
    setRefreshing(false);
  }, [resetForm]);

  return (
    <Container>
      <CustomHeader title={t('tab.market')} />
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
        <Card>
          <FormTitle>{t('market.formTitle') || 'Explore Market Insights'}</FormTitle>

          <Label>{t('market.locationTypeLabel') || 'Select Location Type:'}</Label>
          <PickerContainer>
            <StyledPicker
              selectedValue={locationType}
              onValueChange={val => handleLocationTypeChange(val as 'District' | 'Province')}
              enabled={!loading}
            >
              <Picker.Item label={t('market.districtOption') || 'District'} value="District" />
              <Picker.Item label={t('market.provinceOption') || 'Province'} value="Province" />
            </StyledPicker>
          </PickerContainer>

          <Label>{t('market.locationNameLabel') || 'Select Location:'}</Label>
          <PickerContainer>
            <StyledPicker
              selectedValue={selectedLocation}
              onValueChange={val => setSelectedLocation(val as string)}
              enabled={!loading}
            >
              {(locationType === 'District' ? RWANDA_DISTRICTS : RWANDA_PROVINCES).map(loc => (
                <Picker.Item key={loc.value} label={loc.label} value={loc.value} />
              ))}
            </StyledPicker>
          </PickerContainer>

          <SubmitButton onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={defaultTheme.colors.lightText} />
            ) : (
              <SubmitButtonText>{t('market.submitButton') || 'Get Insights'}</SubmitButtonText>
            )}
          </SubmitButton>
          {error && <ErrorText>{error}</ErrorText>}
        </Card>

        {insights && (
          <ResultsSection>
            <FormTitle>{t('market.resultsTitle') || 'Market Insights'}</FormTitle>

            {/* Demand */}
            <ResultsHeader>{t('market.demandSectionTitle') || 'Top Demand Crops'}</ResultsHeader>
            {insights.demand.length > 0 ? (
              insights.demand.map((item, i) => (
                <InfoCard key={i} style={i === insights.demand.length - 1 ? { borderBottomWidth: 0 } : {}}>
                  <Ionicons name="analytics-outline" size={22} color={defaultTheme.colors.tertiary} style={{ marginRight: 12 }} />
                  <InfoContent>
                    <InfoTitle>{item.CropName}</InfoTitle>
                    <InfoSubtitle>{t('market.totalDemand')}: {item.Total_Weighted_Consumption_Qty_Kg?.toLocaleString()} {t('market.kgUnit')}</InfoSubtitle>
                    <InfoSubtitle>{t('market.totalValue')}: {item.Total_Weighted_Consumption_Value_Rwf?.toLocaleString()} Rwf</InfoSubtitle>
                  </InfoContent>
                </InfoCard>
              ))
            ) : (
              <EmptyStateText>{t('market.noDemandFound')}</EmptyStateText>
            )}

            <SectionSeparator />

            {/* Cooperatives */}
            <ResultsHeader>{t('market.cooperativesSectionTitle') || 'Cooperatives'}</ResultsHeader>
            {insights.cooperatives.length > 0 ? (
              insights.cooperatives.map((item, i) => (
                <InfoCard key={i} style={i === insights.cooperatives.length - 1 ? { borderBottomWidth: 0 } : {}}>
                  <Ionicons name="people-outline" size={22} color={defaultTheme.colors.primary} style={{ marginRight: 12 }} />
                  <InfoContent>
                    <InfoTitle>{item.ISIC_Section_Name}</InfoTitle>
                    <InfoSubtitle>{t('market.workers')}: {item.Total_workers}</InfoSubtitle>
                    <InfoSubtitle>{t('market.annualTurnover')}: {item.Annual_Turnover_2022?.toLocaleString()} Rwf</InfoSubtitle>
                  </InfoContent>
                </InfoCard>
              ))
            ) : (
              <EmptyStateText>{t('market.noCooperativesFound')}</EmptyStateText>
            )}

            <SectionSeparator />

            {/* Buyers + Processors */}
            <ResultsHeader>{t('market.buyersProcessorsSectionTitle') || 'Buyers & Processors'}</ResultsHeader>
            {(insights.buyersProcessors.Potential_Buyers.length > 0 || insights.buyersProcessors.Food_Processors.length > 0) ? (
              <>
                {insights.buyersProcessors.Potential_Buyers.map((item, i) => (
                  <InfoCard key={`buyer-${i}`} style={i === insights.buyersProcessors.Potential_Buyers.length - 1 ? { borderBottomWidth: 0 } : {}}>
                    <Ionicons name="cart-outline" size={22} color={defaultTheme.colors.secondary} style={{ marginRight: 12 }} />
                    <InfoContent>
                      <InfoTitle>{item.ISIC_Section_Name}</InfoTitle>
                      <InfoSubtitle>{t('market.workers')}: {item.Total_workers}</InfoSubtitle>
                      <InfoSubtitle>{t('market.annualTurnover')}: {item.Annual_Turnover_2022?.toLocaleString()} Rwf</InfoSubtitle>
                    </InfoContent>
                  </InfoCard>
                ))}
                {insights.buyersProcessors.Food_Processors.map((item, i) => (
                  <InfoCard key={`processor-${i}`} style={i === insights.buyersProcessors.Food_Processors.length - 1 ? { borderBottomWidth: 0 } : {}}>
                    <Ionicons name="restaurant-outline" size={22} color={defaultTheme.colors.primary} style={{ marginRight: 12 }} />
                    <InfoContent>
                      <InfoTitle>{item.ISIC_Section_Name}</InfoTitle>
                      <InfoSubtitle>{t('market.workers')}: {item.Total_workers}</InfoSubtitle>
                      <InfoSubtitle>{t('market.annualTurnover')}: {item.Annual_Turnover_2022?.toLocaleString()} Rwf</InfoSubtitle>
                    </InfoContent>
                  </InfoCard>
                ))}
              </>
            ) : (
              <EmptyStateText>{t('market.noBuyersProcessorsFound')}</EmptyStateText>
            )}

            <SectionSeparator />

            {/* Exporters */}
            <ResultsHeader>{t('market.exportersSectionTitle') || 'Exporters'}</ResultsHeader>
            {insights.exporters.length > 0 ? (
              insights.exporters.map((item, i) => (
                <InfoCard key={i} style={i === insights.exporters.length - 1 ? { borderBottomWidth: 0 } : {}}>
                  <Ionicons name="globe-outline" size={22} color={defaultTheme.colors.darkGreen} style={{ marginRight: 12 }} />
                  <InfoContent>
                    <InfoTitle>{item.ISIC_Section_Name}</InfoTitle>
                    <InfoSubtitle>{t('market.workers')}: {item.Total_workers}</InfoSubtitle>
                    <InfoSubtitle>{t('market.annualTurnover')}: {item.Annual_Turnover_2022?.toLocaleString()} Rwf</InfoSubtitle>
                  </InfoContent>
                </InfoCard>
              ))
            ) : (
              <EmptyStateText>{t('market.noExportersFound')}</EmptyStateText>
            )}
          </ResultsSection>
        )}
      </ContentArea>
    </Container>
  );
};

export default MarketInsightsScreen;
