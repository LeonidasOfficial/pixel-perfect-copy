import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

export function CTASection() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Background image positioned to be visible just above footer
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '-5%']);
  
  // Text content animation - moves down and fades based on scroll
  // Starts at top, moves down, then fades out as footer approaches
  const textY = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], ['-50vh', '0vh', '10.3929vh', '20vh', '30vh']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.7, 0.85], [0, 1, 0.65357, 0.3, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative h-[160vh]"
      style={{
        backgroundColor: 'rgb(2, 22, 27)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Background Image - fills entire section height (160vh) */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: imageY }}
      >
        {/* Full image - fills entire section to footer */}
        <div className="h-[160vh] relative">
          <img
            src="/images/end-bg.webp"
            alt="Night view of cottage"
            className="w-full h-full object-cover object-top"
          />
          {/* Subtle gradient at bottom to blend with footer */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        </div>
      </motion.div>

      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Text content wrapper with scroll-triggered animations */}
        <motion.div 
          className="relative z-10 h-full flex items-center justify-center px-6"
          style={{ 
            y: textY,
            opacity: textOpacity,
            willChange: 'transform, opacity'
          }}
        >
          <div className="text-center">
            <motion.h2 
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-foreground mb-10"
            >
              {t('cta.heading')}
            </motion.h2>
            
            <motion.a
              href="#"
              className="inline-flex items-center justify-center px-10 py-5 border border-foreground/40 text-foreground font-body text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:bg-foreground hover:text-background backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {t('cta.bookNow')}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
