// src/screens/Main/RecordHarvestScreen.tsx

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components/native';
import { Text, View, ScrollView, ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; 
import { Picker } from '@react-native-picker/picker'; 
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, MainTabNavigationProp } from '../../navigation/types';

import CustomHeader from '../../components/CustomHeader';
import { defaultTheme } from '../../config/theme';
import { useAuth } from '../../context/AuthContext';


type RecordHarvestScreenRouteProp = RouteProp<RootStackParamList, 'RecordHarvest'>;

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
  margin-top: ${defaultTheme.spacing.medium}px; /* Add some top margin for spacing */
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

const DatePickerButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${props => props.theme.spacing.medium + 2}px;
  margin-bottom: ${props => props.theme.spacing.large}px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  background-color: ${props => props.theme.colors.background};
`;

const DatePickerButtonText = styled(Text)<{ isPlaceholder?: boolean }>`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.isPlaceholder ? props.theme.colors.placeholder : props.theme.colors.text};
`;

const SubmitButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.tertiary}; /* Green for record harvest */
  border-radius: ${props => props.theme.borderRadius.pill}px;
  padding: ${props => props.theme.spacing.medium + 4}px;
  align-items: center;
  justify-content: center;
  elevation: 5;
  shadow-color: '#000';
  shadow-offset: 0px 3px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  margin-top: ${defaultTheme.spacing.large}px;
`;

const SubmitButtonText = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.lightText};
`;

const ErrorText = styled(Text)`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSizes.medium}px;
  text-align: center;
  margin-top: ${props => props.theme.spacing.medium}px;
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

const InfoText = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${defaultTheme.spacing.small}px;
`;

const CalculatedValue = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${defaultTheme.spacing.medium}px;
`;

interface PlantedCropPlan {
  _id: string;
  cropName: string;
  actualAreaPlantedHa: number;
  plantingDate: string; 
  estimatedHarvestDate: string; 
 
}

