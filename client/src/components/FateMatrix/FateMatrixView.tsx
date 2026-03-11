import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FateMatrixResult } from '../../data/numerology';
import { FATE_ENERGY_DESCRIPTIONS } from '../../data/numerology';
import {
  TALENT_DESCRIPTIONS, PURPOSE_DESCRIPTIONS, KARMIC_TAIL_DESCRIPTIONS,
  RELATIONSHIP_DESCRIPTIONS, MONEY_DESCRIPTIONS, CHAKRA_TASK_DESCRIPTIONS,
  SELF_REALIZATION_DESCRIPTIONS, COMFORT_ZONE_DESCRIPTIONS,
  CLAN_LINE_DESCRIPTIONS, YEAR_FORECAST_DESCRIPTIONS,
} from '../../data/fate-matrix-descriptions';
import { useTranslation } from '../../i18n';
import styles from './FateMatrixView.module.scss';

interface Props {
  matrix: FateMatrixResult;
}

interface NodeDef {
  x: number; y: number; key: string; r?: number; color?: string;
}

const SECTION_IDS = [
  'talents', 'purpose', 'karmicTail', 'comfort', 'selfReal',
  'health', 'relationships', 'money', 'clan', 'programs', 'yearForecast',
] as const;

const SECTION_I18N_KEYS: Record<string, string> = {
  talents: 'fm.talents',
  purpose: 'fm.purpose',
  karmicTail: 'fm.karmic',
  comfort: 'fm.comfort',
  selfReal: 'fm.selfRealization',
  health: 'fm.health',
  relationships: 'fm.relationships',
  money: 'fm.money',
  clan: 'fm.clan',
  programs: 'fm.karmicPrograms',
  yearForecast: 'fm.yearForecast',
};

const SECTION_ICONS: Record<string, string> = {
  talents: '✦',
  purpose: '◎',
  karmicTail: '☾',
  comfort: '♡',
  selfReal: '⚡',
  health: '✚',
  relationships: '♥',
  money: '◆',
  clan: '⚘',
  programs: '⚠',
  yearForecast: '☀',
};

function EnergyCard({ num, context }: { num: number; context: string }) {
  const e = FATE_ENERGY_DESCRIPTIONS[num];
  if (!e) return null;
  return (
    <div className={styles.energyCard}>
      <div className={styles.energyHeader}>
        <span className={styles.energyNum}>{num}</span>
        <div>
          <span className={styles.energyName}>{e.name}</span>
          {context && <span className={styles.energyContext}>{context}</span>}
        </div>
      </div>
      <div className={styles.energyBody}>
        <div className={styles.energyPlus}><span className={styles.plusIcon}>+</span><p>{e.plus}</p></div>
        <div className={styles.energyMinus}><span className={styles.minusIcon}>−</span><p>{e.minus}</p></div>
      </div>
    </div>
  );
}

