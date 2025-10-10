// src/config/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization'; // Use expo-localization

// Import translation files
import en from '../locales/en.json';
import rw from '../locales/rw.json';
import fr from '../locales/fr.json';

const resources: { [key: string]: { translation: typeof en } } = {
  en: {
    translation: en,
  },
  rw: {
    translation: rw,
  },
  fr: {
    translation: fr,
  },
};

// Function to get the best language for the user based on device settings
const getBestLanguage = () => {
  const locales = Localization.getLocales(); // Use expo-localization's getLocales
  if (locales && locales.length > 0) {
    const primaryLocale = locales[0]?.languageCode;
    // Check if we have translations for the primary locale
    if (primaryLocale && resources[primaryLocale]) {
      return primaryLocale;
    }
    // Fallback for specific regional variants if base language is supported
    if (primaryLocale && primaryLocale.startsWith('fr') && resources['fr']) return 'fr';
    if (primaryLocale && primaryLocale.startsWith('rw') && resources['rw']) return 'rw';
    if (primaryLocale && primaryLocale.startsWith('en') && resources['en']) return 'en';
  }
  return 'en'; // Default to English if no suitable locale found
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: getBestLanguage(), // Set initial language based on device settings
    fallbackLng: 'en', // use en if detected lng is not available

    keySeparator: '.', // We'll use dot notation for keys (e.g., 'auth.login')

    interpolation: {
      escapeValue: false, // react-i18next typically already escapes values to prevent XSS
    },

    // Debug output for development
    debug: __DEV__,
  });

export default i18n;