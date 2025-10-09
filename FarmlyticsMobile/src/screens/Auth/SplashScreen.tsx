// src/screens/Auth/SplashScreen.tsx

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import { Image, ActivityIndicator, Text, Animated, Platform, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient'; // Directly import LinearGradient

import { defaultTheme } from '../../config/theme';
import { RootStackNavigationProp } from '../../navigation/types';

// ---------------------- Styled Components ----------------------
// FINAL FIX: We will NOT use styled(LinearGradient). We'll use a plain LinearGradient
// and apply React Native styles directly for its required props.
// Any other common styles can be wrapped in a styled(View) if needed.
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

// ---------------------- SplashScreen Component ----------------------
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
    // FINAL FIX: Use LinearGradient directly in JSX and pass props
    <LinearGradient
      colors={[defaultTheme.colors.gradientStart, defaultTheme.colors.darkGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <AppLogo source={require('../../../assets/logo.png')} />
        <Tagline>
          <Text>{String(t('common.welcome'))}</Text> {/* Explicit String() */}
          <Text> to Farmlytics!</Text> {/* Explicit String() */}
        </Tagline>
      </Animated.View>
      <ActivityIndicator size="large" color={defaultTheme.colors.lightText} />
    </LinearGradient>
  );
};

export default SplashScreen;