// src/screens/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../styles/colors';
import { useNavigation, NavigationProp } from '@react-navigation/native'; // Import NavigationProp
import { RootStackParamList } from '../../navigation/AppNavigator'; // Import RootStackParamList

const RegisterScreen: React.FC = () => {
  const { t } = useTranslation();
  const { register, isLoading, error, clearError } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Explicitly type useNavigation

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('farmer'); // Default role

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert(t('error'), t('Please fill in all fields.'));
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t('error'), t('Passwords do not match.'));
      return;
    }
    clearError();
    const result = await register(name, email, password, role); // Now `result` has a proper type

    if (result && result.success) { // Truthiness check is now valid
        Alert.alert(t('success'), result.message || t('Registration successful! Please check your email for verification.'));
        navigation.navigate('Login');
    }
    // Error handling is still done via the useEffect for 'error'
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert(t('error'), error);
      clearError();
    }
  }, [error, t, clearError]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('register')}</Text>
        
        <TextInput
          style={styles.input}
          placeholder={t('full_name')}
          placeholderTextColor={Colors.gray}
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />
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
        <TextInput
          style={styles.input}
          placeholder={t('confirm_password')}
          placeholderTextColor={Colors.gray}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>{t('Select Role')}:</Text>
          <TouchableOpacity
            style={[styles.roleButton, role === 'farmer' && styles.selectedRoleButton]}
            onPress={() => setRole('farmer')}
          >
            <Text style={[styles.roleButtonText, role === 'farmer' && styles.selectedRoleButtonText]}>{t('Farmer')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'buyer' && styles.selectedRoleButton]}
            onPress={() => setRole('buyer')}
          >
            <Text style={[styles.roleButtonText, role === 'buyer' && styles.selectedRoleButtonText]}>{t('Buyer')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>{t('register')}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>
            {t('Already have an account?')} <Text style={{ color: Colors.primaryBlue }}>{t('Login here')}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
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
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    justifyContent: 'center',
  },
  roleLabel: {
    fontSize: 16,
    color: Colors.darkGray,
    marginRight: 10,
  },
  roleButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.primaryGreen,
    marginHorizontal: 5,
    backgroundColor: Colors.white,
  },
  selectedRoleButton: {
    backgroundColor: Colors.primaryGreen,
  },
  roleButtonText: {
    color: Colors.primaryGreen,
    fontWeight: 'bold',
  },
  selectedRoleButtonText: {
    color: Colors.white,
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

export default RegisterScreen;