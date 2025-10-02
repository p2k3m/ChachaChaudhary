import { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

interface ComicPanelProps extends PropsWithChildren {
  backgroundImage?: string;
  headline: string;
  subline?: string;
}

export const ComicPanel = ({
  backgroundImage,
  headline,
  subline,
  children
}: ComicPanelProps) => {
  return (
    <motion.section
      className="comic-panel"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined
      }}
    >
      <header className="comic-panel__header">
        <h1>{headline}</h1>
        {subline ? <p>{subline}</p> : null}
      </header>
      <div className="comic-panel__body">{children}</div>
    </motion.section>
  );
};
