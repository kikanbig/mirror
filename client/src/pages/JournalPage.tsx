import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHistoryStore, SavedReading } from '../stores/historyStore';
import { useUserStore } from '../stores/userStore';
import { useAppStore } from '../stores/appStore';
import { useTranslation } from '../i18n';
import { useHaptic } from '../hooks/useHaptic';
import { api } from '../services/api';
import FateReportView from '../components/FateReport/FateReportView';
import styles from './JournalPage.module.scss';

function formatDate(iso: string): string {
  const d = new Date(iso);
  const lang = useAppStore.getState().lang;
  const locale = lang === 'es' ? 'es-ES' : lang === 'en' ? 'en-US' : 'ru-RU';
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
}

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const cardVariant = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

interface FateReportSummary {
  id: string;
  birthDate: string;
  wordCount: number;
  status: string;
  createdAt: string;
}

interface FateReportFull {
  id: string;
  chapters: Record<string, { id: number; title: string; content: string }>;
  wordCount: number;
  status: string;
  createdAt: string;
}

export default function JournalPage() {
  const { t, lang } = useTranslation();
  const { readings, toggleBookmark, deleteReading } = useHistoryStore();
  const { premiumStatus } = useUserStore();
  const { impact } = useHaptic();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'tarot' | 'synthesis' | 'rune' | 'bookmarked' | 'reports'>('all');
  const [fateReports, setFateReports] = useState<FateReportSummary[]>([]);
  const [activeReport, setActiveReport] = useState<FateReportFull | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    if (premiumStatus.hasFateReport) {
      api.get<FateReportSummary[]>('/fate-report')
        .then(setFateReports)
        .catch(() => {});
    }
  }, [premiumStatus.hasFateReport]);

  const openReport = async (r: FateReportSummary) => {
    setLoadingReport(true);
    try {
      const data = await api.get<FateReportFull>(`/fate-report/${r.birthDate}`);
      setActiveReport(data);
    } catch { /* ignore */ }
    setLoadingReport(false);
  };

  if (activeReport) {
    return (
      <motion.div className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <FateReportView
          chapters={activeReport.chapters}
          wordCount={activeReport.wordCount}
          birthDate={fateReports.find(r => r.id === activeReport.id)?.birthDate || ''}
          createdAt={activeReport.createdAt}
          onClose={() => setActiveReport(null)}
        />
      </motion.div>
    );
  }

  const filtered = readings.filter((r) => {
    if (filter === 'bookmarked') return r.isBookmarked;
    if (filter === 'all') return true;
    return r.type === filter;
  });

  const handleExpand = (id: string) => {
    impact('light');
    setExpandedId(expandedId === id ? null : id);
  };

  const handleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    impact('light');
    toggleBookmark(id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    impact('medium');
    deleteReading(id);
    if (expandedId === id) setExpandedId(null);
  };

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className={styles.title}>{t('journal.title')}</h1>

      {(readings.length > 0 || fateReports.length > 0) && (
        <div className={styles.filters}>
          {([
            ['all', t('journal.all')],
            ['tarot', t('journal.tarot')],
            ['rune', t('journal.runes')],
            ['synthesis', t('journal.synthesis')],
            ...(fateReports.length > 0 ? [['reports', t('journal.reports')] as const] : []),
            ['bookmarked', t('journal.bookmarked')],
          ] as const).map(([key, label]) => (
            <motion.button
              key={key}
              className={`${styles.filterBtn} ${filter === key ? styles.filterActive : ''}`}
              onClick={() => { setFilter(key); impact('light'); }}
              whileTap={{ scale: 0.95 }}
            >
              {label}
              {filter === key && (
                <motion.div
                  className={styles.filterIndicator}
                  layoutId="filter-indicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      )}

      {filter === 'reports' ? (
        <motion.div className={styles.list} initial="initial" animate="animate">
          {fateReports.map((r) => (
            <motion.div
              key={r.id}
              className={styles.card}
              onClick={() => openReport(r)}
              variants={cardVariant}
              layout
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardType}>
                    <span style={{ fontSize: '1.1rem' }}>&#128218;</span>
                  </span>
                  <div>
                    <span className={styles.cardTitle}>{t('journal.fateReport')}</span>
                    <span className={styles.cardDate}>
                      {new Date(r.birthDate).toLocaleDateString(lang === 'es' ? 'es-ES' : lang === 'en' ? 'en-US' : 'ru-RU')} · {r.wordCount.toLocaleString()} {t('fr.words')}
                    </span>
                  </div>
                </div>
              </div>
              {loadingReport && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', padding: '8px 16px' }}>{t('journal.loading')}</p>}
            </motion.div>
          ))}
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div
          className={styles.empty}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.img
            className={styles.emptyIllustration}
            src="/icons/icon_journal_empty.webp"
            alt=""
            width={140}
            height={140}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ filter: 'drop-shadow(0 0 16px rgba(139,92,246,0.3))' }}
          />
          <p className={styles.emptyText}>
            {readings.length === 0 ? t('journal.empty') : t('journal.noCategory')}
          </p>
          <p className={styles.emptyHint}>
            {readings.length === 0
              ? t('journal.emptyHint')
              : t('journal.noHint')}
          </p>
        </motion.div>
      ) : (
        <motion.div className={styles.list} variants={stagger} initial="initial" animate="animate">
          {filtered.map((reading) => (
            <ReadingCard
              key={reading.id}
              reading={reading}
              isExpanded={expandedId === reading.id}
              onExpand={() => handleExpand(reading.id)}
              onBookmark={(e) => handleBookmark(e, reading.id)}
              onDelete={(e) => handleDelete(e, reading.id)}
            />
          ))}
        </motion.div>
      )}

      {readings.length > 0 && (
        <p className={styles.count}>
          {readings.length} {readings.length === 1 ? t('journal.count.1') : readings.length < 5 ? t('journal.count.2-4') : t('journal.count.5+')}
        </p>
      )}
    </motion.div>
  );
}

function ReadingCard({
  reading,
  isExpanded,
  onExpand,
  onBookmark,
  onDelete,
}: {
  reading: SavedReading;
  isExpanded: boolean;
  onExpand: () => void;
  onBookmark: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}) {
  const { t } = useTranslation();
  return (
    <motion.div
      className={`${styles.card} ${isExpanded ? styles.cardExpanded : ''}`}
      onClick={onExpand}
      variants={cardVariant}
      layout
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardMeta}>
          <span className={styles.cardType}>
            {reading.type === 'tarot' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 7l-2 3 2 3M10 7l2 3-2 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            ) : reading.type === 'rune' ? (
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>ᚱ</span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5 2.5-7.5-6-4.5h7.5L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <div>
            <span className={styles.cardTitle}>{reading.title}</span>
            <span className={styles.cardDate}>{formatDate(reading.date)}</span>
          </div>
        </div>
        <div className={styles.cardActions}>
          <motion.button
            className={`${styles.actionBtn} ${reading.isBookmarked ? styles.bookmarked : ''}`}
            onClick={onBookmark}
            whileTap={{ scale: 0.8 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={reading.isBookmarked ? 'currentColor' : 'none'}>
              <path
                d="M12 2l3 6.5L22 10l-5 5 1.5 7L12 18.5 5.5 22 7 15 2 10l7-1.5L12 2z"
                stroke="currentColor" strokeWidth="2" strokeLinejoin="round"
              />
            </svg>
          </motion.button>
          <motion.button
            className={styles.actionBtn}
            onClick={onDelete}
            whileTap={{ scale: 0.8 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M5 6v14a2 2 0 002 2h10a2 2 0 002-2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.button>
        </div>
      </div>

      <div className={styles.cardCards}>
        {reading.cards.map((c, i) => (
          <motion.div
            key={i}
            className={styles.miniCard}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            {c.cardImage ? (
              <img src={c.cardImage} alt={c.cardName} className={styles.miniCardImg} />
            ) : (
              <span className={styles.miniRuneSymbol}>{c.cardName}</span>
            )}
            {c.reversed && <span className={styles.miniReversed}>R</span>}
          </motion.div>
        ))}
      </div>

      {reading.question && (
        <p className={styles.cardQuestion}>&#171;{reading.question}&#187;</p>
      )}

      <AnimatePresence>
        {isExpanded && reading.interpretation && (
          <motion.div
            className={styles.cardInterpretation}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {reading.cards.map((c, i) => (
              <div key={i} className={styles.interpCard}>
                <span className={styles.interpPos}>{c.positionName}</span>
                <span className={styles.interpName}>{c.cardName}{c.reversed ? ` (${t('tarot.reversed')})` : ''}</span>
              </div>
            ))}
            <div className={styles.interpText}>
              {reading.interpretation.split('\n').map((p, i) => (
                p.trim() ? <p key={i}>{p}</p> : null
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
