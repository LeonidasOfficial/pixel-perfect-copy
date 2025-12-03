import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

export function HeroSection() {
  const { t } = useLanguage();
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  
  const scrollToContent = () => {
    const element = document.getElementById('content-start');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll progress tracking for hero section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Parallax effect for background image - moves slower than scroll (translate3d)
  // Starts at 0, moves down as user scrolls (positive Y value creates parallax effect)
  const imageTranslateY = useTransform(scrollYProgress, [0, 1], [0, 0.3]);
  
  // Smooth scale effect - image scales up slightly as user scrolls (scale3d)
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // Parallax effect for subtitle
  const subtitleX = useMotionValue(0);
  const subtitleY = useMotionValue(0);
  const springSubtitleX = useSpring(subtitleX, { stiffness: 150, damping: 15 });
  const springSubtitleY = useSpring(subtitleY, { stiffness: 150, damping: 15 });
  const subtitleRotateX = useTransform(springSubtitleY, [-0.5, 0.5], [2, -2]);
  const subtitleRotateY = useTransform(springSubtitleX, [-0.5, 0.5], [-2, 2]);

  // Parallax effect for title
  const titleX = useMotionValue(0);
  const titleY = useMotionValue(0);
  const springTitleX = useSpring(titleX, { stiffness: 100, damping: 15 });
  const springTitleY = useSpring(titleY, { stiffness: 100, damping: 15 });
  const titleRotateX = useTransform(springTitleY, [-0.5, 0.5], [1.5, -1.5]);
  const titleRotateY = useTransform(springTitleX, [-0.5, 0.5], [-1.5, 1.5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>, ref: React.RefObject<HTMLElement>, x: any, y: any) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) / rect.width;
    const distanceY = (e.clientY - centerY) / rect.height;
    x.set(distanceX * 0.3);
    y.set(distanceY * 0.3);
  };

  const handleMouseLeave = (x: any, y: any) => {
    x.set(0);
    y.set(0);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with parallax and scale effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{
          y: imageTranslateY,
          scale: imageScale,
          willChange: 'transform',
          transformStyle: 'preserve-3d'
        }}
      >
        <img
          src="/images/hero-bg.webp"
          alt="Snowy mountain landscape with cottage by the lake"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-20 text-center px-6 pt-20">
        <motion.p
          ref={subtitleRef}
          className="text-base md:text-lg lg:text-xl uppercase tracking-[0.3em] text-accent font-medium mb-6 cursor-default"
          style={{
            textShadow: '0 0 2px rgba(255,255,255,0.8), 0 0 4px rgba(255,255,255,0.6), -0.5px -0.5px 1px rgba(255,255,255,0.9), 0.5px -0.5px 1px rgba(255,255,255,0.9), -0.5px 0.5px 1px rgba(255,255,255,0.9), 0.5px 0.5px 1px rgba(255,255,255,0.9)',
            x: springSubtitleX,
            y: springSubtitleY,
            rotateX: subtitleRotateX,
            rotateY: subtitleRotateY,
            transformStyle: 'preserve-3d',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onMouseMove={(e) => handleMouseMove(e, subtitleRef, subtitleX, subtitleY)}
          onMouseLeave={() => handleMouseLeave(subtitleX, subtitleY)}
        >
          {t('hero.subtitle')}
        </motion.p>
        
        <motion.h1
          ref={titleRef}
          className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-normal uppercase tracking-tight leading-[0.9] text-accent mb-12 cursor-default"
          style={{
            textShadow: '0 0 3px rgba(255,255,255,0.8), 0 0 6px rgba(255,255,255,0.6), -0.5px -0.5px 1px rgba(255,255,255,0.9), 0.5px -0.5px 1px rgba(255,255,255,0.9), -0.5px 0.5px 1px rgba(255,255,255,0.9), 0.5px 0.5px 1px rgba(255,255,255,0.9), 0 -0.5px 1px rgba(255,255,255,0.9), 0 0.5px 1px rgba(255,255,255,0.9), -0.5px 0 1px rgba(255,255,255,0.9), 0.5px 0 1px rgba(255,255,255,0.9)',
            x: springTitleX,
            y: springTitleY,
            rotateX: titleRotateX,
            rotateY: titleRotateY,
            transformStyle: 'preserve-3d',
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          onMouseMove={(e) => handleMouseMove(e, titleRef, titleX, titleY)}
          onMouseLeave={() => handleMouseLeave(titleX, titleY)}
        >
          {t('hero.title')}
        </motion.h1>

        <motion.button
          onClick={scrollToContent}
          className="inline-flex items-center justify-center px-10 py-5 bg-primary/90 text-foreground font-body text-sm uppercase tracking-[0.2em] transition-all duration-300 hover:bg-accent backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('hero.explore')}
        </motion.button>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-foreground/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
