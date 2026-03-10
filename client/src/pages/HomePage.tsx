import { motion } from 'framer-motion';
import DailyCard from '../components/DailyCard/DailyCard';
import MoonPhase from '../components/MoonPhase/MoonPhase';
import { useUserStore } from '../stores/userStore';
import { useAppStore } from '../stores/appStore';
import { getDailyAffirmation } from '../data/affirmations';
import styles from './HomePage.module.scss';

const LEVELS = ['Неофит', 'Ученик', 'Адепт', 'Мистик', 'Оракул', 'Провидец', 'Мастер Арканов', 'Хранитель Тайн', 'Архимаг', 'Просветлённый'];

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

const featureCards = [
  { id: 'runes', icon: 'ᚱ', title: 'Руны', subtitle: 'Древняя мудрость Футарка' },
  { id: 'numerology', icon: '∞', title: 'Нумерология', subtitle: 'Числа Судьбы' },
  { id: 'lunar', icon: '🌙', title: 'Луна', subtitle: 'Лунный Календарь' },
];

export default function HomePage() {
  const { profile } = useUserStore();
  const { setActiveSubPage } = useAppStore();
  const userId = String(profile.telegramId || 'guest');
  const affirmation = getDailyAffirmation(userId);
  const levelName = LEVELS[Math.min(profile.level - 1, LEVELS.length - 1)];

  const greetingName = profile.firstName || 'Путник';

  return (
    <motion.div
      className={styles.page}
      initial="initial"
      animate="animate"
      variants={stagger}
    >
      <motion.header className={styles.header} variants={fadeUp}>
        <div>
          <h1 className={styles.greeting}>
            {greetingName.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.04, duration: 0.3 }}
                className={styles.greetingChar}
              >
                {char}
              </motion.span>
            ))}
            <span className={styles.greetingComma}>,</span>
          </h1>
          <p className={styles.subtitle}>Числа. Карты. Ты.</p>
        </div>
        <div className={styles.level}>
          <span className={styles.levelBadge}>Ур. {profile.level}</span>
          <span className={styles.levelName}>{levelName}</span>
        </div>
      </motion.header>

      {profile.streak > 0 && (
        <motion.div
          className={styles.streak}
          variants={fadeUp}
        >
          <motion.img
            className={styles.streakFire}
            src="/icons/icon_streak_fire.webp"
            alt=""
            width={28}
            height={28}
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span>
            Серия: {profile.streak} {profile.streak === 1 ? 'день' : profile.streak < 5 ? 'дня' : 'дней'}
          </span>
        </motion.div>
      )}

      <motion.div className={styles.affirmation} variants={fadeUp}>
        <span className={styles.affirmationLabel}>Послание дня</span>
        <p className={styles.affirmationText}>&#171;{affirmation.text}&#187;</p>
      </motion.div>

      <motion.div variants={fadeUp}>
        <MoonPhase />
      </motion.div>

      <motion.div variants={fadeUp}>
        <DailyCard />
      </motion.div>

      <motion.div className={styles.features} variants={fadeUp}>
        {featureCards.map((f) => (
          <motion.div
            key={f.id}
            className={styles.featureCard}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveSubPage(f.id)}
          >
            <span className={styles.featureIcon}>{f.icon}</span>
            <span className={styles.featureTitle}>{f.title}</span>
            <span className={styles.featureSub}>{f.subtitle}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
