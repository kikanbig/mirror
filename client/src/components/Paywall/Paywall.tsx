import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore, type PremiumStatus } from '../../stores/userStore';
import { api } from '../../services/api';
import { useTranslation } from '../../i18n';
import styles from './Paywall.module.scss';

type Product = 'premium_month' | 'fate_report';

interface PaywallProps {
  product?: Product;
  children: React.ReactNode;
  feature?: string;
}

function getProductInfo(t: (key: string, replacements?: Record<string, string | number>) => string) {
  return {
    premium_month: {
      title: t('pay.premium'),
      price: t('pay.premiumPrice'),
      successMsg: t('pay.premiumSuccess'),
      successHint: t('pay.premiumHint'),
      features: [
        t('pay.features.allSpreads'),
        t('pay.features.fullNum'),
        t('pay.features.fateMatrix'),
        t('pay.features.allRunes'),
        t('pay.features.fullLunar'),
        t('pay.features.aiUnlimited'),
      ],
    },
    fate_report: {
      title: t('pay.report'),
      price: t('pay.reportPrice'),
      successMsg: t('pay.reportSuccess'),
      successHint: t('pay.reportHint'),
      features: [
        t('pay.features.50pages'),
        t('pay.features.25chapters'),
        t('pay.features.aiGenerated'),
        t('pay.features.savedForever'),
      ],
    },
  };
}

type VerifyResult = { tier: string; hasFateReport: boolean; premiumUntil: string | null };

async function verifyWithRetry(
  product: Product,
  maxRetries = 6,
  delayMs = 1200,
): Promise<PremiumStatus | null> {
  for (let i = 0; i < maxRetries; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, delayMs));
    try {
      const s = await api.post<VerifyResult>('/payments/verify');
      const confirmed =
        (product === 'premium_month' && s.tier === 'premium') ||
        (product === 'fate_report' && s.hasFateReport);
      if (confirmed) {
        return {
          tier: s.tier as 'free' | 'premium',
          hasFateReport: s.hasFateReport,
          premiumUntil: s.premiumUntil,
        };
      }
    } catch { /* retry */ }
  }
  return null;
}

function buildOptimisticStatus(product: Product, current: PremiumStatus): PremiumStatus {
  if (product === 'premium_month') {
    return { tier: 'premium', hasFateReport: current.hasFateReport, premiumUntil: null };
  }
  return { tier: current.tier, hasFateReport: true, premiumUntil: current.premiumUntil };
}

export default function Paywall({ product = 'premium_month', children }: PaywallProps) {
  const { premiumStatus } = useUserStore();
  const isPremium = premiumStatus.tier === 'premium';

  if (isPremium) return <>{children}</>;

  return null;
}

interface OverlayProps {
  product?: Product;
  feature?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function PaywallOverlay({ product = 'premium_month', feature, onSuccess, onClose }: OverlayProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { premiumStatus, setPremiumStatus } = useUserStore();
  const info = getProductInfo(t)[product];
  const verifiedStatusRef = useRef<PremiumStatus | null>(null);

  const handlePurchase = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { invoiceUrl } = await api.post<{ invoiceUrl: string }>('/payments/create-invoice', { product });

      const WebApp = window.Telegram?.WebApp;
      if (!WebApp?.openInvoice) {
        setError(t('pay.openTelegram'));
        setLoading(false);
        return;
      }

      WebApp.openInvoice(invoiceUrl, async (status) => {
        if (status === 'paid') {
          setSuccess(true);
          setLoading(false);
          try { WebApp.HapticFeedback?.notificationOccurred('success'); } catch {}

          const verified = await verifyWithRetry(product);
          verifiedStatusRef.current = verified;

          setTimeout(() => {
            const finalStatus = verifiedStatusRef.current || buildOptimisticStatus(product, premiumStatus);
            setPremiumStatus(finalStatus);
            onSuccess?.();
          }, 2000);
        } else if (status === 'failed') {
          setError(t('pay.failed'));
          setLoading(false);
        } else if (status === 'cancelled') {
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    } catch (err: any) {
      setError(err.message || t('pay.error'));
      setLoading(false);
    }
  }, [product, premiumStatus, setPremiumStatus, onSuccess, t]);

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              className={styles.successState}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className={styles.successIcon}>&#10003;</div>
              <h3 className={styles.successTitle}>{info.successMsg}</h3>
              <p className={styles.successHint}>{info.successHint}</p>
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0 }}>
              <div className={styles.badge}>PRO</div>
              <h3 className={styles.title}>{info.title}</h3>
              {feature && <p className={styles.featureText}>{t('pay.needSub', { feature })}</p>}

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
                {loading ? t('pay.processing') : t('pay.subscribe', { price: info.price })}
              </motion.button>

              {onClose && (
                <button className={styles.closeBtn} onClick={onClose}>{t('pay.close')}</button>
              )}

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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

interface BannerProps {
  product?: Product;
  label?: string;
  onSuccess?: () => void;
}

export function PaywallBanner({ product = 'premium_month', label, onSuccess }: BannerProps) {
  const { t } = useTranslation();
  const { premiumStatus, setPremiumStatus } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const info = getProductInfo(t)[product];

  if (premiumStatus.tier === 'premium' && product === 'premium_month') return null;
  if (premiumStatus.hasFateReport && product === 'fate_report') return null;

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const { invoiceUrl } = await api.post<{ invoiceUrl: string }>('/payments/create-invoice', { product });
      const WebApp = window.Telegram?.WebApp;
      if (!WebApp?.openInvoice) {
        setLoading(false);
        return;
      }

      WebApp.openInvoice(invoiceUrl, async (status) => {
        if (status === 'paid') {
          setSuccess(true);
          setLoading(false);
          try { WebApp.HapticFeedback?.notificationOccurred('success'); } catch {}

          const verified = await verifyWithRetry(product);

          setTimeout(() => {
            const finalStatus = verified || buildOptimisticStatus(product, premiumStatus);
            setPremiumStatus(finalStatus);
            onSuccess?.();
          }, 1500);
        } else {
          setLoading(false);
        }
      });
    } catch {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        className={`${styles.banner} ${styles.bannerSuccess}`}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <span className={styles.successCheckSmall}>&#10003;</span>
        <span className={styles.bannerText}>{info.successMsg}</span>
      </motion.div>
    );
  }

  return (
    <motion.button
      className={styles.banner}
      whileTap={{ scale: 0.97 }}
      onClick={handlePurchase}
      disabled={loading}
    >
      <span className={styles.bannerBadge}>PRO</span>
      <span className={styles.bannerText}>{label || info.title}</span>
      <span className={styles.bannerPrice}>{loading ? t('pay.paying') : info.price}</span>
    </motion.button>
  );
}
