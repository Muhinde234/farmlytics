// src/screens/Main/CropPlanDetailScreen.tsx

import React, { useState, useCallback } from 'react';
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
import { MVP_CROPS } from '../../config/crops';
import { RWANDA_DISTRICTS } from '../../config/districts';

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
  justify-content: space-around;
  margin-top: ${defaultTheme.spacing.large}px;
  margin-bottom: ${defaultTheme.spacing.xl}px;
`;

const ActionButton = styled(TouchableOpacity)<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
  border-radius: ${props => props.theme.borderRadius.pill}px;
  padding: ${props => props.theme.spacing.medium}px ${props => props.theme.spacing.large}px;
  flex-direction: row;
  align-items: center;
  elevation: 4;
  shadow-color: '#000';
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3px;
`;

const ActionButtonText = styled(Text)`
  color: ${props => props.theme.colors.lightText};
  font-size: ${props => props.theme.fontSizes.medium}px;
  font-weight: bold;
  margin-left: ${defaultTheme.spacing.small}px;
`;

// ADDED: Input, PickerContainer, StyledPicker, DatePickerButton, DatePickerButtonText, Label, SubmitButton, SubmitButtonText
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

const SubmitButton = styled(TouchableOpacity)` /* Added SubmitButton */
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

const SubmitButtonText = styled(Text)` /* Added SubmitButtonText */
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.lightText};
`;

const Label = styled(Text)` /* ADDED: Label component */
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
  plantingDate: string;
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
  const { authenticatedFetch } = useAuth();
  const route = useRoute<CropPlanDetailScreenRouteProp>();
  const navigation = useNavigation<MainTabNavigationProp<'HarvestTrackerTab'>>();

  const { cropPlanId } = route.params;

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


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planted': return defaultTheme.colors.primary;
      case 'Harvested': return defaultTheme.colors.tertiary;
      case 'Planned': return defaultTheme.colors.secondary;
      case 'Cancelled': return defaultTheme.colors.error;
      default: return defaultTheme.colors.placeholder;
    }
  };

  const fetchPlanDetails = useCallback(async () => {
    if (!cropPlanId) return;

    setError(null);
    setLoading(true);
    try {
      const response = await authenticatedFetch(`/crop-plans/${cropPlanId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const fetchedPlan: CropPlan = data.data;
          setCropPlan(fetchedPlan);
          
          // Populate edit form states
          setEditCropName(fetchedPlan.cropName);
          setEditDistrictName(fetchedPlan.districtName);
          setEditArea(fetchedPlan.actualAreaPlantedHa.toString());
          setEditPlantingDate(new Date(fetchedPlan.plantingDate));
          setEditStatus(fetchedPlan.status);

          // Fetch tracker estimates
          const estimatesResponse = await authenticatedFetch(
            `/tracker/estimates?crop_name=${fetchedPlan.cropName}&actual_area_planted_ha=${fetchedPlan.actualAreaPlantedHa}&planting_date=${fetchedPlan.plantingDate}&district_name=${fetchedPlan.districtName}`
          );
          if (estimatesResponse.ok) {
            const estimatesData = await estimatesResponse.json();
            if (estimatesData.success) {
              setEstimates(estimatesData.data);
            } else {
              setEstimates(null);
              console.error('Failed to fetch estimates:', estimatesData.message);
            }
          } else {
            setEstimates(null);
            console.error('Failed to fetch estimates:', estimatesResponse.status);
          }

        } else {
          setError(data.message || t('cropPlan.fetchDetailError'));
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || t('cropPlan.fetchDetailError'));
      }
    } catch (err) {
      console.error('Error fetching plan details:', err);
      setError(t('common.networkError'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [cropPlanId, authenticatedFetch, t]);

  useFocusEffect(
    useCallback(() => {
      fetchPlanDetails();
    }, [fetchPlanDetails])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPlanDetails();
  }, [fetchPlanDetails]);

  const handleUpdate = useCallback(async () => {
    setError(null);
    setSaving(true);
    
    const parsedArea = parseFloat(editArea);

    if (!editCropName || !editDistrictName || isNaN(parsedArea) || parsedArea <= 0 || !editPlantingDate || !editStatus) {
      Alert.alert(t('common.error'), t('cropPlan.formValidationError'));
      setSaving(false);
      return;
    }

    try {
      const response = await authenticatedFetch(`/crop-plans/${cropPlanId}`, {
        method: 'PUT',
        body: JSON.stringify({
          cropName: editCropName,
          districtName: editDistrictName,
          actualAreaPlantedHa: parsedArea,
          plantingDate: editPlantingDate.toISOString().split('T')[0],
          status: editStatus,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          Alert.alert(t('common.success'), t('cropPlan.updateSuccess'));
          setIsEditMode(false);
          fetchPlanDetails(); // Re-fetch to get updated estimates
        } else {
          setError(data.message || t('cropPlan.updateError'));
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || t('cropPlan.updateError'));
      }
    } catch (err) {
      console.error('Update crop plan error:', err);
      setError(t('common.networkError'));
    } finally {
      setSaving(false);
    }
  }, [cropPlanId, editCropName, editDistrictName, editArea, editPlantingDate, editStatus, authenticatedFetch, fetchPlanDetails, t]);

  const handleDelete = useCallback(() => {
    Alert.alert(
      t('cropPlan.confirmDeleteTitle'),
      t('cropPlan.confirmDeleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: async () => {
          setDeleting(true);
          try {
            const response = await authenticatedFetch(`/crop-plans/${cropPlanId}`, {
              method: 'DELETE',
            });
            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                Alert.alert(t('common.success'), t('cropPlan.deleteSuccess'));
                navigation.goBack(); // Go back to the list
              } else {
                setError(data.message || t('cropPlan.deleteError'));
              }
            } else {
              const errorData = await response.json();
              setError(errorData.message || t('cropPlan.deleteError'));
            }
          } catch (err) {
            console.error('Delete crop plan error:', err);
            setError(t('common.networkError'));
          } finally {
            setDeleting(false);
          }
        }},
      ]
    );
  }, [cropPlanId, authenticatedFetch, navigation, t]);

  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirmDate = (date: Date) => {
    setEditPlantingDate(date);
    hideDatePicker();
  };

  if (loading) {
    return (
      <Container>
        <CustomHeader title={t('cropPlan.detailTitle')} showBack={true} />
        <LoadingContainer>
          <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
          <Text style={{ color: defaultTheme.colors.text, marginTop: defaultTheme.spacing.medium }}>
            {t('common.loading')}
          </Text>
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <CustomHeader title={t('cropPlan.detailTitle')} showBack={true} />
        <LoadingContainer>
          <ErrorText>{error}</ErrorText>
        </LoadingContainer>
      </Container>
    );
  }

  if (!cropPlan) {
    return (
      <Container>
        <CustomHeader title={t('cropPlan.detailTitle')} showBack={true} />
        <LoadingContainer>
          <ErrorText>{t('cropPlan.planNotFound')}</ErrorText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <CustomHeader title={t('cropPlan.detailTitle')} showBack={true} />
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
            <DetailTitle>{cropPlan.cropName}</DetailTitle>
            <DetailStatus statusColor={getStatusColor(cropPlan.status)}>
              {t(`tracker.status${cropPlan.status}` || cropPlan.status)}
            </DetailStatus>
          </DetailHeader>

          {isEditMode ? (
            <View>
               <Label>{t('cropPlan.cropNameLabel')}</Label>
              <PickerContainer>
                <StyledPicker
                  selectedValue={editCropName}
                  onValueChange={(itemValue: unknown, itemIndex: number) => setEditCropName(itemValue as string)}
                  enabled={!saving}
                >
                  {MVP_CROPS.map((crop) => (
                    <Picker.Item key={crop.value} label={crop.label} value={crop.value} />
                  ))}
                </StyledPicker>
              </PickerContainer>

              <Label>{t('cropPlan.districtNameLabel')}</Label>
              <PickerContainer>
                <StyledPicker
                  selectedValue={editDistrictName}
                  onValueChange={(itemValue: unknown, itemIndex: number) => setEditDistrictName(itemValue as string)}
                  enabled={!saving}
                >
                  {RWANDA_DISTRICTS.map((district) => (
                    <Picker.Item key={district.value} label={district.label} value={district.value} />
                  ))}
                </StyledPicker>
              </PickerContainer>

              <Label>{t('cropPlan.areaPlantedLabel')}</Label>
              <Input
                placeholder={t('cropPlan.areaPlantedPlaceholder')}
                keyboardType="numeric"
                value={editArea}
                onChangeText={setEditArea}
                placeholderTextColor={defaultTheme.colors.placeholder}
                editable={!saving}
              />

              <Label>{t('cropPlan.plantingDateLabel')}</Label>
              <DatePickerButton onPress={showDatePicker} disabled={saving}>
                <DatePickerButtonText isPlaceholder={!editPlantingDate}>
                  {editPlantingDate ? editPlantingDate.toLocaleDateString() : (t('cropPlan.selectDatePlaceholder'))}
                </DatePickerButtonText>
                <Ionicons name="calendar-outline" size={defaultTheme.fontSizes.large} color={defaultTheme.colors.text} />
              </DatePickerButton>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
                date={editPlantingDate || new Date()}
                locale={t('common.locale')}
              />

              <Label>{t('cropPlan.statusLabel')}</Label>
              <PickerContainer>
                <StyledPicker
                  selectedValue={editStatus}
                  onValueChange={(itemValue: unknown, itemIndex: number) => setEditStatus(itemValue as string)}
                  enabled={!saving}
                >
                  {['Planted', 'Harvested', 'Planned', 'Cancelled'].map(s => (
                    <Picker.Item key={s} label={t(`tracker.status${s}`) || s} value={s} />
                  ))}
                </StyledPicker>
              </PickerContainer>

            </View>
          ) : (
            <>
              <DetailItem>
                <DetailLabel>{t('cropPlan.districtNameLabel')}</DetailLabel>
                <DetailValue>{cropPlan.districtName}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{t('cropPlan.areaPlantedLabel')}</DetailLabel>
                <DetailValue>{cropPlan.actualAreaPlantedHa?.toFixed(2)} {t('market.haUnit')}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{t('cropPlan.plantingDateLabel')}</DetailLabel>
                <DetailValue>{cropPlan.plantingDate}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{t('cropPlan.estimatedHarvestDate')}</DetailLabel>
                <DetailValue>{cropPlan.estimatedHarvestDate}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>{t('cropPlan.estimatedYield')}</DetailLabel>
                <DetailValue>{cropPlan.estimatedYieldKgPerHa?.toFixed(2)} {t('market.kgPerHaUnit')}</DetailValue>
              </DetailItem>
              <DetailItem style={{ borderBottomWidth: 0 }}>
                <DetailLabel>{t('cropPlan.estProduction')}</DetailLabel>
                <DetailValue>{cropPlan.estimatedTotalProductionKg?.toFixed(0)} {t('market.kgUnit')}</DetailValue>
              </DetailItem>
            </>
          )}

          {isEditMode && (
             <SubmitButton onPress={handleUpdate} disabled={saving}>
             {saving ? (
               <ActivityIndicator color={defaultTheme.colors.lightText} />
             ) : (
               <SubmitButtonText>{t('common.submit')}</SubmitButtonText>
             )}
           </SubmitButton>
          )}

        </DetailCard>

        {estimates && !isEditMode && (
          <EstimateSection>
            <EstimateTitle>{t('cropPlan.liveEstimatesTitle')}</EstimateTitle>
            <DetailItem>
                <DetailLabel>{t('cropPlan.estimatedPrice')}</DetailLabel>
                <DetailValue>{estimates.Estimated_Price_Per_Kg_Rwf?.toLocaleString()} Rwf/{t('market.kgUnit')}</DetailValue>
              </DetailItem>
              <DetailItem style={{ borderBottomWidth: 0 }}>
                <DetailLabel>{t('cropPlan.estimatedRevenue')}</DetailLabel>
                <DetailValue>{estimates.Estimated_Revenue_Rwf?.toLocaleString()} Rwf</DetailValue>
              </DetailItem>
          </EstimateSection>
        )}

        <ActionButtonsContainer>
          {!isEditMode && (
            <ActionButton bgColor={defaultTheme.colors.primary} onPress={() => setIsEditMode(true)}>
              <Ionicons name="create-outline" size={defaultTheme.fontSizes.large} color={defaultTheme.colors.lightText} />
              <ActionButtonText>{t('common.edit')}</ActionButtonText>
            </ActionButton>
          )}
          {isEditMode && (
            <ActionButton bgColor={defaultTheme.colors.error} onPress={() => setIsEditMode(false)}>
              <Ionicons name="close-circle-outline" size={defaultTheme.fontSizes.large} color={defaultTheme.colors.lightText} />
              <ActionButtonText>{t('common.cancel')}</ActionButtonText>
            </ActionButton>
          )}
          <ActionButton bgColor={defaultTheme.colors.error} onPress={handleDelete} disabled={deleting}>
            {deleting ? (
              <ActivityIndicator color={defaultTheme.colors.lightText} />
            ) : (
              <>
                <Ionicons name="trash-outline" size={defaultTheme.fontSizes.large} color={defaultTheme.colors.lightText} />
                <ActionButtonText>{t('common.delete')}</ActionButtonText>
              </>
            )}
          </ActionButton>
        </ActionButtonsContainer>

      </ContentArea>
    </Container>
  );
};

export default CropPlanDetailScreen;