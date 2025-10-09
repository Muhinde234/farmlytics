// src/screens/Admin/ReferenceDataManagementScreen.tsx

import React, { useState, useCallback } from 'react';
import styled from 'styled-components/native';
import { Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext'; 
import CustomHeader from '../../components/CustomHeader';
import { defaultTheme } from '../../config/theme';
import { Ionicons } from '@expo/vector-icons';
import { AdminTabNavigationProp } from '../../navigation/types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

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

const DataListItem = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: ${defaultTheme.spacing.small}px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const DataListLabel = styled(Text)`
  font-size: ${defaultTheme.fontSizes.medium}px;
  color: ${defaultTheme.colors.text};
  font-weight: 600;
`;

const DataListValue = styled(Text)`
  font-size: ${defaultTheme.fontSizes.medium}px;
  color: ${defaultTheme.colors.primary};
  font-weight: normal;
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


const ReferenceDataManagementScreen: React.FC = () => {
  const { t } = useTranslation();
  const { authenticatedFetch, isLoading: authLoading } = useAuth(); 
  const navigation = useNavigation<AdminTabNavigationProp<'ReferenceDataManagementTab'>>();

  const [districtsData, setDistrictsData] = useState<any[]>([]);
  const [provincesData, setProvincesData] = useState<any[]>([]);
  const [cropsData, setCropsData] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [errorData, setErrorData] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReferenceData = useCallback(async () => {
    setLoadingData(true);
    setErrorData(null);
    try {
      const [districtsRes, provincesRes, cropsRes] = await Promise.all([
        authenticatedFetch('/districts'),
        authenticatedFetch('/provinces'),
        authenticatedFetch('/crops/list'),
      ]);

      // Parse each response safely
      const [districtsJson, provincesJson, cropsJson] = await Promise.all([
        districtsRes.ok ? districtsRes.json() : Promise.reject(new Error(String(districtsRes.status))),
        provincesRes.ok ? provincesRes.json() : Promise.reject(new Error(String(provincesRes.status))),
        cropsRes.ok ? cropsRes.json() : Promise.reject(new Error(String(cropsRes.status))),
      ]);
      
      if (districtsJson.success) setDistrictsData(districtsJson.data);
      else console.error('Failed to fetch districts:', String(districtsJson.message || t('admin.loadReferenceDataError')));

      if (provincesJson.success) setProvincesData(provincesJson.data);
      else console.error('Failed to fetch provinces:', String(provincesJson.message || t('admin.loadReferenceDataError')));

      if (cropsJson.success) setCropsData(cropsJson.data);
      else console.error('Failed to fetch crops:', String(cropsJson.message || t('admin.loadReferenceDataError')));

    } catch (err: unknown) {
      console.error('Error fetching reference data (catch block):', err);
      setErrorData(String(t('admin.loadReferenceDataError') || 'Failed to load reference data.'));
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

  if (authLoading) { // Use authLoading for initial overall app loading
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
          <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
        ) : errorData ? (
          <ErrorText>{errorData}</ErrorText>
        ) : (
          <View>
            <SectionTitle>{String(t('admin.districtsListTitle') || 'Districts')}</SectionTitle>
            {districtsData.length > 0 ? (
              <DataListCard>
                {districtsData.map((item, index) => (
                  <DataListItem key={String(item._id)} style={index === districtsData.length - 1 ? { borderBottomWidth: 0 } : {}}>
                    <DataListLabel>{String(item.name)}</DataListLabel>
                    <DataListValue>{String(item.province)}</DataListValue>
                  </DataListItem>
                ))}
              </DataListCard>
            ) : (
              <EmptyStateText>{String(t('admin.noDistrictsFound') || 'No districts found.')}</EmptyStateText>
            )}

            <SectionTitle>{String(t('admin.provincesListTitle') || 'Provinces')}</SectionTitle>
            {provincesData.length > 0 ? (
              <DataListCard>
                {provincesData.map((item, index) => (
                  <DataListItem key={String(item._id)} style={index === provincesData.length - 1 ? { borderBottomWidth: 0 } : {}}>
                    <DataListLabel>{String(item.name)}</DataListLabel>
                    <DataListValue>{String(item.districts?.length || 0)} {String(t('admin.totalDistricts') || 'districts')}</DataListValue>
                  </DataListItem>
                ))}
              </DataListCard>
            ) : (
              <EmptyStateText>{String(t('admin.noProvincesFound') || 'No provinces found.')}</EmptyStateText>
            )}

            <SectionTitle>{String(t('admin.cropsListTitle') || 'Crops')}</SectionTitle>
            {cropsData.length > 0 ? (
              <DataListCard>
                {cropsData.map((item, index) => (
                  <DataListItem key={String(item._id)} style={index === cropsData.length - 1 ? { borderBottomWidth: 0 } : {}}>
                    <DataListLabel>{String(item.name)}</DataListLabel>
                    <DataListValue>{String(item.category || 'N/A')}</DataListValue>
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