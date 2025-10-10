

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization'; 


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


const getBestLanguage = () => {
  const locales = Localization.getLocales(); 
  if (locales && locales.length > 0) {
    const primaryLocale = locales[0]?.languageCode;

    if (primaryLocale && resources[primaryLocale]) {
      return primaryLocale;
    }
 
    if (primaryLocale && primaryLocale.startsWith('fr') && resources['fr']) return 'fr';
    if (primaryLocale && primaryLocale.startsWith('rw') && resources['rw']) return 'rw';
    if (primaryLocale && primaryLocale.startsWith('en') && resources['en']) return 'en';
  }
  return 'en'; 
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getBestLanguage(), 
    fallbackLng: 'en',

    keySeparator: '.', 

    interpolation: {
      escapeValue: false, 
    },

   
    debug: __DEV__,
  });

export default i18n;
