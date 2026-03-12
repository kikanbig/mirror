import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { elderFuthark, Rune } from '../data/runes';
import { runeSpreads, RuneSpread } from '../data/rune-spreads';
import { fisherYatesShuffle } from '../utils/shuffle';
import { useAppStore } from '../stores/appStore';
import { useUserStore } from '../stores/userStore';
import { useHistoryStore } from '../stores/historyStore';
import { useHaptic } from '../hooks/useHaptic';
import { useTranslation } from '../i18n';
import { localizeRuneSpread, localizeRune } from '../i18n/data';
import { api } from '../services/api';
import CardZoom from '../components/CardZoom/CardZoom';
import styles from './RunesPage.module.scss';

type Phase = 'choose' | 'draw' | 'result';

interface DrawnRune {
  rune: Rune;
  reversed: boolean;
  positionName: string;
}

export default function RunesPage() {
  const { setActiveSubPage } = useAppStore();
  const { profile, addExperience } = useUserStore();
  const { addReading } = useHistoryStore();
  const { impact, notification } = useHaptic();
  const { t, lang } = useTranslation();

  const [phase, setPhase] = useState<Phase>('choose');
  const [spread, setSpread] = useState<RuneSpread | null>(null);
  const [drawnRunes, setDrawnRunes] = useState<DrawnRune[]>([]);
  const [bagRunes, setBagRunes] = useState<number[]>([]);
  const [revealedIdx, setRevealedIdx] = useState<Set<number>>(new Set());
  const [interpretation, setInterpretation] = useState('');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [zoomRune, setZoomRune] = useState<DrawnRune | null>(null);

  const localizedRuneSpreads = useMemo(() => runeSpreads.map(s => localizeRuneSpread(s, lang)), [lang]);

  const handleSelectSpread = useCallback((s: RuneSpread) => {
    impact('light');
    setSpread(s);
    setDrawnRunes([]);
    setRevealedIdx(new Set());
    setInterpretation('');
    setBagRunes(Array.from({ length: Math.max(12, s.runeCount + 6) }, (_, i) => i));
    setPhase('draw');
  }, [impact]);

  const handleDrawRune = useCallback((bagIdx: number) => {
    if (!spread || drawnRunes.length >= spread.runeCount) return;
    impact('heavy');

    const shuffled = fisherYatesShuffle([...elderFuthark]);
    const rune = shuffled[Math.floor(Math.random() * shuffled.length)];
    const reversed = Math.random() < 0.3;
    const positionName = spread.positions[drawnRunes.length].name;

    const newDrawn = [...drawnRunes, { rune, reversed, positionName }];
    setDrawnRunes(newDrawn);
    setBagRunes((prev) => prev.filter((_, i) => i !== bagIdx));

    if (newDrawn.length >= spread.runeCount) {
      setTimeout(() => {
        notification('success');
        addExperience(20);
        setPhase('result');
        requestInterpretation(newDrawn, spread);
      }, 600);
    }
  }, [spread, drawnRunes, impact, notification, addExperience]);

  const requestInterpretation = useCallback(async (runes: DrawnRune[], sp: RuneSpread) => {
    setIsInterpreting(true);
    try {
      const res = await api.post<{ interpretation: string }>('/interpret/runes', {
        spread: sp.name,
        runes: runes.map((dr) => {
          const lr = localizeRune(dr.rune, lang);
          return {
            name: `${lr.nameRu} (${dr.rune.name}) — ${dr.rune.symbol}`,
            position: dr.positionName,
            reversed: dr.reversed,
          };
        }),
      });
      if (res.interpretation) {
        setInterpretation(res.interpretation);
        addExperience(30);
      }
    } catch {
      const lines = runes.map((dr) => {
        const lr = localizeRune(dr.rune, lang);
        return `${dr.positionName}: ${lr.nameRu} ${dr.rune.symbol} ${dr.reversed ? `(${t('runes.reversed')})` : ''}\n${dr.reversed ? lr.meaning.reversed : lr.meaning.upright}`;
      });
      setInterpretation(lines.join('\n\n'));
    } finally {
      setIsInterpreting(false);
      addReading({
        type: 'rune' as any,
        title: sp.name,
        spreadName: sp.name,
        cards: runes.map((dr) => {
          const lr = localizeRune(dr.rune, lang);
          return {
            cardId: dr.rune.id,
            cardName: `${lr.nameRu} ${dr.rune.symbol}`,
            cardImage: '',
            reversed: dr.reversed,
            positionName: dr.positionName,
          };
        }),
      });
    }
  }, [addExperience, addReading, t, lang]);

  const handleReveal = useCallback((idx: number) => {
    impact('medium');
    setRevealedIdx((prev) => new Set(prev).add(idx));
  }, [impact]);

  const handleReset = () => {
    setPhase('choose');
    setSpread(null);
    setDrawnRunes([]);
    setRevealedIdx(new Set());
    setInterpretation('');
  };

  return (
    <motion.div className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => phase === 'choose' ? setActiveSubPage(null) : handleReset()}>
          &#8592; {phase === 'choose' ? t('runes.back') : t('runes.toSpreads')}
        </button>
        <h1 className={styles.title}>{t('runes.title')}</h1>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'choose' && (
          <motion.div key="choose" className={styles.spreadList} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {localizedRuneSpreads.map((s) => (
              <motion.div
                key={s.id}
                className={styles.spreadCard}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelectSpread(s)}
              >
                <span className={styles.spreadRune}>ᚱ</span>
                <div className={styles.spreadInfo}>
                  <span className={styles.spreadName}>{s.name}</span>
                  <span className={styles.spreadCount}>{s.runeCount} {s.runeCount === 1 ? t('runes.rune.1') : s.runeCount < 5 ? t('runes.rune.2-4') : t('runes.rune.5+')}</span>
                  <p className={styles.spreadDesc}>{s.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {phase === 'draw' && spread && (
          <motion.div key="draw" className={styles.drawPhase} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className={styles.drawProgress}>
              {spread.positions[drawnRunes.length]?.name || t('common.done')} — {drawnRunes.length} / {spread.runeCount}
            </p>

            {drawnRunes.length > 0 && (
              <div className={styles.drawnRow}>
                {drawnRunes.map((dr, i) => (
                  <div key={i} className={styles.drawnStone}>
                    <span className={styles.stoneSymbol}>{dr.rune.symbol}</span>
                    <span className={styles.stoneName}>{dr.positionName}</span>
                  </div>
                ))}
              </div>
            )}

            {drawnRunes.length < spread.runeCount && (
              <div className={styles.bag}>
                <p className={styles.bagHint}>{t('runes.draw')}</p>
                <div className={styles.bagStones}>
                  {bagRunes.map((id, i) => (
                    <div
                      key={id}
                      className={styles.bagStone}
                      onClick={() => handleDrawRune(i)}
                    >
                      <span className={styles.bagQ}>?</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div key="result" className={styles.resultPhase} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <h2 className={styles.resultTitle}>{t('runes.result')}</h2>

            <div className={styles.runeResults}>
              {drawnRunes.map((dr, i) => {
                const isRevealed = revealedIdx.has(i);
                const lr = localizeRune(dr.rune, lang);
                return (
                  <motion.div
                    key={i}
                    className={styles.runeCard}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <div
                      className={`${styles.runeStone} ${isRevealed ? styles.revealed : ''}`}
                      onClick={() => isRevealed ? setZoomRune(dr) : handleReveal(i)}
                    >
                      {isRevealed ? (
                        <span className={`${styles.runeSymbol} ${dr.reversed ? styles.reversed : ''}`}>
                          {dr.rune.symbol}
                        </span>
                      ) : (
                        <span className={styles.runeHidden}>?</span>
                      )}
                    </div>
                    <div className={styles.runeInfo}>
                      <span className={styles.runePos}>{dr.positionName}</span>
                      {isRevealed && (
                        <>
                          <span className={styles.runeName}>
                            {lr.nameRu} {dr.reversed ? `(${t('runes.reversed')})` : ''}
                          </span>
                          <p className={styles.runeMeaning}>
                            {dr.reversed ? lr.meaning.reversed : lr.meaning.upright}
                          </p>
                        </>
                      )}
                      {!isRevealed && <span className={styles.runeTapHint}>{t('runes.tapReveal')}</span>}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {isInterpreting && (
              <div className={styles.interpreting}>
                <p>{t('runes.interpreting')}</p>
              </div>
            )}

            {interpretation && !isInterpreting && (
              <div className={styles.interpSection}>
                <h3 className={styles.interpTitle}>{t('runes.interpretation')}</h3>
                {interpretation.split('\n\n').map((p, i) => (
                  <p key={i} className={styles.interpText}>{p}</p>
                ))}
              </div>
            )}

            <motion.button className={styles.resetBtn} whileTap={{ scale: 0.96 }} onClick={handleReset}>
              {t('runes.newSpread')}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zoomRune && (() => {
          const zr = localizeRune(zoomRune.rune, lang);
          return (
            <motion.div
              className={styles.zoomOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomRune(null)}
            >
              <motion.div
                className={styles.zoomContent}
                initial={{ scale: 0.7 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.7 }}
                onClick={(e) => e.stopPropagation()}
              >
                <span className={`${styles.zoomSymbol} ${zoomRune.reversed ? styles.reversed : ''}`}>
                  {zoomRune.rune.symbol}
                </span>
                <h3 className={styles.zoomName}>{zr.nameRu} ({zoomRune.rune.name})</h3>
                {zoomRune.reversed && <span className={styles.zoomReversed}>{t('runes.reversed')}</span>}
                <p className={styles.zoomMeaning}>
                  {zoomRune.reversed ? zr.meaning.reversed : zr.meaning.upright}
                </p>
                <div className={styles.zoomMeta}>
                  <span>{t('runes.element')}: {zr.element}</span>
                  <span>{t('runes.deity')}: {zr.deity}</span>
                </div>
                <p className={styles.zoomAdvice}>{zr.advice}</p>
                <button className={styles.zoomClose} onClick={() => setZoomRune(null)}>{t('runes.close')}</button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </motion.div>
  );
}
