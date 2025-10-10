

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components/native';
import { Text, View, ActivityIndicator, ScrollView, TouchableOpacity, Alert, RefreshControl, Modal, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth, User } from '../../context/AuthContext';
import CustomHeader from '../../components/CustomHeader';
import { defaultTheme } from '../../config/theme';
import { Ionicons } from '@expo/vector-icons';
import { AdminTabNavigationProp } from '../../navigation/types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';



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
  padding-left: ${defaultTheme.spacing.tiny}px; /* Added for alignment */
`;

const UserCard = styled(View)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  padding: ${props => props.theme.spacing.medium}px;
  margin-bottom: ${props => props.theme.spacing.small}px;
  elevation: 3;
  shadow-color: '#000';
  shadow-offset: 0px 2px;
  shadow-opacity: 0.18;
  shadow-radius: 3px;
`;

const UserCardHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${defaultTheme.spacing.small}px;
`;

const UserName = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  flex: 1;
`;

const UserStatus = styled(Text)<{ isVerified: boolean }>`
  font-size: ${props => props.theme.fontSizes.small}px;
  font-weight: 600;
  color: ${props => props.isVerified ? props.theme.colors.success : props.theme.colors.error};
  background-color: ${props => props.isVerified ? `${props.theme.colors.success}20` : `${props.theme.colors.error}20`};
  padding: ${defaultTheme.spacing.tiny}px ${defaultTheme.spacing.small}px;
  border-radius: ${defaultTheme.borderRadius.small}px;
  text-transform: capitalize; /* Make 'Verified' or 'No' look a bit nicer */
`;

const UserDetail = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${defaultTheme.spacing.tiny}px;
`;

const UserActions = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${defaultTheme.spacing.small}px;
`;

const ActionButton = styled(TouchableOpacity)<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
  border-radius: ${defaultTheme.borderRadius.small}px;
  padding: ${defaultTheme.spacing.small}px ${defaultTheme.spacing.medium}px;
  margin-left: ${defaultTheme.spacing.small}px;
  flex-direction: row;
  align-items: center;
`;

const ActionButtonText = styled(Text)`
  color: ${defaultTheme.colors.lightText};
  font-size: ${defaultTheme.fontSizes.small}px;
  font-weight: 600;
  margin-left: ${defaultTheme.spacing.tiny}px;
`;

const EmptyStateContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${defaultTheme.spacing.large}px;
  min-height: 150px; /* Ensure it's visible even on short lists */
`;

const EmptyStateText = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.placeholder};
  text-align: center;
  margin-top: ${props => props.theme.spacing.medium}px;
`;

const ErrorText = styled(Text)`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSizes.medium}px;
  text-align: center;
  margin-top: ${props => props.theme.spacing.medium}px;
  padding: 0 ${defaultTheme.spacing.medium}px; /* Added padding */
`;

// Modal Styled Components
const ModalOverlay = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
`;

const ModalContent = styled(View)`
  background-color: ${defaultTheme.colors.cardBackground};
  border-radius: ${defaultTheme.borderRadius.large}px;
  padding: ${defaultTheme.spacing.large}px;
  width: 90%;
  max-width: 400px;
  elevation: 10;
  shadow-color: '#000';
  shadow-offset: 0px 5px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
`;

const ModalTitle = styled(Text)`
  font-size: ${defaultTheme.fontSizes.xl}px;
  font-weight: bold;
  color: ${defaultTheme.colors.primary};
  margin-bottom: ${defaultTheme.spacing.large}px;
  text-align: center;
`;

const Label = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.small}px;
  font-weight: 600;
`;

const Input = styled(TextInput)`
  width: 100%;
  padding: ${defaultTheme.spacing.medium + 2}px;
  margin-bottom: ${defaultTheme.spacing.medium}px;
  border-width: 1px;
  border-color: ${defaultTheme.colors.border};
  border-radius: ${defaultTheme.borderRadius.medium}px;
  background-color: ${defaultTheme.colors.background};
  color: ${defaultTheme.colors.text};
  font-size: ${defaultTheme.fontSizes.medium}px;
`;

const PickerContainer = styled(View)`
  width: 100%;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  background-color: ${props => props.theme.colors.background};
  margin-bottom: ${props => props.theme.spacing.large}px; /* FIX 1: Accessing spacing via theme */
  overflow: hidden;
`;

const StyledPicker = styled(Picker)`
  width: 100%;
  color: ${props => props.theme.colors.text};
  height: 50px;
