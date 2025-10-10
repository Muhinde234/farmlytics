// src/screens/Main/AddCropPlanScreen.tsx

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components/native';
import { Text, View, ScrollView, ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MainTabNavigationProp } from '../../navigation/types';

import CustomHeader from '../../components/CustomHeader';
import { defaultTheme } from '../../config/theme';
import { useAuth } from '../../context/AuthContext'; // Import useAuth for authenticatedFetch and dynamic data

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

const ErrorText = styled(Text)`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSizes.medium}px;
  text-align: center;
  margin-top: ${props => props.theme.spacing.medium}px;
`;

// ---------------------- Component Logic ----------------------
const AddCropPlanScreen: React.FC = () => {
  const { t } = useTranslation();
  const { authenticatedFetch, crops, districts, areReferenceDataLoading } = useAuth(); // Use dynamic data
  const navigation = useNavigation<MainTabNavigationProp<'HarvestTrackerTab'>>();

  const [cropName, setCropName] = useState('');
  const [districtName, setDistrictName] = useState('');
  const [actualAreaPlantedHa, setActualAreaPlantedHa] = useState('');
  const [plantingDate, setPlantingDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set initial default values after dynamic data is loaded
  useEffect(() => {
    if (crops.length > 0 && !cropName) {
      setCropName(crops[0].value);
    }
    if (districts.length > 0 && !districtName) {
      setDistrictName(districts[0].value);
    }
  }, [crops, districts, cropName, districtName]);


  // Reset form when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setCropName(crops.length > 0 ? crops[0].value : '');
      setDistrictName(districts.length > 0 ? districts[0].value : '');
      setActualAreaPlantedHa('');
      setPlantingDate(null);
      setError(null);
      setLoading(false);
    }, [crops, districts])
  );

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirmDate = (date: Date) => {
    setPlantingDate(date);
    hideDatePicker();
  };

  const handleSubmit = useCallback(async () => {
    setError(null);
    const parsedArea = parseFloat(actualAreaPlantedHa);

    if (!cropName || !districtName || isNaN(parsedArea) || parsedArea <= 0 || !plantingDate) {
      setError(String(t('cropPlan.formValidationError'))); // Explicit String()
      return;
    }

    setLoading(true);
    try {
      const response = await authenticatedFetch('/crop-plans', {
        method: 'POST',
        body: JSON.stringify({
          cropName,
          districtName,
          actualAreaPlantedHa: parsedArea,
          plantingDate: plantingDate.toISOString().split('T')[0], // Format to YYYY-MM-DD
          status: 'Planted', // Default status for new plans
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          Alert.alert(String(t('common.success')), String(t('cropPlan.addSuccess'))); // Explicit String()
          navigation.goBack(); // Go back to the list
        } else {
          setError(String(data.message || t('cropPlan.addError'))); // Explicit String()
        }
      } else {
        const errorData = await response.json();
        setError(String(errorData.message || t('cropPlan.addError'))); // Explicit String()
      }
    } catch (err: unknown) { // Explicitly type error as unknown
      console.error('Add crop plan error (catch block):', err);
      setError(String(t('common.networkError'))); // Explicit String()
    } finally {
      setLoading(false);
    }
  }, [cropName, districtName, actualAreaPlantedHa, plantingDate, authenticatedFetch, navigation, t]);

  return (
    <Container>
      <CustomHeader title={String(t('cropPlan.addTitle'))} showBack={true} showLogo={true} showLanguageSwitcher={true}/>
      <ContentArea>
        <FormSection>
          <FormTitle>{String(t('cropPlan.addPlanFormTitle'))}</FormTitle>
          
          <Label>{String(t('cropPlan.cropNameLabel'))}</Label>
          <PickerContainer>
            <StyledPicker
              selectedValue={cropName}
              onValueChange={(itemValue: unknown, itemIndex: number) => setCropName(itemValue as string)} // Corrected Picker typing
              enabled={!loading && !areReferenceDataLoading}
            >
              {/* FINAL FIX: Ensure Picker.Item children are correctly formed. */}
              {areReferenceDataLoading ? (
                <Picker.Item key="loading-crops" label={String(t('common.loading'))} value="" />
              ) : crops.length > 0 ? (
                crops.map((crop) => (
                  <Picker.Item key={String(crop.value)} label={String(crop.label)} value={String(crop.value)} />
                ))
              ) : (
                <Picker.Item key="no-crops" label={String(t('cropPlan.noCropsFound') || "No crops available")} value="" />
              )}
            </StyledPicker>
          </PickerContainer>

          <Label>{String(t('cropPlan.districtNameLabel'))}</Label>
          <PickerContainer>
            <StyledPicker
              selectedValue={districtName}
              onValueChange={(itemValue: unknown, itemIndex: number) => setDistrictName(itemValue as string)} // Corrected Picker typing
              enabled={!loading && !areReferenceDataLoading}
            >
              {/* FINAL FIX: Same as above, ensure Picker.Item children are correctly formed. */}
              {areReferenceDataLoading ? (
                <Picker.Item key="loading-districts" label={String(t('common.loading'))} value="" />
              ) : districts.length > 0 ? (
                districts.map((district) => (
                  <Picker.Item key={String(district.value)} label={String(district.label)} value={String(district.value)} />
                ))
              ) : (
                <Picker.Item key="no-districts-add" label={String(t('cropPlan.noDistrictsFound') || "No districts available")} value="" />
              )}
            </StyledPicker>
          </PickerContainer>

          <Label>{String(t('cropPlan.areaPlantedLabel'))}</Label>
          <Input
            placeholder={String(t('cropPlan.areaPlantedPlaceholder'))}
            keyboardType="numeric"
            value={actualAreaPlantedHa}
            onChangeText={setActualAreaPlantedHa}
            placeholderTextColor={defaultTheme.colors.placeholder}
            editable={!loading}
          />

          <Label>{String(t('cropPlan.plantingDateLabel'))}</Label>
          <DatePickerButton onPress={showDatePicker} disabled={loading}>
            <DatePickerButtonText isPlaceholder={!plantingDate}>
              {plantingDate ? plantingDate.toLocaleDateString() : (String(t('cropPlan.selectDatePlaceholder')))}
            </DatePickerButtonText>
            <Ionicons name="calendar-outline" size={defaultTheme.fontSizes.large} color={defaultTheme.colors.text} />
          </DatePickerButton>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
            date={plantingDate || new Date()}
            locale={String(t('common.locale'))} // Explicit String()
          />

          <SubmitButton onPress={handleSubmit} disabled={loading || areReferenceDataLoading}>
            {loading ? (
              <ActivityIndicator color={defaultTheme.colors.lightText} />
            ) : (
              <SubmitButtonText>{String(t('cropPlan.submitPlanButton'))}</SubmitButtonText>
            )}
          </SubmitButton>
          {error && <ErrorText>{error}</ErrorText>}

        </FormSection>
      </ContentArea>
    </Container>
  );
};

export default AddCropPlanScreen;