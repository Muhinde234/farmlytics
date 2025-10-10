

import React from 'react';
import styled, { DefaultTheme } from 'styled-components/native'; 
import { Image, Platform, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient'; 


import CustomHeader from '../../components/CustomHeader'; 
import { defaultTheme } from '../../config/theme';
import { RootStackNavigationProp } from '../../navigation/types';


const WelcomeScreenContainer = styled(View)`
  flex: 1;
  /* No background-color, LinearGradient will cover */
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
  margin-top: ${props => props.theme.spacing.xxl}px; /* Adjusted margin */
  elevation: 5;
  shadow-color: '#000';
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
    <>
      <CustomHeader
        title={String(t('common.welcome'))}
        showBack={false}
        showLogo={true}
        showLanguageSwitcher={true}
      />
    
      <LinearGradient
        colors={[defaultTheme.colors.gradientStart, defaultTheme.colors.darkGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: defaultTheme.spacing.large }}
      >
        <ContentContainer>
          <LogoContainer>
            <AppLogo source={require('../../../assets/logo.png')} />
            <Title>Farmlytics</Title>
          </LogoContainer>

          <WelcomeMessage>{String(t('auth.welcomePrompt'))}</WelcomeMessage>
          
          <Button onPress={() => navigation.navigate('Login')}>
            <ButtonText>{String(t('common.login'))}</ButtonText>
          </Button>

          <SecondaryButton onPress={() => navigation.navigate('Register')}>
            <SecondaryButtonText>{String(t('common.register'))}</SecondaryButtonText>
          </SecondaryButton>
        </ContentContainer>
      </LinearGradient>
    </>
  );
};

export default WelcomeScreen;
