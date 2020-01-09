import I18n from "i18n-js";
import * as RNLocalize from "react-native-localize";

import en from "./locales/en";
import id from "./locales/id";

const locales = RNLocalize.getLocales();

if (Array.isArray(locales)) {
  console.log("language locales", locales)
  I18n.locale = locales[0].languageTag;
}

I18n.fallbacks = true;
I18n.translations = {
  en,
  id
};

export const setLanguage = async()=>{
  I18n.locale = locales[0].languageTag;
}

export const getLanguage = () => {
  console.log("locale: ",locales[0].languageTag);
  return locales[0].languageTag;
}

export default I18n;
