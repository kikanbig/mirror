import { motion } from 'framer-motion';
import { useUserStore } from '../stores/userStore';
import styles from './ProfilePage.module.scss';

const LEVELS = ['Неофит', 'Ученик', 'Адепт', 'Мистик', 'Оракул', 'Провидец', 'Мастер Арканов', 'Хранитель Тайн', 'Архимаг', 'Просветлённый'];
const XP_PER_LEVEL = 100;

export default function ProfilePage() {
  const { profile } = useUserStore();
  const levelName = LEVELS[Math.min(profile.level - 1, LEVELS.length - 1)];
  const xpInLevel = profile.experience % XP_PER_LEVEL;
  const progress = (xpInLevel / XP_PER_LEVEL) * 100;

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className={styles.title}>Духовный Профиль</h1>

      <div className={styles.card}>
        <div className={styles.avatar}>
          <span className={styles.avatarEmoji}>🔮</span>
        </div>
        <h2 className={styles.name}>{profile.firstName || 'Путник'}</h2>
        {profile.zodiacSign && (
          <span className={styles.zodiac}>{profile.zodiacSign}</span>
        )}
      </div>

      <div className={styles.levelCard}>
        <div className={styles.levelHeader}>
          <span className={styles.levelLabel}>Уровень {profile.level}</span>
          <span className={styles.levelName}>{levelName}</span>
        </div>
        <div className={styles.progressBar}>
          <motion.div
            className={styles.progressFill}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className={styles.xpText}>
          {xpInLevel} / {XP_PER_LEVEL} XP
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{profile.experience}</span>
          <span className={styles.statLabel}>Общий XP</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{profile.streak}</span>
          <span className={styles.statLabel}>Дней подряд</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{profile.lifePathNumber || '—'}</span>
          <span className={styles.statLabel}>Число Пути</span>
        </div>
      </div>

      {profile.lifePathNumber && (
        <div className={styles.numbersCard}>
          <h3 className={styles.sectionTitle}>Нумерология</h3>
          <div className={styles.numberRow}>
            <span className={styles.numLabel}>Число Жизненного Пути</span>
            <span className={styles.numValue}>{profile.lifePathNumber}</span>
          </div>
          {profile.soulNumber && (
            <div className={styles.numberRow}>
              <span className={styles.numLabel}>Число Души</span>
              <span className={styles.numValue}>{profile.soulNumber}</span>
            </div>
          )}
          {profile.destinyNumber && (
            <div className={styles.numberRow}>
              <span className={styles.numLabel}>Число Судьбы</span>
              <span className={styles.numValue}>{profile.destinyNumber}</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
