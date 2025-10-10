// src/screens/Main/CropPlanDetailScreen.tsx

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components/native';
import { Text, View, ScrollView, ActivityIndicator, Alert, Platform, TouchableOpacity, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRoute, RouteProp, useNavigation } from '@react-navigation/native';

import CustomHeader from '../../components/CustomHeader';
import { defaultTheme } from '../../config/theme';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList, MainTabNavigationProp } from '../../navigation/types';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';

// Define the route prop type for this screen
type CropPlanDetailScreenRouteProp = RouteProp<RootStackParamList, 'CropPlanDetail'>;

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

const DetailCard = styled(View)`
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

const DetailHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${defaultTheme.spacing.medium}px;
`;

const DetailTitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.xl}px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  flex: 1;
`;

const DetailStatus = styled(Text)<{ statusColor: string }>`
  font-size: ${props => props.theme.fontSizes.medium}px;
  font-weight: 600;
  color: ${props => props.statusColor};
  background-color: ${props => `${props.statusColor}20`};
  padding: ${defaultTheme.spacing.tiny}px ${defaultTheme.spacing.small}px;
  border-radius: ${defaultTheme.borderRadius.small}px;
`;

const DetailItem = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: ${defaultTheme.spacing.small}px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const DetailLabel = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const DetailValue = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.primary};
  font-weight: normal;
`;

const EstimateSection = styled(DetailCard)`
  margin-top: ${defaultTheme.spacing.large}px;
  background-color: ${props => props.theme.colors.tertiary}10; /* Lighter tint */
  border-width: 1px;
  border-color: ${props => props.theme.colors.tertiary};
`;

const EstimateTitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.tertiary};
  margin-bottom: ${defaultTheme.spacing.medium}px;
  text-align: center;
`;

const ActionButtonsContainer = styled(View)`
  flex-direction: row;
  flex-wrap: wrap; /* Allow wrapping for multiple buttons */
  justify-content: space-around;
  margin-top: ${defaultTheme.spacing.large}px;
  margin-bottom: ${defaultTheme.spacing.xl}px;
  gap: ${defaultTheme.spacing.small}px; /* Space between buttons */
`;

const ActionButton = styled(TouchableOpacity)<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
  border-radius: ${props => props.theme.borderRadius.pill}px;
  padding: ${props => props.theme.spacing.medium}px ${props => props.theme.spacing.large}px;
  flex-direction: row;
  align-items: center;
  justify-content: center; /* Center content */
  elevation: 4;
  shadow-color: '#000';
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
  flex: 1; /* Allow buttons to grow */
  min-width: 45%; /* Ensure two columns */
`;

const ActionButtonText = styled(Text)`
  color: ${props => props.theme.colors.lightText};
  font-size: ${props => props.theme.fontSizes.medium}px;
  font-weight: bold;
  margin-left: ${defaultTheme.spacing.small}px;
`;

const Input = styled.TextInput`
  width: 100%;
  padding: ${props => props.theme.spacing.medium + 2}px;
  margin-bottom: ${props => props.theme.spacing.small}px;
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
  margin-bottom: ${props => props.theme.spacing.small}px;
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
  margin-bottom: ${props => props.theme.spacing.small}px;
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
  background-color: ${props => props.theme.colors.primary};
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

const Label = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.small}px;
  font-weight: 600;
`;

const LoadingContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled(Text)`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSizes.medium}px;
  text-align: center;
  margin-top: ${props => props.theme.spacing.medium}px;
`;


// ---------------------- Component Logic ----------------------
interface CropPlan {
  _id: string;
  cropName: string;
  districtName: string;
  actualAreaPlantedHa: number;
  plantingDate: string; // This will be an ISO string from the API
  estimatedHarvestDate: string;
  estimatedYieldKgPerHa: number;
  estimatedTotalProductionKg: number;
  estimatedPricePerKgRwf: number;
  estimatedRevenueRwf: number;
  status: 'Planted' | 'Harvested' | 'Planned' | 'Cancelled';
  user: string;
  createdAt: string;
  updatedAt?: string;
}

