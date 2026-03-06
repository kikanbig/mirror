import { motion } from 'framer-motion';

interface IconProps {
  active?: boolean;
  size?: number;
}

function NavIcon({ src, active, size = 36 }: IconProps & { src: string }) {
  return (
    <motion.div
      style={{ width: size, height: size, position: 'relative' }}
      animate={{
        filter: active
          ? 'drop-shadow(0 0 8px rgba(212,175,55,0.6)) brightness(1.2)'
          : 'brightness(0.5) saturate(0.3)',
        scale: active ? 1.1 : 1,
      }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={src}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />
    </motion.div>
  );
}

export function HomeIcon({ active, size = 36 }: IconProps) {
  return <NavIcon src="/icons/icon_nav_home.webp" active={active} size={size} />;
}

export function TarotIcon({ active, size = 36 }: IconProps) {
  return <NavIcon src="/icons/icon_nav_tarot.webp" active={active} size={size} />;
}

export function SynthesisIcon({ active, size = 34 }: IconProps) {
  return (
    <motion.div
      style={{ width: size, height: size }}
      animate={{ scale: active ? 1.1 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="50" y1="50"
            x2={50 + 42 * Math.cos((deg * Math.PI) / 180)}
            y2={50 + 42 * Math.sin((deg * Math.PI) / 180)}
            stroke="#1a0a2e" strokeWidth="2" strokeLinecap="round" opacity="0.5"
          />
        ))}
        {/* Eye shape */}
        <path
          d="M10 50 Q30 25 50 25 Q70 25 90 50 Q70 75 50 75 Q30 75 10 50Z"
          fill="#1a0a2e" opacity="0.9"
        />
        <path
          d="M10 50 Q30 25 50 25 Q70 25 90 50 Q70 75 50 75 Q30 75 10 50Z"
          stroke="#0d0520" strokeWidth="2" fill="none"
        />
        {/* Iris */}
        <circle cx="50" cy="50" r="15" fill="#2d1b69" />
        <circle cx="50" cy="50" r="15" stroke="#0d0520" strokeWidth="1.5" fill="none" />
        {/* Inner ring */}
        <circle cx="50" cy="50" r="10" fill="#4c1d95" />
        {/* Pupil */}
        <circle cx="50" cy="50" r="5" fill="#0d0520" />
        {/* Highlight */}
        <circle cx="45" cy="46" r="3" fill="rgba(255,255,255,0.35)" />
        <circle cx="55" cy="53" r="1.5" fill="rgba(255,255,255,0.2)" />
      </svg>
    </motion.div>
  );
}

export function JournalIcon({ active, size = 36 }: IconProps) {
  return <NavIcon src="/icons/icon_nav_journal.webp" active={active} size={size} />;
}

export function ProfileIcon({ active, size = 36 }: IconProps) {
  return <NavIcon src="/icons/icon_nav_profile.webp" active={active} size={size} />;
}
