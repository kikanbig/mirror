import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from './stores/appStore';
import { useTelegram } from './hooks/useTelegram';
import ParticleBackground from './components/ParticleBackground/ParticleBackground';
import BottomNav from './components/UI/BottomNav';
import SplashScreen from './components/SplashScreen/SplashScreen';
import HomePage from './pages/HomePage';
import TarotPage from './pages/TarotPage';
import SynthesisPage from './pages/SynthesisPage';
import JournalPage from './pages/JournalPage';
import ProfilePage from './pages/ProfilePage';
import { useCallback, useEffect, useState } from 'react';
import { useUserStore } from './stores/userStore';

const pageVariants = {
  initial: { opacity: 0, scale: 0.96, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: 'blur(2px)',
    transition: { duration: 0.2 },
  },
};

function PageRouter() {
  const { activeTab } = useAppStore();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'tarot' && <TarotPage />}
        {activeTab === 'synthesis' && <SynthesisPage />}
        {activeTab === 'journal' && <JournalPage />}
        {activeTab === 'profile' && <ProfilePage />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { user, isReady } = useTelegram();
  const { setProfile } = useUserStore();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        telegramId: user.id,
        firstName: user.first_name,
        username: user.username,
      });
    }
  }, [user, setProfile]);

  const handleSplashComplete = useCallback(() => setSplashDone(true), []);

  if (!isReady || !splashDone) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="app-container">
      <ParticleBackground />
      <div className="page-content">
        <PageRouter />
      </div>
      <BottomNav />
    </div>
  );
}
