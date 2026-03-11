import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotCard } from '../../data/tarot-types';
import { useHaptic } from '../../hooks/useHaptic';
import { useTranslation } from '../../i18n';
import CardZoom from '../CardZoom/CardZoom';
import styles from './CardReveal.module.scss';

interface Props {
  card: TarotCard;
  reversed: boolean;
  positionName?: string;
  delay?: number;
  onReveal?: () => void;
  labelBelow?: boolean;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
}

let sparkId = 0;

function ParticleBurst({ active }: { active: boolean }) {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const fired = useRef(false);

  useEffect(() => {
    if (active && !fired.current) {
      fired.current = true;
      const newSparks: Spark[] = [];
      const colors = ['#D4AF37', '#FFD700', '#8B5CF6', '#F5F5F5'];
      for (let i = 0; i < 16; i++) {
        newSparks.push({
          id: sparkId++,
          x: 0,
          y: 0,
          angle: (Math.PI * 2 * i) / 16 + Math.random() * 0.4,
          speed: 40 + Math.random() * 60,
          size: 3 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setSparks(newSparks);
      setTimeout(() => setSparks([]), 700);
    }
  }, [active]);

  return (
    <div className={styles.burstContainer}>
      {sparks.map((s) => (
        <motion.div
          key={s.id}
          className={styles.spark}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(s.angle) * s.speed,
            y: Math.sin(s.angle) * s.speed,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            width: s.size,
            height: s.size,
            background: s.color,
            borderRadius: '50%',
            boxShadow: `0 0 6px ${s.color}`,
          }}
        />
      ))}
    </div>
  );
}

export default function CardReveal({ card, reversed, positionName, delay = 0, onReveal, labelBelow }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const { impact, notification } = useHaptic();
  const { t } = useTranslation();

  const handleTap = useCallback(() => {
    if (!isFlipped) {
      impact('medium');
      setIsFlipped(true);
      setShowBurst(true);
      setTimeout(() => notification('success'), 400);
      onReveal?.();
    } else {
      impact('light');
      setZoomed(true);
    }
  }, [isFlipped, impact, notification, onReveal]);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
    >
      {positionName && !labelBelow && <div className={styles.position}>{positionName}</div>}
      <motion.div
        className={`${styles.card} ${isFlipped ? styles.cardRevealed : ''} ${isFlipped && reversed ? styles.cardReversed : ''}`}
        onClick={handleTap}
        whileTap={!isFlipped ? { scale: 0.95 } : {}}
        animate={isFlipped ? {
          scale: [1, 1.08, 1],
          transition: { duration: 0.5, times: [0, 0.3, 1] },
        } : {}}
      >
        <ParticleBurst active={showBurst} />

        <motion.div
          className={styles.inner}
          animate={{ rotateY: isFlipped ? 0 : 180 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 25 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className={styles.front}>
            <img src={card.image} alt={card.nameRu} className={styles.cardImg} />
            {reversed && <div className={styles.reversedBadge}>{t('tarot.reversed')[0].toUpperCase() + t('tarot.reversed').slice(1)}</div>}
          </div>
          <div className={styles.back}>
            <img src="/cards/card_back.webp" alt="Card back" className={styles.cardImg} />
          </div>
        </motion.div>

        {isFlipped && (
          <motion.div
            className={styles.glow}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.div>
      {positionName && labelBelow && <div className={`${styles.position} ${styles.positionBelow}`}>{positionName}</div>}
      <AnimatePresence>
        {isFlipped && (
          <motion.div
            className={styles.info}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <h3 className={styles.cardTitle}>
              {card.nameRu} {reversed ? `(${t('tarot.reversed')})` : ''}
            </h3>
            <p className={styles.meaning}>
              {reversed ? card.meanings.reversed : card.meanings.upright}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {zoomed && (
          <CardZoom
            src={card.image}
            name={card.nameRu}
            reversed={reversed}
            onClose={() => setZoomed(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
