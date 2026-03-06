import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { spreads } from '../data/spreads';
import { fullDeck } from '../data/tarot-deck';
import { fisherYatesShuffle } from '../utils/shuffle';
import { useReadingStore, DrawnCard } from '../stores/readingStore';
import { useUserStore } from '../stores/userStore';
import { useHistoryStore } from '../stores/historyStore';
import CardReveal from '../components/CardReveal/CardReveal';
import { useHaptic } from '../hooks/useHaptic';
import { api } from '../services/api';
import styles from './TarotPage.module.scss';

type Phase = 'choose' | 'question' | 'draw' | 'result';

export default function TarotPage() {
  const [phase, setPhase] = useState<Phase>('choose');
  const {
    spreadType, question, area, drawnCards, interpretation, isInterpreting,
    setSpreadType, setQuestion, setArea, addDrawnCard, setInterpretation,
    setIsInterpreting, reset,
  } = useReadingStore();
  const { profile, addExperience } = useUserStore();
  const { addReading } = useHistoryStore();
  const { impact, notification } = useHaptic();

  const spread = spreads.find((s) => s.id === spreadType);
  const [shuffledDeck, setShuffledDeck] = useState(fullDeck);
  const [drawIndex, setDrawIndex] = useState(0);

  const handleSelectSpread = useCallback((id: string) => {
    impact('light');
    reset();
    setSpreadType(id);
    const selected = spreads.find((s) => s.id === id);
    if (selected) {
      const categoryToArea: Record<string, typeof area> = {
        love: 'love',
        career: 'career',
      };
      if (categoryToArea[selected.category]) {
        setArea(categoryToArea[selected.category]);
      }
    }
    setPhase('question');
  }, [impact, reset, setSpreadType, setArea]);

  const handleStartDraw = useCallback(() => {
    impact('medium');
    setShuffledDeck(fisherYatesShuffle(fullDeck));
    setDrawIndex(0);
    setPhase('draw');
  }, [impact]);

  const buildLocalInterpretation = useCallback((cards: DrawnCard[]): string => {
    const lines: string[] = [];
    lines.push(`✨ Ваш расклад раскрывает следующие энергии:\n`);
    cards.forEach((dc) => {
      const meaning = dc.reversed ? dc.card.meanings.reversed : dc.card.meanings.upright;
      lines.push(`📍 ${dc.positionName} — ${dc.card.nameRu}${dc.reversed ? ' (перевёрнута)' : ''}`);
      lines.push(meaning);
      lines.push('');
    });
    if (cards.length > 1) {
      lines.push(`💫 Совет: ${cards[0].card.advice}`);
    }
    lines.push(`\n«${cards[cards.length - 1].card.affirmation}»`);
    return lines.join('\n');
  }, []);

  const saveToHistory = useCallback((cards: DrawnCard[], spreadName: string, interp: string) => {
    addReading({
      type: 'tarot',
      title: spreadName,
      cards: cards.map((dc) => ({
        cardId: dc.card.id,
        cardName: dc.card.nameRu,
        cardImage: dc.card.image,
        reversed: dc.reversed,
        positionName: dc.positionName,
      })),
      spreadName,
      area,
      question: question || undefined,
      interpretation: interp,
    });
  }, [addReading, area, question]);

  const requestInterpretation = useCallback(async (cards: DrawnCard[], spreadName: string) => {
    setIsInterpreting(true);
    let interp: string;
    try {
      const result = await api.post<{ interpretation: string }>('/interpret', {
        spreadType: spreadName,
        cards: cards.map((dc) => ({
          position: dc.positionName,
          cardName: `${dc.card.nameRu} (${dc.card.name})`,
          reversed: dc.reversed,
        })),
        question: question || undefined,
        area,
        userProfile: {
          zodiacSign: profile.zodiacSign,
          lifePathNumber: profile.lifePathNumber,
        },
      });
      interp = result.interpretation;
    } catch {
      interp = buildLocalInterpretation(cards);
    }
    setInterpretation(interp);
    saveToHistory(cards, spreadName, interp);
    setIsInterpreting(false);
  }, [question, area, profile, setInterpretation, setIsInterpreting, buildLocalInterpretation, saveToHistory]);

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
    const newIndex = drawIndex + 1;
    setDrawIndex(newIndex);

    if (newIndex >= spread.cardCount) {
      setTimeout(() => {
        notification('success');
        addExperience(25);
        setPhase('result');
        const allCards = [...useReadingStore.getState().drawnCards];
        requestInterpretation(allCards, spread.name);
      }, 600);
    }
  }, [spread, drawIndex, shuffledDeck, impact, notification, addDrawnCard, addExperience, requestInterpretation]);

  const handleReset = () => {
    reset();
    setPhase('choose');
  };

  return (
    <motion.div className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className={styles.title}>Гадание на Таро</h1>

      <AnimatePresence mode="wait">
        {phase === 'choose' && (
          <motion.div key="choose" className={styles.spreads} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className={styles.subtitle}>Выберите расклад</p>
            <div className={styles.spreadGrid}>
              {spreads.map((s) => (
                <motion.button
                  key={s.id}
                  className={styles.spreadCard}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelectSpread(s.id)}
                >
                  <span className={styles.spreadIcon}>{s.icon}</span>
                  <span className={styles.spreadName}>{s.name}</span>
                  <span className={styles.spreadCount}>{s.cardCount} {s.cardCount === 1 ? 'карта' : s.cardCount < 5 ? 'карты' : 'карт'}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'question' && spread && (
          <motion.div key="question" className={styles.questionPhase} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <h2 className={styles.spreadTitle}>{spread.name}</h2>
            <p className={styles.spreadDesc}>{spread.description}</p>

            {spread.category === 'general' ? (
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
            ) : (
              <div className={styles.areaFixed}>
                <span className={styles.areaFixedIcon}>
                  {spread.category === 'love' ? '❤️' : spread.category === 'career' ? '💼' : '🌟'}
                </span>
                <span className={styles.areaFixedText}>
                  {spread.category === 'love' ? 'Любовь и отношения' : spread.category === 'career' ? 'Карьера и финансы' : 'Общее'}
                </span>
              </div>
            )}

            <textarea
              className={styles.questionInput}
              placeholder="Задайте вопрос (необязательно)..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
            />

            <motion.button className={styles.startBtn} whileTap={{ scale: 0.96 }} onClick={handleStartDraw}>
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
                  <img src="/cards/card_back.webp" alt="Deck" className={styles.deckImg} />
                  <span className={styles.deckLabel}>Нажмите для вытягивания</span>
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
                  <div className={styles.resultCardRow}>
                    <img src={dc.card.image} alt={dc.card.nameRu} className={styles.resultCardImg} />
                    <div className={styles.resultCardBody}>
                      <span className={styles.resultPos}>{dc.positionName}</span>
                      <span className={styles.resultName}>
                        {dc.card.nameRu} {dc.reversed ? '(перевёрнута)' : ''}
                      </span>
                      <p className={styles.resultMeaning}>
                        {dc.reversed ? dc.card.meanings.reversed : dc.card.meanings.upright}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.aiSection}>
              <h3 className={styles.aiTitle}>✨ AI-Интерпретация</h3>
              {isInterpreting ? (
                <motion.div
                  className={styles.aiLoading}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <p>Оракул читает карты...</p>
                </motion.div>
              ) : interpretation ? (
                <div className={styles.aiText}>
                  {interpretation.split('\n').map((paragraph, i) => (
                    paragraph.trim() ? <p key={i}>{paragraph}</p> : null
                  ))}
                </div>
              ) : null}
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
