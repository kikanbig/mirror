import { motion } from 'framer-motion';
import styles from './SynthesisPage.module.scss';

export default function SynthesisPage() {
  return (
    <motion.div className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={styles.header}>
        <span className={styles.icon}>✨</span>
        <h1 className={styles.title}>Синтез Судьбы</h1>
      </div>
      <p className={styles.description}>
        Уникальная функция, объединяющая таро, нумерологию, астрологию и руны в единое предсказание, созданное специально для вас.
      </p>
      <div className={styles.features}>
        <div className={styles.feature}>
          <span>🃏</span>
          <span>Карта таро</span>
        </div>
        <div className={styles.feature}>
          <span>ᚱ</span>
          <span>Руна дня</span>
        </div>
        <div className={styles.feature}>
          <span>🌙</span>
          <span>Фаза луны</span>
        </div>
        <div className={styles.feature}>
          <span>🔢</span>
          <span>Числа судьбы</span>
        </div>
      </div>
      <motion.button className={styles.btn} whileTap={{ scale: 0.96 }}>
        Получить Синтез
      </motion.button>
      <p className={styles.hint}>Доступно 1 раз в неделю бесплатно</p>
    </motion.div>
  );
}
