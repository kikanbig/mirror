import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SplashScreen.module.scss';

interface SplashParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
}

const COLORS = [
  'rgba(212, 175, 55, ',
  'rgba(139, 92, 246, ',
  'rgba(255, 215, 0, ',
];

function SplashParticles({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<SplashParticle[]>([]);
  const animRef = useRef(0);
  const burstFired = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const spawnBurst = () => {
      for (let i = 0; i < 60; i++) {
        const angle = (Math.PI * 2 * i) / 60 + Math.random() * 0.3;
        const speed = 1 + Math.random() * 3;
        particlesRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 0.5,
          opacity: 1,
          life: 0,
          maxLife: 60 + Math.random() * 80,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    };

    const ambient = () => {
      if (particlesRef.current.length < 30) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.5 + 0.3,
          opacity: 0,
          life: 0,
          maxLife: 120 + Math.random() * 60,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!burstFired.current && active) {
        burstFired.current = true;
        spawnBurst();
      }

      ambient();

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;

        const progress = p.life / p.maxLife;
        p.opacity = progress < 0.1 ? progress * 10 : progress > 0.7 ? (1 - progress) / 0.3 : 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ')';
        ctx.fill();

        if (p.size > 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color + (p.opacity * 0.1) + ')';
          ctx.fill();
        }

        return p.life < p.maxLife;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  return <canvas ref={canvasRef} className={styles.particleCanvas} />;
}

const TITLE = 'NUMA';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.splash}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SplashParticles active />
          <div className={styles.glowOrb} />

          <div className={styles.logoContainer}>
            <img
              className={styles.logoImg}
              src="/icons/icon_splash_logo.webp"
              alt="NUMA"
              width={160}
              height={160}
            />
          </div>

          <div className={styles.titleContainer}>
            {TITLE.split('').map((char, i) => (
              <span
                key={i}
                className={`${styles.letter} ${char === ' ' ? styles.space : ''}`}
                style={{ animationDelay: `${1.2 + i * 0.06}s` }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>

          <span className={styles.subtitle}>Числа. Карты. Ты.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
