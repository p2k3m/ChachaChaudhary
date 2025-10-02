import { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

interface DialogueBubbleProps extends PropsWithChildren {
  speaker: string;
  tone?: 'default' | 'excited' | 'hint' | 'warning';
}

const toneClassMap: Record<NonNullable<DialogueBubbleProps['tone']>, string> = {
  default: 'bubble--default',
  excited: 'bubble--excited',
  hint: 'bubble--hint',
  warning: 'bubble--warning'
};

export const DialogueBubble = ({ speaker, tone = 'default', children }: DialogueBubbleProps) => (
  <motion.div
    className={`dialogue-bubble ${toneClassMap[tone]}`}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 240, damping: 16 }}
  >
    <span className="dialogue-bubble__speaker">{speaker}</span>
    <p className="dialogue-bubble__text">{children}</p>
  </motion.div>
);
