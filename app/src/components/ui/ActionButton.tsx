import { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const ActionButton = ({ variant = 'primary', children, ...rest }: ActionButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    className={`action-button action-button--${variant}`}
    {...rest}
  >
    {children}
  </motion.button>
);
