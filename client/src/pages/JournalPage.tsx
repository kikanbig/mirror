import { motion } from 'framer-motion';
import styles from './JournalPage.module.scss';

export default function JournalPage() {
  return (
    <motion.div className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className={styles.title}>Дневник Предсказаний</h1>
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>📔</span>
        <p className={styles.emptyText}>Ваш дневник пока пуст</p>
        <p className={styles.emptyHint}>Сделайте первый расклад, и он появится здесь</p>
      </div>
    </motion.div>
  );
}
