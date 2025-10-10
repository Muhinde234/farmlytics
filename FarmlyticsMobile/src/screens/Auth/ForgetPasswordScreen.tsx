

import React, { useState, useCallback } from 'react';
import styled from 'styled-components/native';

import { Image, ActivityIndicator, Alert, Platform, ScrollView, Text, View, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native'; 
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { defaultTheme } from '../../config/theme';
import { RootStackNavigationProp } from '../../navigation/types';
import CustomHeader from '../../components/CustomHeader';


const Container = styled(KeyboardAvoidingView).attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : 'height',
})`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ScrollContent = styled(ScrollView).attrs({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: defaultTheme.spacing.large,
  },
})`
  width: 100%;
`;

const LogoContainer = styled(View)`
  margin-bottom: ${props => props.theme.spacing.xl}px;
  align-items: center;
`;

const AppLogo = styled(Image)`
  width: 180px;
  height: 180px;
  resize-mode: contain;
  margin-bottom: ${props => props.theme.spacing.medium}px;
`;

const Title = styled(Text)`
  font-size: ${props => props.theme.fontSizes.xxl}px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xxl}px;
  text-align: center;
`;

const Input = styled(TextInput)`
  width: 100%;
  padding: ${props => props.theme.spacing.medium + 4}px;
  margin-bottom: ${props => props.theme.spacing.medium}px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium}px;
  background-color: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.medium}px;
  elevation: 1;
  shadow-color: '#000';
  shadow-offset: 0px 1px;
  shadow-opacity: 0.08;
  shadow-radius: 1.84px;
`;

const Button = styled(TouchableOpacity)`
  width: 100%;
  padding: ${props => props.theme.spacing.medium + 6}px;
  background-color: ${props => props.theme.colors.tertiary}; /* Green for positive action */
  border-radius: ${props => props.theme.borderRadius.pill}px;
  align-items: center;
  justify-content: center;
  margin-top: ${props => props.theme.spacing.large}px;
  elevation: 5;
  shadow-color: '#000';
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4.65px;
`;

const ButtonText = styled(Text)`
  color: ${props => props.theme.colors.lightText};
  font-size: ${props => props.theme.fontSizes.large}px;
  font-weight: bold;
`;

const FeedbackText = styled(Text)`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.medium}px;
  text-align: center;
  margin-top: ${props => props.theme.spacing.medium}px;
`;

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { t } = useTranslation();
  const navigation = useNavigation<RootStackNavigationProp<'ForgotPassword'>>();

  const handleForgotPassword = useCallback(async () => {
    setMessage(null);
    setLoading(true);
    try {
      const response = await fetch('https://farmlytics1-1.onrender.com/api/v1/auth/forgotpassword', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setMessage(String(t('auth.resetLinkSentSuccess')));
        Alert.alert(String(t('common.success')), String(t('auth.resetLinkSentSuccess')));
      } else {
        setMessage(String(data.message || t('auth.resetLinkSentError')));
        Alert.alert(String(t('common.error')), String(data.message || t('auth.resetLinkSentError')));
      }
    } catch (err: unknown) {
      console.error('Forgot password error (catch block):', err);
      setMessage(String(t('common.networkError')));
      Alert.alert(String(t('common.error')), String(t('common.networkError')));
    } finally {
      setLoading(false);
    }
  }, [email, t]);

  return (
    <Container>
      <CustomHeader title={String(t('auth.forgotPasswordTitle'))} showBack={true} showLogo={true} showLanguageSwitcher={true} />
      <ScrollContent>
        <LogoContainer>
          <AppLogo source={require('../../../assets/logo.png')} />
          <Title>Farmlytics</Title>
        </LogoContainer>

        <FeedbackText style={{ marginBottom: defaultTheme.spacing.large }}>
          {String(t('auth.forgotPasswordPrompt'))}
        </FeedbackText>

        <Input
          placeholder={String(t('common.email'))}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={defaultTheme.colors.placeholder}
          editable={!loading}
        />

        <Button onPress={handleForgotPassword} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={defaultTheme.colors.lightText} />
          ) : (
            <ButtonText>{String(t('auth.sendResetLinkButton'))}</ButtonText>
          )}
        </Button>
        {message && <FeedbackText>{message}</FeedbackText>}
      </ScrollContent>
    </Container>
  );
};

export default ForgotPasswordScreen;
