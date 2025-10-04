// src/screens/Auth/LoginScreen.tsx

import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Image, ActivityIndicator, Alert, Platform, ScrollView, Text, View, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { defaultTheme } from '../../config/theme';
import { RootStackNavigationProp } from '../../navigation/types';
import { useAuth } from '../../context/AuthContext';
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

const Input = styled.TextInput`
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

const Button = styled.TouchableOpacity`
  width: 100%;
  padding: ${props => props.theme.spacing.medium + 6}px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.pill}px;
  align-items: center;
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

const LinkText = styled(Text)`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.medium}px;
  margin-top: ${props => props.theme.spacing.xl}px;
  font-weight: 600;
  text-decoration-line: underline;
`;

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation<RootStackNavigationProp<'Login'>>();
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <Container>
      <CustomHeader title={String(t('auth.loginTitle'))} showBack={true} showLogo={true} showLanguageSwitcher={true} />
      <ScrollContent>
        <LogoContainer>
          <AppLogo source={require('../../../assets/logo.png')} />
          <Title>Farmlytics</Title>
        </LogoContainer>

        <Input
          placeholder={String(t('common.email'))} // Explicit String()
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={defaultTheme.colors.placeholder}
        />
        <Input
          placeholder={String(t('common.password'))} // Explicit String()
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={defaultTheme.colors.placeholder}
        />

        <Button onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color={defaultTheme.colors.lightText} /> : <ButtonText>{t('common.login')}</ButtonText>}
        </Button>

        <LinkText onPress={() => navigation.navigate('Register')}>
          {t('auth.noAccount')}
        </LinkText>
      </ScrollContent>
    </Container>
  );
};

export default LoginScreen;