export default function FateMatrixView({ matrix }: Props) {
  const { t } = useTranslation();
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const accordionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const toggle = useCallback((id: string) => {
    setExpanded(prev => {
      const next = prev === id ? null : id;
      if (next) {
        requestAnimationFrame(() => {
          setTimeout(() => {
            accordionRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 80);
        });
      }
      return next;
    });
  }, []);

  const m = matrix;

  // SVG node layout
  const cx = 200, cy = 200;
  const outerR = 170;
  const innerR = 85;

  const corners: NodeDef[] = [
    { x: cx - outerR, y: cy, key: 'a', r: 20, color: '#D4AF37' },
    { x: cx, y: cy - outerR, key: 'b', r: 20, color: '#D4AF37' },
    { x: cx + outerR, y: cy, key: 'c', r: 20, color: '#D4AF37' },
    { x: cx, y: cy + outerR, key: 'd', r: 20, color: '#D4AF37' },
  ];

  const edges: NodeDef[] = [
    { x: cx - innerR, y: cy - innerR, key: 'ab', r: 14, color: '#8B5CF6' },
    { x: cx + innerR, y: cy - innerR, key: 'bc', r: 14, color: '#8B5CF6' },
    { x: cx + innerR, y: cy + innerR, key: 'cd', r: 14, color: '#8B5CF6' },
    { x: cx - innerR, y: cy + innerR, key: 'da', r: 14, color: '#8B5CF6' },
  ];

  const inner: NodeDef[] = [
    { x: cx - innerR, y: cy, key: 'aCenter', r: 12, color: '#06B6D4' },
    { x: cx, y: cy - innerR, key: 'bCenter', r: 12, color: '#06B6D4' },
    { x: cx + innerR, y: cy, key: 'cCenter', r: 12, color: '#06B6D4' },
    { x: cx, y: cy + innerR, key: 'dCenter', r: 12, color: '#06B6D4' },
  ];

  const between: NodeDef[] = [
    { x: (corners[0].x + edges[0].x) / 2, y: (corners[0].y + edges[0].y) / 2, key: 'aAb', r: 9, color: 'rgba(255,255,255,0.35)' },
    { x: (edges[0].x + corners[1].x) / 2, y: (edges[0].y + corners[1].y) / 2, key: 'abB', r: 9, color: 'rgba(255,255,255,0.35)' },
    { x: (corners[1].x + edges[1].x) / 2, y: (corners[1].y + edges[1].y) / 2, key: 'bBc', r: 9, color: 'rgba(255,255,255,0.35)' },
    { x: (edges[1].x + corners[2].x) / 2, y: (edges[1].y + corners[2].y) / 2, key: 'bcC', r: 9, color: 'rgba(255,255,255,0.35)' },
    { x: (corners[2].x + edges[2].x) / 2, y: (corners[2].y + edges[2].y) / 2, key: 'cCd', r: 9, color: 'rgba(255,255,255,0.35)' },
    { x: (edges[2].x + corners[3].x) / 2, y: (edges[2].y + corners[3].y) / 2, key: 'cdD', r: 9, color: 'rgba(255,255,255,0.35)' },
    { x: (corners[3].x + edges[3].x) / 2, y: (corners[3].y + edges[3].y) / 2, key: 'dDa', r: 9, color: 'rgba(255,255,255,0.35)' },
    { x: (edges[3].x + corners[0].x) / 2, y: (edges[3].y + corners[0].y) / 2, key: 'daA', r: 9, color: 'rgba(255,255,255,0.35)' },
  ];

  const centerNode: NodeDef = { x: cx, y: cy, key: 'center', r: 24, color: '#EC4899' };

  const allNodes = [...corners, ...edges, ...inner, ...between, centerNode];

  const getVal = (key: string): number => (m as unknown as Record<string, number>)[key];

  const lines: [number, number, number, number][] = [
    // Outer diamond
    [corners[0].x, corners[0].y, corners[1].x, corners[1].y],
    [corners[1].x, corners[1].y, corners[2].x, corners[2].y],
    [corners[2].x, corners[2].y, corners[3].x, corners[3].y],
    [corners[3].x, corners[3].y, corners[0].x, corners[0].y],
    // Inner diamond
    [edges[0].x, edges[0].y, edges[1].x, edges[1].y],
    [edges[1].x, edges[1].y, edges[2].x, edges[2].y],
    [edges[2].x, edges[2].y, edges[3].x, edges[3].y],
    [edges[3].x, edges[3].y, edges[0].x, edges[0].y],
    // Cross
    [corners[0].x, corners[0].y, corners[2].x, corners[2].y],
    [corners[1].x, corners[1].y, corners[3].x, corners[3].y],
    // Inner cross
    [edges[0].x, edges[0].y, edges[2].x, edges[2].y],
    [edges[1].x, edges[1].y, edges[3].x, edges[3].y],
  ];

  const nodeInfo = activeNode ? (() => {
    const num = getVal(activeNode);
    const e = FATE_ENERGY_DESCRIPTIONS[num];
    return e ? { num, ...e } : null;
  })() : null;

  const cornerLabels = [
    { x: 4, y: cy - 5, text: t('fm.personality'), anchor: 'start' },
    { x: cx, y: 15, text: t('fm.society'), anchor: 'middle' },
    { x: 396, y: cy - 5, text: t('fm.mission'), anchor: 'end' },
    { x: cx, y: 395, text: t('fm.clanKarma'), anchor: 'middle' },
  ];

  return (
    <div className={styles.fateSection}>
      {/* ── SVG Diagram + overlay tooltip ── */}
      <div className={styles.fateVisual}>
        <svg viewBox="0 0 400 400" className={styles.fateSvg}>
          <defs>
            <radialGradient id="fmGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(139,92,246,0.12)" />
              <stop offset="100%" stopColor="rgba(139,92,246,0)" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={outerR + 10} fill="url(#fmGlow)" />

          {lines.map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i < 4 ? 'rgba(212,175,55,0.3)' : i < 8 ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.08)'}
              strokeWidth={i < 4 ? 1.5 : 1} strokeDasharray={i >= 8 ? '4 3' : undefined} />
          ))}

          {cornerLabels.map((l, i) => (
            <text key={i} x={l.x} y={l.y} fill="rgba(255,255,255,0.35)" fontSize="8"
              textAnchor={l.anchor as 'start' | 'middle' | 'end'} fontWeight="500">{l.text}</text>
          ))}

          {allNodes.map(n => {
            const val = getVal(n.key);
            const isActive = activeNode === n.key;
            return (
              <g key={n.key} onClick={(e) => { e.stopPropagation(); setActiveNode(isActive ? null : n.key); }}
                style={{ cursor: 'pointer' }}>
                <circle cx={n.x} cy={n.y} r={(n.r || 12) + (isActive ? 4 : 0)}
                  fill={isActive ? `${n.color}33` : `${n.color}18`}
                  stroke={n.color} strokeWidth={isActive ? 2.5 : 1.2}
                  style={{ transition: 'all 0.2s' }} />
                <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="middle"
                  fill={n.color || '#fff'} fontSize={n.r && n.r >= 20 ? 14 : n.r && n.r >= 14 ? 11 : 8}
                  fontWeight="bold" style={{ pointerEvents: 'none' }}>
                  {val}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip overlays the SVG area — no layout shift */}
        <AnimatePresence>
          {nodeInfo && (
            <motion.div className={styles.nodeTooltip}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setActiveNode(null)}>
              <div className={styles.tooltipHeader}>
                <span className={styles.tooltipNum}>{nodeInfo.num}</span>
                <span className={styles.tooltipName}>{nodeInfo.name}</span>
              </div>
              <p className={styles.tooltipPlus}><b>+</b> {nodeInfo.plus}</p>
              <p className={styles.tooltipMinus}><b>−</b> {nodeInfo.minus}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Sections accordion ── */}
      <div className={styles.sections}>
        {SECTION_IDS.map(id => (
          <div key={id} className={styles.accordionItem}
            ref={el => { accordionRefs.current[id] = el; }}>
            <button className={`${styles.accordionBtn} ${expanded === id ? styles.accordionOpen : ''}`}
              onClick={() => toggle(id)}>
              <span className={styles.accordionIcon}>{SECTION_ICONS[id]}</span>
              <span className={styles.accordionLabel}>{t(SECTION_I18N_KEYS[id])}</span>
              <span className={styles.accordionArrow}>{expanded === id ? '▾' : '▸'}</span>
            </button>
            <AnimatePresence initial={false}>
              {expanded === id && (
                <motion.div className={styles.accordionBody}
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <div className={styles.accordionInner}>
                    {renderSection(id, m)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderSection(id: string, m: FateMatrixResult) {
  switch (id) {
    case 'talents': return <TalentsSection m={m} />;
    case 'purpose': return <PurposeSection m={m} />;
    case 'karmicTail': return <KarmicTailSection m={m} />;
    case 'comfort': return <ComfortSection m={m} />;
    case 'selfReal': return <SelfRealSection m={m} />;
    case 'health': return <HealthSection m={m} />;
    case 'relationships': return <RelationshipsSection m={m} />;
    case 'money': return <MoneySection m={m} />;
    case 'clan': return <ClanSection m={m} />;
    case 'programs': return <ProgramsSection m={m} />;
    case 'yearForecast': return <YearForecastSection m={m} />;
    default: return null;
  }
}

// ── Section Components ──

function TalentsSection({ m }: { m: FateMatrixResult }) {
  const { t } = useTranslation();
  const talents = [
    { num: m.a, label: t('fm.talent1'), sub: t('fm.talent1sub') },
    { num: m.b, label: t('fm.talent2'), sub: t('fm.talent2sub') },
    { num: m.c, label: t('fm.talent3'), sub: t('fm.talent3sub') },
  ];
  return (
    <div className={styles.talentList}>
      {talents.map((tal, i) => {
        const desc = TALENT_DESCRIPTIONS[tal.num];
        if (!desc) return null;
        return (
          <div key={i} className={styles.talentCard}>
            <div className={styles.talentHeader}>
              <span className={styles.talentNum}>{tal.num}</span>
              <div>
                <span className={styles.talentLabel}>{tal.label}</span>
                <span className={styles.talentSub}>{desc.name} · {tal.sub}</span>
              </div>
            </div>
            <div className={styles.talentBody}>
              <div className={styles.energyPlus}><span className={styles.plusIcon}>+</span><p>{desc.plus}</p></div>
              <div className={styles.energyMinus}><span className={styles.minusIcon}>−</span><p>{desc.minus}</p></div>
              <div className={styles.talentProf}>
                <span className={styles.profLabel}>{t('fm.professions')}:</span>
                <p>{desc.professions}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PurposeSection({ m }: { m: FateMatrixResult }) {
  const triples = [m.personalPurpose, m.socialPurpose, m.spiritualPurpose];
  return (
    <div className={styles.purposeList}>
      {triples.map((t, i) => {
        const pKey = i === 0 ? 'personal' : i === 1 ? 'social' : 'spiritual';
        return (
          <div key={i} className={styles.purposeCard}>
            <div className={styles.purposeHeader}>
              <span className={styles.purposeRange}>{t.ageRange}</span>
              <span className={styles.purposeLabel}>{t.label}</span>
            </div>
            <div className={styles.purposeNums}>
              {t.numbers.map((n, j) => (
                <span key={j} className={styles.purposeNum}>{n}</span>
              ))}
            </div>
            {t.numbers.map((n, j) => {
              const desc = PURPOSE_DESCRIPTIONS[n];
              if (!desc) return null;
              return (
                <div key={j} className={styles.purposeDesc}>
                  <span className={styles.purposeDescNum}>{t('fm.energyN', { n: String(n) })}</span>
                  <p>{desc[pKey as keyof typeof desc]}</p>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function KarmicTailSection({ m }: { m: FateMatrixResult }) {
  return (
    <div className={styles.karmicTailList}>
      <p className={styles.karmicTailIntro}>
        {t('fm.karmicTailIntro')}
      </p>
      {m.karmicTail.map((num, i) => {
        const desc = KARMIC_TAIL_DESCRIPTIONS[num];
        const labels = [t('fm.karmicTask1'), t('fm.karmicTask2'), t('fm.karmicTask3')];
        return (
          <div key={i} className={styles.karmicTailCard}>
            <div className={styles.karmicTailHeader}>
              <span className={styles.karmicTailNum}>{num}</span>
              <div>
                <span className={styles.karmicTailLabel}>{labels[i]}</span>
                <span className={styles.karmicTailEnergy}>{FATE_ENERGY_DESCRIPTIONS[num]?.name}</span>
              </div>
            </div>
            {desc && <p className={styles.karmicTailDesc}>{desc}</p>}
          </div>
        );
      })}
    </div>
  );
}

function ComfortSection({ m }: { m: FateMatrixResult }) {
  const { t } = useTranslation();
  const desc = COMFORT_ZONE_DESCRIPTIONS[m.center];
  return (
    <div className={styles.comfortCard}>
      <EnergyCard num={m.center} context={t('fm.comfortZone')} />
      {desc && <p className={styles.comfortDesc}>{desc}</p>}
    </div>
  );
}

function SelfRealSection({ m }: { m: FateMatrixResult }) {
  const desc = SELF_REALIZATION_DESCRIPTIONS[m.selfRealization];
  return (
    <div className={styles.selfRealCard}>
      <EnergyCard num={m.selfRealization} context={t('fm.selfRealContext')} />
      {desc && <p className={styles.selfRealDesc}>{desc}</p>}
    </div>
  );
}

function HealthSection({ m }: { m: FateMatrixResult }) {
  const { t } = useTranslation();
  const chakraColors = ['#9333EA', '#6366F1', '#06B6D4', '#22C55E', '#EAB308', '#F97316', '#EF4444'];
  return (
    <div className={styles.healthSection}>
      <div className={styles.chakraTable}>
        <div className={styles.chakraHeaderRow}>
          <span>{t('fm.chakra')}</span>
          <span>{t('fm.physical')}</span>
          <span>{t('fm.energyLabel')}</span>
          <span>{t('fm.emotions')}</span>
        </div>
        {m.chakras.map((ch, i) => (
          <div key={i} className={styles.chakraRow} style={{ borderLeftColor: chakraColors[i] }}>
            <span className={styles.chakraName}>{ch.nameRu}</span>
            <span className={styles.chakraVal}>{ch.physical}</span>
            <span className={styles.chakraVal}>{ch.energy}</span>
            <span className={styles.chakraVal}>{ch.emotions}</span>
          </div>
        ))}
        <div className={styles.chakraTotalRow}>
          <span>{t('fm.total')}</span>
          <span className={styles.chakraTotalVal}>{m.chakraTotals.physical}</span>
          <span className={styles.chakraTotalVal}>{m.chakraTotals.energy}</span>
          <span className={styles.chakraTotalVal}>{m.chakraTotals.emotions}</span>
        </div>
      </div>

      <h4 className={styles.healthSubTitle}>{t('fm.chakraTasks')}</h4>
      {m.chakras.map((ch, i) => {
        const desc = CHAKRA_TASK_DESCRIPTIONS[ch.physical];
        if (!desc) return null;
        return (
          <div key={i} className={styles.chakraTaskCard} style={{ borderLeftColor: chakraColors[i] }}>
            <span className={styles.chakraTaskName}>{ch.nameRu} ({ch.physical}-{ch.energy}-{ch.emotions})</span>
            <div className={styles.chakraTaskBody}>
              <p><b>{t('fm.physical')}:</b> {desc.physical}</p>
              <p><b>{t('fm.energyLabel')}:</b> {desc.energy}</p>
              <p><b>{t('fm.emotions')}:</b> {desc.emotions}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RelationshipsSection({ m }: { m: FateMatrixResult }) {
  const { t } = useTranslation();
  const desc = RELATIONSHIP_DESCRIPTIONS[m.partnerTasks];
  if (!desc) return null;
  return (
    <div className={styles.relSection}>
      <EnergyCard num={m.partnerTasks} context={t('fm.relContext')} />
      <div className={styles.relGrid}>
        <div className={styles.relItem}>
          <span className={styles.relItemLabel}>{t('fm.relTask')}</span>
          <p>{desc.task}</p>
        </div>
        <div className={styles.relItem}>
          <span className={styles.relItemLabel}>{t('fm.partnerType')}</span>
          <p>{desc.partnerType}</p>
        </div>
        <div className={styles.relItem}>
          <span className={styles.relItemLabel}>{t('fm.relProblems')}</span>
          <p>{desc.problems}</p>
        </div>
        <div className={styles.relItem}>
          <span className={styles.relItemLabel}>{t('fm.relWhere')}</span>
          <p>{desc.meeting}</p>
        </div>
      </div>
    </div>
  );
}

function MoneySection({ m }: { m: FateMatrixResult }) {
  const { t } = useTranslation();
  const desc = MONEY_DESCRIPTIONS[m.moneyProfession];
  if (!desc) return null;
  return (
    <div className={styles.moneySection}>
      <EnergyCard num={m.moneyProfession} context={t('fm.moneyContext')} />
      <div className={styles.moneyGrid}>
        <div className={styles.moneyItem}>
          <span className={styles.moneyItemLabel}>{t('fm.moneyProfessions')}</span>
          <p>{desc.professions}</p>
        </div>
        <div className={styles.moneyItem}>
          <span className={styles.moneyItemLabel}>{t('fm.moneyGives')}</span>
          <p>{desc.gives}</p>
        </div>
        <div className={styles.moneyItem}>
          <span className={styles.moneyItemLabel}>{t('fm.moneyBlocks')}</span>
          <p>{desc.blocks}</p>
        </div>
      </div>
    </div>
  );
}

function ClanSection({ m }: { m: FateMatrixResult }) {
  const { t } = useTranslation();
  const desc = CLAN_LINE_DESCRIPTIONS[m.clanStrength];
  if (!desc) return null;
  return (
    <div className={styles.clanSection}>
      <EnergyCard num={m.clanStrength} context={t('fm.clanContext')} />
      <div className={styles.clanGrid}>
        <div className={styles.clanItem}>
          <span className={styles.clanItemLabel}>{t('fm.fatherLine')}</span>
          <p>{desc.father}</p>
        </div>
        <div className={styles.clanItem}>
          <span className={styles.clanItemLabel}>{t('fm.motherLine')}</span>
          <p>{desc.mother}</p>
        </div>
        <div className={styles.clanItem}>
          <span className={styles.clanItemLabel}>{t('fm.clanGrandmaFather')}</span>
          <p>{desc.fatherMother}</p>
        </div>
        <div className={styles.clanItem}>
          <span className={styles.clanItemLabel}>{t('fm.clanGrandpaMother')}</span>
          <p>{desc.motherFather}</p>
        </div>
      </div>
    </div>
  );
}

function ProgramsSection({ m }: { m: FateMatrixResult }) {
  const { t } = useTranslation();
  if (m.programs.length === 0) {
    return (
      <div className={styles.noProgramsCard}>
        <span className={styles.noProgramsIcon}>✓</span>
        <p>{t('fm.noKarmic')}</p>
      </div>
    );
  }
  return (
    <div className={styles.programsList}>
      {m.programs.map((p, i) => (
        <div key={i} className={styles.programCard}>
          <div className={styles.programHeader}>
            <span className={styles.programNums}>{p.numbers.join(' – ')}</span>
            <span className={styles.programName}>{p.name}</span>
          </div>
          <p className={styles.programDesc}>{p.description}</p>
        </div>
      ))}
    </div>
  );
}

function YearForecastSection({ m }: { m: FateMatrixResult }) {
  const desc = YEAR_FORECAST_DESCRIPTIONS[m.yearEnergy];
  return (
    <div className={styles.yearSection}>
      <div className={styles.yearHeader}>
        <span className={styles.yearAge}>{t('fm.yourAge', { age: String(m.currentAge) })}</span>
        <span className={styles.yearEnergy}>{t('fm.yearEnergy', { energy: String(m.yearEnergy) })}</span>
      </div>
      <EnergyCard num={m.yearEnergy} context={t('fm.yearForecastContext', { year: String(new Date().getFullYear()) })} />
      {desc && <p className={styles.yearDesc}>{desc}</p>}
    </div>
  );
}
