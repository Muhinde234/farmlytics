// src/screens/Admin/AdminProfileScreen.tsx

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components/native';
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../components/CustomHeader';
import { useAuth, User } from '../../context/AuthContext'; 
import { defaultTheme } from '../../config/theme';
import { Ionicons } from '@expo/vector-icons';
import LanguageSelector from '../../components/LanguageSelector';
import { Picker } from '@react-native-picker/picker';
import { AdminTabNavigationProp } from '../../navigation/types'; 
import { useNavigation } from '@react-navigation/native'; 

const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ContentArea = styled(ScrollView).attrs({
  contentContainerStyle: {
    padding: defaultTheme.spacing.medium,
    paddingBottom: defaultTheme.spacing.xxl, // Ensure ample scroll space
    flexGrow: 1, // Allow content to grow
    justifyContent: 'flex-start', // Align content to start
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
  color: ${props => props.theme.colors.lightText};
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
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

const AdminProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isLoading, updateUserProfile } = useAuth();
  const navigation = useNavigation<AdminTabNavigationProp<'AdminProfileTab'>>();


  const [editLanguage, setEditLanguage] = useState(user?.preferredLanguage || t('common.locale'));
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditLanguage(user.preferredLanguage || t('common.locale'));
    }
  }, [user, t]);

  const handleSaveProfile = useCallback(async () => {
    setIsSaving(true);
    const updates: Partial<User> = { 
      preferredLanguage: editLanguage,
    };
    
    const success = await updateUserProfile(updates);
    if (success) {
      // Profile updated, AuthContext handles language change and user state update
    }
    setIsSaving(false);
  }, [editLanguage, updateUserProfile]);

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
        showLanguageSwitcher={true}
      />
      <ContentArea>
        <AppLogo source={require('../../../assets/logo.png')} />

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
        <DetailCard style={{ paddingVertical: defaultTheme.spacing.medium }}>
          <View style={{ marginBottom: defaultTheme.spacing.small }}>
            <InfoLabel>{String(t('profile.appLanguageLabel') || 'App Language:')}</InfoLabel>
            <PickerContainer>
              <StyledPicker
                selectedValue={editLanguage}
                onValueChange={(itemValue: unknown, itemIndex: number) => setEditLanguage(itemValue as string)}
                enabled={!isSaving}
              >
                {['en', 'rw', 'fr'].map(langCode => (
                  <Picker.Item key={String(langCode)} label={String(t(`common.languageName_${langCode}`) || langCode.toUpperCase())} value={String(langCode)} />
                ))}
              </StyledPicker>
            </PickerContainer>
          </View>
          <SubmitButton onPress={handleSaveProfile} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color={defaultTheme.colors.lightText} />
            ) : (
              <SubmitButtonText>{String(t('profile.saveChangesButton') || 'Save Changes')}</SubmitButtonText>
            )}
          </SubmitButton>
        </DetailCard>

        {/* No Preferred Location settings for Admin, as it's less relevant */}

        {/* --- Account Info Section --- */}
        <SectionTitle>{String(t('profile.accountInfo'))}</SectionTitle>
        <DetailCard style={{ paddingVertical: 0 }}>
          <DetailItem style={{ borderBottomWidth: 0 }}>
            <InfoLabel>{String(t('profile.emailVerified'))}</InfoLabel>
            <InfoValue>{String(user?.isVerified ? t('common.yes') : t('common.no'))}</InfoValue>
          </DetailItem>
        </DetailCard>

        {/* --- Logout Button --- */}
        <LogoutButton onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={defaultTheme.fontSizes.medium} color={defaultTheme.colors.lightText} />
          <LogoutButtonText>{String(t('auth.logout'))}</LogoutButtonText>
        </LogoutButton>
      </ContentArea>
    </Container>
  );
};

export default AdminProfileScreen;