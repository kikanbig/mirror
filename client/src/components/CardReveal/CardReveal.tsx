import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotCard } from '../../data/tarot-types';
import { useHaptic } from '../../hooks/useHaptic';
import styles from './CardReveal.module.scss';

interface Props {
  card: TarotCard;
  reversed: boolean;
  positionName?: string;
  delay?: number;
  onReveal?: () => void;
}

export default function CardReveal({ card, reversed, positionName, delay = 0, onReveal }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { impact, notification } = useHaptic();

  const handleFlip = () => {
    if (isFlipped) return;
    impact('medium');
    setIsFlipped(true);
    setTimeout(() => notification('success'), 400);
    onReveal?.();
  };

  const suitColors: Record<string, string> = {
    wands: '#f59e0b',
    cups: '#3b82f6',
    swords: '#a855f7',
    pentacles: '#10b981',
  };

  const glowColor = card.suit ? suitColors[card.suit] : '#d4af37';

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
    >
      {positionName && <div className={styles.position}>{positionName}</div>}
      <motion.div
        className={styles.card}
        onClick={handleFlip}
        whileTap={!isFlipped ? { scale: 0.95 } : {}}
        animate={isFlipped ? { boxShadow: `0 0 30px ${glowColor}40` } : {}}
      >
        <motion.div
          className={styles.inner}
          animate={{ rotateY: isFlipped ? 0 : 180 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 25 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className={styles.front} style={{ transform: reversed ? 'rotate(180deg)' : undefined }}>
            <div className={styles.cardImage}>
              <div className={styles.cardArt} style={{ borderColor: glowColor }}>
                <span className={styles.cardNumber}>{card.number}</span>
                <span className={styles.cardName}>{card.nameRu}</span>
                {card.suit && <span className={styles.cardSuit}>
                  {card.suit === 'wands' ? '🔥' : card.suit === 'cups' ? '💧' : card.suit === 'swords' ? '💨' : '🌍'}
                </span>}
              </div>
            </div>
            {reversed && <div className={styles.reversedBadge}>Перевёрнута</div>}
          </div>
          <div className={styles.back}>
            <div className={styles.backDesign}>
              <span className={styles.backSymbol}>✦</span>
              <span className={styles.backText}>Зеркало Судьбы</span>
              <span className={styles.backSymbol}>✦</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            className={styles.info}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <h3 className={styles.cardTitle}>{card.nameRu}</h3>
            <p className={styles.meaning}>
              {reversed ? card.meanings.reversed : card.meanings.upright}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
