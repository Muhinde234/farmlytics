// src/config/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import all translation files
import en from '../translations/en/common.json';
import fr from '../translations/fr/common.json';
import rw from '../translations/rw/common.json';

const resources = {
  en: {
    common: en, // 'common' is the namespace
  },
  fr: {
    common: fr,
  },
  rw: {
    common: rw,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    compatibilityJSON: 'v3', // For older Android devices
    resources,
    lng: 'en', // default language
    fallbackLng: 'en', // fallback language if translation not found
    ns: ['common'], // default namespace
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;