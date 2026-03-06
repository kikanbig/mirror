import { AnimatePresence } from 'framer-motion';
import { useAppStore } from './stores/appStore';
import { useTelegram } from './hooks/useTelegram';
import ParticleBackground from './components/ParticleBackground/ParticleBackground';
import BottomNav from './components/UI/BottomNav';
import HomePage from './pages/HomePage';
import TarotPage from './pages/TarotPage';
import SynthesisPage from './pages/SynthesisPage';
import JournalPage from './pages/JournalPage';
import ProfilePage from './pages/ProfilePage';
import { useEffect } from 'react';
import { useUserStore } from './stores/userStore';

function PageRouter() {
  const { activeTab } = useAppStore();

  return (
    <AnimatePresence mode="wait">
      {activeTab === 'home' && <HomePage key="home" />}
      {activeTab === 'tarot' && <TarotPage key="tarot" />}
      {activeTab === 'synthesis' && <SynthesisPage key="synthesis" />}
      {activeTab === 'journal' && <JournalPage key="journal" />}
      {activeTab === 'profile' && <ProfilePage key="profile" />}
    </AnimatePresence>
  );
}

export default function App() {
  const { user, isReady } = useTelegram();
  const { setProfile } = useUserStore();

  useEffect(() => {
    if (user) {
      setProfile({
        telegramId: user.id,
        firstName: user.first_name,
        username: user.username,
      });
    }
  }, [user, setProfile]);

  if (!isReady) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#0A0A1A',
        color: '#D4AF37',
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: '1rem',
      }}>
        Зеркало Судьбы...
      </div>
    );
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
