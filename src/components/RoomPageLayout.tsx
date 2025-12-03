import { motion } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { ImageGallery } from './ImageGallery';
import { ScrollReveal } from './ScrollReveal';
import { useLanguage } from '@/hooks/useLanguage';

interface RoomPageLayoutProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  images: { src: string; alt: string }[];
  heroImage: string;
}

export function RoomPageLayout({ 
  title, 
  subtitle, 
  description, 
  features,
  images,
  heroImage 
}: RoomPageLayoutProps) {
  const { t } = useLanguage();
  
  return (
    <main className="relative bg-background text-foreground overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
        
        <div className="relative z-10 section-container pb-16">
          <motion.p
            className="subheading mb-4"
            style={{
              textShadow: '-0.5px -0.5px 0 white, 0.5px -0.5px 0 white, -0.5px 0.5px 0 white, 0.5px 0.5px 0 white, 0 -0.5px 0 white, 0 0.5px 0 white, -0.5px 0 0 white, 0.5px 0 0 white'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
          <motion.h1
            className="heading-xl text-foreground"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {title}
          </motion.h1>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-24 md:py-32">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            <ScrollReveal>
              <p className="body-text text-lg md:text-xl leading-relaxed">
                {description}
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <h3 className="font-heading text-2xl text-foreground mb-6">{t('rooms.amenities')}</h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li 
                    key={index}
                    className="font-body text-muted-foreground flex items-center gap-3"
                  >
                    <span className="w-2 h-2 bg-accent rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="section-container">
          <ScrollReveal>
            <h2 className="heading-md text-foreground mb-12">{t('rooms.gallery')}</h2>
          </ScrollReveal>
          <ImageGallery images={images} />
        </div>
      </section>

      <Footer />
    </main>
  );
}