const RecordHarvestScreen: React.FC = () => {
  const { t } = useTranslation();
  const { authenticatedFetch } = useAuth();
 
  const navigation = useNavigation<MainTabNavigationProp<'HarvestTrackerTab'>>(); 
  const route = useRoute<RecordHarvestScreenRouteProp>();

  
  const initialCropPlanId = route.params?.cropPlanId;
  const initialCropName = route.params?.cropName;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [plantedPlans, setPlantedPlans] = useState<PlantedCropPlan[]>([]); 
  const [selectedPlanId, setSelectedPlanId] = useState<string | undefined>(initialCropPlanId);
  const [actualHarvestDate, setActualHarvestDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [actualYieldKgPerHa, setActualYieldKgPerHa] = useState<string>('');
  const [actualSellingPricePerKgRwf, setActualSellingPricePerKgRwf] = useState<string>('');
  const [harvestNotes, setHarvestNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

 
  const selectedPlan = plantedPlans.find(p => p._id === selectedPlanId);

  
  const actualAreaPlantedHa = selectedPlan?.actualAreaPlantedHa || 0;
  const parsedActualYieldKgPerHa = parseFloat(actualYieldKgPerHa) || 0;
  const parsedActualSellingPricePerKgRwf = parseFloat(actualSellingPricePerKgRwf) || 0;

  const totalActualProductionKg = parsedActualYieldKgPerHa * actualAreaPlantedHa;
  const totalActualRevenueRwf = totalActualProductionKg * parsedActualSellingPricePerKgRwf;

 
  const fetchPlantedPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {

      const response = await authenticatedFetch('/crop-plans?status=Planted');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPlantedPlans(data.data);
       
          if (!initialCropPlanId && !selectedPlanId && data.data.length > 0) {
            setSelectedPlanId(data.data[0]._id);
          } else if (initialCropPlanId && !data.data.some((p: PlantedCropPlan) => p._id === initialCropPlanId)) {
            
            setSelectedPlanId(undefined);
            
            Alert.alert(String(t('common.error')), String(t('recordHarvest.noPlantedPlans'))); 
          }
        } else {
          setError(data.message || t('recordHarvest.errorFetchingPlans'));
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || t('recordHarvest.errorFetchingPlans'));
      }
    } catch (err: unknown) {
      console.error('Error fetching planted plans:', err);
      setError(t('common.networkError'));
    } finally {
      setLoading(false);
    }
  }, [authenticatedFetch, initialCropPlanId, selectedPlanId, t]);

  useFocusEffect(
    useCallback(() => {
      fetchPlantedPlans();
      
      if (!initialCropPlanId) {
        setActualYieldKgPerHa('');
        setActualSellingPricePerKgRwf('');
        setHarvestNotes('');
        setActualHarvestDate(new Date()); 
      }
      
      setError(null);
    }, [fetchPlantedPlans, initialCropPlanId])
  );


  useEffect(() => {
    if (initialCropPlanId && plantedPlans.length > 0 && selectedPlanId !== initialCropPlanId) {
      
      if (plantedPlans.some(plan => plan._id === initialCropPlanId)) {
        setSelectedPlanId(initialCropPlanId);
      } else {
        
        setSelectedPlanId(undefined);
        
        Alert.alert(String(t('common.error')), String(t('recordHarvest.noPlantedPlans'))); 
      }
    }
  }, [initialCropPlanId, plantedPlans, selectedPlanId, t]);


  // Date picker handlers
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || actualHarvestDate;
    setDatePickerVisible(false); 
    setActualHarvestDate(currentDate);
  };

  
  const handleSubmit = useCallback(async () => {
    setError(null);
    
    if (!selectedPlanId || parsedActualYieldKgPerHa <= 0 || parsedActualSellingPricePerKgRwf <= 0 || !actualHarvestDate) {
      Alert.alert(String(t('common.error')), String(t('recordHarvest.validationError')));
      return;
    }

    setSubmitting(true); 
    try {
      const payload = {
        actualHarvestDate: actualHarvestDate.toISOString().split('T')[0], 
        actualYieldKgPerHa: parsedActualYieldKgPerHa,
        actualTotalProductionKg: totalActualProductionKg, 
        actualSellingPricePerKgRwf: parsedActualSellingPricePerKgRwf,
        actualRevenueRwf: totalActualRevenueRwf, 
        harvestNotes: harvestNotes || undefined,
      };

      const response = await authenticatedFetch(`/crop-plans/${selectedPlanId}/record-harvest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert(String(t('common.success')), String(t('recordHarvest.success')));
        
        navigation.goBack(); 
      } else {
        const errorData = await response.json();
        setError(errorData.message || t('recordHarvest.error'));
        Alert.alert(String(t('common.error')), errorData.message || t('recordHarvest.error'));
      }
    } catch (err: unknown) {
      console.error('Error recording harvest:', err);
      setError(t('common.networkError'));
      Alert.alert(String(t('common.error')), t('common.networkError'));
    } finally {
      setSubmitting(false); 
    }
  }, [
    selectedPlanId,
    actualHarvestDate,
    parsedActualYieldKgPerHa,
    parsedActualSellingPricePerKgRwf,
    totalActualProductionKg,
    totalActualRevenueRwf,
    harvestNotes,
    authenticatedFetch,
    navigation,
    t,
  ]);

  
  if (loading) {
    return (
      <Container>
        <CustomHeader title={String(t('recordHarvest.title'))} showBack={true} showLogo={true} showLanguageSwitcher={true}/>
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
      <CustomHeader title={String(t('recordHarvest.title'))} showBack={true} showLogo={true} showLanguageSwitcher={true}/>
      <ContentArea>
        <FormSection>
          <FormTitle>{String(t('recordHarvest.title'))}</FormTitle>
          
          <Label>{String(t('recordHarvest.selectPlan'))}</Label>
          {plantedPlans.length === 0 ? (
            <Text style={{ color: defaultTheme.colors.placeholder, textAlign: 'center', marginBottom: defaultTheme.spacing.medium }}>
              {String(t('recordHarvest.noPlantedPlans'))}
            </Text>
          ) : (
            <PickerContainer>
              <StyledPicker
                selectedValue={selectedPlanId}
                onValueChange={(itemValue: unknown) => setSelectedPlanId(String(itemValue))}
                enabled={!submitting}
              >
                
                {plantedPlans.map(plan => (
                  <Picker.Item
                    key={plan._id}
                    label={`${plan.cropName} - ${plan.actualAreaPlantedHa}ha (Planted: ${new Date(plan.plantingDate).toLocaleDateString()})`}
                    value={plan._id}
                  />
                ))}
              </StyledPicker>
            </PickerContainer>
          )}

          
          {selectedPlan && (
            <>
              <InfoText style={{marginBottom: defaultTheme.spacing.medium, color: defaultTheme.colors.primary, fontWeight: 'bold'}}>
                {String(t('recordHarvest.recordingFor'))} {selectedPlan.cropName} ({selectedPlan.actualAreaPlantedHa}ha)
              </InfoText>

              <Label>{String(t('recordHarvest.actualHarvestDate'))}</Label>
              <DatePickerButton onPress={() => setDatePickerVisible(true)} disabled={submitting}>
                <DatePickerButtonText isPlaceholder={!actualHarvestDate}>
                  {actualHarvestDate ? actualHarvestDate.toLocaleDateString() : (String(t('cropPlan.selectDatePlaceholder')))}
                </DatePickerButtonText>
                <Ionicons name="calendar-outline" size={defaultTheme.fontSizes.large} color={defaultTheme.colors.text} />
              </DatePickerButton>

             
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={onDateChange}
                onCancel={() => setDatePickerVisible(false)} 
                date={actualHarvestDate || new Date()}
                locale={String(t('common.locale'))}
                maximumDate={new Date()} 
              />

              <Label>{String(t('recordHarvest.actualYieldKgPerHa'))}</Label>
              <Input
                placeholder="e.g., 750"
                keyboardType="numeric"
                value={actualYieldKgPerHa}
                onChangeText={setActualYieldKgPerHa}
                placeholderTextColor={defaultTheme.colors.placeholder}
                editable={!submitting}
                style={{marginBottom: defaultTheme.spacing.small}}
              />
              <InfoText style={{marginBottom: defaultTheme.spacing.large, textAlign: 'right', color: defaultTheme.colors.placeholder}}>
                {String(t('market.kgPerHaUnit'))}
              </InfoText>

              <Label>{String(t('recordHarvest.totalProduction'))}</Label>
              <CalculatedValue>
                
                {totalActualProductionKg.toFixed(2)} {String(t('market.kgUnit'))}
              </CalculatedValue>

              <Label>{String(t('recordHarvest.actualSellingPricePerKgRwf'))}</Label>
              <Input
                placeholder="e.g., 400"
                keyboardType="numeric"
                value={actualSellingPricePerKgRwf}
                onChangeText={setActualSellingPricePerKgRwf}
                placeholderTextColor={defaultTheme.colors.placeholder}
                editable={!submitting}
                style={{marginBottom: defaultTheme.spacing.small}}
              />
               <InfoText style={{marginBottom: defaultTheme.spacing.large, textAlign: 'right', color: defaultTheme.colors.placeholder}}>
                RWF/{String(t('market.kgUnit'))}
              </InfoText>


              <Label>{String(t('recordHarvest.totalRevenue'))}</Label>
              <CalculatedValue>
                
                {totalActualRevenueRwf.toLocaleString('en-RW', { style: 'currency', currency: 'RWF' })}
              </CalculatedValue>

              <Label>{String(t('recordHarvest.notes'))}</Label>
              <Input
                placeholder={String(t('recordHarvest.notesPlaceholder')) || "Any specific observations?"}
                value={harvestNotes}
                onChangeText={setHarvestNotes}
                placeholderTextColor={defaultTheme.colors.placeholder}
                multiline
                numberOfLines={3}
                editable={!submitting}
              />

              <SubmitButton onPress={handleSubmit} disabled={submitting || plantedPlans.length === 0}>
                {submitting ? (
                  <ActivityIndicator color={defaultTheme.colors.lightText} />
                ) : (
                  <SubmitButtonText>{String(t('recordHarvest.recordButton'))}</SubmitButtonText>
                )}
              </SubmitButton>
            </>
          )}
          {error && <ErrorText>{error}</ErrorText>}
        </FormSection>
      </ContentArea>
    </Container>
  );
};

export default RecordHarvestScreen;