import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FateReportView.module.scss';

interface Chapter {
  id: number;
  title: string;
  content: string;
}

interface FateReportViewProps {
  chapters: Record<string, Chapter>;
  wordCount: number;
  birthDate: string;
  createdAt?: string;
  onClose?: () => void;
}

export default function FateReportView({ chapters, wordCount, birthDate, createdAt, onClose }: FateReportViewProps) {
  const [activeChapter, setActiveChapter] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const sorted = Object.values(chapters).sort((a, b) => a.id - b.id);
  const pageEstimate = Math.ceil(wordCount / 250);

  const scrollToChapter = (id: number) => {
    setActiveChapter(activeChapter === id ? null : id);
  };

  return (
    <div className={styles.report}>
      <div className={styles.header}>
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose}>&#8592; Назад</button>
        )}
        <h1 className={styles.mainTitle}>Полный отчёт Матрицы Судьбы</h1>
        <div className={styles.meta}>
          <span>Дата рождения: {new Date(birthDate).toLocaleDateString('ru-RU')}</span>
          <span>{wordCount.toLocaleString()} слов / ~{pageEstimate} страниц</span>
          {createdAt && <span>Создан: {new Date(createdAt).toLocaleDateString('ru-RU')}</span>}
        </div>
      </div>

      {/* Table of contents */}
      <div className={styles.toc}>
        <h3 className={styles.tocTitle}>Содержание</h3>
        <div className={styles.tocList}>
          {sorted.map((ch) => (
            <button
              key={ch.id}
              className={`${styles.tocItem} ${activeChapter === ch.id ? styles.tocActive : ''}`}
              onClick={() => scrollToChapter(ch.id)}
            >
              <span className={styles.tocNum}>{ch.id}</span>
              <span className={styles.tocText}>{ch.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chapters */}
      <div ref={contentRef} className={styles.chapters}>
        {sorted.map((ch) => (
          <motion.div
            key={ch.id}
            className={styles.chapter}
            id={`chapter-${ch.id}`}
            layout
          >
            <button
              className={styles.chapterHeader}
              onClick={() => scrollToChapter(ch.id)}
            >
              <span className={styles.chapterNum}>{ch.id}</span>
              <span className={styles.chapterTitle}>{ch.title}</span>
              <motion.span
                className={styles.chapterArrow}
                animate={{ rotate: activeChapter === ch.id ? 180 : 0 }}
              >
                &#9660;
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {activeChapter === ch.id && (
                <motion.div
                  className={styles.chapterBody}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className={styles.chapterContent}>
                    {ch.content.split('\n').map((p, i) =>
                      p.trim() ? <p key={i}>{p}</p> : <br key={i} />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
