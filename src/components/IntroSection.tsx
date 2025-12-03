import { ScrollReveal } from './ScrollReveal';
import { ParallaxImage } from './ParallaxImage';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

export function IntroSection() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Images move away from each other on scroll
  // Left image moves left, right image moves right
  const leftImageX = useTransform(scrollYProgress, [0, 0.5, 1], ['0%', '-8%', '-12%']);
  const rightImageX = useTransform(scrollYProgress, [0, 0.5, 1], ['0%', '8%', '12%']);

  return (
    <section id="content-start" ref={containerRef} className="relative py-24 md:py-40 bg-background">
      <div className="section-container">
        {/* Two images that move apart on scroll */}
        <div className="relative flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4 mb-24 md:mb-40">
          <motion.div 
            className="w-full md:w-[45%] z-10"
            style={{ x: leftImageX }}
          >
            <ScrollReveal delay={0.1}>
            <ParallaxImage
              src="/images/orange.webp"
              alt="Cozy cottage in winter forest"
              className="aspect-[4/5]"
              speed={0.15}
            />
          </ScrollReveal>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-[55%] md:mt-32 z-20"
            style={{ x: rightImageX }}
          >
            <ScrollReveal delay={0.3}>
            <ParallaxImage
              src="/images/Fassade.webp"
              alt="Cottage by the lake with mountains"
              className="aspect-[4/3]"
              speed={0.1}
            />
          </ScrollReveal>
          </motion.div>
        </div>

        {/* Text content */}
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal zoom>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight text-foreground mb-8">
              {t('intro.heading')}
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <p className="font-body text-base md:text-lg leading-relaxed text-foreground/70">
              {t('intro.description')}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
