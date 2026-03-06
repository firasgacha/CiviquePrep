import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationFR from "./locales/fr.json";
import translationEN from "./locales/en.json";
import translationUK from "./locales/uk.json";
import translationES from "./locales/es.json";
import translationIT from "./locales/it.json";
import translationAR from "./locales/ar.json";
import translationZH from "./locales/zh.json";

const resources = {
  fr: {
    translation: translationFR,
  },
  en: {
    translation: translationEN,
  },
  uk: {
    translation: translationUK,
  },
  es: {
    translation: translationES,
  },
  it: {
    translation: translationIT,
  },
  ar: {
    translation: translationAR,
  },
  zh: {
    translation: translationZH,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "fr",
    lng: "fr", // Default language is French
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
