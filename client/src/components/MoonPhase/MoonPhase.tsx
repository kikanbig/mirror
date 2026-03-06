import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getMoonPhase } from '../../data/moon-phases';
import styles from './MoonPhase.module.scss';

function MoonSvg({ illumination, isWaxing }: { illumination: number; isWaxing: boolean }) {
  const r = 22;
  const cx = 25;
  const cy = 25;

  const phase = illumination;
  const curveX = cx + r * (1 - 2 * phase) * (isWaxing ? 1 : -1);

  const lightSide = isWaxing ? 'right' : 'left';

  return (
    <svg viewBox="0 0 50 50" className={styles.moonSvg}>
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(212, 175, 55, 0.2)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r + 8} fill="url(#moonGlow)" />
      {/* Dark side */}
      <circle cx={cx} cy={cy} r={r} fill="#1a1a3e" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />
      {/* Lit side */}
      <path
        d={`M ${cx} ${cy - r}
            A ${r} ${r} 0 0 ${lightSide === 'right' ? 1 : 0} ${cx} ${cy + r}
            Q ${curveX} ${cy} ${cx} ${cy - r} Z`}
        fill="rgba(212, 175, 55, 0.85)"
        filter="url(#moonGlow)"
      />
    </svg>
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
        <MoonSvg illumination={moon.illumination} isWaxing={moon.isWaxing} />
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
