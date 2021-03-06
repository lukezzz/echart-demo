import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector"
import { TRANSLATIONS_ZH } from "./zh/translations";
import { TRANSLATIONS_EN } from "./en/translations";

const DETECTION_OPTIONS = {
    order: ['navigator']
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        detection: DETECTION_OPTIONS,
        resources: {
            en: {
                translation: TRANSLATIONS_EN
            },
            zh: {
                translation: TRANSLATIONS_ZH
            }
        },
        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;