// src/screens/Auth/RegisterScreen.tsx

import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Image, ActivityIndicator, Alert, Platform, ScrollView, Text, View, KeyboardAvoidingView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { useCallback } from 'react';

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
  margin-bottom: ${props => props.theme.spacing.xl}px; /* Explicitly 'px' string */
  align-items: center;
`;

const AppLogo = styled(Image)`
  width: 180px; /* Explicitly 'px' string */
  height: 180px; /* Explicitly 'px' string */
  resize-mode: contain;
  margin-bottom: ${props => props.theme.spacing.medium}px; /* Explicitly 'px' string */
`;

const Title = styled(Text)`
  font-size: ${props => props.theme.fontSizes.xxl}px; /* Explicitly 'px' string */
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xxl}px; /* Explicitly 'px' string */
  text-align: center;
`;

const Input = styled.TextInput`
  width: 100%;
  padding: ${props => props.theme.spacing.medium + 4}px; /* Explicitly 'px' string */
  margin-bottom: ${props => props.theme.spacing.medium}px; /* Explicitly 'px' string */
  border-width: 1px; /* Explicitly 'px' string */
  border-color: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium}px; /* Explicitly 'px' string */
  background-color: ${props => props.theme.colors.cardBackground};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.medium}px; /* Explicitly 'px' string */
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.08;
  shadow-radius: 1.84px; /* Explicitly 'px' string */
`;

const PickerContainer = styled(View)`
  width: 100%;
  border-width: 1px; /* Explicitly 'px' string */
  border-color: ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium}px; /* Explicitly 'px' string */
  background-color: ${props => props.theme.colors.cardBackground};
  margin-bottom: ${props => props.theme.spacing.large}px; /* Explicitly 'px' string */
  overflow: hidden;
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.08;
  shadow-radius: 1.84px; /* Explicitly 'px' string */
`;

const StyledPicker = styled(Picker)`
  width: 100%;
  color: ${props => props.theme.colors.text};
`;

const Button = styled.TouchableOpacity`
  width: 100%;
  padding: ${props => props.theme.spacing.medium + 6}px; /* Explicitly 'px' string */
  background-color: ${props => props.theme.colors.tertiary};
  border-radius: ${props => props.theme.borderRadius.pill}px; /* Explicitly 'px' string */
  align-items: center;
  margin-top: ${props => props.theme.spacing.large}px; /* Explicitly 'px' string */
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4.65px; /* Explicitly 'px' string */
`;

const ButtonText = styled(Text)`
  color: ${props => props.theme.colors.lightText};
  font-size: ${props => props.theme.fontSizes.large}px; /* Explicitly 'px' string */
  font-weight: bold;
`;

const LinkText = styled(Text)`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.fontSizes.medium}px; /* Explicitly 'px' string */
  margin-top: ${props => props.theme.spacing.xl}px; /* Explicitly 'px' string */
  font-weight: 600;
  text-decoration-line: underline;
`;

const LoadingMessage = styled(Text)`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.medium}px;
  margin-top: ${props => props.theme.spacing.medium}px;
  text-align: center;
`;

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'farmer' | 'buyer'>('farmer');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation<RootStackNavigationProp<'Register'>>();
  const { register } = useAuth();

  useFocusEffect(
    useCallback(() => {
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('farmer');
      setLoading(false);
    }, [])
  );

  const handleRegister = async () => {
    setLoading(true);
    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), t('auth.passwordsMismatch'));
      setLoading(false);
      return;
    }
    const success = await register(name, email, password, role);
    if (success) {
      navigation.replace('Login');
    }
    setLoading(false);
  };

  return (
    <Container>
      <CustomHeader title={t('auth.registerTitle')} showBack={true} />
      <ScrollContent>
        <LogoContainer>
          <AppLogo source={require('../../../assets/logo.png')} />
          <Title>Farmlytics</Title>
        </LogoContainer>

        <Input
          placeholder={t('auth.name')}
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
          placeholderTextColor={defaultTheme.colors.placeholder}
          editable={!loading}
        />
        <Input
          placeholder={t('common.email')}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor={defaultTheme.colors.placeholder}
          editable={!loading}
        />
        <Input
          placeholder={t('common.password')}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={defaultTheme.colors.placeholder}
          editable={!loading}
        />
        <Input
          placeholder={t('auth.confirmPassword')}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor={defaultTheme.colors.placeholder}
          editable={!loading}
        />

        <PickerContainer>
          <StyledPicker
            selectedValue={role}
            onValueChange={(itemValue: unknown, itemIndex: number) => setRole(itemValue as 'farmer' | 'buyer')}
            enabled={!loading}
          >
            <Picker.Item label={t('auth.roleFarmer')} value="farmer" />
            <Picker.Item label={t('auth.roleBuyer')} value="buyer" />
          </StyledPicker>
        </PickerContainer>

        <Button onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={defaultTheme.colors.lightText} />
          ) : (
            <ButtonText>{t('common.register')}</ButtonText>
          )}
        </Button>

        {loading && (
          <LoadingMessage>
            <Text>{t('auth.sendingVerificationEmail')}</Text>
          </LoadingMessage>
        )}

        <LinkText onPress={() => navigation.replace('Login')}>
          {t('auth.alreadyHaveAccount')}
        </LinkText>
      </ScrollContent>
    </Container>
  );
};

export default RegisterScreen;