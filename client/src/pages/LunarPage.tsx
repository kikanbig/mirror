import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getMoonPhase, moonPhases, MoonPhaseInfo } from '../data/moon-phases';
import { useAppStore } from '../stores/appStore';
import { useTranslation } from '../i18n';
import { localizeMoon, localizeMoonPhaseName } from '../i18n/data';
import styles from './LunarPage.module.scss';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function MoonVisual({ illumination, isWaxing }: { illumination: number; isWaxing: boolean }) {
  const pct = Math.round(illumination * 100);
  const shadowX = isWaxing ? (1 - illumination) * 100 : illumination * -100;

  return (
    <div className={styles.moonVisual}>
      <div className={styles.moonGlow} />
      <div className={styles.moonSphere}>
        <div
          className={styles.moonShadow}
          style={{
            background: `radial-gradient(circle at ${50 + shadowX * 0.5}% 50%, transparent 30%, rgba(10,10,26,0.95) 55%)`,
          }}
        />
      </div>
      <span className={styles.moonPct}>{pct}%</span>
    </div>
  );
}

function CalendarGrid({ year, month, selectedDay, onSelect }: {
  year: number;
  month: number;
  selectedDay: number | null;
  onSelect: (day: number) => void;
}) {
  const { t } = useTranslation();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const days = [];
  for (let i = 0; i < offset; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className={styles.calGrid}>
      {[t('lunar.mon'), t('lunar.tue'), t('lunar.wed'), t('lunar.thu'), t('lunar.fri'), t('lunar.sat'), t('lunar.sun')].map((d) => (
        <div key={d} className={styles.calHeader}>{d}</div>
      ))}
      {days.map((day, i) => {
        if (day === null) return <div key={`e-${i}`} />;
        const date = new Date(year, month, day, 12);
        const mp = getMoonPhase(date);
        const isToday = isCurrentMonth && day === today.getDate();
        const isSelected = day === selectedDay;
        return (
          <div
            key={day}
            className={`${styles.calDay} ${isToday ? styles.calToday : ''} ${isSelected ? styles.calSelected : ''}`}
            onClick={() => onSelect(day)}
          >
            <span className={styles.calEmoji}>{mp.emoji}</span>
            <span className={styles.calNum}>{day}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function LunarPage() {
  const { t, lang } = useTranslation();
  const { setActiveSubPage } = useAppStore();
  const MONTHS = [t('lunar.jan'), t('lunar.feb'), t('lunar.mar'), t('lunar.apr'), t('lunar.may'), t('lunar.jun'), t('lunar.jul'), t('lunar.aug'), t('lunar.sep'), t('lunar.oct'), t('lunar.nov'), t('lunar.dec')];
  const now = new Date();
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const todayMoon = useMemo(() => getMoonPhase(), []);
  const todayPhaseName = useMemo(() => localizeMoonPhaseName(todayMoon.phase, todayMoon.phaseRu, lang), [todayMoon, lang]);
  const todayInfo = useMemo(() => {
    const raw = moonPhases.find((p) => p.phase === todayMoon.phase);
    return raw ? localizeMoon(raw, lang) : undefined;
  }, [todayMoon, lang]);

  const selectedInfo = useMemo<{ moon: ReturnType<typeof getMoonPhase>; info: MoonPhaseInfo } | null>(() => {
    if (selectedDay === null) return null;
    const date = new Date(viewYear, viewMonth, selectedDay, 12);
    const moon = getMoonPhase(date);
    const rawInfo = moonPhases.find((p) => p.phase === moon.phase)!;
    const info = localizeMoon(rawInfo, lang);
    return { moon, info };
  }, [selectedDay, viewMonth, viewYear, lang]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
    setSelectedDay(null);
  };

  return (
    <motion.div className={styles.page} initial="initial" animate="animate">
      <motion.div className={styles.topBar} variants={fadeUp}>
        <button className={styles.backBtn} onClick={() => setActiveSubPage(null)}>{t('lunar.back')}</button>
        <h1 className={styles.title}>{t('lunar.title')}</h1>
      </motion.div>

      <motion.div className={styles.hero} variants={fadeUp}>
        <MoonVisual illumination={todayMoon.illumination} isWaxing={todayMoon.isWaxing} />
        <div className={styles.heroInfo}>
          <span className={styles.heroPhase}>{todayMoon.emoji} {todayPhaseName}</span>
          <span className={styles.heroAge}>{t('lunar.day', { day: Math.floor(todayMoon.age) + 1 })}</span>
        </div>
      </motion.div>

      {todayInfo && (
        <motion.div className={styles.section} variants={fadeUp}>
          <h2 className={styles.sectionTitle}>{t('lunar.energy')}</h2>
          <p className={styles.sectionText}>{todayInfo.energy}</p>
        </motion.div>
      )}

      {todayInfo && (
        <motion.div className={styles.section} variants={fadeUp}>
          <h2 className={styles.sectionTitle}>{t('lunar.recommendations')}</h2>
          <ul className={styles.recList}>
            {todayInfo.recommendations.map((r, i) => (
              <li key={i} className={styles.recItem}>{r}</li>
            ))}
          </ul>
        </motion.div>
      )}

      {todayInfo && (
        <motion.div className={styles.section} variants={fadeUp}>
          <h2 className={styles.sectionTitle}>{t('lunar.rituals')}</h2>
          <ul className={styles.recList}>
            {todayInfo.rituals.map((r, i) => (
              <li key={i} className={styles.recItem}>{r}</li>
            ))}
          </ul>
        </motion.div>
      )}

      {todayInfo && (
        <motion.div className={styles.section} variants={fadeUp}>
          <h2 className={styles.sectionTitle}>{t('lunar.tarot')}</h2>
          <p className={styles.sectionText}>{todayInfo.tarotConnection}</p>
        </motion.div>
      )}

      <motion.div className={styles.calSection} variants={fadeUp}>
        <div className={styles.calNav}>
          <button className={styles.calArrow} onClick={prevMonth}>&#8249;</button>
          <span className={styles.calMonth}>{MONTHS[viewMonth]} {viewYear}</span>
          <button className={styles.calArrow} onClick={nextMonth}>&#8250;</button>
        </div>
        <CalendarGrid
          year={viewYear}
          month={viewMonth}
          selectedDay={selectedDay}
          onSelect={setSelectedDay}
        />
      </motion.div>

      {selectedInfo && (
        <motion.div
          className={styles.selectedPhase}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <h3 className={styles.selectedTitle}>{selectedInfo.moon.emoji} {localizeMoonPhaseName(selectedInfo.info.phase, selectedInfo.info.phaseRu, lang)}</h3>
          <p className={styles.selectedDesc}>{selectedInfo.info.description}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
