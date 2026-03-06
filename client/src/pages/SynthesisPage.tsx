import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fullDeck } from '../data/tarot-deck';
import { elderFuthark } from '../data/runes';
import { getMoonPhase } from '../data/moon-phases';
import { hashSeed, seededShuffle } from '../utils/shuffle';
import { useUserStore, UserProfile } from '../stores/userStore';
import { useHistoryStore } from '../stores/historyStore';
import { useHaptic } from '../hooks/useHaptic';
import { api } from '../services/api';
import { moonPhases } from '../data/moon-phases';
import type { TarotCard } from '../data/tarot-types';
import type { Rune } from '../data/runes';
import styles from './SynthesisPage.module.scss';

const YEAR_THEMES: Record<number, string> = {
  1: 'новых начинаний, посева семян будущего и смелых первых шагов',
  2: 'партнёрства, терпения и внутренней гармонии',
  3: 'творчества, самовыражения и расцвета талантов',
  4: 'строительства фундамента, дисциплины и упорного труда',
  5: 'перемен, свободы и неожиданных поворотов судьбы',
  6: 'любви, семьи, ответственности и заботы о близких',
  7: 'духовного поиска, уединения и глубокой мудрости',
  8: 'власти, достижений, материального успеха и кармических уроков',
  9: 'завершения великого цикла, отпускания и подготовки к новому витку',
};

const ELEMENT_SYNERGY: Record<string, Record<string, string>> = {
  fire: {
    fire: 'Двойной огонь разжигает невероятную силу действия — время дерзких поступков.',
    water: 'Огонь и вода создают пар трансформации — эмоции направляют вашу волю.',
    air: 'Огонь и воздух раздувают пламя идей — мысли обретают силу действия.',
    earth: 'Огонь и земля куют нечто прочное — ваша страсть обретает форму.',
    ice: 'Огонь растапливает лёд — старые блоки и страхи уступают место смелости.',
  },
  water: {
    fire: 'Вода и огонь создают алхимию чувств — интуиция направляет действие.',
    water: 'Двойная вода углубляет эмоциональное понимание до самых глубин подсознания.',
    air: 'Вода и воздух несут ясность чувств — интуиция получает голос разума.',
    earth: 'Вода и земля питают рост — ваши чувства укореняются в реальности.',
    ice: 'Вода и лёд обращают к глубинным, замороженным чувствам — время их растопить.',
  },
  air: {
    fire: 'Воздух и огонь разносят искру вдохновения — идеи превращаются в действия.',
    water: 'Воздух и вода соединяют разум и чувства в единый поток осознанности.',
    air: 'Двойной воздух даёт кристальную ясность мысли и интеллектуальный прорыв.',
    earth: 'Воздух и земля — идеи обретают практическое воплощение.',
    ice: 'Воздух и лёд — холодная ясность ума помогает увидеть скрытое.',
  },
  earth: {
    fire: 'Земля и огонь — практическая сила трансформирует материальный мир.',
    water: 'Земля и вода — плодородное сочетание для роста и процветания.',
    air: 'Земля и воздух — практичность соединяется с видением будущего.',
    earth: 'Двойная земля укрепляет фундамент — время собирать урожай стабильности.',
    ice: 'Земля и лёд — застывшая мудрость прошлого раскрывает свои сокровища.',
  },
  spirit: {
    fire: 'Дух и огонь — высшая воля направляет вашу страсть к цели.',
    water: 'Дух и вода — духовная интуиция достигает невероятной глубины.',
    air: 'Дух и воздух — высшее знание нисходит через ясность ума.',
    earth: 'Дух и земля — духовное проявляется в материальном мире.',
    ice: 'Дух и лёд — медитативная тишина открывает врата к высшему знанию.',
  },
};

