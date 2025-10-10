// src/screens/Main/CropPlannerScreen.tsx

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components/native';
import { Text, View, ScrollView, ActivityIndicator, Alert, Platform, TouchableOpacity, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
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

const Input = styled.TextInput`
  width: 100%;
  padding: ${props => props.theme.spacing.medium + 2}px;
  margin-bottom: ${props => props.theme.spacing.large}px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.medium}px;
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
  background-color: ${props => props.theme.colors.tertiary};
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

const ResultsSection = styled(View)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.large}px;
  padding: ${props => props.theme.spacing.large}px;
  margin-top: ${defaultTheme.spacing.large}px; /* Space from form */
  elevation: 4;
  shadow-color: '#000';
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
`;

const ResultCard = styled(View)`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
  padding-vertical: ${props => props.theme.spacing.medium}px;
  flex-direction: row;
  align-items: center;
`;

const ResultIcon = styled(Ionicons)`
  margin-right: ${defaultTheme.spacing.medium}px;
`;

const ResultContent = styled(View)`
  flex: 1;
`;

const ResultTitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const ResultSubtitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.text};
  margin-top: ${props => props.theme.spacing.tiny}px;
`;

const ResultValue = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.tertiary};
  margin-left: ${defaultTheme.spacing.small}px;
`;

const FeedbackContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${defaultTheme.spacing.large}px;
`;

const FeedbackText = styled(Text)<{ isError?: boolean }>`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.isError ? props.theme.colors.error : props.theme.colors.placeholder};
  text-align: center;
  margin-top: ${props => props.theme.spacing.medium}px;
`;

const EmptyStateText = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.placeholder};
  text-align: center;
  margin-top: ${props => props.theme.spacing.large}px;
`;


interface CropRecommendation {
  CropName: string;
  Recommended_Area_ha: number;
  Estimated_Yield_Kg_per_Ha: number;
  Estimated_Total_Production_Kg: number;
}

const CropPlannerScreen: React.FC = () => {
  const { t } = useTranslation();
  const { authenticatedFetch, districts, areReferenceDataLoading } = useAuth(); 
  
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [farmSize, setFarmSize] = useState(''); 
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false); 

  
  useEffect(() => {
    if (districts.length > 0 && !selectedDistrict) {
      setSelectedDistrict(districts[0].value);
    }
  }, [districts, selectedDistrict]);

 
  const resetForm = useCallback(() => {
    setSelectedDistrict(districts.length > 0 ? districts[0].value : '');
    setFarmSize('');
    setRecommendations([]);
    setError(null);
    setLoading(false);
  }, [districts]);

  useFocusEffect(resetForm);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setRecommendations([]); 
    
    const parsedFarmSize = parseFloat(farmSize);

    if (!selectedDistrict || isNaN(parsedFarmSize) || parsedFarmSize <= 0) {
      setError(String(t('cropPlanner.formValidationError')));
      return;
    }

    setLoading(true);
    try {
      const response = await authenticatedFetch(
        `/crops/recommendations?district_name=${selectedDistrict}&farm_size_ha=${parsedFarmSize}&top_n=5`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setRecommendations(data.data);
        } else {
          setError(String(t('cropPlanner.noRecommendations'))); 
        }
      } else {
        const errorData = await response.json();
        setError(String(errorData.message || t('cropPlanner.fetchError'))); 
      }
    } catch (err: unknown) { 
      console.error('Crop recommendation fetch error (catch block):', err);
      setError(String(t('common.networkError'))); // Explicit String()
    } finally {
      setLoading(false);
    }
  }, [selectedDistrict, farmSize, authenticatedFetch, t, districts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    resetForm(); 
    setRefreshing(false); 
  }, [resetForm]);


  return (
    <Container>
      <CustomHeader title={String(t('tab.cropPlanner'))} showBack={false} showLogo={true} showLanguageSwitcher={true}/>
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
          <FormTitle>{String(t('cropPlanner.formTitle'))}</FormTitle>
          
          <Label>{String(t('cropPlanner.districtLabel'))}</Label>
          <PickerContainer>
            <StyledPicker
              selectedValue={selectedDistrict}
              onValueChange={(itemValue: unknown, itemIndex: number) => setSelectedDistrict(itemValue as string)} 
              enabled={!loading && !areReferenceDataLoading}
            >
              {areReferenceDataLoading ? (
                <Picker.Item key="loading" label={String(t('common.loading'))} value="" />
              ) : districts.length > 0 ? (
                districts.map((district) => (
                  <Picker.Item key={String(district.value)} label={String(district.label)} value={String(district.value)} /> 
                ))
              ) : (
                <Picker.Item key="no-districts" label={String(t('cropPlanner.noDistrictsFound') || "No districts available")} value="" />
              )}
            </StyledPicker>
          </PickerContainer>

          <Label>{String(t('cropPlanner.farmSizeLabel'))}</Label>
          <Input
            placeholder={String(t('cropPlanner.farmSizePlaceholder'))}
            keyboardType="numeric"
            value={farmSize}
            onChangeText={setFarmSize}
            placeholderTextColor={defaultTheme.colors.placeholder}
            editable={!loading}
          />

          <SubmitButton onPress={handleSubmit} disabled={loading || areReferenceDataLoading}>
            {loading ? (
              <ActivityIndicator color={defaultTheme.colors.lightText} />
            ) : (
              <SubmitButtonText>{String(t('cropPlanner.submitButton'))}</SubmitButtonText>
            )}
          </SubmitButton>
          
          {error && <FeedbackText isError>{error}</FeedbackText>}

        </FormSection>

        {recommendations.length > 0 && (
          <ResultsSection>
            <FormTitle>{String(t('cropPlanner.resultsTitle'))}</FormTitle>
            {recommendations.map((rec, index) => (
              <View key={String(rec.CropName)}> 
                {(index !== 0) && (
                  <View style={{ height: 1, backgroundColor: defaultTheme.colors.border, marginVertical: defaultTheme.spacing.small }} />
                )}
                <ResultCard style={index === recommendations.length - 1 ? { borderBottomWidth: 0, paddingBottom: 0 } : {}}>
                  <ResultIcon name="leaf" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.primary} />
                  <ResultContent>
                    <ResultTitle>{String(rec.CropName)}</ResultTitle> {/* Explicit String() */}
                    <ResultSubtitle>
                      {String(t('cropPlanner.recommendedArea'))}: {String(rec.Recommended_Area_ha?.toFixed(2) || 'N/A')} {String(t('market.haUnit'))}
                    </ResultSubtitle>
                    <ResultSubtitle>
                      {String(t('cropPlanner.estimatedYield'))}: {String(rec.Estimated_Yield_Kg_per_Ha?.toFixed(2) || 'N/A')} {String(t('market.kgPerHaUnit'))}
                    </ResultSubtitle>
                  </ResultContent>
                  <ResultValue>
                    {String(rec.Estimated_Total_Production_Kg?.toFixed(0) || 'N/A')} {String(t('market.kgUnit'))}
                  </ResultValue>
                </ResultCard>
              </View>
            ))}
          </ResultsSection>
        )}
      </ContentArea>
    </Container>
  );
};

export default CropPlannerScreen;
