import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getMoonPhase } from '../../data/moon-phases';
import styles from './MoonPhase.module.scss';

function MoonDisc({ illumination, isWaxing }: { illumination: number; isWaxing: boolean }) {
  const shadowX = isWaxing ? (1 - illumination) * 100 : illumination * -100;

  return (
    <div className={styles.moonDisc}>
      <div className={styles.moonSphere}>
        <div
          className={styles.moonShadow}
          style={{
            background: `radial-gradient(circle at ${50 + shadowX * 0.5}% 50%, transparent 30%, rgba(10,10,26,0.95) 55%)`,
          }}
        />
      </div>
    </div>
  );
}

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
        <motion.div
          className={styles.moonGlow}
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <MoonDisc illumination={moon.illumination} isWaxing={moon.isWaxing} />
      </div>
      <div className={styles.info}>
        <h3 className={styles.phase}>{moon.phaseRu}</h3>
        <p className={styles.detail}>
          Освещённость: {Math.round(moon.illumination * 100)}%
        </p>
        <p className={styles.detail}>
          Возраст: {Math.round(moon.age)} дн. &#183; {moon.isWaxing ? 'Растущая' : 'Убывающая'}
        </p>
      </div>
    </motion.div>
  );
}
