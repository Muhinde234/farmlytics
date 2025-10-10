// src/screens/Main/ProfileScreen.tsx

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components/native';
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../components/CustomHeader';
import { useAuth, User, ReferenceDataItem } from '../../context/AuthContext';
import { defaultTheme } from '../../config/theme';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; 
import i18n from '../../config/i18n'; 
import { useNavigation } from '@react-navigation/native'; 
import { MainTabNavigationProp } from '../../navigation/types'; 



const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ContentArea = styled(ScrollView).attrs({
  contentContainerStyle: {
    padding: defaultTheme.spacing.medium,
    paddingBottom: defaultTheme.spacing.xxl, 
    flexGrow: 1, 
    justifyContent: 'flex-start', 
  },
})`
  flex: 1;
`;

const AppLogo = styled(Image)`
  width: 100px;
  height: 100px;
  align-self: center; 
  margin-top: ${defaultTheme.spacing.medium}px;
  margin-bottom: ${defaultTheme.spacing.large}px;
  resize-mode: contain;
`;

const ProfileCard = styled(View)`
  background-color: ${defaultTheme.colors.cardBackground};
  border-radius: ${defaultTheme.borderRadius.large}px;
  padding: ${defaultTheme.spacing.large}px;
  align-items: center;
  margin-bottom: ${defaultTheme.spacing.xl}px;
  elevation: 5;
  shadow-color: '#000';
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
`;

const ProfileIcon = styled(Ionicons)`
  margin-bottom: ${defaultTheme.spacing.medium}px;
`;

const ProfileName = styled(Text)`
  font-size: ${defaultTheme.fontSizes.xl}px;
  font-weight: bold;
  color: ${defaultTheme.colors.primary};
  margin-bottom: ${defaultTheme.spacing.small}px;
  text-align: center;
`;

const ProfileEmail = styled(Text)`
  font-size: ${defaultTheme.fontSizes.medium}px;
  color: ${defaultTheme.colors.text};
  margin-bottom: ${defaultTheme.spacing.small}px;
  text-align: center;
`;

const ProfileRole = styled(Text)`
  font-size: ${defaultTheme.fontSizes.medium}px;
  color: ${defaultTheme.colors.tertiary};
  font-weight: 600;
  text-align: center;
`;

const SectionTitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-top: ${props => props.theme.spacing.large}px;
  margin-bottom: ${props => props.theme.spacing.medium}px;
`;

const DetailCard = styled(View)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  padding: ${props => props.theme.spacing.large}px;
  margin-bottom: ${props => props.theme.spacing.large}px;
  elevation: 3;
  shadow-color: '#000';
  shadow-offset: 0px 2px;
  shadow-opacity: 0.18;
  shadow-radius: 3px;
`;

const DetailItem = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: ${defaultTheme.spacing.small}px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const InfoLabel = styled(Text)`
  font-size: ${defaultTheme.fontSizes.medium}px;
  color: ${defaultTheme.colors.text};
  font-weight: 600;
`;

const InfoValue = styled(Text)`
  font-size: ${defaultTheme.fontSizes.medium}px;
  color: ${defaultTheme.colors.primary};
  font-weight: normal;
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

const LogoutButton = styled(TouchableOpacity)`
  padding-horizontal: ${defaultTheme.spacing.large}px;
  padding-vertical: ${defaultTheme.spacing.small}px;
  background-color: ${defaultTheme.colors.error};
  border-radius: ${defaultTheme.borderRadius.pill}px;
  align-items: center;
  justify-content: center;
  margin-top: ${defaultTheme.spacing.xxl}px;
  margin-bottom: ${defaultTheme.spacing.xl}px; 
  align-self: center;
  flex-direction: row;
  elevation: 4;
  shadow-color: '#000';
  shadow-offset: 0px 3px;
  shadow-opacity: 0.22;
  shadow-radius: 3.84px;
`;

const LogoutButtonText = styled(Text)`
  color: ${defaultTheme.colors.lightText};
  font-size: ${defaultTheme.fontSizes.medium}px;
  font-weight: bold;
  margin-left: ${defaultTheme.spacing.small}px;
