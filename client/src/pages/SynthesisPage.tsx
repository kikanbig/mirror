import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fullDeck } from '../data/tarot-deck';
import { elderFuthark } from '../data/runes';
import { getMoonPhase } from '../data/moon-phases';
import { hashSeed, seededShuffle } from '../utils/shuffle';
import { useUserStore, UserProfile } from '../stores/userStore';
import { useHaptic } from '../hooks/useHaptic';
import { api } from '../services/api';
import type { TarotCard } from '../data/tarot-types';
import type { Rune } from '../data/runes';
import styles from './SynthesisPage.module.scss';

function buildLocalSynthesis(
  synth: { card: TarotCard; rune: Rune; moon: { phaseRu: string }; personalYear: number },
  profile: UserProfile,
): string {
  const cardMeaning = synth.card.meanings.upright;
  const runeMeaning = synth.rune.meaning.upright;
  const advice = synth.card.advice;
  const runeAdvice = synth.rune.advice;
  const zodiac = profile.zodiacSign || 'Вселенная';

  return [
    `🃏 Карта таро «${synth.card.nameRu}» несёт вам следующее послание:`,
    cardMeaning,
    ``,
    `ᚱ Руна «${synth.rune.nameRu}» (${synth.rune.symbol}) дополняет этот посыл:`,
    runeMeaning,
    ``,
    `🌙 Текущая фаза луны — ${synth.moon.phaseRu} — усиливает энергию трансформации и интуиции. Персональный год ${synth.personalYear} указывает на цикл ${synth.personalYear <= 3 ? 'нового начала и роста' : synth.personalYear <= 6 ? 'труда и строительства' : 'завершения и мудрости'}.`,
    ``,
    `💫 Совет карты: ${advice}`,
    ``,
    `✨ Совет руны: ${runeAdvice}`,
    ``,
    `${zodiac}, доверьтесь потоку судьбы — все знаки указывают в одном направлении. «${synth.card.affirmation}»`,
  ].join('\n');
}

function getPersonalYear(birthDate?: string): number {
  if (!birthDate) return new Date().getFullYear() % 9 || 9;
  const [, month, day] = birthDate.split('-').map(Number);
  const year = new Date().getFullYear();
  const sum = String(day) + String(month) + String(year);
  let total = sum.split('').reduce((a, d) => a + Number(d), 0);
  while (total > 9 && total !== 11 && total !== 22) {
    total = String(total).split('').reduce((a, d) => a + Number(d), 0);
  }
  return total;
}

type Phase = 'intro' | 'loading' | 'result';

