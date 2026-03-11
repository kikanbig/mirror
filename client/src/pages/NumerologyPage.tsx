import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  calculateLifePathNumber, calculateSoulNumber, calculateDestinyNumber,
  calculatePersonalityNumber, calculatePersonalYear, calculatePersonalMonth,
  calculatePersonalDay, calculateCompatibility, getNumberDescription,
  calculateBirthdayNumber, calculateMaturityNumber, findKarmicDebts,
  calculatePinnacles, calculateChallenges, calculateKarmicLessons,
  calculatePsychomatrix, getArcana, getPsychomatrixCellDescription,
  PSYCHOMATRIX_CELL_NAMES, PSYCHOMATRIX_LINE_NAMES, getLineStrength, getLineDescription,
  KARMIC_DEBT_DESCRIPTIONS, KARMIC_LESSON_DESCRIPTIONS,
  PINNACLE_DESCRIPTIONS, CHALLENGE_DESCRIPTIONS,
  calculateFateMatrix,
  type PinnacleInfo, type ChallengeInfo, type KarmicDebtInfo, type PsychomatrixResult,
  type FateMatrixResult,
} from '../data/numerology';
import { useTranslation } from '../i18n';
import { useAppStore } from '../stores/appStore';
import { useUserStore } from '../stores/userStore';
import FateMatrixView from '../components/FateMatrix/FateMatrixView';
import FateReportGenerator from '../components/FateReport/FateReportGenerator';
import { PaywallOverlay } from '../components/Paywall/Paywall';
import styles from './NumerologyPage.module.scss';

interface FullResult {
  lifePath: number;
  birthday: number;
  soul: number | null;
  destiny: number | null;
  personality: number | null;
  maturity: number | null;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  karmicDebts: KarmicDebtInfo[];
  pinnacles: PinnacleInfo[];
  challenges: ChallengeInfo[];
  karmicLessons: number[];
  psychomatrix: PsychomatrixResult;
  arcanaNumber: number;
  fateMatrix: FateMatrixResult;
}

function NumberCard({ label, value, color, delay, onTap }: {
  label: string; value: number; color: string; delay: number; onTap?: () => void;
}) {
  return (
    <motion.div
      className={styles.numCard}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200 }}
      onClick={onTap}
      style={{ borderColor: color }}
    >
      <span className={styles.numValue} style={{ color }}>{value}</span>
      <span className={styles.numLabel}>{label}</span>
    </motion.div>
  );
}

