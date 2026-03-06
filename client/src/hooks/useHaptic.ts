import { useCallback } from 'react';
import WebApp from '@twa-dev/sdk';

export function useHaptic() {
  const impact = useCallback((style: 'light' | 'medium' | 'heavy' = 'medium') => {
    try {
      WebApp.HapticFeedback.impactOccurred(style);
    } catch {}
  }, []);

  const notification = useCallback((type: 'error' | 'success' | 'warning') => {
    try {
      WebApp.HapticFeedback.notificationOccurred(type);
    } catch {}
  }, []);

  const selection = useCallback(() => {
    try {
      WebApp.HapticFeedback.selectionChanged();
    } catch {}
  }, []);

  return { impact, notification, selection };
}