`;

const ModalActionButtons = styled(View)`
  flex-direction: row;
  justify-content: space-around;
  margin-top: ${defaultTheme.spacing.large}px;
`;

const ModalButton = styled(TouchableOpacity)<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
  border-radius: ${defaultTheme.borderRadius.pill}px;
  padding: ${defaultTheme.spacing.medium}px ${defaultTheme.spacing.large}px;
  align-items: center;
  justify-content: center;
  min-width: 100px;
`;

const ModalButtonText = styled(Text)`
  color: ${defaultTheme.colors.lightText};
  font-size: ${defaultTheme.fontSizes.medium}px;
  font-weight: bold;
`;


// ---------------------- Component Logic ----------------------
const UserManagementScreen: React.FC = () => {
  const { t } = useTranslation();
  // Fetching reference data (districts, provinces) for potential future use in modal if needed
  const { authenticatedFetch, isLoading: authLoading, districts, provinces, areReferenceDataLoading } = useAuth();
  const navigation = useNavigation<AdminTabNavigationProp<'UserManagementTab'>>();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'farmer' | 'buyer'>('farmer');
  const [editIsVerified, setEditIsVerified] = useState<boolean>(false);
  // States for preferred location/language
  const [editPreferredDistrict, setEditPreferredDistrict] = useState('');
  const [editPreferredProvince, setEditPreferredProvince] = useState('');
  const [editPreferredLanguage, setEditPreferredLanguage] = useState('');
  const [isSavingUser, setIsSavingUser] = useState(false);


  const fetchUsers = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await authenticatedFetch('/admin/users');
    
      const data = await response.json();

      if (response.ok && data.success) {
        setUsers(data.data);
      } else {
       
        setError(String(data.error || data.message || t('admin.loadUsersError')));
      }
    } catch (err: unknown) {
      console.error('Error fetching users (catch block):', err);
      setError(String(t('common.networkError')));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [authenticatedFetch, t]);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [fetchUsers])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers();
  }, [fetchUsers]);

  const handleEditUser = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setEditName(userToEdit.name);
    setEditEmail(userToEdit.email);
    setEditRole(userToEdit.role);
    setEditIsVerified(userToEdit.isVerified);
    setEditPreferredDistrict(userToEdit.preferredDistrictName || '');
    setEditPreferredProvince(userToEdit.preferredProvinceName || '');
    setEditPreferredLanguage(userToEdit.preferredLanguage || '');
    setIsEditModalVisible(true);
  };

  const handleSaveUser = useCallback(async () => {
    if (!editingUser) return;

    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert(String(t('common.error')), String(t('common.formValidationError')));
      return;
    }

    setIsSavingUser(true);
    setError(null); 

    try {
      const response = await authenticatedFetch(`/admin/users/${editingUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          role: editRole,
          isVerified: editIsVerified,
          preferredDistrictName: editPreferredDistrict,
          preferredProvinceName: editPreferredProvince,
          preferredLanguage: editPreferredLanguage,
        }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert(String(t('common.success')), String(t('admin.userUpdateSuccess')));
        setIsEditModalVisible(false);
        fetchUsers(); 
      } else {
        const errorMessage = String(data.error || data.message || t('admin.userUpdateError'));
        setError(errorMessage);
        Alert.alert(String(t('common.error')), errorMessage);
      }
    } catch (err: unknown) {
      console.error('Error saving user (catch block):', err);
      const networkError = String(t('common.networkError'));
      setError(networkError);
      Alert.alert(String(t('common.error')), networkError);
    } finally {
      setIsSavingUser(false);
    }
  }, [
    editingUser, editName, editEmail, editRole, editIsVerified,
    editPreferredDistrict, editPreferredProvince, editPreferredLanguage,
    authenticatedFetch, fetchUsers, t
  ]);


  const handleDeleteUser = useCallback((userId: string) => {
    Alert.alert(
      String(t('admin.deleteUserConfirmTitle')),
      String(t('admin.deleteUserConfirmMessage')),
      [
        { text: String(t('common.cancel')), style: 'cancel' },
        { text: String(t('common.delete')), style: 'destructive', onPress: async () => {
          setLoading(true); // General loading for the screen while deleting
          try {
            const response = await authenticatedFetch(`/admin/users/${userId}`, {
              method: 'DELETE',
            });
            const data = await response.json();

            if (response.ok && data.success) {
              Alert.alert(String(t('common.success')), String(t('admin.deleteUserSuccess')));
              fetchUsers(); // Refresh list
            } else {
              const errorMessage = String(data.error || data.message || t('admin.deleteUserError'));
              setError(errorMessage);
              Alert.alert(String(t('common.error')), errorMessage);
            }
          } catch (err: unknown) {
            console.error('Error deleting user (catch block):', err);
            const networkError = String(t('common.networkError'));
            setError(networkError);
            Alert.alert(String(t('common.error')), networkError);
          } finally {
            setLoading(false);
          }
        }},
      ]
    );
  }, [authenticatedFetch, fetchUsers, t]);


  if (authLoading) { 
    return (
      <Container>
        <CustomHeader title={String(t('admin.userManagement'))} showLogo={true} showLanguageSwitcher={true} />
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
      <CustomHeader title={String(t('admin.userManagement'))} showBack={true} showLogo={true} showLanguageSwitcher={true} />
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
        <SectionTitle>{String(t('admin.userListTitle'))}</SectionTitle>

        {loading ? (
          <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
        ) : error ? (
          <ErrorText>{error}</ErrorText>
        ) : users.length > 0 ? (
          users.map(userItem => (
            <UserCard key={String(userItem.id)}>
              <UserCardHeader>
                <UserName>{String(userItem.name)}</UserName>
                <UserStatus isVerified={userItem.isVerified}>
                  {String(userItem.isVerified ? t('admin.userIsVerified') : t('common.no'))}
                </UserStatus>
              </UserCardHeader>
              <UserDetail>{String(t('admin.userEmail'))}: {String(userItem.email)}</UserDetail>
              <UserDetail>{String(t('admin.userRole'))}: {String(userItem.role)}</UserDetail>
              {userItem.preferredDistrictName && (
                <UserDetail>{String(t('profile.preferredDistrictLabel'))}: {String(userItem.preferredDistrictName)}</UserDetail>
              )}
              {userItem.preferredProvinceName && (
                <UserDetail>{String(t('profile.preferredProvinceLabel'))}: {String(userItem.preferredProvinceName)}</UserDetail>
              )}
              {userItem.preferredLanguage && (
                <UserDetail>{String(t('profile.appLanguageLabel'))}: {String(t(`common.languageName_${userItem.preferredLanguage}`))}</UserDetail>
              )}

              <UserActions>
                <ActionButton bgColor={defaultTheme.colors.primary} onPress={() => handleEditUser(userItem)}>
                  <Ionicons name="create-outline" size={defaultTheme.fontSizes.medium} color={defaultTheme.colors.lightText} />
                  <ActionButtonText>{String(t('common.edit'))}</ActionButtonText>
                </ActionButton>
                <ActionButton bgColor={defaultTheme.colors.error} onPress={() => handleDeleteUser(userItem.id)}>
                  <Ionicons name="trash-outline" size={defaultTheme.fontSizes.medium} color={defaultTheme.colors.lightText} />
                  <ActionButtonText>{String(t('common.delete'))}</ActionButtonText>
                </ActionButton>
              </UserActions>
            </UserCard>
          ))
        ) : (
          <EmptyStateContainer>
            <EmptyStateText>{String(t('admin.noUsersFound'))}</EmptyStateText>
          </EmptyStateContainer>
        )}
      </ContentArea>

      {/* Edit User Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>{String(t('admin.editUserTitle'))}</ModalTitle>

            <Label>{String(t('admin.userNameLabel'))}</Label>
            <Input
              placeholder={String(t('admin.userNameLabel'))}
              value={editName}
              onChangeText={setEditName}
              editable={!isSavingUser}
              placeholderTextColor={defaultTheme.colors.placeholder}
            />

            <Label>{String(t('admin.userEmailLabel'))}</Label>
            <Input
              placeholder={String(t('admin.userEmailLabel'))}
              value={editEmail}
              onChangeText={setEditEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isSavingUser}
              placeholderTextColor={defaultTheme.colors.placeholder}
            />

            <Label>{String(t('admin.userRoleLabel'))}</Label>
            <PickerContainer>
              <StyledPicker
                selectedValue={editRole}
                onValueChange={(itemValue: unknown, itemIndex: number) => setEditRole(itemValue as 'admin' | 'farmer' | 'buyer')} // FIX 2
                enabled={!isSavingUser}
              >
                <Picker.Item key="admin-role" label={String(t('auth.roleAdmin') || 'Admin')} value="admin" />
                <Picker.Item key="farmer-role" label={String(t('auth.roleFarmer'))} value="farmer" />
                <Picker.Item key="buyer-role" label={String(t('auth.roleBuyer'))} value="buyer" />
              </StyledPicker>
            </PickerContainer>

            {/* Verification Status */}
            <Label>{String(t('admin.userIsVerifiedLabel'))}</Label>
            <PickerContainer>
              <StyledPicker
                selectedValue={editIsVerified ? 'true' : 'false'}
                onValueChange={(itemValue: unknown, itemIndex: number) => setEditIsVerified((itemValue as string) === 'true')} // FIX 2
                enabled={!isSavingUser}
              >
                <Picker.Item label={String(t('common.yes'))} value="true" />
                <Picker.Item label={String(t('common.no'))} value="false" />
              </StyledPicker>
            </PickerContainer>

            <Label>{String(t('profile.preferredProvinceLabel'))}</Label>
            <PickerContainer>
              <StyledPicker
                selectedValue={editPreferredProvince}
                onValueChange={(itemValue: unknown, itemIndex: number) => { // FIX 2
                  setEditPreferredProvince(itemValue as string);
                  setEditPreferredDistrict(''); // Reset district when province changes
                }}
                enabled={!isSavingUser && !areReferenceDataLoading}
              >
                <Picker.Item label={String(t('profile.selectProvincePlaceholder') || 'Select Province')} value="" />
                {areReferenceDataLoading ? (
                  <Picker.Item key="loading-provinces" label={String(t('common.loading'))} value="" />
                ) : provinces.length > 0 ? (
                  provinces.map(province => (
                    <Picker.Item key={String(province.value)} label={String(province.label)} value={String(province.value)} />
                  ))
                ) : (
                  <Picker.Item key="no-provinces" label={String(t('profile.noProvincesFound') || "No provinces available")} value="" />
                )}
              </StyledPicker>
            </PickerContainer>

           
            <Label>{String(t('profile.preferredDistrictLabel'))}</Label>
            <PickerContainer>
              <StyledPicker
                selectedValue={editPreferredDistrict}
                onValueChange={(itemValue: unknown, itemIndex: number) => setEditPreferredDistrict(itemValue as string)} // FIX 2
                enabled={!isSavingUser && !areReferenceDataLoading && !!editPreferredProvince} // Disable if no province selected
              >
                <Picker.Item label={String(t('profile.selectDistrictPlaceholder') || 'Select District')} value="" />
                {areReferenceDataLoading ? (
                  <Picker.Item key="loading-districts" label={String(t('common.loading'))} value="" />
                ) : (districts.length > 0 && editPreferredProvince) ? (
                  districts.filter(d => d.province === editPreferredProvince).map(district => ( // FIX 3 relies on ReferenceDataItem update
                    <Picker.Item key={String(district.value)} label={String(district.label)} value={String(district.value)} />
                  ))
                ) : (
                  <Picker.Item key="no-districts" label={String(t('profile.noDistrictsFound') || "No districts available")} value="" />
                )}
              </StyledPicker>
            </PickerContainer>

            {/* Preferred Language Picker */}
            <Label>{String(t('profile.appLanguageLabel'))}</Label>
            <PickerContainer>
              <StyledPicker
                selectedValue={editPreferredLanguage}
                onValueChange={(itemValue: unknown, itemIndex: number) => setEditPreferredLanguage(itemValue as string)} // FIX 2
                enabled={!isSavingUser}
              >
                <Picker.Item label={String(t('profile.selectLanguagePlaceholder') || 'Select Language')} value="" />
                <Picker.Item label={String(t('common.languageName_en'))} value="en" />
                <Picker.Item label={String(t('common.languageName_fr'))} value="fr" />
                <Picker.Item label={String(t('common.languageName_rw'))} value="rw" />
              </StyledPicker>
            </PickerContainer>


            <ModalActionButtons>
              <ModalButton bgColor={defaultTheme.colors.error} onPress={() => setIsEditModalVisible(false)} disabled={isSavingUser}>
                <ModalButtonText>{String(t('common.cancel'))}</ModalButtonText>
              </ModalButton>
              <ModalButton bgColor={defaultTheme.colors.success} onPress={handleSaveUser} disabled={isSavingUser}>
                {isSavingUser ? (
                  <ActivityIndicator color={defaultTheme.colors.lightText} />
                ) : (
                  <ModalButtonText>{String(t('admin.saveUserButton'))}</ModalButtonText>
                )}
              </ModalButton>
            </ModalActionButtons>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
};

export default UserManagementScreen;
