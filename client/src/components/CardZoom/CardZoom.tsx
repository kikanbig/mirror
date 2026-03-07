import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import styles from './CardZoom.module.scss';

interface Props {
  src: string;
  name?: string;
  reversed?: boolean;
  onClose: () => void;
}

export default function CardZoom({ src, name, reversed, onClose }: Props) {
  return createPortal(
    <motion.div
      className={styles.overlay}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className={styles.cardWrapper}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={name || ''}
          className={styles.image}
          style={reversed ? { transform: 'rotate(180deg)' } : undefined}
          onClick={onClose}
        />
        {name && (
          <div className={styles.cardName}>
            {name}
            {reversed && <span className={styles.reversedTag}>(перевёрнута)</span>}
          </div>
        )}
      </motion.div>
      <span className={styles.closeHint}>Нажмите, чтобы закрыть</span>
    </motion.div>,
    document.body,
  );
}
