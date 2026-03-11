import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';
import { useUserStore } from '../../stores/userStore';
import { useTranslation } from '../../i18n';
import { PaywallBanner } from '../Paywall/Paywall';
import FateReportView from './FateReportView';
import styles from './FateReportGenerator.module.scss';

interface Chapter {
  id: number;
  title: string;
  content: string;
}

interface ReportResponse {
  id: string;
  chapters: Record<string, Chapter>;
  wordCount: number;
  status: string;
  cached?: boolean;
}

interface Props {
  birthDate: string;
}

export default function FateReportGenerator({ birthDate }: Props) {
  const { t } = useTranslation();
  const { premiumStatus } = useUserStore();
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [justPurchased, setJustPurchased] = useState(false);

  const hasPurchased = premiumStatus.hasFateReport || justPurchased;

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError('');
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 4 + 1;
      });
    }, 1000);

    try {
      const data = await api.post<ReportResponse>('/fate-report/generate', { birthDate });
      clearInterval(progressInterval);
      setProgress(100);
      setReport(data);
    } catch (err: any) {
      clearInterval(progressInterval);
      if (err.message?.includes('Purchase required')) {
        setError('purchase_required');
      } else {
        setError(err.message || t('common.error'));
      }
    } finally {
      setLoading(false);
    }
  }, [birthDate, t]);

  const handleLoadExisting = useCallback(async () => {
    try {
      const data = await api.get<ReportResponse>(`/fate-report/${birthDate}`);
      if (data.status === 'ready') {
        setReport(data);
      }
    } catch {
      // No existing report
    }
  }, [birthDate]);

  const handlePurchaseSuccess = useCallback(() => {
    setJustPurchased(true);
    setError('');
  }, []);

  if (report) {
    return (
      <FateReportView
        chapters={report.chapters}
        wordCount={report.wordCount}
        birthDate={birthDate}
        onClose={() => setReport(null)}
      />
    );
  }

  if (error === 'purchase_required' && !hasPurchased) {
    return (
      <div className={styles.container}>
        <PaywallBanner
          product="fate_report"
          label={t('fr.buyFull')}
          onSuccess={handlePurchaseSuccess}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>&#128218;</div>
        <h3 className={styles.title}>{t('fr.title')}</h3>
        <p className={styles.description}>
          {t('fr.description')}
        </p>

        {loading ? (
          <div className={styles.progressSection}>
            <div className={styles.progressBar}>
              <motion.div
                className={styles.progressFill}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className={styles.progressText}>
              {t('fr.generating', { pct: Math.round(progress) })}
            </p>
            <p className={styles.progressHint}>
              {t('fr.generatingHint')}
            </p>
          </div>
        ) : (
          <>
            {hasPurchased ? (
              <>
                <motion.button
                  className={styles.generateBtn}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleGenerate}
                >
                  {t('fr.generate')}
                </motion.button>
                <button className={styles.loadBtn} onClick={handleLoadExisting}>
                  {t('fr.loadSaved')}
                </button>
              </>
            ) : (
              <PaywallBanner
                product="fate_report"
                label={t('fr.buyFull')}
                onSuccess={handlePurchaseSuccess}
              />
            )}
          </>
        )}

        {error && error !== 'purchase_required' && (
          <p className={styles.error}>{error}</p>
        )}
      </div>
    </div>
  );
}
