import { motion } from 'framer-motion';
import type { Clue } from '../../types/game';

interface ClueCardProps {
  clue: Clue;
  iconUrl: string;
  isSelected: boolean;
  onToggle: (clue: Clue) => void;
}

export const ClueCard = ({ clue, iconUrl, isSelected, onToggle }: ClueCardProps) => (
  <motion.button
    type="button"
    className={`clue-card ${isSelected ? 'clue-card--selected' : ''}`}
    onClick={() => onToggle(clue)}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <img src={iconUrl} alt="" aria-hidden />
    <span className="clue-card__label">{clue.label}</span>
    <p className="clue-card__description">{clue.description}</p>
  </motion.button>
);
