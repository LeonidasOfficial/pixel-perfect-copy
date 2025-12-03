import { HeroSection } from '@/components/HeroSection';
import { IntroSection } from '@/components/IntroSection';
import { SaunaSection } from '@/components/SaunaSection';
import { InteriorSection } from '@/components/InteriorSection';
import { LandscapeSection } from '@/components/LandscapeSection';
import { CTASection } from '@/components/CTASection';
import { AnimatedLine } from '@/components/AnimatedLine';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

const Index = () => {
  return (
    <main className="relative bg-background text-foreground overflow-x-hidden">
      {/* Header */}
      <Header />
      
      {/* Content wrapper with animated line */}
      <div className="relative">
        {/* Animated scroll line - runs behind all content */}
        <AnimatedLine />
        
        {/* Hero Section */}
        <HeroSection />
        
        {/* Main Content */}
        <IntroSection />
        <SaunaSection />
        <InteriorSection />
        <LandscapeSection />
        
        {/* CTA Section */}
        <CTASection />
      </div>
      
      {/* Footer - outside the line wrapper */}
      <Footer />
    </main>
  );
};

export default Index;
