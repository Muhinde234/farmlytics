// src/screens/Main/ProfileScreen.tsx

import React from 'react';
import styled from 'styled-components/native';
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../components/CustomHeader';
import { useAuth } from '../../context/AuthContext';
import { defaultTheme } from '../../config/theme';
import { Ionicons } from '@expo/vector-icons';
// import LanguageSelector from '../../components/LanguageSelector'; // REMOVED: Now used in header

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
    justifyContent: 'flex-start',
  },
})`
  flex: 1;
`;

const ProfileCard = styled(View)`
  background-color: ${defaultTheme.colors.cardBackground};
  border-radius: ${defaultTheme.borderRadius.large}px;
  padding: ${defaultTheme.spacing.large}px;
  align-items: center;
  margin-bottom: ${defaultTheme.spacing.xl}px;
  margin-top: ${defaultTheme.spacing.medium}px; /* Space from header */
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


// ---------------------- Component Logic ----------------------
const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <Container>
        <CustomHeader title={t('tab.profile')} showLogo={true} showLanguageSwitcher={false} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={defaultTheme.colors.primary} />
          <Text style={{ color: defaultTheme.colors.text, marginTop: defaultTheme.spacing.medium }}>
            {t('common.loading')}
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      {/* Updated CustomHeader for Profile Screen */}
      <CustomHeader 
        title={t('tab.profile')} 
        showBack={false} // Profile is a tab root, no back button needed
        showLogo={true} 
        showLanguageSwitcher={true} // Show language switcher in header
      />
      <ContentArea>
        {/* Removed large app logo from body, now handled by header if showLogo=true */}
        {/* <AppLogo source={require('../../../assets/logo.png')} /> */}

        <ProfileCard>
          <ProfileIcon
            name="person-circle-outline"
            size={defaultTheme.fontSizes.xxxl}
            color={defaultTheme.colors.primary}
          />
          <ProfileName>{user?.name || t('common.userFallback')}</ProfileName>
          <ProfileEmail>{user?.email || 'N/A'}</ProfileEmail>
          <ProfileRole>
            {t('auth.yourRole')}: {user?.role ? t(`auth.role${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`) : t('auth.roleUnknown')}
          </ProfileRole>
        </ProfileCard>

        {/* Language Selector removed from body, now in header */}
        {/* <SectionTitle>{t('profile.languageSettings')}</SectionTitle>
        <DetailCard style={{ paddingVertical: defaultTheme.spacing.medium }}>
          <LanguageSelector />
        </DetailCard> */}

        <SectionTitle>{t('profile.accountInfo')}</SectionTitle>
        <DetailCard style={{ paddingVertical: 0 }}>
          <DetailItem style={{ borderBottomWidth: 0 }}>
            <InfoLabel>{t('profile.emailVerified')}</InfoLabel>
            <InfoValue>{user?.isVerified ? t('common.yes') : t('common.no')}</InfoValue>
          </DetailItem>
        </DetailCard>

        <LogoutButton onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={defaultTheme.fontSizes.medium} color={defaultTheme.colors.lightText} />
          <LogoutButtonText>{t('auth.logout')}</LogoutButtonText>
        </LogoutButton>
      </ContentArea>
    </Container>
  );
};

export default ProfileScreen;