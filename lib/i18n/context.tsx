"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { LocaleKeys } from "./locales/en";
import en from "./locales/en";

type Locale = "en" | "zh" | "ja" | "ko";

const localeModules: Record<Locale, () => Promise<{ default: Record<LocaleKeys, string> }>> = {
  en: () => Promise.resolve({ default: en }),
  zh: () => import("./locales/zh"),
  ja: () => import("./locales/ja"),
  ko: () => import("./locales/ko"),
};

interface LocaleContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: LocaleKeys, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("hamster-locale");
  if (stored && ["en", "zh", "ja", "ko"].includes(stored)) return stored as Locale;
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("zh")) return "zh";
  if (nav.startsWith("ja")) return "ja";
  if (nav.startsWith("ko")) return "ko";
  return "en";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [messages, setMessages] = useState<Record<LocaleKeys, string>>(en);

  useEffect(() => {
    const detected = detectLocale();
    setLocaleState(detected);
    if (detected !== "en") {
      localeModules[detected]().then((mod) => setMessages(mod.default));
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("hamster-locale", l);
    localeModules[l]().then((mod) => setMessages(mod.default));
  }, []);

  const t = useCallback(
    (key: LocaleKeys, params?: Record<string, string | number>) => {
      let str = messages[key] || en[key] || key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return str;
    },
    [messages]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

export const LOCALES: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" },
];
