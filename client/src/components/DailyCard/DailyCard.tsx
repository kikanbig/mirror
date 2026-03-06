import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fullDeck } from '../../data/tarot-deck';
import { hashSeed, seededShuffle } from '../../utils/shuffle';
import { useHaptic } from '../../hooks/useHaptic';
import { useUserStore } from '../../stores/userStore';
import styles from './DailyCard.module.scss';

export default function DailyCard() {
  const { profile, addExperience } = useUserStore();
  const today = new Date().toISOString().split('T')[0];
  const userId = String(profile.telegramId || 'guest');
  const [revealed, setRevealed] = useState(false);
  const { impact, notification } = useHaptic();

  const dailyResult = useMemo(() => {
    const seed = hashSeed(userId, today);
    const shuffled = seededShuffle(fullDeck, seed);
    const card = shuffled[0];
    const reversed = seed % 3 === 0;
    return { card, reversed };
  }, [userId, today]);

  const handleReveal = useCallback(() => {
    if (revealed) return;
    impact('heavy');
    setRevealed(true);
    addExperience(10);
    setTimeout(() => notification('success'), 500);
  }, [revealed, impact, notification, addExperience]);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className={styles.title}>Карта Дня</h2>
      <p className={styles.date}>{new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</p>

      <div className={styles.cardArea}>
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="back"
              className={styles.cardBack}
              onClick={handleReveal}
              whileTap={{ scale: 0.96 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img src="/cards/card_back.webp" alt="Card back" className={styles.cardImg} />
              <span className={styles.backLabel}>Нажмите, чтобы открыть</span>
            </motion.div>
          ) : (
            <motion.div
              key="front"
              className={styles.cardFront}
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
            >
              <div className={styles.frontInner}>
                <img src={dailyResult.card.image} alt={dailyResult.card.nameRu} className={styles.cardImg} />
              </div>
              {dailyResult.reversed && (
                <div className={styles.reversedLabel}>Перевёрнута</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {revealed && (
          <motion.div
            className={styles.reading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className={styles.cardName}>{dailyResult.card.nameRu}</h3>
            <div className={styles.keywords}>
              {(dailyResult.reversed
                ? dailyResult.card.keywords.reversed
                : dailyResult.card.keywords.upright
              ).map((kw) => (
                <span key={kw} className={styles.keyword}>{kw}</span>
              ))}
            </div>
            <p className={styles.meaning}>
              {dailyResult.reversed
                ? dailyResult.card.meanings.reversed
                : dailyResult.card.meanings.upright}
            </p>
            <div className={styles.advice}>
              <span className={styles.adviceIcon}>💫</span>
              <p>{dailyResult.card.advice}</p>
            </div>
            <div className={styles.affirmation}>
              «{dailyResult.card.affirmation}»
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
