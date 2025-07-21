// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization'; // Optional if using Expo

i18n
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        lng: Localization.getLocales()[0].languageTag, // Detect locale
        fallbackLng: 'en',
        supportedLngs: ['en', 'zh'],
        resources: {
            en: { translation: require('../locales/en.json') },
            zh: { translation: require('../locales/zh.json') },
        },
        interpolation: { escapeValue: false },
    });

// Map Traditional Chinese locales to 'zh'
const zhTraditionalLocales = ['zh-TW', 'zh-Hant', 'zh-HK', 'zh-MO'];
if (zhTraditionalLocales.includes(i18n.language)) {
    i18n.changeLanguage('zh');
}

export default i18n;
