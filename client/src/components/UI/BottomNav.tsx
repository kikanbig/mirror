import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/appStore';
import { useHaptic } from '../../hooks/useHaptic';
import styles from './BottomNav.module.scss';

const tabs = [
  { id: 'home', label: 'Главная', icon: '🏠' },
  { id: 'tarot', label: 'Таро', icon: '🃏' },
  { id: 'synthesis', label: 'Синтез', icon: '✨', center: true },
  { id: 'journal', label: 'Дневник', icon: '📔' },
  { id: 'profile', label: 'Профиль', icon: '👤' },
];

export default function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();
  const { selection } = useHaptic();

  return (
    <nav className={styles.nav}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''} ${tab.center ? styles.center : ''}`}
          onClick={() => {
            selection();
            setActiveTab(tab.id);
          }}
        >
          {tab.center ? (
            <motion.div
              className={styles.centerBtn}
              whileTap={{ scale: 0.9 }}
              animate={activeTab === tab.id ? { boxShadow: '0 0 25px rgba(212,175,55,0.5)' } : {}}
            >
              <span className={styles.centerIcon}>{tab.icon}</span>
            </motion.div>
          ) : (
            <>
              <span className={styles.icon}>{tab.icon}</span>
              <span className={styles.label}>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div className={styles.indicator} layoutId="nav-indicator" />
              )}
            </>
          )}
        </button>
      ))}
    </nav>
  );
}
