import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TRANSLATIONS } from "../i18n/translations";

const LOCALE_KEY = "glowluxe_locale_v1";
const SUPPORTED = ["ru", "kk", "en"];

function readLocale() {
  try {
    const raw = localStorage.getItem(LOCALE_KEY);
    if (SUPPORTED.includes(raw)) return raw;
  } catch {
    /* ignore */
  }
  return "ru";
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(() => readLocale());

  const setLocale = useCallback((next) => {
    const l = SUPPORTED.includes(next) ? next : "ru";
    setLocaleState(l);
    try {
      localStorage.setItem(LOCALE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "kk" ? "kk" : locale === "en" ? "en" : "ru";
    const title = TRANSLATIONS[locale]?.doc_title ?? TRANSLATIONS.ru.doc_title;
    document.title = title;
  }, [locale]);

  const t = useCallback(
    (key, params) => {
      const dict = TRANSLATIONS[locale] ?? TRANSLATIONS.ru;
      let s = dict[key] ?? TRANSLATIONS.ru[key] ?? key;
      if (params && typeof s === "string") {
        for (const [k, v] of Object.entries(params)) {
          s = s.replaceAll(`{${k}}`, String(v));
        }
      }
      return s;
    },
    [locale]
  );

  const dateLocale = locale === "kk" ? "kk-KZ" : locale === "en" ? "en-GB" : "ru-RU";
  const collatorLocale = locale === "kk" ? "kk-KZ" : locale === "en" ? "en" : "ru";

  const value = useMemo(
    () => ({ locale, setLocale, t, dateLocale, collatorLocale }),
    [locale, setLocale, t, dateLocale, collatorLocale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
