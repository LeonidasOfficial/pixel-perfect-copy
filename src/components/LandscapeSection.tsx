import { ScrollReveal } from './ScrollReveal';
import { useLanguage } from '@/hooks/useLanguage';

export function LandscapeSection() {
  const { t } = useLanguage();
  
  return (
    <section className="relative py-24 md:py-40 bg-background">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal zoom>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-tight text-foreground mb-8">
              {t('landscape.heading')}
            </h2>
          </ScrollReveal>
          
          <ScrollReveal delay={0.2}>
            <p className="font-body text-base md:text-lg leading-relaxed text-foreground/70">
              {t('landscape.description')}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
