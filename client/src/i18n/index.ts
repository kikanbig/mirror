import { useCallback } from 'react';
import { useAppStore } from '../stores/appStore';
import { ru } from './ru';
import { en } from './en';
import { es } from './es';

export type Lang = 'ru' | 'en' | 'es';

const locales: Record<Lang, Record<string, string>> = { ru, en, es };

export function detectLanguage(): Lang {
  const params = new URLSearchParams(window.location.search);
  const langParam = params.get('lang');
  if (langParam && langParam in locales) return langParam as Lang;

  const tgLang = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
  if (tgLang) {
    if (tgLang.startsWith('es')) return 'es';
    if (tgLang.startsWith('en')) return 'en';
    if (tgLang.startsWith('ru') || tgLang.startsWith('uk') || tgLang.startsWith('be')) return 'ru';
    return 'en';
  }

  return 'ru';
}

export function t(key: string, lang?: Lang): string {
  const l = lang || useAppStore.getState().lang;
  return locales[l]?.[key] || locales.ru[key] || key;
}

export function useTranslation() {
  const lang = useAppStore((s) => s.lang);

  const translate = useCallback(
    (key: string, replacements?: Record<string, string | number>) => {
      let text = locales[lang]?.[key] || locales.ru[key] || key;
      if (replacements) {
        Object.entries(replacements).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v));
        });
      }
      return text;
    },
    [lang],
  );

  return { t: translate, lang };
}

export function tData<T extends Record<string, any>>(
  item: T,
  field: string,
  lang: Lang,
): string {
  const localized = (item as any)[`${field}_${lang}`];
  if (localized) return localized;
  const ruField = (item as any)[`${field}Ru`] || (item as any)[field];
  return ruField || '';
}
