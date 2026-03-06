import { motion } from 'framer-motion';
import DailyCard from '../components/DailyCard/DailyCard';
import MoonPhase from '../components/MoonPhase/MoonPhase';
import { useUserStore } from '../stores/userStore';
import { getDailyAffirmation } from '../data/affirmations';
import styles from './HomePage.module.scss';

const LEVELS = ['Неофит', 'Ученик', 'Адепт', 'Мистик', 'Оракул', 'Провидец', 'Мастер Арканов', 'Хранитель Тайн', 'Архимаг', 'Просветлённый'];

export default function HomePage() {
  const { profile } = useUserStore();
  const userId = String(profile.telegramId || 'guest');
  const affirmation = getDailyAffirmation(userId);
  const levelName = LEVELS[Math.min(profile.level - 1, LEVELS.length - 1)];

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className={styles.header}>
        <div>
          <h1 className={styles.greeting}>
            {profile.firstName ? `${profile.firstName},` : 'Добро пожаловать,'}
          </h1>
          <p className={styles.subtitle}>добро пожаловать в Зеркало Судьбы</p>
        </div>
        <div className={styles.level}>
          <span className={styles.levelBadge}>Ур. {profile.level}</span>
          <span className={styles.levelName}>{levelName}</span>
        </div>
      </header>

      {profile.streak > 0 && (
        <motion.div
          className={styles.streak}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          🔥 Серия: {profile.streak} {profile.streak === 1 ? 'день' : profile.streak < 5 ? 'дня' : 'дней'}
        </motion.div>
      )}

      <motion.div
        className={styles.affirmation}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className={styles.affirmationLabel}>Послание дня</span>
        <p className={styles.affirmationText}>«{affirmation.text}»</p>
      </motion.div>

      <MoonPhase />

      <DailyCard />
    </motion.div>
  );
}
