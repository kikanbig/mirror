import { motion } from 'framer-motion';

interface IconProps {
  active?: boolean;
  size?: number;
}

const activeColor = '#D4AF37';
const inactiveColor = '#6B6B8D';

export function HomeIcon({ active, size = 22 }: IconProps) {
  const color = active ? activeColor : inactiveColor;
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      animate={{ filter: active ? 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' : 'none' }}
    >
      <motion.path
        d="M12 3L2 12h3v8h5v-5h4v5h5v-8h3L12 3z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={active ? 'rgba(212,175,55,0.15)' : 'none'}
        animate={{ fill: active ? 'rgba(212,175,55,0.15)' : 'rgba(212,175,55,0)' }}
        transition={{ duration: 0.3 }}
      />
      <motion.circle
        cx="12" cy="12" r="2"
        fill={color}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.svg>
  );
}

export function TarotIcon({ active, size = 22 }: IconProps) {
  const color = active ? activeColor : inactiveColor;
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      animate={{ filter: active ? 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' : 'none' }}
    >
      <motion.rect
        x="4" y="2" width="12" height="18" rx="2"
        stroke={color} strokeWidth="1.5"
        fill={active ? 'rgba(212,175,55,0.1)' : 'none'}
        animate={{ fill: active ? 'rgba(212,175,55,0.1)' : 'rgba(0,0,0,0)' }}
      />
      <motion.rect
        x="8" y="4" width="12" height="18" rx="2"
        stroke={color} strokeWidth="1.5"
        fill={active ? 'rgba(139,92,246,0.1)' : 'none'}
        animate={{ fill: active ? 'rgba(139,92,246,0.1)' : 'rgba(0,0,0,0)' }}
      />
      <motion.path
        d="M14 10l-2 3 2 3M12 10l2 3-2 3"
        stroke={color} strokeWidth="1" strokeLinecap="round"
        animate={{ opacity: active ? 1 : 0.5 }}
      />
    </motion.svg>
  );
}

export function SynthesisIcon({ active, size = 26 }: IconProps) {
  const color = active ? activeColor : '#F5F5F5';
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      animate={{
        filter: active ? 'drop-shadow(0 0 8px rgba(212,175,55,0.6))' : 'drop-shadow(0 0 4px rgba(212,175,55,0.2))',
      }}
    >
      <motion.path
        d="M12 2l2.5 7.5H22l-6 4.5 2.5 7.5L12 17l-6.5 4.5 2.5-7.5-6-4.5h7.5L12 2z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={active ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.1)'}
        animate={{
          fill: active ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.1)',
          scale: active ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: active ? 1.5 : 0.3, repeat: active ? Infinity : 0 }}
      />
      <motion.circle
        cx="12" cy="12" r="3"
        fill={color}
        animate={{ opacity: active ? 0.8 : 0.3 }}
      />
    </motion.svg>
  );
}

export function JournalIcon({ active, size = 22 }: IconProps) {
  const color = active ? activeColor : inactiveColor;
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      animate={{ filter: active ? 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' : 'none' }}
    >
      <motion.path
        d="M4 4h2v16H4V4z"
        fill={active ? 'rgba(139,92,246,0.3)' : 'rgba(107,107,141,0.2)'}
      />
      <motion.rect
        x="6" y="3" width="14" height="18" rx="2"
        stroke={color} strokeWidth="1.5"
        fill={active ? 'rgba(212,175,55,0.08)' : 'none'}
      />
      <motion.path
        d="M10 8h6M10 12h6M10 16h4"
        stroke={color} strokeWidth="1.2" strokeLinecap="round"
        animate={{ pathLength: active ? 1 : 0.7, opacity: active ? 1 : 0.6 }}
        transition={{ duration: 0.4 }}
      />
    </motion.svg>
  );
}

export function ProfileIcon({ active, size = 22 }: IconProps) {
  const color = active ? activeColor : inactiveColor;
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      animate={{ filter: active ? 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' : 'none' }}
    >
      {/* Crystal / gem shape */}
      <motion.path
        d="M12 2L6 8l6 13 6-13-6-6z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={active ? 'rgba(139,92,246,0.15)' : 'none'}
        animate={{ fill: active ? 'rgba(139,92,246,0.15)' : 'rgba(0,0,0,0)' }}
      />
      <motion.path
        d="M6 8h12M12 8v13"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        animate={{ opacity: active ? 0.8 : 0.4 }}
      />
      <motion.path
        d="M9 5l3 3 3-3"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ opacity: active ? 0.6 : 0.3 }}
      />
    </motion.svg>
  );
}
