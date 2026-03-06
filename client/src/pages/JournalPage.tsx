import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHistoryStore, SavedReading } from '../stores/historyStore';
import { useHaptic } from '../hooks/useHaptic';
import styles from './JournalPage.module.scss';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
}

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const cardVariant = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function JournalPage() {
  const { readings, toggleBookmark, deleteReading } = useHistoryStore();
  const { impact } = useHaptic();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'tarot' | 'synthesis' | 'bookmarked'>('all');

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
      <h1 className={styles.title}>Дневник Предсказаний</h1>

      {readings.length > 0 && (
        <div className={styles.filters}>
          {([
            ['all', 'Все'],
            ['tarot', 'Таро'],
            ['synthesis', 'Синтез'],
            ['bookmarked', 'Избранное'],
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

      {filtered.length === 0 ? (
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
            {readings.length === 0 ? 'Ваш дневник пока пуст' : 'Нет записей в этой категории'}
          </p>
          <p className={styles.emptyHint}>
            {readings.length === 0
              ? 'Сделайте расклад или синтез, и он появится здесь'
              : 'Попробуйте другой фильтр'}
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
          {readings.length} {readings.length === 1 ? 'запись' : readings.length < 5 ? 'записи' : 'записей'}
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
            <img src={c.cardImage} alt={c.cardName} className={styles.miniCardImg} />
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
                <span className={styles.interpName}>{c.cardName}{c.reversed ? ' (перевёрнута)' : ''}</span>
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
