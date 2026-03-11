import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/appStore';
import { useHaptic } from '../../hooks/useHaptic';
import { useTranslation } from '../../i18n';
import { HomeIcon, TarotIcon, SynthesisIcon, JournalIcon, ProfileIcon } from '../icons/NavIcons';
import styles from './BottomNav.module.scss';

const tabDefs = [
  { id: 'home', key: 'nav.home', Icon: HomeIcon },
  { id: 'tarot', key: 'nav.tarot', Icon: TarotIcon },
  { id: 'synthesis', key: 'nav.synthesis', Icon: SynthesisIcon, center: true },
  { id: 'journal', key: 'nav.journal', Icon: JournalIcon },
  { id: 'profile', key: 'nav.profile', Icon: ProfileIcon },
];

export default function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();
  const { selection } = useHaptic();
  const { t } = useTranslation();
  const tabs = tabDefs.map((d) => ({ ...d, label: t(d.key) }));

  return (
    <nav className={styles.nav}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`${styles.tab} ${isActive ? styles.active : ''} ${tab.center ? styles.center : ''}`}
            onClick={() => {
              selection();
              setActiveTab(tab.id);
            }}
          >
            {tab.center ? (
              <motion.div
                className={styles.centerBtn}
                whileTap={{ scale: 0.9 }}
                animate={isActive ? {
                  boxShadow: [
                    '0 0 20px rgba(212,175,55,0.3)',
                    '0 0 35px rgba(212,175,55,0.5)',
                    '0 0 20px rgba(212,175,55,0.3)',
                  ],
                } : { boxShadow: '0 4px 20px rgba(212,175,55,0.2)' }}
                transition={isActive ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
              >
                <tab.Icon active={isActive} />
              </motion.div>
            ) : (
              <>
                <tab.Icon active={isActive} />
                <motion.span
                  className={styles.label}
                  animate={{ opacity: isActive ? 1 : 0.5, y: isActive ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {tab.label}
                </motion.span>
                {isActive && (
                  <motion.div
                    className={styles.indicator}
                    layoutId="nav-indicator"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </>
            )}
          </button>
        );
      })}
    </nav>
  );
}
