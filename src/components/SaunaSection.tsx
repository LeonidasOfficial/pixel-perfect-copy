import { ScrollReveal } from './ScrollReveal';
import { ParallaxImage } from './ParallaxImage';
import { useLanguage } from '@/hooks/useLanguage';

export function SaunaSection() {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-24 md:py-40 bg-background">
      <div className="section-container">
        {/* Top images row */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <ScrollReveal className="w-full md:w-1/2" delay={0.1}>
            <ParallaxImage
              src="/images/cottage-12.webp"
              alt="Lakeside view"
              className="aspect-[4/3]"
              speed={0.12}
            />
          </ScrollReveal>
          
          <ScrollReveal className="w-full md:w-1/2 md:mt-20" delay={0.2}>
            <ParallaxImage
              src="/images/cottage-13.webp"
              alt="Forest cabin"
              className="aspect-[4/3]"
              speed={0.1}
            />
          </ScrollReveal>
        </div>

        {/* Relax label and heading */}
        <div className="text-center my-16 md:my-24">
          <ScrollReveal zoom>
            <p className="text-sm md:text-base uppercase tracking-[0.3em] text-accent font-medium mb-4">{t('sauna.label')}</p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight text-foreground">
            {t('sauna.heading')}
            </h2>
          </ScrollReveal>
        </div>

        {/* Main sauna image */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <ScrollReveal className="w-full lg:w-[55%]" delay={0.1}>
            <ParallaxImage
              src="/images/sauna-1.webp"
              alt="Sauna with lake view"
              className="aspect-[4/3]"
              speed={0.15}
              imageHeight="95%"
            />
            <p className="font-body text-base md:text-lg leading-relaxed text-foreground/70 mt-6 max-w-md">
            {t('sauna.description1')}
            </p>
          </ScrollReveal>

          <div className="w-full lg:w-[45%] flex flex-col gap-8 lg:mt-24">
            <ScrollReveal delay={0.2}>
              <ParallaxImage
                src="/images/sauna-2.webp"
                alt="Sauna interior"
                className="aspect-[3/2]"
                speed={0.1}
                imageHeight="100%"
              />
            </ScrollReveal>
            
            <div className="flex gap-8">
              <ScrollReveal className="w-1/2" delay={0.3}>
                <ParallaxImage
                  src="/images/sauna-3.webp"
                  alt="Relaxation area"
                  className="aspect-square"
                  speed={0.08}
                  imageHeight="100%"
                />
              </ScrollReveal>
              
              <ScrollReveal className="w-1/2" delay={0.4}>
                <ParallaxImage
                  src="/images/sauna-4.webp"
                  alt="Outdoor shower"
                  className="aspect-square"
                  speed={0.12}
                  imageHeight="100%"
                />
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.3}>
              <p className="font-body text-base md:text-lg leading-relaxed text-foreground/70">
              {t('sauna.description2')}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