`;



const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isLoading, updateUserProfile, districts, provinces } = useAuth(); 
  const navigation = useNavigation<MainTabNavigationProp<'ProfileTab'>>();

  const [editDistrict, setEditDistrict] = useState(user?.preferredDistrictName || '');
  const [editProvince, setEditProvince] = useState(user?.preferredProvinceName || '');
  const [editLanguage, setEditLanguage] = useState(user?.preferredLanguage || i18n.language); 
  const [isSaving, setIsSaving] = useState(false);

 
  useEffect(() => {
    if (user) {
      setEditDistrict(user.preferredDistrictName || '');
      setEditProvince(user.preferredProvinceName || '');
      setEditLanguage(user.preferredLanguage || i18n.language); 
    }
  }, [user, i18n.language]); 


  
  const handleSaveLanguage = useCallback(async () => {
    setIsSaving(true);
    const updates: Partial<User> = { 
      preferredLanguage: editLanguage,
    };
    
    const success = await updateUserProfile(updates);
    if (success) {
      
      i18n.changeLanguage(editLanguage);
      Alert.alert(String(t('common.success')), String(t('profile.updateSuccess')));
    } else {
      Alert.alert(String(t('common.error')), String(t('profile.updateError')));
    }
    setIsSaving(false);
  }, [editLanguage, updateUserProfile, t]);

 
  const handleSaveLocation = useCallback(async () => {
    setIsSaving(true);
    const updates: Partial<User> = {
      preferredDistrictName: editDistrict,
      preferredProvinceName: editProvince,
    };

   
    if (!editProvince && editDistrict) {
        Alert.alert(String(t('common.error')), String(t('profile.provinceShouldBeSelected')));
        setIsSaving(false);
        return;
    }
    

    const success = await updateUserProfile(updates);
    if (success) {
      Alert.alert(String(t('common.success')), String(t('profile.updateSuccess')));
    } else {
      Alert.alert(String(t('common.error')), String(t('profile.updateError')));
    }
    setIsSaving(false);
  }, [editDistrict, editProvince, updateUserProfile, t]);


  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <Container>
        <CustomHeader title={String(t('tab.profile'))} showLogo={true} showLanguageSwitcher={true} />
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
      <CustomHeader 
        title={String(t('tab.profile'))} 
        showBack={false}
        showLogo={true} 
        showLanguageSwitcher={false}
      />
      <ContentArea>
        

        <ProfileCard>
          <ProfileIcon
            name="person-circle-outline"
            size={defaultTheme.fontSizes.xxxl}
            color={defaultTheme.colors.primary}
          />
          <ProfileName>{String(user?.name || t('common.userFallback'))}</ProfileName>
          <ProfileEmail>{String(user?.email || 'N/A')}</ProfileEmail>
          <ProfileRole>
            {String(t('auth.yourRole'))}: {String(user?.role ? t(`auth.role${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`) : t('auth.roleUnknown'))}
          </ProfileRole>
        </ProfileCard>

        {/* --- Language Settings --- */}
        <SectionTitle>{String(t('profile.languageSettings'))}</SectionTitle>
        <DetailCard> 
          <View style={{ marginBottom: defaultTheme.spacing.small }}>
            <InfoLabel>{String(t('profile.appLanguageLabel') || 'App Language:')}</InfoLabel>
            <PickerContainer>
              <StyledPicker
                selectedValue={editLanguage}
                onValueChange={(itemValue: unknown) => setEditLanguage(itemValue as string)} 
                enabled={!isSaving}
                accessibilityLabel={String(t('profile.selectLanguagePlaceholder'))}
              >
                {['en', 'rw', 'fr'].map(langCode => (
                  <Picker.Item key={String(langCode)} label={String(t(`common.languageName_${langCode}`) || langCode.toUpperCase())} value={String(langCode)} />
                ))}
              </StyledPicker>
            </PickerContainer>
          </View>
          <SubmitButton onPress={handleSaveLanguage} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color={defaultTheme.colors.lightText} />
            ) : (
              <SubmitButtonText>{String(t('profile.saveChangesButton') || 'Save Changes')}</SubmitButtonText>
            )}
          </SubmitButton>
        </DetailCard>


        
        {(user?.role === 'farmer' || user?.role === 'buyer') && ( 
          <>
            <SectionTitle>{String(t('profile.preferredLocationSettings') || 'Preferred Location')}</SectionTitle>
            <DetailCard> 
              
              <View style={{ marginBottom: defaultTheme.spacing.small }}>
                <InfoLabel>{String(t('profile.preferredProvinceLabel') || 'Preferred Province:')}</InfoLabel>
                <PickerContainer>
                  <StyledPicker
                    selectedValue={editProvince}
                    onValueChange={(itemValue: unknown) => {
                      setEditProvince(itemValue as string);
                     
                    }}
                    enabled={!isSaving && !isLoading}
                    accessibilityLabel={String(t('profile.selectProvincePlaceholder'))}
                  >
                    <Picker.Item label={String(t('profile.selectProvincePlaceholder'))} value="" /> {/* Placeholder item */}
                    {isLoading ? (
                      <Picker.Item key="loading-provinces" label={String(t('common.loading'))} value="" />
                    ) : provinces.length > 0 ? (
                      provinces.map((province: ReferenceDataItem) => ( 
                        <Picker.Item key={String(province.value)} label={String(province.label)} value={String(province.value)} />
                      ))
                    ) : (
                      <Picker.Item key="no-provinces" label={String(t('profile.noProvincesFound') || "No provinces available")} value="" />
                    )}
                  </StyledPicker>
                </PickerContainer>
              </View>

              
              <View style={{ marginBottom: defaultTheme.spacing.small }}>
                <InfoLabel>{String(t('profile.preferredDistrictLabel') || 'Preferred District:')}</InfoLabel>
                <PickerContainer>
                  <StyledPicker
                    selectedValue={editDistrict}
                    onValueChange={(itemValue: unknown) => setEditDistrict(itemValue as string)} 
                    enabled={!isSaving && !isLoading} 
                    accessibilityLabel={String(t('profile.selectDistrictPlaceholder'))}
                  >
                    <Picker.Item label={String(t('profile.selectDistrictPlaceholder'))} value="" /> 
                    {isLoading ? (
                      <Picker.Item key="loading-districts" label={String(t('common.loading'))} value="" />
                    ) : districts.length > 0 ? ( 
                      districts
                        .map((district: ReferenceDataItem) => ( 
                          <Picker.Item key={String(district.value)} label={String(district.label)} value={String(district.value)} />
                        ))
                    ) : (
                      <Picker.Item key="no-districts" label={String(t('profile.noDistrictsFound') || "No districts available")} value="" />
                    )}
                  </StyledPicker>
                </PickerContainer>
              </View>
              <SubmitButton onPress={handleSaveLocation} disabled={isSaving}>
                {isSaving ? (
                  <ActivityIndicator color={defaultTheme.colors.lightText} />
                ) : (
                  <SubmitButtonText>{String(t('profile.saveChangesButton') || 'Save Changes')}</SubmitButtonText>
                )}
              </SubmitButton>
            </DetailCard>
          </>
        )}


       
        <SectionTitle>{String(t('profile.accountInfo'))}</SectionTitle>
        <DetailCard style={{ paddingVertical: 0 }}>
          <DetailItem style={{ borderBottomWidth: 0 }}>
            <InfoLabel>{String(t('profile.emailVerified'))}</InfoLabel>
            <InfoValue>{String(user?.isVerified ? t('common.yes') : t('common.no'))}</InfoValue>
          </DetailItem>
           
           <SubmitButton 
              onPress={() => navigation.navigate('UpdatePassword')} 
              style={{marginTop: defaultTheme.spacing.medium, backgroundColor: defaultTheme.colors.secondary}}
            >
              <SubmitButtonText>{String(t('profile.updatePasswordButton'))}</SubmitButtonText>
            </SubmitButton>
        </DetailCard>

      
        <LogoutButton onPress={handleLogout} disabled={isSaving}>
          <Ionicons name="log-out-outline" size={defaultTheme.fontSizes.medium} color={defaultTheme.colors.lightText} />
          <LogoutButtonText>{String(t('auth.logout'))}</LogoutButtonText>
        </LogoutButton>
      </ContentArea>
    </Container>
  );
};

export default ProfileScreen;