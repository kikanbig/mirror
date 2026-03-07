import { motion } from 'framer-motion';

interface IconProps {
  active?: boolean;
  size?: number;
}

function IconWrap({ active, size = 32, children }: IconProps & { children: React.ReactNode }) {
  return (
    <motion.div
      style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      animate={{
        filter: active
          ? 'drop-shadow(0 0 6px rgba(212,175,55,0.6))'
          : 'none',
        scale: active ? 1.1 : 1,
        opacity: active ? 1 : 0.45,
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

export function HomeIcon({ active, size = 32 }: IconProps) {
  const c = active ? '#D4AF37' : '#e0d6c8';
  return (
    <IconWrap active={active} size={size}>
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10.5z" />
        <path d="M9 21V14h6v7" />
      </svg>
    </IconWrap>
  );
}

export function TarotIcon({ active, size = 32 }: IconProps) {
  const c = active ? '#D4AF37' : '#e0d6c8';
  return (
    <IconWrap active={active} size={size}>
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 5v1M12 18v1" />
        <path d="M8 8l.7.7M15.3 15.3l.7.7" />
        <path d="M5 12h1M18 12h1" />
        <path d="M8 16l.7-.7M15.3 8.7l.7-.7" />
      </svg>
    </IconWrap>
  );
}

export function SynthesisIcon({ active, size = 30 }: IconProps) {
  const c = active ? '#D4AF37' : '#1a0a2e';
  return (
    <motion.div
      style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      animate={{ scale: active ? 1.1 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12c3-5 7-8 10-8s7 3 10 8c-3 5-7 8-10 8s-7-3-10-8z" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="12" cy="12" r="1.2" fill={c} stroke="none" />
      </svg>
    </motion.div>
  );
}

export function JournalIcon({ active, size = 32 }: IconProps) {
  const c = active ? '#D4AF37' : '#e0d6c8';
  return (
    <IconWrap active={active} size={size}>
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h1c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4" />
        <rect x="7" y="2" width="13" height="20" rx="1" />
        <path d="M11 7h5M11 11h5M11 15h3" />
      </svg>
    </IconWrap>
  );
}

export function ProfileIcon({ active, size = 32 }: IconProps) {
  const c = active ? '#D4AF37' : '#e0d6c8';
  return (
    <IconWrap active={active} size={size}>
      <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
      </svg>
    </IconWrap>
  );
}