export default function NumerologyPage() {
  const { setActiveSubPage } = useAppStore();
  const { profile } = useUserStore();

  const [birthStr, setBirthStr] = useState(profile.birthDate || '');
  const [fullName, setFullName] = useState('');
  const [result, setResult] = useState<FullResult | null>(null);
  const [detailNum, setDetailNum] = useState<number | null>(null);
  const { premiumStatus } = useUserStore();
  const { t } = useTranslation();
  const [partnerBirth, setPartnerBirth] = useState('');
  const [compatResult, setCompatResult] = useState<ReturnType<typeof calculateCompatibility> | null>(null);
  const [compatNums, setCompatNums] = useState<{ my: number; partner: number } | null>(null);

  const handleCalculate = useCallback(() => {
    if (!birthStr) return;
    const bd = new Date(birthStr);
    if (isNaN(bd.getTime())) return;

    const lifePath = calculateLifePathNumber(bd);
    const birthday = calculateBirthdayNumber(bd);
    const soul = fullName.trim() ? calculateSoulNumber(fullName) : null;
    const destiny = fullName.trim() ? calculateDestinyNumber(fullName) : null;
    const personality = fullName.trim() ? calculatePersonalityNumber(fullName) : null;
    const maturity = destiny !== null ? calculateMaturityNumber(lifePath, destiny) : null;
    const personalYear = calculatePersonalYear(bd);
    const personalMonth = calculatePersonalMonth(bd);
    const personalDay = calculatePersonalDay(bd);
    const karmicDebts = findKarmicDebts(bd, fullName.trim() || undefined);
    const pinnacles = calculatePinnacles(bd);
    const challenges = calculateChallenges(bd);
    const karmicLessons = fullName.trim() ? calculateKarmicLessons(fullName) : [];
    const psychomatrix = calculatePsychomatrix(bd);
    const fateMatrix = calculateFateMatrix(bd);

    setResult({
      lifePath, birthday, soul, destiny, personality, maturity,
      personalYear, personalMonth, personalDay,
      karmicDebts, pinnacles, challenges, karmicLessons, psychomatrix,
      arcanaNumber: lifePath, fateMatrix,
    });
    setDetailNum(null);
  }, [birthStr, fullName]);

  const handleCompatibility = useCallback(() => {
    if (!birthStr || !partnerBirth) return;
    const bd1 = new Date(birthStr);
    const bd2 = new Date(partnerBirth);
    if (isNaN(bd1.getTime()) || isNaN(bd2.getTime())) return;
    const n1 = calculateLifePathNumber(bd1);
    const n2 = calculateLifePathNumber(bd2);
    setCompatResult(calculateCompatibility(n1, n2));
    setCompatNums({ my: n1, partner: n2 });
  }, [birthStr, partnerBirth]);

  const detail = useMemo(() => detailNum !== null ? getNumberDescription(detailNum) : null, [detailNum]);
  const arcana = useMemo(() => result ? getArcana(result.arcanaNumber) : null, [result]);

  return (
    <motion.div className={styles.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => setActiveSubPage(null)}>{t('num.back')}</button>
        <h1 className={styles.title}>{t('num.title')}</h1>
      </div>

      {/* Input Form */}
      <div className={styles.form}>
        <label className={styles.fieldLabel}>{t('num.birthDate')}</label>
        <input type="date" className={styles.input} value={birthStr} onChange={(e) => setBirthStr(e.target.value)} />
        <label className={styles.fieldLabel}>{t('num.fullName')}</label>
        <input type="text" className={styles.input} placeholder={t('num.namePlaceholder')} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <motion.button className={styles.calcBtn} onClick={handleCalculate} whileTap={{ scale: 0.96 }}>
          {t('num.calculate')}
        </motion.button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div className={styles.results} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

            {/* Section 1: Core Numbers */}
            <h2 className={styles.sectionTitle}>{t('num.coreNumbers')}</h2>
            <div className={styles.numGrid}>
              <NumberCard label={t('num.lifePath')} value={result.lifePath} color="#D4AF37" delay={0} onTap={() => setDetailNum(result.lifePath)} />
              <NumberCard label={t('num.birthday')} value={result.birthday} color="#F59E0B" delay={0.05} onTap={() => setDetailNum(result.birthday)} />
              {result.soul !== null && <NumberCard label={t('num.soul')} value={result.soul} color="#8B5CF6" delay={0.1} onTap={() => setDetailNum(result.soul!)} />}
              {result.destiny !== null && <NumberCard label={t('num.destiny')} value={result.destiny} color="#EC4899" delay={0.15} onTap={() => setDetailNum(result.destiny!)} />}
              {result.personality !== null && <NumberCard label={t('num.personality')} value={result.personality} color="#06B6D4" delay={0.2} onTap={() => setDetailNum(result.personality!)} />}
              {result.maturity !== null && <NumberCard label={t('num.maturity')} value={result.maturity} color="#10B981" delay={0.25} onTap={() => setDetailNum(result.maturity!)} />}
            </div>

            {/* Section 2: Tarot Arcana */}
            {arcana && (
              <div className={styles.arcanaSection}>
                <h2 className={styles.sectionTitle}>{t('num.arcana')}</h2>
                <div className={styles.arcanaCard}>
                  <img src={arcana.image} alt={arcana.nameRu} className={styles.arcanaImg} />
                  <div className={styles.arcanaInfo}>
                    <span className={styles.arcanaName}>{t('num.arcanaLabel', { num: arcana.number, name: arcana.nameRu })}</span>
                    <p className={styles.arcanaDesc}>{arcana.meaning}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Premium gate — one block for all premium sections */}
            {premiumStatus.tier !== 'premium' ? (
              <>
                <h2 className={styles.sectionTitle}>{t('num.fateMatrix')}</h2>
                <PaywallOverlay feature={t('num.fateMatrix')} />
                <FateReportGenerator birthDate={birthStr} />
              </>
            ) : (
              <>
                {/* Fate Matrix — full product */}
                <h2 className={styles.sectionTitle}>{t('num.fateMatrix')}</h2>
                <FateMatrixView matrix={result.fateMatrix} />

                <FateReportGenerator birthDate={birthStr} />

                {/* Karmic Debts */}
                {result.karmicDebts.length > 0 && (
                  <div className={styles.karmicSection}>
                    <h2 className={styles.sectionTitle}>{t('num.karmicDebts')}</h2>
                    {result.karmicDebts.map((kd) => {
                      const desc = KARMIC_DEBT_DESCRIPTIONS[kd.number];
                      return desc ? (
                        <div key={kd.number} className={styles.karmicCard}>
                          <span className={styles.karmicNumber}>{kd.number}</span>
                          <div className={styles.karmicInfo}>
                            <span className={styles.karmicTitle}>{desc.title}</span>
                            <span className={styles.karmicSource}>{t('num.foundIn')}: {kd.source}</span>
                            <p className={styles.karmicDesc}>{desc.description}</p>
                            <p className={styles.karmicLesson}>{desc.lesson}</p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                {/* Psychomatrix */}
                <div className={styles.psychoSection}>
                  <h2 className={styles.sectionTitle}>{t('num.psychomatrix')}</h2>
                  <div className={styles.psychoWorking}>
                    <div>{t('num.workingNumbers')}: <strong>{result.psychomatrix.workingNumbers.join(' · ')}</strong></div>
                    <div className={styles.psychoDigits}>{t('num.allDigits')}: {result.psychomatrix.allDigits.split('').join(' ')}</div>
                    <div className={styles.psychoTotal}>{t('num.totalDigits')}: {result.psychomatrix.allDigits.length}</div>
                  </div>
                  <div className={styles.psychoGrid}>
                    {[1,4,7,2,5,8,3,6,9].map((d) => (
                      <div key={d} className={styles.psychoCell}>
                        <span className={styles.psychoCellDigit}>{String(d).repeat(result.psychomatrix.cells[d]) || '—'}</span>
                        <span className={styles.psychoCellName}>{PSYCHOMATRIX_CELL_NAMES[d]}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className={styles.subTitle}>{t('num.cellDecode')}</h3>
                  {[1,2,3,4,5,6,7,8,9].map((d) => {
                    const count = result.psychomatrix.cells[d];
                    const desc = getPsychomatrixCellDescription(d, count);
                    if (!desc) return null;
                    return (
                      <div key={d} className={styles.psychoCellDesc}>
                        <span className={styles.psychoCellLabel}>
                          {PSYCHOMATRIX_CELL_NAMES[d]} — {count > 0 ? String(d).repeat(count) : t('num.noCell')}
                        </span>
                        <p>{desc}</p>
                      </div>
                    );
                  })}

                  <h3 className={styles.subTitle}>{t('num.matrixLines')}</h3>
                  {Object.entries(result.psychomatrix.lines).map(([key, val]) => (
                    <div key={key} className={styles.lineCard}>
                      <div className={styles.lineHeader}>
                        <span className={styles.lineName}>{PSYCHOMATRIX_LINE_NAMES[key]}</span>
                        <span className={styles.lineVal}>{val} — {getLineStrength(val)}</span>
                      </div>
                      <p className={styles.lineDesc}>{getLineDescription(key, val)}</p>
                    </div>
                  ))}
                </div>

                {/* Pinnacles & Challenges */}
                <div className={styles.timelineSection}>
                  <h2 className={styles.sectionTitle}>{t('num.pinnacles')}</h2>
                  <div className={styles.timeline}>
                    {result.pinnacles.map((p, i) => (
                      <div key={i} className={styles.timelineItem}>
                        <span className={styles.timelineNum}>{p.number}</span>
                        <div className={styles.timelineInfo}>
                          <span className={styles.timelineLabel}>{p.label}</span>
                          <span className={styles.timelineAge}>{p.fromAge}–{p.toAge ?? '...'} {t('num.years')}</span>
                          <p className={styles.timelineDesc}>{PINNACLE_DESCRIPTIONS[p.number] || ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <h2 className={styles.sectionTitle}>{t('num.challenges')}</h2>
                  <div className={styles.timeline}>
                    {result.challenges.map((c, i) => (
                      <div key={i} className={styles.timelineItem}>
                        <span className={styles.timelineNum}>{c.number}</span>
                        <div className={styles.timelineInfo}>
                          <span className={styles.timelineLabel}>{c.label}</span>
                          <p className={styles.timelineDesc}>{CHALLENGE_DESCRIPTIONS[c.number] || ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Section 6: Personal Cycles */}
            <h2 className={styles.sectionTitle}>{t('num.personalCycles')}</h2>
            <div className={styles.cyclesRow}>
              <div className={styles.cycleCard}>
                <span className={styles.cycleValue}>{result.personalYear}</span>
                <span className={styles.cycleLabel}>{t('num.personalYear')}</span>
              </div>
              <div className={styles.cycleCard}>
                <span className={styles.cycleValue}>{result.personalMonth}</span>
                <span className={styles.cycleLabel}>{t('num.personalMonth')}</span>
              </div>
              <div className={styles.cycleCard}>
                <span className={styles.cycleValue}>{result.personalDay}</span>
                <span className={styles.cycleLabel}>{t('num.personalDay')}</span>
              </div>
            </div>

            {/* Section 7: Karmic Lessons */}
            {result.karmicLessons.length > 0 && (
              <div className={styles.lessonsSection}>
                <h2 className={styles.sectionTitle}>{t('num.karmicLessons')}</h2>
                <p className={styles.lessonsHint}>{t('num.karmicLessonsHint')}</p>
                {result.karmicLessons.map((n) => {
                  const desc = KARMIC_LESSON_DESCRIPTIONS[n];
                  return desc ? (
                    <div key={n} className={styles.lessonItem}>
                      <span className={styles.lessonNum}>{n}</span>
                      <div>
                        <span className={styles.lessonTitle}>{desc.title}</span>
                        <p className={styles.lessonDesc}>{desc.description}</p>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail panel */}
      <AnimatePresence>
        {detail && (
          <motion.div className={styles.detail} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <h3 className={styles.detailTitle}>{detail.name} — {detail.title}</h3>
            <p className={styles.detailDesc}>{detail.description}</p>
            <div className={styles.detailMeta}>
              <span className={styles.metaItem}>{t('num.color')}: {detail.color}</span>
              <span className={styles.metaItem}>{t('num.stone')}: {detail.stone}</span>
              <span className={styles.metaItem}>{t('num.planet')}: {detail.planet}</span>
            </div>
            <h4 className={styles.detailSub}>{t('num.strengths')}</h4>
            <ul className={styles.detailList}>{detail.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
            <h4 className={styles.detailSub}>{t('num.weaknesses')}</h4>
            <ul className={styles.detailList}>{detail.weaknesses.map((w, i) => <li key={i}>{w}</li>)}</ul>
            <h4 className={styles.detailSub}>{t('num.recommendations')}</h4>
            <p className={styles.detailDesc}>{detail.recommendations}</p>
            <h4 className={styles.detailSub}>{t('num.celebrities')}</h4>
            <p className={styles.detailDesc}>{detail.celebrities.join(', ')}</p>
            <button className={styles.closeDetail} onClick={() => setDetailNum(null)}>{t('num.close')}</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 8: Compatibility */}
      <div className={styles.compatSection}>
        <h2 className={styles.sectionTitle}>{t('num.compatibility')}</h2>
        <label className={styles.fieldLabel}>{t('num.partnerBirth')}</label>
        <input type="date" className={styles.input} value={partnerBirth} onChange={(e) => setPartnerBirth(e.target.value)} />
        <motion.button className={styles.calcBtn} onClick={handleCompatibility} whileTap={{ scale: 0.96 }}>{t('num.checkCompat')}</motion.button>
      </div>

      <AnimatePresence>
        {compatResult && compatNums && (
          <motion.div className={styles.compatResult} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={styles.compatScore}>
              <div className={styles.compatGauge}>
                <svg viewBox="0 0 100 50" className={styles.compatSvg}>
                  <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" strokeLinecap="round" />
                  <path d="M 10 45 A 40 40 0 0 1 90 45" fill="none" stroke={compatResult.score >= 75 ? '#22c55e' : compatResult.score >= 50 ? '#D4AF37' : '#ef4444'} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${compatResult.score * 1.26} 126`} />
                </svg>
                <span className={styles.compatPct}>{compatResult.score}%</span>
              </div>
              <span className={styles.compatNums}>{compatNums.my} + {compatNums.partner}</span>
            </div>
            <p className={styles.compatDesc}>{compatResult.description}</p>
            <h4 className={styles.detailSub}>{t('num.strengths')}</h4>
            <ul className={styles.detailList}>{compatResult.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
            <h4 className={styles.detailSub}>{t('num.challengesLabel')}</h4>
            <ul className={styles.detailList}>{compatResult.challenges.map((c, i) => <li key={i}>{c}</li>)}</ul>
            <h4 className={styles.detailSub}>{t('num.advice')}</h4>
            <p className={styles.detailDesc}>{compatResult.advice}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
