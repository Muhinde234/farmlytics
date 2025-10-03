// src/screens/Home/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, Button, Alert } from 'react-native'; // Import Alert
import { useTranslation } from 'react-i18next';
import { useNavigation, NavigationProp } from '@react-navigation/native'; // Import NavigationProp
import LanguageSelector from '../../components/LanguageSelector';
import { Colors } from '../../styles/colors';
import { Images } from '../../assets';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../navigation/AppNavigator'; // Import RootStackParamList

interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>(); // Explicitly type useNavigation
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Image source={Images.logo} style={styles.logo} />
      
      {user ? ( // If user is logged in
        <View style={styles.loggedInContainer}>
          <Text style={styles.welcomeText}>
            {t('welcome')}, {user.name}!
          </Text>
          <Text style={styles.subText}>Role: {user.role}</Text>
          <Text style={styles.subText}>Status: {user.isVerified ? 'Verified' : 'Unverified'}</Text>

          <View style={styles.buttonContainer}>
            <Button
              title={t('Dashboard')} // Assuming you'll create a Dashboard screen
              onPress={() => Alert.alert('Navigate', 'To Dashboard')} // Placeholder for now
              color={Colors.primaryBlue}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title={t('logout')}
              onPress={logout}
              color={Colors.error}
            />
          </View>
        </View>
      ) : ( // If no user is logged in
        <View style={styles.loggedOutContainer}>
          <Text style={styles.welcomeText}>{t('welcome')}</Text>
          <View style={styles.buttonContainer}>
            <Button 
              title={t('login')} 
              onPress={() => navigation.navigate('Login')} 
              color={Colors.primaryBlue}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button 
              title={t('register')} 
              onPress={() => navigation.navigate('Register')} 
              color={Colors.primaryGreen}
            />
          </View>
        </View>
      )}

      <LanguageSelector />
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
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.darkGray,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: Colors.gray,
    marginBottom: 5,
  },
  loggedInContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  loggedOutContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '60%',
    marginBottom: 15,
  },
});

export default HomeScreen;