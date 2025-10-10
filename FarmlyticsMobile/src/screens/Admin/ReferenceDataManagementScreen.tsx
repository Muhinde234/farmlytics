// src/screens/Admin/ReferenceDataManagementScreen.tsx

import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components/native';
import { Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Alert, RefreshControl, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import CustomHeader from '../../components/CustomHeader';
import { defaultTheme } from '../../config/theme';
import { Ionicons } from '@expo/vector-icons';
import { AdminTabNavigationProp } from '../../navigation/types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// --- Specific Interfaces for API Data ---
// These interfaces define the FULL structure of data returned by your API.
// Even if we don't display all properties, we still fetch them for filtering etc.
interface DistrictApiItem {
  _id: string;
  name?: string;
  province?: string; // Still useful for searching, even if not displayed
}

interface ProvinceApiItem {
  _id: string;
  name?: string;
  districts?: string[]; // Still useful for searching/internal logic, even if not displayed
}

interface CropApiItem {
  _id: string;
  name?: string;
  category?: string; // Still useful for searching, even if not displayed
}
// --- End Specific Interfaces ---


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
  margin-bottom: ${defaultTheme.spacing.medium}px;
  padding-left: ${defaultTheme.spacing.tiny}px;
`;

const DataListCard = styled(View)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  padding: ${props => props.theme.spacing.medium}px;
  margin-bottom: ${props => props.theme.spacing.large}px;
  elevation: 3;
  shadow-color: '#000';
  shadow-offset: 0px 2px;
  shadow-opacity: 0.18;
  shadow-radius: 3px;
`;

// Modified DataListItem for single label display
const DataListItem = styled(View)`
  flex-direction: row;
  justify-content: space-between; /* To push actions to the right */
  align-items: center;
  padding-vertical: ${defaultTheme.spacing.small}px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const DataListLabel = styled(Text)`
  font-size: ${defaultTheme.fontSizes.medium}px;
  color: ${defaultTheme.colors.text};
  font-weight: 600;
  flex: 1; /* Allow label to take available space */
  margin-right: ${defaultTheme.spacing.small}px; /* Space from actions */
`;

// DataListValue is no longer needed for display in this simplified version
// const DataListValue = styled(Text)`
//   font-size: ${defaultTheme.fontSizes.medium}px;
//   color: ${defaultTheme.colors.primary};
//   font-weight: normal;
// `;

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
margin-top: ${props => defaultTheme.spacing.large}px;
`;

const SearchInput = styled(TextInput).attrs(props => ({
  placeholderTextColor: props.theme.colors.placeholder,
}))`
  background-color: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  border-radius: ${defaultTheme.borderRadius.small}px;
  padding: ${defaultTheme.spacing.small}px;
  margin-bottom: ${defaultTheme.spacing.medium}px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  margin-horizontal: ${defaultTheme.spacing.tiny}px;
`;

const SectionActions = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: ${defaultTheme.spacing.medium}px;
  padding-horizontal: ${defaultTheme.spacing.tiny}px;
`;

const AddButton = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.success};
  padding: ${defaultTheme.spacing.small}px ${defaultTheme.spacing.medium}px;
  border-radius: ${defaultTheme.borderRadius.medium}px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

const AddButtonText = styled(Text)`
  color: ${props => props.theme.colors.lightText};
  font-weight: bold;
  margin-left: ${defaultTheme.spacing.tiny}px;
`;

const ItemActions = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: ${defaultTheme.spacing.small}px;
`;

const ActionButton = styled(TouchableOpacity)`
  padding: ${defaultTheme.spacing.tiny}px;
  border-radius: ${defaultTheme.borderRadius.small}px;
  background-color: ${props => props.theme.colors.primary + '1A'};
`;

const DeleteButton = styled(TouchableOpacity)`
  padding: ${defaultTheme.spacing.tiny}px;
  border-radius: ${defaultTheme.borderRadius.small}px;
  background-color: ${props => props.theme.colors.error + '1A'};
