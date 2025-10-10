// src/screens/Main/MarketInsightsScreen.tsx

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components/native';
import { Text, View, ScrollView, ActivityIndicator, Alert, Platform, TouchableOpacity, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

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

const FormSection = styled(View)`
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
  background-color: ${props => props.theme.colors.secondary}; /* Yellow submit button */
  border-radius: ${props => props.theme.borderRadius.pill}px;
  padding: ${props => props.theme.spacing.medium + 4}px;
  align-items: center;
  justify-content: center;
  elevation: 5;
  shadow-color: '#000';
  shadow-offset: 0px 3px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
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

const ResultsSection = styled(View)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.large}px;
  padding: ${props => props.theme.spacing.large}px;
  margin-top: ${defaultTheme.spacing.large}px;
  elevation: 4;
  shadow-color: '#000';
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
`;

const ResultsHeader = styled(Text)`
  font-size: ${props => props.theme.fontSizes.xl}px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.medium}px;
`;

const InfoCard = styled(View)` /* Changed to View as it's not always tappable */
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
  padding-vertical: ${props => props.theme.spacing.medium}px;
  flex-direction: row;
  align-items: center;
`;

const InfoCardLast = styled(InfoCard)`
  border-bottom-width: 0;
  padding-bottom: 0px;
`;

const InfoIcon = styled(Ionicons)`
  margin-right: ${defaultTheme.spacing.medium}px;
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

const InfoValue = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.tertiary};
  margin-left: ${defaultTheme.spacing.small}px;
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


interface MarketDemandItem {
  CropName: string;
  Total_Weighted_Consumption_Qty_Kg: number;
  Total_Weighted_Consumption_Value_Rwf: number;
}

interface BusinessInfo {
  ISIC_Section_Name: string;
  Total_workers: number;
  Annual_Turnover_2022: number;
  Employed_Capital: number;
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

const MarketInsightsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { authenticatedFetch, districts, provinces, areReferenceDataLoading } = useAuth(); 

  const [locationType, setLocationType] = useState<'District' | 'Province'>('District');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [insights, setInsights] = useState<MarketInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false); 

  
  useEffect(() => {
    if (!areReferenceDataLoading) {
      if (locationType === 'District' && districts.length > 0 && !selectedLocation) {
        setSelectedLocation(districts[0].value);
      } else if (locationType === 'Province' && provinces.length > 0 && !selectedLocation) {
        setSelectedLocation(provinces[0].value);
      }
    }
  }, [districts, provinces, locationType, selectedLocation, areReferenceDataLoading]);


  const resetForm = useCallback(() => {
    setLocationType('District');
    setSelectedLocation(''); 
    setInsights(null);
    setError(null);
    setLoading(false);
  }, []);

  useFocusEffect(resetForm);

  
  const handleLocationTypeChange = useCallback((newType: 'District' | 'Province') => {
    setLocationType(newType);
    setSelectedLocation(newType === 'District' ? (districts.length > 0 ? districts[0].value : '') : (provinces.length > 0 ? provinces[0].value : ''));
  }, [districts, provinces]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setInsights(null);
    
    if (!selectedLocation) {
      setError(String(t('market.locationValidationError'))); 
      return;
    }

    setLoading(true);
    try {
     
      const demandResponse = await authenticatedFetch(
        `/market/demand?location_name=${selectedLocation}&location_type=${locationType}&top_n=5&sort_by=quantity`
      );
      const demandData = demandResponse.ok ? await demandResponse.json() : { success: false, message: String(t('market.demandFetchError')) }; // Explicit String()

    
      const coopResponse = await authenticatedFetch(
        `/market/cooperatives?location_name=${selectedLocation}&location_type=${locationType}`
      );
      const coopData = coopResponse.ok ? await coopResponse.json() : { success: false, message: String(t('market.coopFetchError')) }; // Explicit String()

     
      const buyersProcResponse = await authenticatedFetch(
        `/market/buyers-processors?location_name=${selectedLocation}&location_type=${locationType}&min_workers=10&min_turnover=5000000` // Example thresholds
      );
      const buyersProcData = buyersProcResponse.ok ? await buyersProcResponse.json() : { success: false, message: String(t('market.buyersProcFetchError')) }; // Explicit String()

      
      const exportersResponse = await authenticatedFetch(
        `/market/exporters?location_name=${selectedLocation}&location_type=${locationType}`
      );
      const exportersData = exportersResponse.ok ? await exportersResponse.json() : { success: false, message: String(t('market.exportersFetchError')) }; // Explicit String()

      
      if (demandData.success || coopData.success || buyersProcData.success || exportersData.success) {
        setInsights({
          demand: demandData.success ? demandData.data : [],
          cooperatives: coopData.success ? coopData.data : [],
          buyersProcessors: buyersProcData.success ? buyersProcData.data : { Potential_Buyers: [], Food_Processors: [] },
          exporters: exportersData.success ? exportersData.data : [],
        });
      } else {
        setError(String(t('market.noInsightsFound') || 'No market insights available for the selected location.')); // Explicit String()
      }

    } catch (err: unknown) { 
      console.error('Market insights fetch error (catch block):', err);
      setError(String(t('common.networkError'))); 
    } finally {
      setLoading(false);
    }
  }, [selectedLocation, locationType, authenticatedFetch, t, districts, provinces]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    resetForm();
    setRefreshing(false);
  }, [resetForm]);


  return (
    <Container>
      <CustomHeader title={String(t('tab.market'))} showBack={false} showLogo={true} showLanguageSwitcher={true}/>
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
        <FormSection>
          <FormTitle>{String(t('market.formTitle'))}</FormTitle>
          
          <Label>{String(t('market.locationTypeLabel'))}</Label>
          <PickerContainer>
            <StyledPicker
              selectedValue={locationType}
              onValueChange={(itemValue: unknown, itemIndex: number) => handleLocationTypeChange(itemValue as 'District' | 'Province')} // Corrected Picker typing
              enabled={!loading && !areReferenceDataLoading}
            >
              <Picker.Item key="district-option" label={String(t('market.districtOption'))} value="District" />
              <Picker.Item key="province-option" label={String(t('market.provinceOption'))} value="Province" />
            </StyledPicker>
          </PickerContainer>

          <Label>{String(t('market.locationNameLabel'))}</Label>
          <PickerContainer>
            <StyledPicker
              selectedValue={selectedLocation}
              onValueChange={(itemValue: unknown, itemIndex: number) => setSelectedLocation(itemValue as string)} 
              enabled={!loading && !areReferenceDataLoading}
            >
              {areReferenceDataLoading ? (
                <Picker.Item key="loading-locations" label={String(t('common.loading'))} value="" />
              ) : (locationType === 'District' ? districts : provinces).length > 0 ? (
                (locationType === 'District' ? districts : provinces).map((loc) => (
                  <Picker.Item key={String(loc.value)} label={String(loc.label)} value={String(loc.value)} /> 
                ))
              ) : (
                <Picker.Item key="no-locations" label={String(t('market.noLocationsFound') || "No locations available")} value="" />
              )}
            </StyledPicker>
          </PickerContainer>

          <SubmitButton onPress={handleSubmit} disabled={loading || areReferenceDataLoading}>
            {loading ? (
              <ActivityIndicator color={defaultTheme.colors.lightText} />
            ) : (
              <SubmitButtonText>{String(t('market.submitButton'))}</SubmitButtonText>
            )}
          </SubmitButton>
          {error && <ErrorText>{error}</ErrorText>}

        </FormSection>

        {insights && (
          <ResultsSection>
            <FormTitle>{String(t('market.resultsTitle'))}</FormTitle>

            {/* Market Demand Results */}
            <ResultsHeader>{String(t('market.demandSectionTitle'))}</ResultsHeader>
            {insights.demand.length > 0 ? (
              insights.demand.map((item, index) => (
                <InfoCard key={String(item.CropName)} style={index === insights.demand.length - 1 ? { borderBottomWidth: 0 } : {}}>
                  <InfoIcon name="analytics-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.tertiary} />
                  <InfoContent>
                    <InfoTitle>{String(item.CropName)}</InfoTitle>
                    <InfoSubtitle>{String(t('market.totalDemand'))}: {String(item.Total_Weighted_Consumption_Qty_Kg?.toLocaleString())} {String(t('market.kgUnit'))}</InfoSubtitle>
                    <InfoSubtitle>{String(t('market.totalValue'))}: {String(item.Total_Weighted_Consumption_Value_Rwf?.toLocaleString())} Rwf</InfoSubtitle>
                  </InfoContent>
                </InfoCard>
              ))
            ) : (
              <EmptyStateText>{String(t('market.noDemandFound'))}</EmptyStateText>
            )}

            <SectionSeparator />

            {/* Cooperatives Results */}
            <ResultsHeader>{String(t('market.cooperativesSectionTitle'))}</ResultsHeader>
            {insights.cooperatives.length > 0 ? (
              insights.cooperatives.map((item, index) => (
                <InfoCard key={`coop-${String(index)}`} style={index === insights.cooperatives.length - 1 ? { borderBottomWidth: 0 } : {}}>
                  <InfoIcon name="people-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.primary} />
                  <InfoContent>
                    <InfoTitle>{String(item.ISIC_Section_Name.replace('A: Agriculture, Forestry and Fishing', String(t('market.agricultureLabel'))))}</InfoTitle>
                    <InfoSubtitle>{String(t('market.workers'))}: {String(item.Total_workers)}</InfoSubtitle>
                    <InfoSubtitle>{String(t('market.annualTurnover'))}: {String(item.Annual_Turnover_2022?.toLocaleString())} Rwf</InfoSubtitle>
                  </InfoContent>
                </InfoCard>
              ))
            ) : (
              <EmptyStateText>{String(t('market.noCooperativesFound'))}</EmptyStateText>
            )}

            <SectionSeparator />

            {/* Buyers and Processors Results */}
            <ResultsHeader>{String(t('market.buyersProcessorsSectionTitle'))}</ResultsHeader>
            {(insights.buyersProcessors.Potential_Buyers.length > 0 || insights.buyersProcessors.Food_Processors.length > 0) ? (
              <>
                {insights.buyersProcessors.Potential_Buyers.length > 0 && (
                  <View>
                    <Label style={{ marginTop: defaultTheme.spacing.small }}>{String(t('market.buyersSubtitle'))}</Label>
                    {insights.buyersProcessors.Potential_Buyers.map((item, index) => (
                      <InfoCard key={`buyer-${String(index)}`} style={index === insights.buyersProcessors.Potential_Buyers.length - 1 ? { borderBottomWidth: 0 } : {}}>
                        <InfoIcon name="cart-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.secondary} />
                        <InfoContent>
                          <InfoTitle>{String(item.ISIC_Section_Name.replace('G: Wholesale and Retail Trade; Repair of Motor Vehicles and Motorcycles', String(t('market.tradeLabel'))))}</InfoTitle>
                          <InfoSubtitle>{String(t('market.workers'))}: {String(item.Total_workers)}</InfoSubtitle>
                          <InfoSubtitle>{String(t('market.annualTurnover'))}: {String(item.Annual_Turnover_2022?.toLocaleString())} Rwf</InfoSubtitle>
                        </InfoContent>
                      </InfoCard>
                    ))}
                  </View>
                )}
                {insights.buyersProcessors.Food_Processors.length > 0 && (
                  <View style={{ marginTop: defaultTheme.spacing.medium }}>
                    <Label>{String(t('market.processorsSubtitle'))}</Label>
                    {insights.buyersProcessors.Food_Processors.map((item, index) => (
                      <InfoCard key={`processor-${String(index)}`} style={index === insights.buyersProcessors.Food_Processors.length - 1 ? { borderBottomWidth: 0 } : {}}>
                        <InfoIcon name="restaurant-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.primary} />
                        <InfoContent>
                          <InfoTitle>{String(item.ISIC_Section_Name.replace('C: Manufacturing', String(t('market.manufacturingLabel'))))}</InfoTitle>
                          <InfoSubtitle>{String(t('market.workers'))}: {String(item.Total_workers)}</InfoSubtitle>
                          <InfoSubtitle>{String(t('market.annualTurnover'))}: {String(item.Annual_Turnover_2022?.toLocaleString())} Rwf</InfoSubtitle>
                        </InfoContent>
                      </InfoCard>
                    ))}
                  </View>
                )}
              </>
            ) : (
              <EmptyStateText>{String(t('market.noBuyersProcessorsFound'))}</EmptyStateText>
            )}

            <SectionSeparator />

            {/* Exporters Results */}
            <ResultsHeader>{String(t('market.exportersSectionTitle'))}</ResultsHeader>
            {insights.exporters.length > 0 ? (
              insights.exporters.map((item, index) => (
                <InfoCard key={`exporter-${String(index)}`} style={index === insights.exporters.length - 1 ? { borderBottomWidth: 0 } : {}}>
                  <InfoIcon name="globe-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.darkGreen} />
                  <InfoContent>
                    <InfoTitle>{String(item.ISIC_Section_Name.replace('C: Manufacturing', String(t('market.manufacturingLabel'))))}</InfoTitle>
                    <InfoSubtitle>{String(t('market.workers'))}: {String(item.Total_workers)}</InfoSubtitle>
                    <InfoSubtitle>{String(t('market.annualTurnover'))}: {String(item.Annual_Turnover_2022?.toLocaleString())} Rwf</InfoSubtitle>
                  </InfoContent>
                </InfoCard>
              ))
            ) : (
              <EmptyStateText>{String(t('market.noExportersFound'))}</EmptyStateText>
            )}
          </ResultsSection>
        )}
      </ContentArea>
    </Container>
  );
};

export default MarketInsightsScreen;