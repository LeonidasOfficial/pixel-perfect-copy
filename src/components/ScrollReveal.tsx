import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  zoom?: boolean;
}

export function ScrollReveal({ 
  children, 
  className = '', 
  delay = 0,
  direction = 'up',
  zoom = false
}: ScrollRevealProps) {
  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { y: 0, x: 60 },
    right: { y: 0, x: -60 },
    none: { y: 0, x: 0 },
  };

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        y: directions[direction].y,
        x: directions[direction].x,
        scale: zoom ? 0.85 : 1
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        x: 0,
        scale: 1
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: zoom ? 1.2 : 0.8, 
        delay,
        ease: [0.25, 0.1, 0.25, 1] 
      }}
    >
      {children}
    </motion.div>
  );
}
