import { useEffect, useState, useCallback } from 'react';
import WebApp from '@twa-dev/sdk';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      WebApp.ready();
      WebApp.expand();
      WebApp.setHeaderColor('#0A0A1A');
      WebApp.setBackgroundColor('#0A0A1A');

      if (WebApp.initDataUnsafe?.user) {
        setUser(WebApp.initDataUnsafe.user as TelegramUser);
      }
      setIsReady(true);
    } catch {
      setIsReady(true);
    }
  }, []);

  const hapticImpact = useCallback((style: 'light' | 'medium' | 'heavy' = 'medium') => {
    try {
      WebApp.HapticFeedback.impactOccurred(style);
    } catch {}
  }, []);

  const hapticNotification = useCallback((type: 'error' | 'success' | 'warning') => {
    try {
      WebApp.HapticFeedback.notificationOccurred(type);
    } catch {}
  }, []);

  const hapticSelection = useCallback(() => {
    try {
      WebApp.HapticFeedback.selectionChanged();
    } catch {}
  }, []);

  const initData = WebApp.initData || '';

  return {
    user,
    isReady,
    initData,
    hapticImpact,
    hapticNotification,
    hapticSelection,
    WebApp,
  };
}
