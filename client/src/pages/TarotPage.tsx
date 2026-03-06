import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { spreads } from '../data/spreads';
import { fullDeck } from '../data/tarot-deck';
import { fisherYatesShuffle } from '../utils/shuffle';
import { useReadingStore, DrawnCard } from '../stores/readingStore';
import { useUserStore } from '../stores/userStore';
import CardReveal from '../components/CardReveal/CardReveal';
import { useHaptic } from '../hooks/useHaptic';
import styles from './TarotPage.module.scss';

type Phase = 'choose' | 'question' | 'draw' | 'result';

export default function TarotPage() {
  const [phase, setPhase] = useState<Phase>('choose');
  const {
    spreadType, question, area, drawnCards,
    setSpreadType, setQuestion, setArea, addDrawnCard, reset,
  } = useReadingStore();
  const { addExperience } = useUserStore();
  const { impact, notification } = useHaptic();

  const spread = spreads.find((s) => s.id === spreadType);
  const [shuffledDeck, setShuffledDeck] = useState(fullDeck);
  const [drawIndex, setDrawIndex] = useState(0);

  const handleSelectSpread = useCallback((id: string) => {
    impact('light');
    reset();
    setSpreadType(id);
    setPhase('question');
  }, [impact, reset, setSpreadType]);

  const handleStartDraw = useCallback(() => {
    impact('medium');
    setShuffledDeck(fisherYatesShuffle(fullDeck));
    setDrawIndex(0);
    setPhase('draw');
  }, [impact]);

  const handleDrawCard = useCallback(() => {
    if (!spread || drawIndex >= spread.cardCount) return;
    impact('heavy');

    const card = shuffledDeck[drawIndex];
    const reversed = Math.random() < 0.3;
    const position = spread.positions[drawIndex];

    const drawn: DrawnCard = {
      card,
      reversed,
      position: drawIndex,
      positionName: position.name,
    };

    addDrawnCard(drawn);
    setDrawIndex((p) => p + 1);

    if (drawIndex + 1 >= spread.cardCount) {
      setTimeout(() => {
        notification('success');
        addExperience(25);
        setPhase('result');
      }, 600);
    }
  }, [spread, drawIndex, shuffledDeck, impact, notification, addDrawnCard, addExperience]);

  const handleReset = () => {
    reset();
    setPhase('choose');
  };

  return (
    <motion.div
      className={styles.page}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className={styles.title}>Гадание на Таро</h1>

      <AnimatePresence mode="wait">
        {phase === 'choose' && (
          <motion.div key="choose" className={styles.spreads} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className={styles.subtitle}>Выберите расклад</p>
            <div className={styles.spreadGrid}>
              {spreads.filter(s => s.category !== 'spiritual').map((s) => (
                <motion.button
                  key={s.id}
                  className={`${styles.spreadCard} ${s.isPremium ? styles.premium : ''}`}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelectSpread(s.id)}
                >
                  <span className={styles.spreadIcon}>{s.icon}</span>
                  <span className={styles.spreadName}>{s.name}</span>
                  <span className={styles.spreadCount}>{s.cardCount} {s.cardCount === 1 ? 'карта' : s.cardCount < 5 ? 'карты' : 'карт'}</span>
                  {s.isPremium && <span className={styles.premiumBadge}>Premium</span>}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'question' && spread && (
          <motion.div key="question" className={styles.questionPhase} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <h2 className={styles.spreadTitle}>{spread.name}</h2>
            <p className={styles.spreadDesc}>{spread.description}</p>

            <div className={styles.areaSelect}>
              <p className={styles.areaLabel}>Область вопроса:</p>
              <div className={styles.areaOptions}>
                {(['general', 'love', 'career', 'health'] as const).map((a) => (
                  <button
                    key={a}
                    className={`${styles.areaBtn} ${area === a ? styles.areaActive : ''}`}
                    onClick={() => { setArea(a); impact('light'); }}
                  >
                    {a === 'general' ? '🌟 Общее' : a === 'love' ? '❤️ Любовь' : a === 'career' ? '💼 Карьера' : '🌿 Здоровье'}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className={styles.questionInput}
              placeholder="Задайте вопрос (необязательно)..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
            />

            <motion.button
              className={styles.startBtn}
              whileTap={{ scale: 0.96 }}
              onClick={handleStartDraw}
            >
              Начать расклад
            </motion.button>
          </motion.div>
        )}

        {phase === 'draw' && spread && (
          <motion.div key="draw" className={styles.drawPhase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className={styles.drawProgress}>
              Вытянуто: {drawnCards.length} / {spread.cardCount}
            </p>

            <motion.div className={styles.deckArea} onClick={handleDrawCard} whileTap={{ scale: 0.96 }}>
              {drawIndex < spread.cardCount && (
                <motion.div
                  className={styles.deckCard}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                  <div className={styles.deckInner}>
                    <span>✦</span>
                    <span className={styles.deckLabel}>Нажмите для вытягивания</span>
                    <span>✦</span>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <div className={styles.drawnCards}>
              {drawnCards.map((dc, i) => (
                <CardReveal
                  key={dc.card.id}
                  card={dc.card}
                  reversed={dc.reversed}
                  positionName={dc.positionName}
                  delay={i * 0.1}
                />
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div key="result" className={styles.resultPhase} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className={styles.resultTitle}>Ваш расклад</h2>

            <div className={styles.resultCards}>
              {drawnCards.map((dc) => (
                <div key={dc.card.id} className={styles.resultCard}>
                  <div className={styles.resultCardHeader}>
                    <span className={styles.resultPos}>{dc.positionName}</span>
                    <span className={styles.resultName}>
                      {dc.card.nameRu} {dc.reversed ? '(перевёрнута)' : ''}
                    </span>
                  </div>
                  <p className={styles.resultMeaning}>
                    {dc.reversed ? dc.card.meanings.reversed : dc.card.meanings.upright}
                  </p>
                  {area === 'love' && (
                    <p className={styles.resultExtra}>
                      ❤️ {dc.reversed ? dc.card.love.reversed : dc.card.love.upright}
                    </p>
                  )}
                  {area === 'career' && (
                    <p className={styles.resultExtra}>
                      💼 {dc.reversed ? dc.card.career.reversed : dc.card.career.upright}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <motion.button className={styles.resetBtn} whileTap={{ scale: 0.96 }} onClick={handleReset}>
              Новый расклад
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
