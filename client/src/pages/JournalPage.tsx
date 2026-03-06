import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHistoryStore, SavedReading } from '../stores/historyStore';
import { useHaptic } from '../hooks/useHaptic';
import styles from './JournalPage.module.scss';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
}

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
    <motion.div className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className={styles.title}>Дневник Предсказаний</h1>

      {readings.length > 0 && (
        <div className={styles.filters}>
          {([
            ['all', 'Все'],
            ['tarot', '🃏 Таро'],
            ['synthesis', '✨ Синтез'],
            ['bookmarked', '⭐ Избранное'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              className={`${styles.filterBtn} ${filter === key ? styles.filterActive : ''}`}
              onClick={() => { setFilter(key); impact('light'); }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📔</span>
          <p className={styles.emptyText}>
            {readings.length === 0 ? 'Ваш дневник пока пуст' : 'Нет записей в этой категории'}
          </p>
          <p className={styles.emptyHint}>
            {readings.length === 0
              ? 'Сделайте расклад или синтез, и он появится здесь'
              : 'Попробуйте другой фильтр'}
          </p>
        </div>
      ) : (
        <div className={styles.list}>
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
        </div>
      )}

      {readings.length > 0 && (
        <p className={styles.count}>{readings.length} {readings.length === 1 ? 'запись' : readings.length < 5 ? 'записи' : 'записей'}</p>
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
      layout
    >
      <div className={styles.cardHeader}>
        <div className={styles.cardMeta}>
          <span className={styles.cardType}>
            {reading.type === 'tarot' ? '🃏' : '✨'}
          </span>
          <div>
            <span className={styles.cardTitle}>{reading.title}</span>
            <span className={styles.cardDate}>{formatDate(reading.date)}</span>
          </div>
        </div>
        <div className={styles.cardActions}>
          <button className={styles.actionBtn} onClick={onBookmark}>
            {reading.isBookmarked ? '⭐' : '☆'}
          </button>
          <button className={styles.actionBtn} onClick={onDelete}>
            🗑
          </button>
        </div>
      </div>

      <div className={styles.cardCards}>
        {reading.cards.map((c, i) => (
          <div key={i} className={styles.miniCard}>
            <img src={c.cardImage} alt={c.cardName} className={styles.miniCardImg} />
            {c.reversed && <span className={styles.miniReversed}>R</span>}
          </div>
        ))}
      </div>

      {reading.question && (
        <p className={styles.cardQuestion}>«{reading.question}»</p>
      )}

      <AnimatePresence>
        {isExpanded && reading.interpretation && (
          <motion.div
            className={styles.cardInterpretation}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
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