interface TrackerEstimates {
  CropName: string;
  Actual_Area_Planted_ha: number;
  Planting_Date: string;
  Estimated_Yield_Kg_per_Ha: number;
  Estimated_Total_Production_Kg: number;
  Estimated_Price_Per_Kg_Rwf: number;
  Estimated_Revenue_Rwf: number;
  Estimated_Harvest_Date: string;
}

const CropPlanDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { authenticatedFetch, crops, districts, areReferenceDataLoading } = useAuth(); // Use dynamic data
  const route = useRoute<CropPlanDetailScreenRouteProp>();
  const navigation = useNavigation<MainTabNavigationProp<'HarvestTrackerTab'>>();

  const { cropPlanId } = route.params; // Get the ID from route parameters

  const [cropPlan, setCropPlan] = useState<CropPlan | null>(null);
  const [estimates, setEstimates] = useState<TrackerEstimates | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Form states for editing
  const [editCropName, setEditCropName] = useState('');
  const [editDistrictName, setEditDistrictName] = useState('');
  const [editArea, setEditArea] = useState('');
  const [editPlantingDate, setEditPlantingDate] = useState<Date | null>(null);
  const [editStatus, setEditStatus] = useState<string>('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'Planted': return defaultTheme.colors.primary;
      case 'Harvested': return defaultTheme.colors.tertiary;
      case 'Planned': return defaultTheme.colors.secondary;
      case 'Cancelled': return defaultTheme.colors.error;
      default: return defaultTheme.colors.placeholder;
    }
  }, []);

  const fetchPlanDetails = useCallback(async () => {
    console.log('--- fetchPlanDetails initiated ---');
    console.log('Fetching plan for ID:', cropPlanId);
    if (!cropPlanId) {
      console.error('No cropPlanId provided to fetchPlanDetails.');
      setError(String(t('cropPlan.planNotFound')));
      return;
    }

    setError(null);
    setLoading(true);
    try {
      // Fetch Crop Plan Details
      const planResponse = await authenticatedFetch(`/crop-plans/${cropPlanId}`);
      console.log('Plan response status:', planResponse.status);

      if (planResponse.ok) {
        const planData = await planResponse.json();
        console.log('Raw plan data received:', JSON.stringify(planData));

        if (planData.success) {
          const fetchedPlan: CropPlan = planData.data;
          setCropPlan(fetchedPlan);
          console.log('Crop Plan fetched successfully:', fetchedPlan.cropName, 'Status:', fetchedPlan.status);
          
          // Populate edit form states
          setEditCropName(fetchedPlan.cropName);
          setEditDistrictName(fetchedPlan.districtName);
          setEditArea(String(fetchedPlan.actualAreaPlantedHa));
          setEditPlantingDate(new Date(fetchedPlan.plantingDate));
          setEditStatus(fetchedPlan.status);
          console.log('Edit form states populated.');

          // --- FIX START: Format plantingDate to YYYY-MM-DD for the estimates API ---
          const formattedPlantingDateForEstimates = new Date(fetchedPlan.plantingDate).toISOString().split('T')[0];
          console.log('Formatted Planting Date for Estimates:', formattedPlantingDateForEstimates);
          // --- FIX END ---

          // Fetch Tracker Estimates (conditional on successful plan fetch)
          console.log('Attempting to fetch tracker estimates...');
          const estimatesEndpoint = `/tracker/estimates?crop_name=${encodeURIComponent(fetchedPlan.cropName)}&actual_area_planted_ha=${fetchedPlan.actualAreaPlantedHa}&planting_date=${formattedPlantingDateForEstimates}&district_name=${encodeURIComponent(fetchedPlan.districtName)}`;
          console.log('Estimates endpoint:', estimatesEndpoint);
          const estimatesResponse = await authenticatedFetch(estimatesEndpoint);
          console.log('Estimates response status:', estimatesResponse.status);

          if (estimatesResponse.ok) {
            const estimatesData = await estimatesResponse.json();
            console.log('Raw estimates data received:', JSON.stringify(estimatesData));
            if (estimatesData.success) {
              setEstimates(estimatesData.data);
              console.log('Tracker estimates fetched successfully.');
            } else {
              setEstimates(null);
              console.warn('Failed to fetch estimates:', String(estimatesData.message));
              setError(String(estimatesData.message || t('cropPlan.fetchEstimatesError'))); 
            }
          } else {
            setEstimates(null);
            console.error('Failed to fetch estimates, non-OK response:', estimatesResponse.status);
            const errorText = await estimatesResponse.text();
            console.error('Estimates error response text:', errorText);
            setError(String(t('cropPlan.fetchEstimatesError') + ` (Status: ${estimatesResponse.status})`)); 
          }

        } else {
          console.error('API returned success: false for plan details:', planData.message);
          setError(String(planData.message || t('cropPlan.fetchDetailError')));
        }
      } else {
        console.error('Failed to fetch plan details, non-OK response:', planResponse.status);
        const errorData = await planResponse.json();
        console.error('Plan error response data:', errorData);
        setError(String(errorData.message || t('cropPlan.fetchDetailError')));
      }
    } catch (err: unknown) {
      console.error('Error fetching plan details (catch block):', err);
      setError(String(t('common.networkError')));
    } finally {
      setLoading(false);
      setRefreshing(false);
      console.log('--- fetchPlanDetails finished ---');
    }
  }, [cropPlanId, authenticatedFetch, t, getStatusColor]);

  useFocusEffect(
    useCallback(() => {
      fetchPlanDetails();
      setIsEditMode(false);
      setError(null);
    }, [fetchPlanDetails])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPlanDetails();
  }, [fetchPlanDetails]);

  const handleUpdate = useCallback(async () => {
    console.log('--- handleUpdate initiated ---');
    setError(null);
    setSaving(true);
    
    const parsedArea = parseFloat(editArea);

    if (!editCropName || !editDistrictName || isNaN(parsedArea) || parsedArea <= 0 || !editPlantingDate || !editStatus) {
      Alert.alert(String(t('common.error')), String(t('cropPlan.formValidationError')));
      setSaving(false);
      console.warn('Validation failed for update.');
      return;
    }

    const updatePayload = {
      cropName: editCropName,
      districtName: editDistrictName,
      actualAreaPlantedHa: parsedArea,
      plantingDate: editPlantingDate.toISOString().split('T')[0], 
      status: editStatus,
    };
    console.log('Sending update payload:', updatePayload);

    try {
      const response = await authenticatedFetch(`/crop-plans/${cropPlanId}`, {
        method: 'PUT',
        body: JSON.stringify(updatePayload),
      });
      console.log('Update response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Raw update response data:', JSON.stringify(data));
        if (data.success) {
          Alert.alert(String(t('common.success')), String(t('cropPlan.updateSuccess')));
          setIsEditMode(false);
          fetchPlanDetails(); // Re-fetch to get updated details and estimates
          console.log('Crop plan updated successfully.');
        } else {
          console.error('API returned success: false for update:', data.message);
          setError(String(data.message || t('cropPlan.updateError')));
        }
      } else {
        console.error('Failed to update crop plan, non-OK response:', response.status);
        const errorData = await response.json();
        console.error('Update error response data:', errorData);
        setError(String(errorData.message || t('cropPlan.updateError')));
      }
    } catch (err: unknown) {
      console.error('Update crop plan error (catch block):', err);
      setError(String(t('common.networkError')));
    } finally {
      setSaving(false);
      console.log('--- handleUpdate finished ---');
    }
  }, [cropPlanId, editCropName, editDistrictName, editArea, editPlantingDate, editStatus, authenticatedFetch, fetchPlanDetails, t]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      String(t('cropPlan.confirmDeleteTitle')),
      String(t('cropPlan.confirmDeleteMessage')),
      [
        { text: String(t('common.cancel')), style: 'cancel' },
        { text: String(t('common.delete')), style: 'destructive', onPress: async () => {
          setDeleting(true);
          console.log('Attempting to delete crop plan:', cropPlanId);
          try {
            const response = await authenticatedFetch(`/crop-plans/${cropPlanId}`, {
              method: 'DELETE',
            });
            console.log('Delete response status:', response.status);
            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                Alert.alert(String(t('common.success')), String(t('cropPlan.deleteSuccess')));
                navigation.goBack(); // Go back to the list
                console.log('Crop plan deleted successfully.');
              } else {
                console.error('API returned success: false for delete:', data.message);
                setError(String(data.message || t('cropPlan.deleteError')));
              }
            } else {
              console.error('Failed to delete crop plan, non-OK response:', response.status);
              const errorData = await response.json();
              console.error('Delete error response data:', errorData);
              setError(String(errorData.message || t('cropPlan.deleteError')));
            }
          } catch (err: unknown) {
            console.error('Delete crop plan error (catch block):', err);
            setError(String(t('common.networkError')));
          } finally {
            setDeleting(false);
          }
        }},
      ]
    );
  }, [cropPlanId, authenticatedFetch, navigation, t]);

  // NEW: Handle navigation to RecordHarvestScreen from CropPlanDetail
  const handleRecordHarvest = useCallback(() => {
    if (cropPlan) {
      // Pass both cropPlanId and cropName
      navigation.navigate('RecordHarvest', { cropPlanId: cropPlan._id, cropName: cropPlan.cropName });
    } else {
      Alert.alert(String(t('common.error')), String(t('cropPlan.noPlanToRecord')));
    }
  }, [navigation, cropPlan, t]);


  const showDatePicker = useCallback(() => setDatePickerVisible(true), []);
  const hideDatePicker = useCallback(() => setDatePickerVisible(false), []);

  const handleConfirmDate = useCallback((date: Date) => {
    setEditPlantingDate(date);
    hideDatePicker();
  }, [hideDatePicker]);

  useEffect(() => {
    console.log('Reference data status in CropPlanDetailScreen:');
    console.log('  areReferenceDataLoading:', areReferenceDataLoading);
    console.log('  Crops available:', crops.length);
    console.log('  Districts available:', districts.length);
  }, [areReferenceDataLoading, crops.length, districts.length]);


  if (loading) {
    return (
      <Container>
        <CustomHeader title={String(t('cropPlan.detailTitle'))} showBack={true} showLogo={true} showLanguageSwitcher={true}/>
        <LoadingContainer>
          <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
          <Text style={{ color: defaultTheme.colors.text, marginTop: defaultTheme.spacing.medium }}>
            {String(t('common.loading'))}
          </Text>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <CustomHeader title={String(t('cropPlan.detailTitle'))} showBack={true} showLogo={true} showLanguageSwitcher={true}/>
        <LoadingContainer>
          <ErrorText>{error}</ErrorText>
        </LoadingContainer>
      </Container>
    );
  }

  if (!cropPlan) {
    return (
      <Container>
        <CustomHeader title={String(t('cropPlan.detailTitle'))} showBack={true} showLogo={true} showLanguageSwitcher={true}/>
        <LoadingContainer>
          <ErrorText>{String(t('cropPlan.planNotFound'))}</ErrorText>
        </LoadingContainer>
      </Container>
    );
  }

  // Determine if "Record Harvest" button should be shown
  const isPlantedAndNotHarvested = cropPlan.status === 'Planted';


  return (
    <Container>
      <CustomHeader title={String(t('cropPlan.detailTitle'))} showBack={true} showLogo={true} showLanguageSwitcher={true}/>
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
        <DetailCard>
          <DetailHeader>
            <DetailTitle>{String(cropPlan.cropName)}</DetailTitle>
            <DetailStatus statusColor={getStatusColor(cropPlan.status)}>
              {String(t(`tracker.status${cropPlan.status}` || cropPlan.status))}
            </DetailStatus>
          </DetailHeader>

          {isEditMode ? (
            <View>
               <Label>{String(t('cropPlan.cropNameLabel'))}</Label>
              <PickerContainer>
                <StyledPicker
                  selectedValue={editCropName}
                  onValueChange={(itemValue: unknown, itemIndex: number) => setEditCropName(itemValue as string)}
                  enabled={!saving && !areReferenceDataLoading}
                >
                  {areReferenceDataLoading ? (
                    <Picker.Item key="loading-crops-edit" label={String(t('common.loading'))} value="" />
                  ) : crops.length > 0 ? (
                    crops.map((crop) => (
                      <Picker.Item key={String(crop.value)} label={String(crop.label)} value={String(crop.value)} />
                    ))
                  ) : (
                    <Picker.Item key="no-crops-edit" label={String(t('cropPlan.noCropsFound') || "No crops available")} value="" />
                  )}
                </StyledPicker>
              </PickerContainer>

              <Label>{String(t('cropPlan.districtNameLabel'))}</Label>
              <PickerContainer>
                <StyledPicker
                  selectedValue={editDistrictName}
                  onValueChange={(itemValue: unknown, itemIndex: number) => setEditDistrictName(itemValue as string)}
                  enabled={!saving && !areReferenceDataLoading}
                >
                   {areReferenceDataLoading ? (
                    <Picker.Item key="loading-districts-edit" label={String(t('common.loading'))} value="" />
                  ) : districts.length > 0 ? (
                    districts.map((district) => (
                      <Picker.Item key={String(district.value)} label={String(district.label)} value={String(district.value)} />
                    ))
                  ) : (
                    <Picker.Item key="no-districts-edit" label={String(t('cropPlan.noDistrictsFound') || "No districts available")} value="" />
                  )}
                </StyledPicker>
              </PickerContainer>

              <Label>{String(t('cropPlan.areaPlantedLabel'))}</Label>
              <Input
                placeholder={String(t('cropPlan.areaPlantedPlaceholder'))}
                keyboardType="numeric"
                value={editArea}
                onChangeText={setEditArea}
                placeholderTextColor={defaultTheme.colors.placeholder}
                editable={!saving}
              />

              <Label>{String(t('cropPlan.plantingDateLabel'))}</Label>
              <DatePickerButton onPress={showDatePicker} disabled={saving}>
                <DatePickerButtonText isPlaceholder={!editPlantingDate}>
                  {editPlantingDate ? editPlantingDate.toLocaleDateString() : (String(t('cropPlan.selectDatePlaceholder')))}
                </DatePickerButtonText>
                <Ionicons name="calendar-outline" size={defaultTheme.fontSizes.large} color={defaultTheme.colors.text} />
              </DatePickerButton>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
                date={editPlantingDate || new Date()}
                locale={String(t('common.locale'))}
              />

              <Label>{String(t('cropPlan.statusLabel'))}</Label>
              <PickerContainer>
                <StyledPicker
                  selectedValue={editStatus}
                  onValueChange={(itemValue: unknown, itemIndex: number) => setEditStatus(itemValue as string)}
                  enabled={!saving}
                >
                  {['Planted', 'Harvested', 'Planned', 'Cancelled'].map(s => (
                    <Picker.Item key={String(s)} label={String(t(`tracker.status${s}`) || s)} value={String(s)} />
                  ))}
                </StyledPicker>
              </PickerContainer>

            </View>
          ) : (
            <>
              <DetailItem>
                <DetailLabel>{String(t('cropPlan.districtNameLabel'))}</DetailLabel>
                <DetailValue>{String(cropPlan.districtName)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{String(t('cropPlan.areaPlantedLabel'))}</DetailLabel>
                <DetailValue>{String(cropPlan.actualAreaPlantedHa?.toFixed(2))} {String(t('market.haUnit'))}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{String(t('cropPlan.plantingDateLabel'))}</DetailLabel>
                <DetailValue>{String(new Date(cropPlan.plantingDate).toLocaleDateString())}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{String(t('cropPlan.estimatedHarvestDate'))}</DetailLabel>
                <DetailValue>{String(new Date(cropPlan.estimatedHarvestDate).toLocaleDateString())}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{String(t('cropPlan.estimatedYield'))}</DetailLabel>
                <DetailValue>{String(cropPlan.estimatedYieldKgPerHa?.toFixed(2))} {String(t('market.kgPerHaUnit'))}</DetailValue>
              </DetailItem>
              <DetailItem style={{ borderBottomWidth: 0 }}>
                <DetailLabel>{String(t('cropPlan.estProduction'))}</DetailLabel>
                <DetailValue>{String(cropPlan.estimatedTotalProductionKg?.toFixed(0))} {String(t('market.kgUnit'))}</DetailValue>
              </DetailItem>
            </>
          )}

          {isEditMode && (
             <SubmitButton onPress={handleUpdate} disabled={saving || areReferenceDataLoading}>
             {saving ? (
               <ActivityIndicator color={defaultTheme.colors.lightText} />
             ) : (
               <SubmitButtonText>{String(t('common.submit'))}</SubmitButtonText>
             )}
           </SubmitButton>
          )}

        </DetailCard>

        {estimates && !isEditMode && (
          <EstimateSection>
            <EstimateTitle>{String(t('cropPlan.liveEstimatesTitle'))}</EstimateTitle>
            <DetailItem>
                <DetailLabel>{String(t('cropPlan.estimatedPrice'))}</DetailLabel>
                <DetailValue>{String(estimates.Estimated_Price_Per_Kg_Rwf?.toLocaleString())} Rwf/{String(t('market.kgUnit'))}</DetailValue>
              </DetailItem>
              <DetailItem style={{ borderBottomWidth: 0 }}>
                <DetailLabel>{String(t('cropPlan.estimatedRevenue'))}</DetailLabel>
                <DetailValue>{String(estimates.Estimated_Revenue_Rwf?.toLocaleString())} Rwf</DetailValue>
              </DetailItem>
          </EstimateSection>
        )}

        <ActionButtonsContainer>
          {!isEditMode && (
            <ActionButton bgColor={defaultTheme.colors.primary} onPress={() => setIsEditMode(true)}>
              <Ionicons name="create-outline" size={defaultTheme.fontSizes.large} color={defaultTheme.colors.lightText} />
              <ActionButtonText>{String(t('common.edit'))}</ActionButtonText>
            </ActionButton>
          )}
          {isEditMode && (
            <ActionButton bgColor={defaultTheme.colors.error} onPress={() => setIsEditMode(false)}>
              <Ionicons name="close-circle-outline" size={defaultTheme.fontSizes.large} color={defaultTheme.colors.lightText} />
              <ActionButtonText>{String(t('common.cancel'))}</ActionButtonText>
            </ActionButton>
          )}
          
          {isPlantedAndNotHarvested && !isEditMode && ( // Show "Record Harvest" only for Planted plans
            <ActionButton bgColor={defaultTheme.colors.tertiary} onPress={handleRecordHarvest}>
              <MaterialCommunityIcons name="tractor" size={defaultTheme.fontSizes.large} color={defaultTheme.colors.lightText} />
              <ActionButtonText>{String(t('home.recordHarvestTitle'))}</ActionButtonText>
            </ActionButton>
          )}

          <ActionButton bgColor={defaultTheme.colors.error} onPress={handleDelete} disabled={deleting}>
            {deleting ? (
              <ActivityIndicator color={defaultTheme.colors.lightText} />
            ) : (
              <>
                <Ionicons name="trash-outline" size={defaultTheme.fontSizes.large} color={defaultTheme.colors.lightText} />
                <ActionButtonText>{String(t('common.delete'))}</ActionButtonText>
              </>
            )}
          </ActionButton>
        </ActionButtonsContainer>

      </ContentArea>
    </Container>
  );
};

export default CropPlanDetailScreen;