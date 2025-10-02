// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../styles/colors';
import { useNavigation, NavigationProp } from '@react-navigation/native'; // Import NavigationProp
import { RootStackParamList } from '../../navigation/AppNavigator'; // Import RootStackParamList

const LoginScreen: React.FC = () => {
  const { t } = useTranslation();
  const { login, isLoading, error, clearError } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Explicitly type useNavigation

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('error'), t('Please fill in all fields.'));
      return;
    }
    clearError();
    await login(email, password);
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert(t('error'), error);
      clearError();
    }
  }, [error, t, clearError]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('login')}</Text>
      
      <TextInput
        style={styles.input}
        placeholder={t('email')}
        placeholderTextColor={Colors.gray}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder={t('password')}
        placeholderTextColor={Colors.gray}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.buttonText}>{t('login')}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>
          {t('Don\'t have an account?')} <Text style={{ color: Colors.primaryBlue }}>{t('Register here')}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: Colors.darkGray,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: Colors.black,
    backgroundColor: Colors.lightGray,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.primaryGreen,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    padding: 10,
  },
  linkText: {
    fontSize: 16,
    color: Colors.darkGray,
  },
});

export default LoginScreen;