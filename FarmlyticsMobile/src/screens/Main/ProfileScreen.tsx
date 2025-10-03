import React from 'react';
import styled from 'styled-components/native';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../components/CustomHeader';
import { useAuth } from '../../context/AuthContext';
import { defaultTheme } from '../../config/theme';
import { Ionicons } from '@expo/vector-icons';

const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ContentArea = styled(View)`
  flex: 1;
  padding: ${defaultTheme.spacing.medium}px;
`;

const ProfileCard = styled(View)`
  background-color: ${defaultTheme.colors.cardBackground};
  border-radius: ${defaultTheme.borderRadius.large}px;
  padding: ${defaultTheme.spacing.large}px;
  align-items: center;
  margin-bottom: ${defaultTheme.spacing.xl}px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 2.84px;
`;

const ProfileIcon = styled(Ionicons)`
  margin-bottom: ${defaultTheme.spacing.medium}px;
`;

const ProfileName = styled(Text)`
  font-size: ${defaultTheme.fontSizes.xl}px;
  font-weight: bold;
  color: ${defaultTheme.colors.primary};
  margin-bottom: ${defaultTheme.spacing.small}px;
`;

const ProfileEmail = styled(Text)`
  font-size: ${defaultTheme.fontSizes.medium}px;
  color: ${defaultTheme.colors.text};
  margin-bottom: ${defaultTheme.spacing.small}px;
`;

const ProfileRole = styled(Text)`
  font-size: ${defaultTheme.fontSizes.medium}px;
  color: ${defaultTheme.colors.tertiary};
  font-weight: 600;
`;

const LogoutButton = styled.TouchableOpacity`
  padding-horizontal: ${defaultTheme.spacing.medium}px;
  padding-vertical: ${defaultTheme.spacing.small}px;
  background-color: ${defaultTheme.colors.error};
  border-radius: ${defaultTheme.borderRadius.medium}px;
  align-items: center;
  justify-content: center;
  margin-top: ${defaultTheme.spacing.large}px;
  align-self: center;
  flex-direction: row;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.15;
  shadow-radius: 2.22px;
`;

const LogoutButtonText = styled(Text)`
  color: ${defaultTheme.colors.lightText};
  font-size: ${defaultTheme.fontSizes.medium}px;
  font-weight: bold;
  margin-left: ${defaultTheme.spacing.small}px;
`;


const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Container>
      <CustomHeader title={t('tab.profile') || 'Profile'} />
      <ContentArea>
        <ProfileCard>
          <ProfileIcon name="person-circle-outline" size={defaultTheme.fontSizes.xxxl} color={defaultTheme.colors.primary} />
          <ProfileName>{user?.name || t('auth.roleUnknown')}</ProfileName>
          <ProfileEmail>{user?.email || 'N/A'}</ProfileEmail>
          <ProfileRole>{t('auth.yourRole')}: {user?.role || t('auth.roleUnknown')}</ProfileRole>
        </ProfileCard>

        {/* You can add more profile details or settings options here */}

        <LogoutButton onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={defaultTheme.fontSizes.medium} color={defaultTheme.colors.lightText} />
          <LogoutButtonText>{t('auth.logout')}</LogoutButtonText>
        </LogoutButton>
      </ContentArea>
    </Container>
  );
};

export default ProfileScreen;