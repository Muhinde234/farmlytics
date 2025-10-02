// src/components/LanguageSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../styles/colors';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('change_language')}:</Text>
      <TouchableOpacity
        style={[styles.button, i18n.language === 'en' && styles.selectedButton]}
        onPress={() => changeLanguage('en')}
      >
        <Text style={styles.buttonText}>{t('english')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, i18n.language === 'fr' && styles.selectedButton]}
        onPress={() => changeLanguage('fr')}
      >
        <Text style={styles.buttonText}>{t('french')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, i18n.language === 'rw' && styles.selectedButton]}
        onPress={() => changeLanguage('rw')}
      >
        <Text style={styles.buttonText}>{t('kinyarwanda')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    marginRight: 10,
    fontSize: 16,
    color: Colors.darkGray,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: Colors.primaryGreen,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default LanguageSelector;