import { motion } from 'framer-motion';

interface IconProps {
  active?: boolean;
  size?: number;
}

function NavIcon({ src, active, size = 28 }: IconProps & { src: string }) {
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

export function HomeIcon({ active, size = 28 }: IconProps) {
  return <NavIcon src="/icons/icon_nav_home.webp" active={active} size={size} />;
}

export function TarotIcon({ active, size = 28 }: IconProps) {
  return <NavIcon src="/icons/icon_nav_tarot.webp" active={active} size={size} />;
}

export function SynthesisIcon({ active, size = 32 }: IconProps) {
  return <NavIcon src="/icons/icon_nav_synthesis.webp" active={active} size={size} />;
}

export function JournalIcon({ active, size = 28 }: IconProps) {
  return <NavIcon src="/icons/icon_nav_journal.webp" active={active} size={size} />;
}

export function ProfileIcon({ active, size = 28 }: IconProps) {
  return <NavIcon src="/icons/icon_nav_profile.webp" active={active} size={size} />;
}