function buildLocalSynthesis(
  synth: { card: TarotCard; rune: Rune; moon: { phaseRu: string; phase: string }; personalYear: number },
  profile: UserProfile,
): string {
  const moonInfo = moonPhases.find((m) => m.phase === synth.moon.phase);
  const yearTheme = YEAR_THEMES[synth.personalYear] || YEAR_THEMES[1];

  const cardElement = synth.card.element;
  const runeElement = synth.rune.element;
  const synergy = ELEMENT_SYNERGY[cardElement]?.[runeElement]
    || 'Стихии ваших знаков переплетаются, создавая уникальный узор энергий.';

  const lines: string[] = [];

  lines.push(`Сегодня Зеркало Судьбы раскрывает перед вами уникальное сочетание космических сил. Четыре древних системы знания сплетаются воедино, чтобы показать ваш путь.`);
  lines.push('');

  lines.push(`Карта «${synth.card.nameRu}» и руна «${synth.rune.nameRu}» (${synth.rune.symbol}) выпали вам не случайно. ${synergy}`);
  lines.push('');

  lines.push(`${synth.card.nameRu} говорит: ${synth.card.meanings.upright}`);
  lines.push('');

  lines.push(`Руна ${synth.rune.symbol} ${synth.rune.nameRu} усиливает этот посыл: ${synth.rune.meaning.upright}`);
  lines.push('');

  if (moonInfo) {
    lines.push(`${moonInfo.emoji} ${moonInfo.phaseRu} наполняет этот день особой энергией. ${moonInfo.energy} ${moonInfo.tarotConnection}`);
    lines.push('');
  }

  lines.push(`Ваш персональный год — ${synth.personalYear}. Это год ${yearTheme}. В сочетании с картой ${synth.card.nameRu} и руной ${synth.rune.nameRu} это указывает на глубокую внутреннюю работу, плоды которой не заставят себя ждать.`);
  lines.push('');

  lines.push(`💫 ${synth.card.advice}`);
  lines.push('');
  lines.push(`✨ ${synth.rune.advice}`);
  lines.push('');

  if (moonInfo && moonInfo.recommendations.length > 0) {
    lines.push(`🌙 Совет луны: ${moonInfo.recommendations[0]}`);
    lines.push('');
  }

  const name = profile.firstName || 'Путник';
  lines.push(`${name}, все знаки сегодня указывают в одном направлении. Доверьтесь этому потоку.`);
  lines.push('');
  lines.push(`«${synth.card.affirmation}»`);

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
      title: 'Синтез Судьбы',
      cards: [
        {
          cardId: synthesis.card.id,
          cardName: synthesis.card.nameRu,
          cardImage: synthesis.card.image,
          reversed: false,
          positionName: 'Карта таро',
        },
      ],
      interpretation: interp,
    });
  }, [addReading, synthesis]);

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
      saveSynthesisToHistory(result.interpretation);
      addExperience(50);
      notification('success');
      setPhase('result');
    } catch {
      const fallback = buildLocalSynthesis(synthesis, profile);
      setInterpretation(fallback);
      saveSynthesisToHistory(fallback);
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
              <motion.img
                className={styles.icon}
                src="/icons/icon_synthesis.webp"
                alt=""
                width={48}
                height={48}
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <h1 className={styles.title}>Синтез Судьбы</h1>
            </div>
            <p className={styles.description}>
              Уникальная функция, объединяющая таро, нумерологию, астрологию и руны в единое предсказание, созданное специально для вас.
            </p>

            <div className={styles.elements}>
              {[
                {
                  content: (
                    <>
                      <img src={synthesis.card.image} alt={synthesis.card.nameRu} className={styles.elementImg} />
                      <div className={styles.elementInfo}>
                        <span className={styles.elementLabel}>Карта таро</span>
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
                        <span className={styles.elementLabel}>Руна дня</span>
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
                        <span className={styles.elementLabel}>Фаза луны</span>
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
                        <span className={styles.elementLabel}>Персональный год</span>
                        <span className={styles.elementValue}>Число {synthesis.personalYear}</span>
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
              {[
                { text: '\u{1F0CF}', title: synthesis.card.nameRu },
                { text: synthesis.rune.symbol, title: synthesis.rune.nameRu },
                { text: synthesis.moon.emoji, title: synthesis.moon.phaseRu },
                { text: String(synthesis.personalYear), title: `Число ${synthesis.personalYear}` },
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
              Вернуться
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
