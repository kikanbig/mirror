import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getMoonPhase } from '../../data/moon-phases';
import styles from './MoonPhase.module.scss';

export default function MoonPhase() {
  const moon = useMemo(() => getMoonPhase(), []);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className={styles.moonVisual}>
        <div className={styles.moonGlow} />
        <span className={styles.moonEmoji}>{moon.emoji}</span>
      </div>
      <div className={styles.info}>
        <h3 className={styles.phase}>{moon.phaseRu}</h3>
        <p className={styles.detail}>
          Освещённость: {Math.round(moon.illumination * 100)}%
        </p>
        <p className={styles.detail}>
          Возраст: {Math.round(moon.age)} дн. • {moon.isWaxing ? 'Растущая' : 'Убывающая'}
        </p>
      </div>
    </motion.div>
  );
}
