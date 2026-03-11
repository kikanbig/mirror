import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fullDeck } from '../data/tarot-deck';
import { elderFuthark } from '../data/runes';
import { getMoonPhase } from '../data/moon-phases';
import { hashSeed, seededShuffle } from '../utils/shuffle';
import { useUserStore, UserProfile } from '../stores/userStore';
import { useHistoryStore } from '../stores/historyStore';
import { useHaptic } from '../hooks/useHaptic';
import { useTranslation } from '../i18n';
import { api } from '../services/api';
import { moonPhases } from '../data/moon-phases';
import type { TarotCard } from '../data/tarot-types';
import type { Rune } from '../data/runes';
import styles from './SynthesisPage.module.scss';

type TranslateFn = (key: string, replacements?: Record<string, string | number>) => string;

function buildLocalSynthesis(
  synth: { card: TarotCard; rune: Rune; moon: { phaseRu: string; phase: string }; personalYear: number },
  profile: UserProfile,
  t: TranslateFn,
): string {
  const moonInfo = moonPhases.find((m) => m.phase === synth.moon.phase);
  const yearTheme = t(`synth.yearTheme.${synth.personalYear}`);

  const cardElement = synth.card.element;
  const runeElement = synth.rune.element;
  const synergyKey = `synth.synergy.${cardElement}.${runeElement}`;
  const rawSynergy = t(synergyKey);
  const synergy = rawSynergy !== synergyKey ? rawSynergy : t('synth.synergyFallback');

  const lines: string[] = [];

  lines.push(t('synth.local.intro'));
  lines.push('');

  lines.push(t('synth.local.cardAndRune', { card: synth.card.nameRu, rune: synth.rune.nameRu, symbol: synth.rune.symbol, synergy }));
  lines.push('');

  lines.push(t('synth.local.cardSpeaks', { card: synth.card.nameRu, meaning: synth.card.meanings.upright }));
  lines.push('');

  lines.push(t('synth.local.runeReinforces', { symbol: synth.rune.symbol, rune: synth.rune.nameRu, meaning: synth.rune.meaning.upright }));
  lines.push('');

  if (moonInfo) {
    lines.push(t('synth.local.moonEnergy', { emoji: moonInfo.emoji, phase: moonInfo.phaseRu, energy: moonInfo.energy, connection: moonInfo.tarotConnection }));
    lines.push('');
  }

  lines.push(t('synth.local.personalYear', { year: synth.personalYear, theme: yearTheme, card: synth.card.nameRu, rune: synth.rune.nameRu }));
  lines.push('');

  lines.push(`💫 ${synth.card.advice}`);
  lines.push('');
  lines.push(`✨ ${synth.rune.advice}`);
  lines.push('');

  if (moonInfo && moonInfo.recommendations.length > 0) {
    lines.push(t('synth.local.moonAdvice', { advice: moonInfo.recommendations[0] }));
    lines.push('');
  }

  const name = profile.firstName || t('synth.wanderer');
  lines.push(t('synth.local.closing', { name }));
  lines.push('');
  lines.push(t('synth.local.affirmation', { text: synth.card.affirmation }));

  return lines.join('\n');
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
  const { addReading } = useHistoryStore();
  const { impact, notification } = useHaptic();
  const { t } = useTranslation();

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

  const saveSynthesisToHistory = useCallback((interp: string) => {
    addReading({
      type: 'synthesis',
      title: t('synth.title'),
      cards: [
        {
          cardId: synthesis.card.id,
          cardName: synthesis.card.nameRu,
          cardImage: synthesis.card.image,
          reversed: false,
          positionName: t('synth.tarotCard'),
        },
      ],
      interpretation: interp,
    });
  }, [addReading, synthesis, t]);

  const handleSynthesize = useCallback(async () => {
    impact('heavy');
    setPhase('loading');
    setError('');

    try {
      const result = await api.post<{ interpretation: string }>('/interpret/synthesis', {
        card: `${synthesis.card.nameRu} (${synthesis.card.name})`,
        rune: `${synthesis.rune.nameRu} (${synthesis.rune.name}) — ${synthesis.rune.symbol}`,
        zodiac: profile.zodiacSign || t('synth.notSpecified'),
        lifePathNumber: profile.lifePathNumber || 0,
        moonPhase: synthesis.moon.phaseRu,
        personalYear: synthesis.personalYear,
      });

      setInterpretation(result.interpretation);
      saveSynthesisToHistory(result.interpretation);
      addExperience(50);
      notification('success');
      setPhase('result');
    } catch {
      const fallback = buildLocalSynthesis(synthesis, profile, t);
      setInterpretation(fallback);
      saveSynthesisToHistory(fallback);
      addExperience(30);
      notification('success');
      setPhase('result');
    }
  }, [impact, notification, synthesis, profile, addExperience, t, saveSynthesisToHistory]);

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
              <motion.img
                className={styles.icon}
                src="/icons/icon_synthesis.webp"
                alt=""
                width={48}
                height={48}
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <h1 className={styles.title}>{t('synth.title')}</h1>
            </div>
            <p className={styles.description}>
              {t('synth.description')}
            </p>

            <div className={styles.elements}>
              {[
                {
                  content: (
                    <>
                      <img src={synthesis.card.image} alt={synthesis.card.nameRu} className={styles.elementImg} />
                      <div className={styles.elementInfo}>
                        <span className={styles.elementLabel}>{t('synth.tarotCard')}</span>
                        <span className={styles.elementValue}>{synthesis.card.nameRu}</span>
                      </div>
                    </>
                  ),
                },
                {
                  content: (
                    <>
                      <div className={styles.runeSymbol}>{synthesis.rune.symbol}</div>
                      <div className={styles.elementInfo}>
                        <span className={styles.elementLabel}>{t('synth.runeOfDay')}</span>
                        <span className={styles.elementValue}>{synthesis.rune.nameRu}</span>
                      </div>
                    </>
                  ),
                },
                {
                  content: (
                    <>
                      <div className={styles.moonSymbol}>{synthesis.moon.emoji}</div>
                      <div className={styles.elementInfo}>
                        <span className={styles.elementLabel}>{t('synth.moonPhase')}</span>
                        <span className={styles.elementValue}>{synthesis.moon.phaseRu}</span>
                      </div>
                    </>
                  ),
                },
                {
                  content: (
                    <>
                      <div className={styles.numberSymbol}>{synthesis.personalYear}</div>
                      <div className={styles.elementInfo}>
                        <span className={styles.elementLabel}>{t('synth.personalYear')}</span>
                        <span className={styles.elementValue}>{t('synth.number', { num: synthesis.personalYear })}</span>
                      </div>
                    </>
                  ),
                },
              ].map((el, i) => (
                <motion.div
                  key={i}
                  className={styles.element}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  {el.content}
                </motion.div>
              ))}
            </div>

            {error && (
              <motion.p className={styles.error} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {error}
              </motion.p>
            )}

            <motion.button
              className={styles.btn}
              whileTap={{ scale: 0.96 }}
              onClick={handleSynthesize}
              whileHover={{ boxShadow: '0 0 40px rgba(139,92,246,0.4)' }}
            >
              {t('synth.generate')}
            </motion.button>
            <p className={styles.hint}>{t('synth.hint')}</p>
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
            <p className={styles.loadingText}>{t('synth.loading')}</p>
            <p className={styles.loadingHint}>{t('synth.loadingHint')}</p>
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div
            key="result"
            className={styles.resultContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className={styles.resultTitle}>{t('synth.result')}</h2>

            <div className={styles.resultSymbols}>
              {[
                { text: '\u{1F0CF}', title: synthesis.card.nameRu },
                { text: synthesis.rune.symbol, title: synthesis.rune.nameRu },
                { text: synthesis.moon.emoji, title: synthesis.moon.phaseRu },
                { text: String(synthesis.personalYear), title: t('synth.number', { num: synthesis.personalYear }) },
              ].map((s, i) => (
                <motion.span
                  key={i}
                  title={s.title}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                >
                  {s.text}
                </motion.span>
              ))}
            </div>

            <div className={styles.resultText}>
              {interpretation.split('\n').map((paragraph, i) => (
                paragraph.trim() ? (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                  >
                    {paragraph}
                  </motion.p>
                ) : null
              ))}
            </div>

            <motion.button className={styles.resetBtn} whileTap={{ scale: 0.96 }} onClick={handleReset}>
              {t('synth.back')}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
