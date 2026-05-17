import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslation from './locales/en/translation.json'
import frTranslation from './locales/fr/translation.json'
import ruTranslation from './locales/ru/translation.json'
import roTranslation from './locales/ro/translation.json'

const resources = {
  en: { translation: enTranslation },
  fr: { translation: frTranslation },
  ru: { translation: ruTranslation },
  ro: { translation: roTranslation }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'ru', 'ro'],
    detection: {
      order: ['path', 'querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie']
    },
    interpolation: {
      escapeValue: false // React already escapes by default
    }
  })

export default i18n
