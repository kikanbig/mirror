import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fullDeck } from '../../data/tarot-deck';
import { hashSeed, seededShuffle } from '../../utils/shuffle';
import { useHaptic } from '../../hooks/useHaptic';
import { useTranslation } from '../../i18n';
import { useUserStore } from '../../stores/userStore';
import CardZoom from '../CardZoom/CardZoom';
import styles from './DailyCard.module.scss';

export default function DailyCard() {
  const { profile, addExperience } = useUserStore();
  const today = new Date().toISOString().split('T')[0];
  const userId = String(profile.telegramId || 'guest');
  const [revealed, setRevealed] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const { impact, notification } = useHaptic();
  const { t, lang } = useTranslation();
  const dateLocale = lang === 'es' ? 'es-ES' : lang === 'en' ? 'en-US' : 'ru-RU';

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
      <h2 className={styles.title}>{t('daily.title')}</h2>
      <p className={styles.date}>
        {new Date().toLocaleDateString(dateLocale, { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>

      <div className={styles.cardArea}>
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="back"
              className={styles.cardBack}
              onClick={handleReveal}
              whileTap={{ scale: 0.96 }}
              exit={{ rotateY: 90, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <img src="/cards/card_back.webp" alt="Card back" className={styles.cardImg} />
              <motion.span
                className={styles.backLabel}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {t('daily.tap')}
              </motion.span>
            </motion.div>
          ) : (
            <motion.div
              key="front"
              className={styles.cardFront}
              initial={{ rotateY: -90, opacity: 0, scale: 0.9 }}
              animate={{ rotateY: 0, opacity: 1, scale: [0.9, 1.05, 1] }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 200, times: [0, 0.6, 1] }}
              onClick={() => setZoomed(true)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.frontInner}>
                <img src={dailyResult.card.image} alt={dailyResult.card.nameRu} className={styles.cardImg} />
              </div>
              {dailyResult.reversed && (
                <div className={styles.reversedLabel}>{t('daily.reversed')}</div>
              )}
              <motion.div
                className={styles.revealGlow}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0.3] }}
                transition={{ duration: 1 }}
              />
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
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <h3 className={styles.cardName}>{dailyResult.card.nameRu}</h3>
            <div className={styles.keywords}>
              {(dailyResult.reversed
                ? dailyResult.card.keywords.reversed
                : dailyResult.card.keywords.upright
              ).map((kw, i) => (
                <motion.span
                  key={kw}
                  className={styles.keyword}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  {kw}
                </motion.span>
              ))}
            </div>
            <motion.p
              className={styles.meaning}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {dailyResult.reversed
                ? dailyResult.card.meanings.reversed
                : dailyResult.card.meanings.upright}
            </motion.p>
            <motion.div
              className={styles.advice}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <p>{dailyResult.card.advice}</p>
            </motion.div>
            <motion.div
              className={styles.affirmation}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              &#171;{dailyResult.card.affirmation}&#187;
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {zoomed && (
          <CardZoom
            src={dailyResult.card.image}
            name={dailyResult.card.nameRu}
            reversed={dailyResult.reversed}
            onClose={() => setZoomed(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
