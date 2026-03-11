import { motion } from 'framer-motion';
import DailyCard from '../components/DailyCard/DailyCard';
import MoonPhase from '../components/MoonPhase/MoonPhase';
import { useUserStore } from '../stores/userStore';
import { useAppStore } from '../stores/appStore';
import { getDailyAffirmation, getDailyAffirmationIndex } from '../data/affirmations';
import { localizeAffirmation } from '../i18n/data';
import { useTranslation } from '../i18n';
import styles from './HomePage.module.scss';

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

export default function HomePage() {
  const { profile } = useUserStore();
  const { setActiveSubPage } = useAppStore();
  const { t, lang } = useTranslation();
  const userId = String(profile.telegramId || 'guest');
  const baseAff = getDailyAffirmation(userId);
  const affIndex = getDailyAffirmationIndex(userId);
  const affirmation = { ...baseAff, text: localizeAffirmation(baseAff.text, affIndex, lang) };
  const levelName = t(`level.${Math.min(profile.level, 10)}`);

  const greetingName = profile.firstName || t('home.guest');

  const featureCards = [
    { id: 'runes', icon: 'ᚱ', title: t('home.runes'), subtitle: t('home.runes.sub') },
    { id: 'numerology', icon: '∞', title: t('home.numerology'), subtitle: t('home.numerology.sub') },
    { id: 'lunar', icon: '🌙', title: t('home.lunar'), subtitle: t('home.lunar.sub') },
  ];

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
          <p className={styles.subtitle}>{t('home.slogan')}</p>
        </div>
        <div className={styles.level}>
          <span className={styles.levelBadge}>{t('home.level', { level: profile.level })}</span>
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
            {t('home.streak', { count: profile.streak, days: profile.streak === 1 ? t('home.streak.1') : profile.streak < 5 ? t('home.streak.2-4') : t('home.streak.5+') })}
          </span>
        </motion.div>
      )}

      <motion.div className={styles.affirmation} variants={fadeUp}>
        <span className={styles.affirmationLabel}>{t('home.affirmation')}</span>
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
