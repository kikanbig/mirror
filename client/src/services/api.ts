import { useAppStore } from '../stores/appStore';

const API_BASE = '/api';

function getCurrentLang(): string {
  try { return useAppStore.getState().lang || 'ru'; } catch { return 'ru'; }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const initData = window.Telegram?.WebApp?.initData || '';

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-Init-Data': initData,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => {
    const lang = getCurrentLang();
    const bodyWithLang = body && typeof body === 'object' ? { ...body, lang } : body;
    return request<T>(path, { method: 'POST', body: JSON.stringify(bodyWithLang) });
  },
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        openInvoice: (url: string, callback?: (status: string) => void) => void;
        HapticFeedback?: {
          impactOccurred: (style: string) => void;
          notificationOccurred: (type: string) => void;
        };
      };
    };
  }
}
