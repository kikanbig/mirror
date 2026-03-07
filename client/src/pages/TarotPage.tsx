import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { spreads } from '../data/spreads';
import { fullDeck } from '../data/tarot-deck';
import { fisherYatesShuffle } from '../utils/shuffle';
import { useReadingStore, DrawnCard } from '../stores/readingStore';
import { useAppStore } from '../stores/appStore';
import { useUserStore } from '../stores/userStore';
import { useHistoryStore } from '../stores/historyStore';
import CardReveal from '../components/CardReveal/CardReveal';
import CardZoom from '../components/CardZoom/CardZoom';
import { useHaptic } from '../hooks/useHaptic';
import { api } from '../services/api';
import styles from './TarotPage.module.scss';

type Phase = 'choose' | 'question' | 'shuffle' | 'draw' | 'result';

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

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
  const [fanCards, setFanCards] = useState<number[]>([]);
  const [shuffleStep, setShuffleStep] = useState(0);
  const [zoomCard, setZoomCard] = useState<{ src: string; name: string; reversed: boolean } | null>(null);
  const fanRef = useRef<HTMLDivElement>(null);

  const tabResetSignal = useAppStore((s) => s.tabResetSignal);
  useEffect(() => {
    if (tabResetSignal > 0) {
      reset();
      setPhase('choose');
      setDrawIndex(0);
      setFanCards([]);
      setShuffleStep(0);
      setZoomCard(null);
    }
  }, [tabResetSignal, reset]);

  const handleSelectSpread = useCallback((id: string) => {
    impact('light');
    reset();
    setSpreadType(id);
    const selected = spreads.find((s) => s.id === id);
    if (selected) {
      const categoryToArea: Record<string, typeof area> = { love: 'love', career: 'career' };
      if (categoryToArea[selected.category]) setArea(categoryToArea[selected.category]);
    }
    setPhase('question');
  }, [impact, reset, setSpreadType, setArea]);

  const handleStartDraw = useCallback(() => {
    impact('medium');
    const deck = fisherYatesShuffle(fullDeck);
    setShuffledDeck(deck);
    setDrawIndex(0);
    const currentSpreadType = useReadingStore.getState().spreadType;
    const selected = spreads.find((s) => s.id === currentSpreadType);
    const cardCount = selected?.cardCount ?? 1;
    const fanSize = cardCount <= 1 ? 15 : cardCount <= 3 ? 18 : 22;
    setFanCards(Array.from({ length: fanSize }, (_, i) => i));
    setShuffleStep(0);
    setPhase('shuffle');

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setShuffleStep(step);
      if (step >= 3) {
        clearInterval(interval);
        setTimeout(() => setPhase('draw'), 400);
      }
    }, 500);
  }, [impact]);

  const buildLocalInterpretation = useCallback((cards: DrawnCard[]): string => {
    const lines: string[] = [];
    lines.push('Ваш расклад раскрывает следующие энергии:\n');
    cards.forEach((dc) => {
      const meaning = dc.reversed ? dc.card.meanings.reversed : dc.card.meanings.upright;
      lines.push(`${dc.positionName} — ${dc.card.nameRu}${dc.reversed ? ' (перевёрнута)' : ''}`);
      lines.push(meaning);
      lines.push('');
    });
    if (cards.length > 1) lines.push(`Совет: ${cards[0].card.advice}`);
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

  const handleFanCardSelect = useCallback((fanIndex: number) => {
    if (!spread || drawIndex >= spread.cardCount) return;
    impact('heavy');

    const card = shuffledDeck[drawIndex + fanIndex];
    const reversed = Math.random() < 0.3;
    const position = spread.positions[drawIndex];

    const drawn: DrawnCard = {
      card,
      reversed,
      position: drawIndex,
      positionName: position.name,
    };

    addDrawnCard(drawn);
    setFanCards((prev) => prev.filter((_, i) => i !== fanIndex));
    const newIndex = drawIndex + 1;
    setDrawIndex(newIndex);

    setTimeout(() => {
      fanRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);

    if (newIndex >= spread.cardCount) {
      setTimeout(() => {
        notification('success');
        addExperience(25);
        setPhase('result');
        const allCards = [...useReadingStore.getState().drawnCards];
        requestInterpretation(allCards, spread.name);
      }, 800);
    }
  }, [spread, drawIndex, shuffledDeck, impact, notification, addDrawnCard, addExperience, requestInterpretation]);

  const handleReset = () => {
    reset();
    setPhase('choose');
  };

  const spreadLayout = useMemo(() => {
    if (!spread) return 'default';
    if (spread.cardCount === 1) return 'single';
    if (spread.cardCount === 3) return 'three';
    if (spread.id === 'celtic_cross') return 'celtic';
    return 'default';
  }, [spread]);

  return (
    <motion.div className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className={styles.title}>Гадание на Таро</h1>

      <AnimatePresence mode="wait">
        {/* CHOOSE SPREAD */}
        {phase === 'choose' && (
          <motion.div
            key="choose"
            className={styles.spreads}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            variants={staggerContainer}
          >
            <p className={styles.subtitle}>Выберите расклад</p>
            <motion.div className={styles.spreadGrid} variants={staggerContainer} initial="initial" animate="animate">
              {spreads.map((s) => (
                <motion.button
                  key={s.id}
                  className={styles.spreadCard}
                  variants={staggerItem}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelectSpread(s.id)}
                >
                  <img className={styles.spreadIcon} src={s.icon} alt={s.name} />
                  <span className={styles.spreadName}>{s.name}</span>
                  <span className={styles.spreadCount}>
                    {s.cardCount} {s.cardCount === 1 ? 'карта' : s.cardCount < 5 ? 'карты' : 'карт'}
                  </span>
                  {s.isPremium && <span className={styles.premiumBadge}>PRO</span>}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* QUESTION PHASE */}
        {phase === 'question' && spread && (
          <motion.div
            key="question"
            className={styles.questionPhase}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
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
                      {a === 'general' ? 'Общее' : a === 'love' ? 'Любовь' : a === 'career' ? 'Карьера' : 'Здоровье'}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.areaFixed}>
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

            <motion.button
              className={styles.startBtn}
              whileTap={{ scale: 0.96 }}
              onClick={handleStartDraw}
              whileHover={{ boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}
            >
              Начать расклад
            </motion.button>
          </motion.div>
        )}

        {/* SHUFFLE ANIMATION */}
        {phase === 'shuffle' && (
          <motion.div
            key="shuffle"
            className={styles.shufflePhase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className={styles.shuffleText}>Перетасовка колоды...</p>
            <div className={styles.shuffleDeck}>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className={styles.shuffleCard}
                  animate={{
                    x: shuffleStep % 2 === 0
                      ? (i % 2 === 0 ? -30 : 30)
                      : 0,
                    y: shuffleStep % 2 === 1 ? (i % 2 === 0 ? -15 : 15) : 0,
                    rotate: shuffleStep % 2 === 0 ? (i - 2) * 5 : (i - 2) * 2,
                    scale: shuffleStep === 3 ? 0.95 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    delay: i * 0.05,
                  }}
                >
                  <img src="/cards/card_back.webp" alt="" className={styles.shuffleCardImg} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* DRAW PHASE — FAN */}
        {phase === 'draw' && spread && (
          <motion.div
            key="draw"
            className={styles.drawPhase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className={styles.drawProgress}>
              {spread.positions[drawIndex]?.name || 'Готово'} — {drawnCards.length} / {spread.cardCount}
            </p>

            {/* Drawn cards area */}
            <div className={`${styles.drawnCards} ${styles[`layout_${spreadLayout}`]}`}>
              {drawnCards.map((dc, i) => (
                <CardReveal
                  key={dc.card.id}
                  card={dc.card}
                  reversed={dc.reversed}
                  positionName={dc.positionName}
                  delay={i * 0.1}
                  labelBelow={spreadLayout === 'celtic'}
                />
              ))}
            </div>

            {/* Fan of cards to choose from */}
            {drawIndex < spread.cardCount && (
              <div ref={fanRef} className={styles.fanContainer}>
                <p className={styles.fanHint}>Выберите карту</p>
                <div className={styles.fan}>
                  {fanCards.map((cardId, i) => {
                    const total = fanCards.length;
                    const middle = (total - 1) / 2;
                    const maxArc = 70;
                    const step = total > 1 ? maxArc / (total - 1) : 0;
                    const angle = (i - middle) * step;
                    const dist = Math.abs(i - middle) / (middle || 1);
                    const yOffset = dist * dist * 20;
                    return (
                      <div
                        key={cardId}
                        className={styles.fanCard}
                        style={{
                          transform: `rotate(${angle}deg) translateY(${yOffset}px)`,
                          zIndex: total - Math.abs(Math.round(middle) - i),
                        }}
                        onClick={() => handleFanCardSelect(i)}
                      >
                        <img src="/cards/card_back.webp" alt="Card" className={styles.fanCardImg} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* RESULT PHASE */}
        {phase === 'result' && (
          <motion.div
            key="result"
            className={styles.resultPhase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className={styles.resultTitle}>Ваш расклад</h2>

            <div className={styles.resultCards}>
              {drawnCards.map((dc, i) => (
                <motion.div
                  key={dc.card.id}
                  className={styles.resultCard}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={styles.resultCardRow}>
                    <img
                      src={dc.card.image}
                      alt={dc.card.nameRu}
                      className={styles.resultCardImg}
                      onClick={() => setZoomCard({ src: dc.card.image, name: dc.card.nameRu, reversed: dc.reversed })}
                    />
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
                </motion.div>
              ))}
            </div>

            <div className={styles.aiSection}>
              <h3 className={styles.aiTitle}>Интерпретация</h3>
              {isInterpreting ? (
                <div className={styles.aiLoading}>
                  <motion.div
                    className={styles.thinkingDots}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className={styles.thinkingDot} />
                    <span className={styles.thinkingDot} />
                    <span className={styles.thinkingDot} />
                  </motion.div>
                  <p>Оракул читает карты...</p>
                </div>
              ) : interpretation ? (
                <motion.div
                  className={styles.aiText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {interpretation.split('\n').map((paragraph, i) => (
                    paragraph.trim() ? (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        {paragraph}
                      </motion.p>
                    ) : null
                  ))}
                </motion.div>
              ) : null}
            </div>

            <motion.button
              className={styles.resetBtn}
              whileTap={{ scale: 0.96 }}
              onClick={handleReset}
            >
              Новый расклад
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {zoomCard && (
          <CardZoom
            src={zoomCard.src}
            name={zoomCard.name}
            reversed={zoomCard.reversed}
            onClose={() => setZoomCard(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
