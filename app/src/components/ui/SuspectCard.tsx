import { motion } from 'framer-motion';
import type { Suspect } from '../../types/game';

interface SuspectCardProps {
  suspect: Suspect;
  avatarUrl: string;
  isActive: boolean;
  onSelect: (suspect: Suspect) => void;
}

export const SuspectCard = ({ suspect, avatarUrl, isActive, onSelect }: SuspectCardProps) => (
  <motion.button
    type="button"
    className={`suspect-card ${isActive ? 'suspect-card--active' : ''}`}
    onClick={() => onSelect(suspect)}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
  >
    <img src={avatarUrl} alt={suspect.name} className="suspect-card__avatar" />
    <span className="suspect-card__name">{suspect.name}</span>
    <p className="suspect-card__statement">{suspect.statement}</p>
  </motion.button>
);
