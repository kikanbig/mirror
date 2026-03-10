import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../stores/userStore';
import { api } from '../../services/api';
import styles from './Paywall.module.scss';

type Product = 'premium_month' | 'fate_report';

interface PaywallProps {
  product?: Product;
  children: React.ReactNode;
  feature?: string;
}

const PRODUCT_INFO = {
  premium_month: {
    title: 'Premium подписка',
    price: '149 Stars/мес',
    features: [
      'Все расклады таро (Кельтский крест, Любовь, Карьера, Неделя)',
      'Полная нумерология с психоматрицей',
      'Матрица Судьбы — интерактивная с описаниями',
      'Все рунные расклады',
      'Полный лунный календарь',
      'AI-интерпретации без лимитов',
    ],
  },
  fate_report: {
    title: 'Полный отчёт Матрицы Судьбы',
    price: '499 Stars (разово)',
    features: [
      'Персональный отчёт на 50+ страниц',
      '25 глав: таланты, карма, здоровье, деньги, отношения',
      'Генерируется AI по вашей дате рождения',
      'Сохраняется навсегда в дневнике',
    ],
  },
};

export default function Paywall({ product = 'premium_month', children, feature }: PaywallProps) {
  const { premiumStatus } = useUserStore();
  const isPremium = premiumStatus.tier === 'premium';

  if (isPremium) return <>{children}</>;

  return null;
}

export function PaywallOverlay({ product = 'premium_month', feature }: { product?: Product; feature?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setPremiumStatus } = useUserStore();
  const info = PRODUCT_INFO[product];

  const handlePurchase = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { invoiceUrl } = await api.post<{ invoiceUrl: string }>('/payments/create-invoice', { product });

      const WebApp = window.Telegram?.WebApp;
      if (!WebApp?.openInvoice) {
        setError('Откройте приложение через Telegram');
        setLoading(false);
        return;
      }

      WebApp.openInvoice(invoiceUrl, async (status) => {
        if (status === 'paid') {
          try {
            const newStatus = await api.post<{ tier: string; hasFateReport: boolean; premiumUntil: string | null }>('/payments/verify');
            setPremiumStatus({
              tier: newStatus.tier as 'free' | 'premium',
              hasFateReport: newStatus.hasFateReport,
              premiumUntil: newStatus.premiumUntil,
            });
          } catch {
            // Status will refresh on next app load
          }
        } else if (status === 'failed') {
          setError('Платёж не прошёл. Попробуйте снова.');
        }
        setLoading(false);
      });
    } catch (err: any) {
      setError(err.message || 'Ошибка создания платежа');
      setLoading(false);
    }
  }, [product, setPremiumStatus]);

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.content}>
        <div className={styles.badge}>PRO</div>
        <h3 className={styles.title}>{info.title}</h3>
        {feature && <p className={styles.featureText}>Для доступа к «{feature}» нужна подписка</p>}

        <ul className={styles.features}>
          {info.features.map((f, i) => (
            <li key={i} className={styles.featureItem}>
              <span className={styles.checkmark}>&#10003;</span>
              {f}
            </li>
          ))}
        </ul>

        <motion.button
          className={styles.purchaseBtn}
          whileTap={{ scale: 0.96 }}
          onClick={handlePurchase}
          disabled={loading}
        >
          {loading ? 'Загрузка...' : `Подключить за ${info.price}`}
        </motion.button>

        <AnimatePresence>
          {error && (
            <motion.p
              className={styles.error}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function PaywallBanner({ product = 'premium_month', label }: { product?: Product; label?: string }) {
  const { premiumStatus } = useUserStore();
  const [loading, setLoading] = useState(false);
  const { setPremiumStatus } = useUserStore();
  const info = PRODUCT_INFO[product];

  if (premiumStatus.tier === 'premium' && product === 'premium_month') return null;
  if (premiumStatus.hasFateReport && product === 'fate_report') return null;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const { invoiceUrl } = await api.post<{ invoiceUrl: string }>('/payments/create-invoice', { product });
      const WebApp = window.Telegram?.WebApp;
      if (!WebApp?.openInvoice) return;

      WebApp.openInvoice(invoiceUrl, async (status) => {
        if (status === 'paid') {
          try {
            const newStatus = await api.post<{ tier: string; hasFateReport: boolean; premiumUntil: string | null }>('/payments/verify');
            setPremiumStatus({
              tier: newStatus.tier as 'free' | 'premium',
              hasFateReport: newStatus.hasFateReport,
              premiumUntil: newStatus.premiumUntil,
            });
          } catch { /* will refresh later */ }
        }
        setLoading(false);
      });
    } catch {
      setLoading(false);
    }
  };

  return (
    <motion.button
      className={styles.banner}
      whileTap={{ scale: 0.97 }}
      onClick={handlePurchase}
      disabled={loading}
    >
      <span className={styles.bannerBadge}>PRO</span>
      <span className={styles.bannerText}>{label || info.title}</span>
      <span className={styles.bannerPrice}>{loading ? '...' : info.price}</span>
    </motion.button>
  );
}
