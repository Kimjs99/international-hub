import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import koCommon from '../locales/ko/common.json'
import koHome from '../locales/ko/home.json'
import koSchools from '../locales/ko/schools.json'
import koAcademic from '../locales/ko/academic.json'
import koCulture from '../locales/ko/culture.json'
import koActivities from '../locales/ko/activities.json'
import koGallery from '../locales/ko/gallery.json'
import koNotices from '../locales/ko/notices.json'

import jaCommon from '../locales/ja/common.json'
import jaHome from '../locales/ja/home.json'
import jaSchools from '../locales/ja/schools.json'
import jaAcademic from '../locales/ja/academic.json'
import jaCulture from '../locales/ja/culture.json'
import jaActivities from '../locales/ja/activities.json'
import jaGallery from '../locales/ja/gallery.json'
import jaNotices from '../locales/ja/notices.json'

import enCommon from '../locales/en/common.json'
import enHome from '../locales/en/home.json'
import enSchools from '../locales/en/schools.json'
import enAcademic from '../locales/en/academic.json'
import enCulture from '../locales/en/culture.json'
import enActivities from '../locales/en/activities.json'
import enGallery from '../locales/en/gallery.json'
import enNotices from '../locales/en/notices.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ko: {
        common: koCommon,
        home: koHome,
        schools: koSchools,
        academic: koAcademic,
        culture: koCulture,
        activities: koActivities,
        gallery: koGallery,
        notices: koNotices,
      },
      ja: {
        common: jaCommon,
        home: jaHome,
        schools: jaSchools,
        academic: jaAcademic,
        culture: jaCulture,
        activities: jaActivities,
        gallery: jaGallery,
        notices: jaNotices,
      },
      en: {
        common: enCommon,
        home: enHome,
        schools: enSchools,
        academic: enAcademic,
        culture: enCulture,
        activities: enActivities,
        gallery: enGallery,
        notices: enNotices,
      },
    },
    fallbackLng: 'ko',
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
    },
  })

export default i18n
