// src/screens/Main/HomeScreen.tsx

import React from 'react';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp, MainTabNavigationProp } from '../../navigation/types'; // Import MainTabNavigationProp
import CustomHeader from '../../components/CustomHeader';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, View, Text } from 'react-native';
import { defaultTheme } from '../../config/theme';

const Container = styled(View)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ContentArea = styled(ScrollView).attrs({
  contentContainerStyle: {
    padding: defaultTheme.spacing.medium,
  },
})`
  flex: 1;
`;

const WelcomeBanner = styled(View)`
  background-color: ${props => props.theme.colors.secondary};
  padding: ${props => props.theme.spacing.large}px;
  border-radius: ${props => props.theme.borderRadius.large}px;
  margin-bottom: ${props => props.theme.spacing.large}px;
  flex-direction: row;
  align-items: center;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 3.84px;
`;

const WelcomeText = styled(Text)`
  font-size: ${props => props.theme.fontSizes.xl}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const RoleText = styled(Text)`
  font-size: ${props => props.theme.fontSizes.medium}px;
  color: ${props => props.theme.colors.text};
  margin-top: ${props => props.theme.spacing.tiny}px;
`;

const Card = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.cardBackground};
  padding: ${props => props.theme.spacing.medium}px;
  border-radius: ${props => props.theme.borderRadius.medium}px;
  margin-bottom: ${props => props.theme.spacing.medium}px;
  flex-direction: row;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.15;
  shadow-radius: 2.22px;
`;

const CardIconContainer = styled(View)`
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  padding: ${props => props.theme.spacing.small}px;
  margin-right: ${props => props.theme.spacing.medium}px;
`;

const CardContent = styled(View)`
  flex: 1;
`;

const CardTitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const CardSubtitle = styled(Text)`
  font-size: ${props => props.theme.fontSizes.small}px;
  color: ${props => props.theme.colors.text};
`;

const LogoutButton = styled.TouchableOpacity`
  padding-horizontal: ${props => props.theme.spacing.medium}px;
  padding-vertical: ${props => props.theme.spacing.small}px;
  background-color: ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  align-items: center;
  justify-content: center;
  margin-top: ${props => props.theme.spacing.large}px;
  align-self: center;
  flex-direction: row;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.15;
  shadow-radius: 2.22px;
`;

const LogoutButtonText = styled(Text)`
  color: ${props => props.theme.colors.lightText};
  font-size: ${props => props.theme.fontSizes.medium}px;
  font-weight: bold;
  margin-left: ${props => props.theme.spacing.small}px;
`;


const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  // CORRECTED: HomeScreen is now part of the MainTabNavigator
  const navigation = useNavigation<MainTabNavigationProp<'HomeTab'>>(); 

  const handleLogout = () => {
    logout();
  };

  return (
    <Container>
      <CustomHeader title={t('common.welcome')} />
      <ContentArea>
        <WelcomeBanner>
          <MaterialCommunityIcons name="seed-outline" size={defaultTheme.fontSizes.xxl} color={defaultTheme.colors.text} />
          <View style={{ marginLeft: defaultTheme.spacing.medium }}>
            <WelcomeText>{t('common.welcome')}, {user?.name || 'User'}!</WelcomeText>
            <Text>{t('auth.yourRole')}: {user?.role || t('auth.roleUnknown')}</Text>
          </View>
        </WelcomeBanner>

        <Card onPress={() => console.log('Navigate to Crop Planner')}>
          <CardIconContainer>
            <Ionicons name="leaf-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
          </CardIconContainer>
          <CardContent>
            <CardTitle>{t('home.cropPlannerTitle')}</CardTitle>
            <CardSubtitle>{t('home.cropPlannerSubtitle')}</CardSubtitle>
          </CardContent>
        </Card>

        <Card onPress={() => console.log('Navigate to Market Insights')}>
          <CardIconContainer style={{ backgroundColor: defaultTheme.colors.tertiary }}>
            <Ionicons name="analytics-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
          </CardIconContainer>
          <CardContent>
            <CardTitle>{t('home.marketInsightsTitle')}</CardTitle>
            <CardSubtitle>{t('home.marketInsightsSubtitle')}</CardSubtitle>
          </CardContent>
        </Card>

        <Card onPress={() => console.log('Navigate to Harvest Tracker')}>
          <CardIconContainer style={{ backgroundColor: defaultTheme.colors.secondary }}>
            <Ionicons name="calendar-outline" size={defaultTheme.fontSizes.xl} color={defaultTheme.colors.lightText} />
          </CardIconContainer>
          <CardContent>
            <CardTitle>{t('home.harvestTrackerTitle')}</CardTitle>
            <CardSubtitle>{t('home.harvestTrackerSubtitle')}</CardSubtitle>
          </CardContent>
        </Card>

        <LogoutButton onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={defaultTheme.fontSizes.medium} color={defaultTheme.colors.lightText} />
          <LogoutButtonText>{t('auth.logout')}</LogoutButtonText>
        </LogoutButton>

      </ContentArea>
    </Container>
  );
};

export default HomeScreen;