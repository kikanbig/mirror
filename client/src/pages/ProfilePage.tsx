import { motion } from 'framer-motion';
import { useUserStore } from '../stores/userStore';
import styles from './ProfilePage.module.scss';

const LEVELS = ['Неофит', 'Ученик', 'Адепт', 'Мистик', 'Оракул', 'Провидец', 'Мастер Арканов', 'Хранитель Тайн', 'Архимаг', 'Просветлённый'];
const XP_PER_LEVEL = 100;

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ProfilePage() {
  const { profile } = useUserStore();
  const levelName = LEVELS[Math.min(profile.level - 1, LEVELS.length - 1)];
  const xpInLevel = profile.experience % XP_PER_LEVEL;
  const progress = (xpInLevel / XP_PER_LEVEL) * 100;

  return (
    <motion.div
      className={styles.page}
      initial="initial"
      animate="animate"
      variants={stagger}
    >
      <motion.h1 className={styles.title} variants={fadeUp}>Духовный Профиль</motion.h1>

      <motion.div className={styles.card} variants={fadeUp}>
        <div className={styles.avatarWrapper}>
          <motion.div
            className={styles.avatarRing}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <div className={styles.avatar}>
            <svg viewBox="0 0 24 24" className={styles.avatarIcon} fill="none">
              <path
                d="M12 2L6 8l6 13 6-13-6-6z"
                stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
              />
              <path d="M6 8h12M12 8v13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <h2 className={styles.name}>{profile.firstName || 'Путник'}</h2>
        {profile.zodiacSign && (
          <span className={styles.zodiac}>{profile.zodiacSign}</span>
        )}
      </motion.div>

      <motion.div className={styles.levelCard} variants={fadeUp}>
        <div className={styles.levelHeader}>
          <span className={styles.levelLabel}>Уровень {profile.level}</span>
          <span className={styles.levelName}>{levelName}</span>
        </div>
        <div className={styles.progressBar}>
          <motion.div
            className={styles.progressFill}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          />
          <motion.div
            className={styles.progressShimmer}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}
          />
        </div>
        <div className={styles.xpText}>
          {xpInLevel} / {XP_PER_LEVEL} XP
        </div>
      </motion.div>

      <motion.div className={styles.statsGrid} variants={stagger}>
        {[
          { value: profile.experience, label: 'Общий XP' },
          { value: profile.streak, label: 'Дней подряд' },
          { value: profile.lifePathNumber || '—', label: 'Число Пути' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className={styles.stat}
            variants={fadeUp}
            whileHover={{ borderColor: 'rgba(212,175,55,0.2)' }}
          >
            <motion.span
              className={styles.statValue}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 300 }}
            >
              {stat.value}
            </motion.span>
            <span className={styles.statLabel}>{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {profile.lifePathNumber && (
        <motion.div className={styles.numbersCard} variants={fadeUp}>
          <h3 className={styles.sectionTitle}>Нумерология</h3>
          {[
            { label: 'Число Жизненного Пути', value: profile.lifePathNumber },
            profile.soulNumber ? { label: 'Число Души', value: profile.soulNumber } : null,
            profile.destinyNumber ? { label: 'Число Судьбы', value: profile.destinyNumber } : null,
          ].filter(Boolean).map((item, i) => (
            <motion.div
              key={item!.label}
              className={styles.numberRow}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <span className={styles.numLabel}>{item!.label}</span>
              <motion.span
                className={styles.numValue}
                animate={{
                  textShadow: [
                    '0 0 8px rgba(139,92,246,0.3)',
                    '0 0 16px rgba(139,92,246,0.5)',
                    '0 0 8px rgba(139,92,246,0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {item!.value}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
