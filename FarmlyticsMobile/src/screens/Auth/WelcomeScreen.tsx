// src/screens/Auth/WelcomeScreen.tsx

import React from 'react';
import styled, { DefaultTheme } from 'styled-components/native'; // Import DefaultTheme here
import { Image, Platform, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import LanguageSelector from '../../components/LanguageSelector';
import { defaultTheme } from '../../config/theme';
import { RootStackNavigationProp } from '../../navigation/types';
import GradientWrapper from '../../components/GradientWrapper';

const GradientBackground = styled(GradientWrapper).attrs((props: { theme: DefaultTheme }) => ({
  colors: [props.theme.colors.gradientStart, props.theme.colors.darkGradientEnd],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.large}px;
`;

const ContentContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 400px;
`;

const LogoContainer = styled(View)`
  margin-bottom: ${props => props.theme.spacing.xl}px;
  align-items: center;
`;

const AppLogo = styled(Image)`
  width: 250px;
  height: 250px;
  resize-mode: contain;
`;

const Title = styled(Text)`
  font-size: ${props => props.theme.fontSizes.xxl}px;
  font-weight: bold;
  color: ${props => props.theme.colors.lightText};
  margin-top: ${props => props.theme.spacing.medium}px;
  text-align: center;
`;

const WelcomeMessage = styled(Text)`
  font-size: ${props => props.theme.fontSizes.large}px;
  color: ${props => props.theme.colors.lightText};
  margin-top: ${props => props.theme.spacing.large}px;
  margin-bottom: ${props => props.theme.spacing.xxl}px;
  text-align: center;
`;

const Button = styled.TouchableOpacity`
  width: 100%;
  padding-vertical: ${props => props.theme.spacing.medium + 6}px;
  padding-horizontal: ${props => props.theme.spacing.medium}px;
  background-color: ${props => props.theme.colors.secondary};
  border-radius: ${props => props.theme.borderRadius.pill}px;
  align-items: center;
  margin-top: ${props => props.theme.spacing.medium}px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4.65px;
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  border-width: 2px;
  border-color: ${props => props.theme.colors.lightText};
  margin-top: ${props => props.theme.spacing.small}px;
`;

const ButtonText = styled(Text)`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
`;

const SecondaryButtonText = styled(ButtonText)`
  color: ${props => props.theme.colors.lightText};
`;


const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'Welcome'>>();
  const { t } = useTranslation();

  return (
    <GradientBackground>
      <ContentContainer>
        <LogoContainer>
          <AppLogo source={require('../../../assets/logo.png')} />
          <Title>Farmlytics</Title>
        </LogoContainer>

        <WelcomeMessage>{t('auth.welcomePrompt')}</WelcomeMessage>

        <LanguageSelector />
        
        <Button onPress={() => navigation.navigate('Login')}>
          <ButtonText>{t('common.login')}</ButtonText>
        </Button>

        <SecondaryButton onPress={() => navigation.navigate('Register')}>
          <SecondaryButtonText>{t('common.register')}</SecondaryButtonText>
        </SecondaryButton>
      </ContentContainer>
    </GradientBackground>
  );
};

export default WelcomeScreen;