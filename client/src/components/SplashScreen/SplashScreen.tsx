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

const TITLE = 'Зеркало Судьбы';

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
            <svg className={styles.logoSvg} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              {/* Outer eye shape */}
              <path
                className={styles.logoPath}
                d="M10 50 Q30 20 50 20 Q70 20 90 50 Q70 80 50 80 Q30 80 10 50 Z"
              />
              {/* Inner iris */}
              <circle
                className={styles.logoPath}
                cx="50" cy="50" r="15"
                style={{ animationDelay: '0.5s' }}
              />
              {/* Pupil */}
              <circle
                className={`${styles.logoFill}`}
                cx="50" cy="50" r="7"
                fill="#D4AF37"
              />
              {/* Light reflection */}
              <circle
                className={styles.logoFill}
                cx="44" cy="45" r="2.5"
                fill="rgba(255,255,255,0.8)"
                style={{ animationDelay: '1.6s' }}
              />
              {/* Decorative rays */}
              <path
                className={styles.logoPath}
                d="M50 5 L50 15 M50 85 L50 95 M5 50 L15 50 M85 50 L95 50"
                style={{ animationDelay: '0.8s' }}
              />
              <path
                className={styles.logoPath}
                d="M18 18 L25 25 M75 75 L82 82 M82 18 L75 25 M25 75 L18 82"
                style={{ animationDelay: '1s' }}
              />
            </svg>
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

          <span className={styles.subtitle}>раскройте тайны судьбы</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