`;


const ReferenceDataManagementScreen: React.FC = () => {
  const { t } = useTranslation();
  const { authenticatedFetch, isLoading: authLoading } = useAuth();
  const navigation = useNavigation<AdminTabNavigationProp<'ReferenceDataManagementTab'>>();

  // State for fetched reference data (using specific types)
  const [districtsData, setDistrictsData] = useState<DistrictApiItem[]>([]);
  const [provincesData, setProvincesData] = useState<ProvinceApiItem[]>([]);
  const [cropsData, setCropsData] = useState<CropApiItem[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [errorData, setErrorData] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // State for search queries
  const [districtSearch, setDistrictSearch] = useState('');
  const [provinceSearch, setProvinceSearch] = useState('');
  const [cropSearch, setCropSearch] = useState('');

  // --- CUD Placeholder Handlers ---
  const handleAddItem = useCallback((type: string) => {
    Alert.alert(
      String(t('common.addFeatureTitle') || 'Add Item'),
      String(t('common.addFeatureMessage', { type: type }) || `Functionality to add a new ${type} will be implemented here. Backend API for this action is required.`)
    );
  }, [t]);

  // Updated handleEditItem to handle item.name potentially being undefined
  const handleEditItem = useCallback((type: string, item: { name?: string, _id: string }) => {
    const itemName = item.name || ''; // Use empty string if name is undefined
    Alert.alert(
      String(t('common.editFeatureTitle') || 'Edit Item'),
      String(t('common.editFeatureMessage', { type: type, name: itemName }) || `Functionality to edit ${itemName} (${type}) will be implemented here. Backend API for this action is required.`)
    );
  }, [t]);

  // Updated handleDeleteItem to handle itemName potentially being undefined
  const handleDeleteItem = useCallback((type: string, itemId: string, itemName: string | undefined) => {
    const displayItemName = itemName || ''; // Use empty string if itemName is undefined
    Alert.alert(
      String(t('common.deleteConfirmTitle') || 'Confirm Deletion'),
      String(t('common.deleteConfirmMessage', { name: displayItemName, type: type }) || `Are you sure you want to delete ${displayItemName} (${type})? This action cannot be undone.`),
      [
        {
          text: String(t('common.cancel') || 'Cancel'),
          style: 'cancel',
        },
        {
          text: String(t('common.delete') || 'Delete'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              String(t('common.deleteFeatureTitle') || 'Delete Item'),
              String(t('common.deleteFeatureMessage', { type: type, name: displayItemName }) || `Functionality to delete ${displayItemName} (${type}) will be implemented here. Backend API for this action is required.`)
            );
          },
        },
      ]
    );
  }, [t]);
  // --- End CUD Placeholder Handlers ---


  const fetchReferenceData = useCallback(async () => {
    setLoadingData(true);
    setErrorData(null);
    try {
      const [districtsRes, provincesRes, cropsRes] = await Promise.all([
        authenticatedFetch('/districts'),
        authenticatedFetch('/provinces'),
        authenticatedFetch('/crops/list'),
      ]);

      const [districtsJson, provincesJson, cropsJson] = await Promise.all([
        districtsRes.ok ? districtsRes.json() : Promise.reject(new Error(`${districtsRes.status}: ${await districtsRes.text()}`)),
        provincesRes.ok ? provincesRes.json() : Promise.reject(new Error(`${provincesRes.status}: ${await provincesRes.text()}`)),
        cropsRes.ok ? cropsRes.json() : Promise.reject(new Error(`${cropsRes.status}: ${await cropsRes.text()}`)),
      ]);

      if (districtsJson.success && Array.isArray(districtsJson.data)) {
        setDistrictsData(districtsJson.data);
      } else {
        console.error('Failed to fetch districts:', districtsJson.message || 'Data format error');
        setDistrictsData([]);
      }

      if (provincesJson.success && Array.isArray(provincesJson.data)) {
        setProvincesData(provincesJson.data);
      } else {
        console.error('Failed to fetch provinces:', provincesJson.message || 'Data format error');
        setProvincesData([]);
      }

      if (cropsJson.success && Array.isArray(cropsJson.data)) {
        setCropsData(cropsJson.data);
      } else {
        console.error('Failed to fetch crops:', cropsJson.message || 'Data format error');
        setCropsData([]);
      }

    } catch (err: unknown) {
      console.error('Error fetching reference data (catch block):', err);
      if (err instanceof Error) {
        setErrorData(String(t('admin.loadReferenceDataError') || 'Failed to load reference data.') + ` (${err.message})`);
      } else {
        setErrorData(String(t('admin.loadReferenceDataError') || 'Failed to load reference data.'));
      }
      setDistrictsData([]);
      setProvincesData([]);
      setCropsData([]);
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  }, [authenticatedFetch, t]);

  useFocusEffect(
    useCallback(() => {
      fetchReferenceData();
    }, [fetchReferenceData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchReferenceData();
  }, [fetchReferenceData]);


  // --- Filtered Data Logic (using useMemo for optimization) ---
  const filteredDistricts = useMemo(() => {
    return districtsData.filter(district => {
      // Still allow filtering by province even if not displayed
      const name = district.name?.toLowerCase() || '';
      const province = district.province?.toLowerCase() || '';
      const searchLower = districtSearch.toLowerCase();
      return name.includes(searchLower) || province.includes(searchLower);
    });
  }, [districtsData, districtSearch]);

  const filteredProvinces = useMemo(() => {
    return provincesData.filter(province => {
      const name = province.name?.toLowerCase() || '';
      const searchLower = provinceSearch.toLowerCase();
      return name.includes(searchLower);
    });
  }, [provincesData, provinceSearch]);

  const filteredCrops = useMemo(() => {
    return cropsData.filter(crop => {
      // Still allow filtering by category even if not displayed
      const name = crop.name?.toLowerCase() || '';
      const category = crop.category?.toLowerCase() || '';
      const searchLower = cropSearch.toLowerCase();
      return name.includes(searchLower) || category.includes(searchLower);
    });
  }, [cropsData, cropSearch]);
  // --- End Filtered Data Logic ---


  if (authLoading) {
    return (
      <Container>
        <CustomHeader title={String(t('admin.referenceDataTab'))} showLogo={true} showLanguageSwitcher={true} />
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
      <CustomHeader title={String(t('admin.referenceDataTab'))} showBack={false} showLogo={true} showLanguageSwitcher={true} />
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
        {loadingData ? (
          <ActivityIndicator size="large" color={defaultTheme.colors.primary} style={{ marginTop: defaultTheme.spacing.large }}/>
        ) : errorData ? (
          <ErrorText>{errorData}</ErrorText>
        ) : (
          <View>
            {/* Districts Section */}
            <SectionTitle>{String(t('admin.districtsListTitle') || 'Districts')}</SectionTitle>
            <SectionActions>
                <AddButton onPress={() => handleAddItem(String(t('admin.district') || 'district'))}>
                    <Ionicons name="add-circle-outline" size={18} color={defaultTheme.colors.lightText} />
                    <AddButtonText>{String(t('common.addNew') || 'Add New')}</AddButtonText>
                </AddButton>
            </SectionActions>
            <SearchInput
              placeholder={String(t('common.searchDistricts') || 'Search districts by name or province...')}
              value={districtSearch}
              onChangeText={setDistrictSearch}
            />
            {filteredDistricts.length > 0 ? (
              <DataListCard>
                {filteredDistricts.map((item, index) => (
                  <DataListItem key={String(item._id)} style={index === filteredDistricts.length - 1 ? { borderBottomWidth: 0 } : {}}>
                    {/* Display only the district name, defaulting to empty string if undefined */}
                    <DataListLabel>{String(item.name || '')}</DataListLabel>
                    <ItemActions>
                        <ActionButton onPress={() => handleEditItem(String(t('admin.district') || 'district'), item)}>
                            <Ionicons name="create-outline" size={20} color={defaultTheme.colors.primary} />
                        </ActionButton>
                        <DeleteButton onPress={() => handleDeleteItem(String(t('admin.district') || 'district'), item._id, item.name)}>
                            <Ionicons name="trash-outline" size={20} color={defaultTheme.colors.error} />
                        </DeleteButton>
                    </ItemActions>
                  </DataListItem>
                ))}
              </DataListCard>
            ) : (
              <EmptyStateText>{String(t('admin.noDistrictsFound') || 'No districts found.')}</EmptyStateText>
            )}

            {/* Provinces Section */}
            <SectionTitle>{String(t('admin.provincesListTitle') || 'Provinces')}</SectionTitle>
            <SectionActions>
                <AddButton onPress={() => handleAddItem(String(t('admin.province') || 'province'))}>
                    <Ionicons name="add-circle-outline" size={18} color={defaultTheme.colors.lightText} />
                    <AddButtonText>{String(t('common.addNew') || 'Add New')}</AddButtonText>
                </AddButton>
            </SectionActions>
            <SearchInput
              placeholder={String(t('common.searchProvinces') || 'Search provinces by name...')}
              value={provinceSearch}
              onChangeText={setProvinceSearch}
            />
            {filteredProvinces.length > 0 ? (
              <DataListCard>
                {filteredProvinces.map((item, index) => (
                  <DataListItem key={String(item._id)} style={index === filteredProvinces.length - 1 ? { borderBottomWidth: 0 } : {}}>
                    {/* Display only the province name, defaulting to empty string if undefined */}
                    <DataListLabel>{String(item.name || '')}</DataListLabel>
                     <ItemActions>
                        <ActionButton onPress={() => handleEditItem(String(t('admin.province') || 'province'), item)}>
                            <Ionicons name="create-outline" size={20} color={defaultTheme.colors.primary} />
                        </ActionButton>
                        <DeleteButton onPress={() => handleDeleteItem(String(t('admin.province') || 'province'), item._id, item.name)}>
                            <Ionicons name="trash-outline" size={20} color={defaultTheme.colors.error} />
                        </DeleteButton>
                    </ItemActions>
                  </DataListItem>
                ))}
              </DataListCard>
            ) : (
              <EmptyStateText>{String(t('admin.noProvincesFound') || 'No provinces found.')}</EmptyStateText>
            )}

            {/* Crops Section */}
            <SectionTitle>{String(t('admin.cropsListTitle') || 'Crops')}</SectionTitle>
            <SectionActions>
                <AddButton onPress={() => handleAddItem(String(t('admin.crop') || 'crop'))}>
                    <Ionicons name="add-circle-outline" size={18} color={defaultTheme.colors.lightText} />
                    <AddButtonText>{String(t('common.addNew') || 'Add New')}</AddButtonText>
                </AddButton>
            </SectionActions>
            <SearchInput
              placeholder={String(t('common.searchCrops') || 'Search crops by name or category...')}
              value={cropSearch}
              onChangeText={setCropSearch}
            />
            {filteredCrops.length > 0 ? (
              <DataListCard>
                {filteredCrops.map((item, index) => (
                  <DataListItem key={String(item._id)} style={index === filteredCrops.length - 1 ? { borderBottomWidth: 0 } : {}}>
                    {/* Display only the crop name, defaulting to empty string if undefined */}
                    <DataListLabel>{String(item.name || '')}</DataListLabel>
                    <ItemActions>
                        <ActionButton onPress={() => handleEditItem(String(t('admin.crop') || 'crop'), item)}>
                            <Ionicons name="create-outline" size={20} color={defaultTheme.colors.primary} />
                        </ActionButton>
                        <DeleteButton onPress={() => handleDeleteItem(String(t('admin.crop') || 'crop'), item._id, item.name)}>
                            <Ionicons name="trash-outline" size={20} color={defaultTheme.colors.error} />
                        </DeleteButton>
                    </ItemActions>
                  </DataListItem>
                ))}
              </DataListCard>
            ) : (
              <EmptyStateText>{String(t('admin.noCropsFound') || 'No crops found.')}</EmptyStateText>
            )}
          </View>
        )}
      </ContentArea>
    </Container>
  );
};

export default ReferenceDataManagementScreen;