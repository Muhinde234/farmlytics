// src/screens/Auth/SplashScreen.tsx

import React, { useEffect, useRef } from 'react';
import styled, { DefaultTheme } from 'styled-components/native'; // Import DefaultTheme here
import { Image, ActivityIndicator, Text, Animated, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

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
`;

const AppLogo = styled(Image).attrs({
  resizeMode: 'contain',
})`
  width: 280px;
  height: 280px;
`;

const Tagline = styled(Text)`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  color: ${({ theme }) => theme.colors.lightText};
  margin-top: ${({ theme }) => theme.spacing.medium}px;
  margin-bottom: ${({ theme }) => theme.spacing.xl}px;
  text-align: center;
  font-weight: 600;
`;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'Splash'>>();
  const { t, i18n } = useTranslation();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const bootstrapAsync = async () => {
      await i18n.changeLanguage(i18n.language);

      setTimeout(() => navigation.replace('Welcome'), 3000);
    };
    bootstrapAsync();
  }, [navigation, i18n]);

  return (
    <GradientBackground>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <AppLogo source={require('../../../assets/logo.png')} />
        <Tagline>
          {t('common.welcome')} to Farmlytics!
        </Tagline>
      </Animated.View>
      <ActivityIndicator size="large" color={defaultTheme.colors.lightText} />
    </GradientBackground>
  );
};

export default SplashScreen;