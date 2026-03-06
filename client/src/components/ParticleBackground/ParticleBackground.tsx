import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  maxOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: [number, number, number];
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  trail: { x: number; y: number; opacity: number }[];
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: [number, number, number];
  vx: number;
  vy: number;
  opacity: number;
  phase: number;
}

const PARTICLE_COLORS: [number, number, number][] = [
  [212, 175, 55],   // gold
  [139, 92, 246],   // purple
  [255, 215, 0],    // bright gold
  [167, 139, 250],  // light purple
  [59, 130, 246],   // blue
];

const CONSTELLATION_DIST = 120;
const NEBULA_COUNT = 4;

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const touchRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const lastShootingStarRef = useRef(0);

  const handleTouch = useCallback((e: TouchEvent | MouseEvent) => {
    const point = 'touches' in e ? e.touches[0] : e;
    if (!point) return;
    touchRef.current = { x: point.clientX, y: point.clientY, active: true };
    setTimeout(() => { touchRef.current.active = false; }, 300);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('mousedown', handleTouch);

    const count = Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 14000));
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.12,
      speedY: (Math.random() - 0.5) * 0.12,
      opacity: Math.random() * 0.5 + 0.1,
      maxOpacity: Math.random() * 0.6 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    }));

    nebulaeRef.current = Array.from({ length: NEBULA_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 150 + Math.random() * 200,
      color: PARTICLE_COLORS[Math.floor(Math.random() * 3)],
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      opacity: 0.015 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
    }));

    const spawnShootingStar = () => {
      const startX = Math.random() * canvas.width;
      const angle = Math.PI * 0.15 + Math.random() * Math.PI * 0.2;
      shootingStarsRef.current.push({
        x: startX,
        y: -10,
        vx: Math.cos(angle) * (4 + Math.random() * 3),
        vy: Math.sin(angle) * (4 + Math.random() * 3),
        life: 0,
        maxLife: 40 + Math.random() * 30,
        trail: [],
      });
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const touch = touchRef.current;

      // Nebulae
      for (const n of nebulaeRef.current) {
        n.x += n.vx;
        n.y += n.vy;
        n.phase += 0.003;

        if (n.x < -n.radius) n.x = canvas.width + n.radius;
        if (n.x > canvas.width + n.radius) n.x = -n.radius;
        if (n.y < -n.radius) n.y = canvas.height + n.radius;
        if (n.y > canvas.height + n.radius) n.y = -n.radius;

        const currentOpacity = n.opacity * (0.7 + 0.3 * Math.sin(n.phase));
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
        grad.addColorStop(0, `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${currentOpacity})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(n.x - n.radius, n.y - n.radius, n.radius * 2, n.radius * 2);
      }

      // Particles
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.twinklePhase += p.twinkleSpeed;
        p.opacity = p.maxOpacity * (0.5 + 0.5 * Math.sin(p.twinklePhase));

        if (touch.active) {
          const dx = p.x - touch.x;
          const dy = p.y - touch.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100 * 2;
            p.speedX += (dx / dist) * force * 0.3;
            p.speedY += (dy / dist) * force * 0.3;
          }
        }

        p.speedX *= 0.995;
        p.speedY *= 0.995;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.opacity})`;
        ctx.fill();

        if (p.size > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.opacity * 0.12})`;
          ctx.fill();
        }
      }

      // Constellation lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONSTELLATION_DIST) {
            const alpha = (1 - dist / CONSTELLATION_DIST) * 0.12 * Math.min(particles[i].opacity, particles[j].opacity);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Shooting stars
      if (time - lastShootingStarRef.current > (8000 + Math.random() * 6000)) {
        spawnShootingStar();
        lastShootingStarRef.current = time;
      }

      shootingStarsRef.current = shootingStarsRef.current.filter((s) => {
        s.life++;
        s.trail.unshift({ x: s.x, y: s.y, opacity: 1 });
        s.x += s.vx;
        s.y += s.vy;

        if (s.trail.length > 15) s.trail.pop();
        for (let t = 0; t < s.trail.length; t++) {
          s.trail[t].opacity *= 0.85;
          const tp = s.trail[t];
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, 1.5 * (1 - t / s.trail.length), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${tp.opacity * 0.6})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212, 175, 55, 0.2)';
        ctx.fill();

        return s.life < s.maxLife && s.x < canvas.width + 50 && s.y < canvas.height + 50;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('mousedown', handleTouch);
    };
  }, [handleTouch]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
