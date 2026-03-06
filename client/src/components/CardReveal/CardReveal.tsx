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
      >
        <motion.div
          className={styles.inner}
          animate={{ rotateY: isFlipped ? 0 : 180 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 25 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className={styles.front} style={{ transform: reversed ? 'rotate(180deg)' : undefined }}>
            <img src={card.image} alt={card.nameRu} className={styles.cardImg} />
          </div>
          <div className={styles.back}>
            <img src="/cards/card_back.webp" alt="Card back" className={styles.cardImg} />
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
            <h3 className={styles.cardTitle}>
              {card.nameRu} {reversed ? '(перевёрнута)' : ''}
            </h3>
            <p className={styles.meaning}>
              {reversed ? card.meanings.reversed : card.meanings.upright}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
