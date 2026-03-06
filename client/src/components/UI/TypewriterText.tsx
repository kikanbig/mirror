import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './TypewriterText.module.scss';

interface Props {
  text: string;
  speed?: number;
  className?: string;
}

export default function TypewriterText({ text, speed = 25, className }: Props) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    setDone(false);
    lastTimeRef.current = 0;

    const interval = 1000 / speed;

    const tick = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;

      if (delta >= interval) {
        lastTimeRef.current = time;
        indexRef.current++;

        if (indexRef.current >= text.length) {
          setDisplayed(text);
          setDone(true);
          return;
        }

        setDisplayed(text.slice(0, indexRef.current));
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [text, speed]);

  const paragraphs = displayed.split('\n');

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {paragraphs.map((p, i) =>
        p.trim() ? (
          <p key={i} className={styles.paragraph}>
            {p}
            {i === paragraphs.length - 1 && !done && (
              <span className={styles.cursor} />
            )}
          </p>
        ) : null
      )}
      {!displayed && !done && (
        <div className={styles.thinking}>
          <span className={styles.thinkingStar}>&#10022;</span>
          <span className={styles.thinkingStar}>&#10022;</span>
          <span className={styles.thinkingStar}>&#10022;</span>
        </div>
      )}
    </div>
  );
}

export function ThinkingIndicator() {
  return (
    <motion.div
      className={styles.thinkingBlock}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className={styles.thinking}>
        <motion.span
          className={styles.thinkingStar}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
        >&#10022;</motion.span>
        <motion.span
          className={styles.thinkingStar}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
        >&#10022;</motion.span>
        <motion.span
          className={styles.thinkingStar}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
        >&#10022;</motion.span>
      </div>
      <p className={styles.thinkingText}>Оракул читает карты...</p>
    </motion.div>
  );
}
