import { ScrollReveal } from './ScrollReveal';
import { ParallaxImage } from './ParallaxImage';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

export function InteriorSection() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Images move away from each other on scroll
  // Left images move left, right images move right
  const leftImageX = useTransform(scrollYProgress, [0, 0.5, 1], ['0%', '-6%', '-10%']);
  const rightImageX = useTransform(scrollYProgress, [0, 0.5, 1], ['0%', '6%', '10%']);

  return (
    <section ref={containerRef} className="relative py-24 md:py-40 bg-background">
      <div className="section-container">
        {/* Heading */}
        <div className="text-center mb-16 md:mb-24">
          <ScrollReveal zoom>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight text-foreground mb-6">
              {t('interior.heading')}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="font-body text-base md:text-lg leading-relaxed text-foreground/70 max-w-2xl mx-auto">
              {t('interior.description')}
            </p>
          </ScrollReveal>
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Large image left */}
          <motion.div 
            className="md:row-span-2 relative z-10"
            style={{ x: leftImageX }}
          >
            <ScrollReveal delay={0.1}>
            <ParallaxImage
              src="/images/interior-1.webp"
              alt="Living room interior"
              className="aspect-[3/4] h-full"
              speed={0.12}
              imageHeight="100%"
            />
          </ScrollReveal>
          </motion.div>

          {/* Top right image */}
          <motion.div 
            className="relative z-20"
            style={{ x: rightImageX }}
          >
          <ScrollReveal delay={0.2}>
            <ParallaxImage
              src="/images/interior-2.webp"
              alt="Kitchen area"
              className="aspect-[4/3]"
              speed={0.1}
              imageHeight="100%"
            />
            </ScrollReveal>
            {/* Text with more spacing and proper z-index */}
            <div className="relative z-30 mt-8 md:mt-12 pr-4">
              <p className="font-body text-base md:text-lg leading-relaxed text-foreground/70">
              {t('interior.kitchenNote')}
            </p>
            </div>
          </motion.div>

          {/* Bottom right smaller images */}
          <motion.div 
            className="flex gap-8 md:gap-12 relative z-20"
            style={{ x: rightImageX }}
          >
            <ScrollReveal className="w-1/2" delay={0.3}>
              <ParallaxImage
                src="/images/interior-3.webp"
                alt="Bedroom"
                className="aspect-[3/4]"
                speed={0.08}
                imageHeight="90%"
              />
            </ScrollReveal>
            
            <ScrollReveal className="w-1/2" delay={0.4}>
              <ParallaxImage
                src="/images/interior-4.webp"
                alt="Dining area"
                className="aspect-[3/4]"
                speed={0.1}
              />
            </ScrollReveal>
          </motion.div>
        </div>

        {/* Bathroom section */}
        <div className="mt-16 md:mt-24 flex flex-col md:flex-row gap-8 items-center">
          <ScrollReveal className="w-full md:w-1/2" delay={0.1}>
            <ParallaxImage
              src="/images/interior-5.webp"
              alt="Bathroom with bathtub"
              className="aspect-[4/3]"
              speed={0.12}
              imageHeight="100%"
            />
          </ScrollReveal>
          
          <ScrollReveal className="w-full md:w-1/2" delay={0.2}>
            <p className="font-body text-base md:text-lg leading-relaxed text-foreground/70">
              {t('interior.bathroomNote')}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