export default function SynthesisPage() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [interpretation, setInterpretation] = useState('');
  const [error, setError] = useState('');
  const { profile, addExperience } = useUserStore();
  const { impact, notification } = useHaptic();

  const userId = String(profile.telegramId || 'guest');
  const today = new Date().toISOString().split('T')[0];

  const synthesis = useMemo(() => {
    const seed = hashSeed(userId, today);
    const shuffledCards = seededShuffle(fullDeck, seed);
    const card = shuffledCards[0];

    const runeSeed = hashSeed(userId + '-rune', today);
    const shuffledRunes = seededShuffle(elderFuthark, runeSeed);
    const rune = shuffledRunes[0];

    const moon = getMoonPhase();
    const personalYear = getPersonalYear(profile.birthDate);

    return { card, rune, moon, personalYear };
  }, [userId, today, profile.birthDate]);

  const handleSynthesize = useCallback(async () => {
    impact('heavy');
    setPhase('loading');
    setError('');

    try {
      const result = await api.post<{ interpretation: string }>('/interpret/synthesis', {
        card: `${synthesis.card.nameRu} (${synthesis.card.name})`,
        rune: `${synthesis.rune.nameRu} (${synthesis.rune.name}) — ${synthesis.rune.symbol}`,
        zodiac: profile.zodiacSign || 'не указан',
        lifePathNumber: profile.lifePathNumber || 0,
        moonPhase: synthesis.moon.phaseRu,
        personalYear: synthesis.personalYear,
      });

      setInterpretation(result.interpretation);
      addExperience(50);
      notification('success');
      setPhase('result');
    } catch {
      const fallback = buildLocalSynthesis(synthesis, profile);
      setInterpretation(fallback);
      addExperience(30);
      notification('success');
      setPhase('result');
    }
  }, [impact, notification, synthesis, profile, addExperience]);

  const handleReset = () => {
    setPhase('intro');
    setInterpretation('');
  };

  return (
    <motion.div className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div key="intro" className={styles.intro} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={styles.header}>
              <span className={styles.icon}>✨</span>
              <h1 className={styles.title}>Синтез Судьбы</h1>
            </div>
            <p className={styles.description}>
              Уникальная функция, объединяющая таро, нумерологию, астрологию и руны в единое предсказание, созданное специально для вас.
            </p>

            <div className={styles.elements}>
              <div className={styles.element}>
                <img src={synthesis.card.image} alt={synthesis.card.nameRu} className={styles.elementImg} />
                <div className={styles.elementInfo}>
                  <span className={styles.elementLabel}>Карта таро</span>
                  <span className={styles.elementValue}>{synthesis.card.nameRu}</span>
                </div>
              </div>

              <div className={styles.element}>
                <div className={styles.runeSymbol}>{synthesis.rune.symbol}</div>
                <div className={styles.elementInfo}>
                  <span className={styles.elementLabel}>Руна дня</span>
                  <span className={styles.elementValue}>{synthesis.rune.nameRu}</span>
                </div>
              </div>

              <div className={styles.element}>
                <div className={styles.moonSymbol}>{synthesis.moon.emoji}</div>
                <div className={styles.elementInfo}>
                  <span className={styles.elementLabel}>Фаза луны</span>
                  <span className={styles.elementValue}>{synthesis.moon.phaseRu}</span>
                </div>
              </div>

              <div className={styles.element}>
                <div className={styles.numberSymbol}>{synthesis.personalYear}</div>
                <div className={styles.elementInfo}>
                  <span className={styles.elementLabel}>Персональный год</span>
                  <span className={styles.elementValue}>Число {synthesis.personalYear}</span>
                </div>
              </div>
            </div>

            {error && (
              <motion.p className={styles.error} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error}
              </motion.p>
            )}

            <motion.button className={styles.btn} whileTap={{ scale: 0.96 }} onClick={handleSynthesize}>
              Получить Синтез
            </motion.button>
            <p className={styles.hint}>Доступно 1 раз в неделю бесплатно</p>
          </motion.div>
        )}

        {phase === 'loading' && (
          <motion.div
            key="loading"
            className={styles.loadingContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.loadingOrb}
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 30px rgba(139, 92, 246, 0.3)',
                  '0 0 60px rgba(212, 175, 55, 0.5)',
                  '0 0 30px rgba(139, 92, 246, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>✨</span>
            </motion.div>
            <p className={styles.loadingText}>Соединяем потоки судьбы...</p>
            <p className={styles.loadingHint}>Таро, руны, звёзды и числа сплетаются в единое послание</p>
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div
            key="result"
            className={styles.resultContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className={styles.resultTitle}>Ваш Синтез Судьбы</h2>

            <div className={styles.resultSymbols}>
              <span title={synthesis.card.nameRu}>🃏</span>
              <span title={synthesis.rune.nameRu}>{synthesis.rune.symbol}</span>
              <span title={synthesis.moon.phaseRu}>{synthesis.moon.emoji}</span>
              <span title={`Число ${synthesis.personalYear}`}>{synthesis.personalYear}</span>
            </div>

            <div className={styles.resultText}>
              {interpretation.split('\n').map((paragraph, i) => (
                paragraph.trim() ? <p key={i}>{paragraph}</p> : null
              ))}
            </div>

            <motion.button className={styles.resetBtn} whileTap={{ scale: 0.96 }} onClick={handleReset}>
              Вернуться
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
