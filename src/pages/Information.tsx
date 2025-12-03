import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { MapPin, Phone, Mail, Clock, Car } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookingCalendar } from '@/components/BookingCalendar';
import { useLanguage } from '@/hooks/useLanguage';

interface HoverImageProps {
  src: string;
  alt: string;
}

function HoverImage({ src, alt }: HoverImageProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        animate={{
          scale: isHovered ? 1.08 : 1,
        }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute inset-0 bg-accent/10"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export default function Information() {
  const { t } = useLanguage();
  const [isAroundHouseOpen, setIsAroundHouseOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

  const infoItems = [
    {
      icon: MapPin,
      title: t('information.location'),
      content: t('information.locationContent'),
    },
    {
      icon: Phone,
      title: t('information.phone'),
      content: t('information.phoneContent'),
    },
    {
      icon: Mail,
      title: t('information.email'),
      content: t('information.emailContent'),
    },
    {
      icon: Clock,
      title: t('information.checkInOut'),
      content: t('information.checkInOutContent'),
    },
    {
      icon: Car,
      title: t('information.parking'),
      content: t('information.parkingContent'),
    },
  ];

  return (
    <main className="relative bg-background text-foreground overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg.webp"
            alt="Maison d'Hôtes"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        
        <div className="relative z-10 section-container pb-16">
          <motion.p
            className="subheading mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t('information.heroSubtitle')}
          </motion.p>
          <motion.h1
            className="heading-xl text-foreground"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {t('information.heroTitle')}
          </motion.h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 md:py-32">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24">
            {/* Left: Info Cards */}
            <div className="space-y-16">
              <ScrollReveal>
                <h2 className="heading-md text-foreground mb-8">{t('information.aboutHeading')}</h2>
                <p className="body-text mb-6">
                  {t('information.aboutDescription')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => setIsAroundHouseOpen(true)}
                    variant="outline"
                    className="mt-4 border-accent/50 hover:bg-accent/10 hover:border-accent transition-all duration-300"
                  >
                    {t('information.aroundHouseButton')}
                  </Button>
                  <Button
                    onClick={() => setIsAvailabilityOpen(true)}
                    variant="outline"
                    className="mt-4 border-accent/50 hover:bg-accent/10 hover:border-accent transition-all duration-300"
                  >
                    {t('information.availabilityButton')}
                  </Button>
                </div>
              </ScrollReveal>

              <div className="grid sm:grid-cols-2 gap-8">
                {infoItems.map((item, index) => (
                  <ScrollReveal key={item.title} delay={index * 0.1}>
                    <motion.div
                      className="p-6 bg-card/50 border border-border/30 hover:border-accent/50 transition-all duration-300"
                      whileHover={{ y: -4 }}
                    >
                      <item.icon className="w-6 h-6 text-accent mb-4" />
                      <h3 className="font-heading text-lg text-foreground mb-2">{item.title}</h3>
                      <p className="font-body text-sm text-muted-foreground">{item.content}</p>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            {/* Right: Images with hover effect */}
            <div className="space-y-8">
              <ScrollReveal direction="right">
                <div className="aspect-[4/3]">
                  <HoverImage 
                    src="/images/Haus2.webp" 
                    alt="Guest house exterior" 
                  />
                </div>
              </ScrollReveal>
              
              <ScrollReveal direction="right" delay={0.2}>
                <div className="aspect-[4/3]">
                  <HoverImage 
                    src="/images/Luftaufnahme-4.webp" 
                    alt="Wellness area" 
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Policies Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="section-container">
          <ScrollReveal>
            <h2 className="heading-md text-foreground mb-12">{t('information.policiesHeading')}</h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-12">
            <ScrollReveal delay={0.1}>
              <h3 className="font-heading text-xl text-foreground mb-4">{t('information.cancellationPolicy')}</h3>
              <p className="body-text text-sm">
                {t('information.cancellationContent')}
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <h3 className="font-heading text-xl text-foreground mb-4">{t('information.childrenPets')}</h3>
              <p className="body-text text-sm">
                {t('information.childrenPetsContent')}
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={0.3}>
              <h3 className="font-heading text-xl text-foreground mb-4">{t('information.specialRequests')}</h3>
              <p className="body-text text-sm">
                {t('information.specialRequestsContent')}
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Around The House Modal */}
      <Dialog open={isAroundHouseOpen} onOpenChange={setIsAroundHouseOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border/50">
          <DialogHeader>
            <DialogTitle className="text-3xl md:text-4xl font-heading text-foreground mb-2">
              {t('information.aroundHouseTitle')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t('information.aroundHouseDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 mt-6">
            {/* Local Essentials Section */}
            <section>
              <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-6">{t('information.localEssentials')}</h3>
              <p className="body-text mb-6">
                {t('information.localEssentialsDescription')}
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                  <h4 className="font-heading text-lg text-foreground mb-2">{t('information.cafeBar')}</h4>
                  <p className="body-text text-sm">
                    {t('information.cafeBarDescription')}
                  </p>
                </div>

                <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                  <h4 className="font-heading text-lg text-foreground mb-2">{t('information.restaurants')}</h4>
                  <div className="space-y-3 mt-2">
                    <div>
                      <p className="font-semibold text-foreground">{t('information.restaurant1')}</p>
                      <p className="body-text text-sm">{t('information.restaurant1Description')}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{t('information.restaurant2')}</p>
                      <p className="body-text text-sm">{t('information.restaurant2Description')}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                  <h4 className="font-heading text-lg text-foreground mb-2">{t('information.superette')}</h4>
                  <p className="body-text text-sm">{t('information.superetteDescription')}</p>
                </div>

                <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                  <h4 className="font-heading text-lg text-foreground mb-2">{t('information.boulangerie')}</h4>
                  <p className="body-text text-sm">{t('information.boulangerieDescription')}</p>
                </div>

                <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                  <h4 className="font-heading text-lg text-foreground mb-2">{t('information.boucherie')}</h4>
                  <p className="body-text text-sm">{t('information.boucherieDescription')}</p>
                </div>

                <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                  <h4 className="font-heading text-lg text-foreground mb-2">{t('information.pharmacie')}</h4>
                  <p className="body-text text-sm">{t('information.pharmacieDescription')}</p>
                </div>

                <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                  <h4 className="font-heading text-lg text-foreground mb-2">{t('information.centreMedical')}</h4>
                  <p className="body-text text-sm">{t('information.centreMedicalDescription')}</p>
                </div>

                <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                  <h4 className="font-heading text-lg text-foreground mb-2">{t('information.tennis')}</h4>
                  <p className="body-text text-sm">{t('information.tennisDescription')}</p>
                </div>

                <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                  <h4 className="font-heading text-lg text-foreground mb-2">{t('information.boules')}</h4>
                  <p className="body-text text-sm">{t('information.boulesDescription')}</p>
                </div>
              </div>
            </section>

            {/* Activities Section */}
            <section>
              <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-6">{t('information.activitiesHeading')}</h3>
              <p className="body-text mb-6">
                {t('information.activitiesDescription')}
              </p>

              <div className="space-y-6">
                <div>
                  <h4 className="font-heading text-xl text-foreground mb-4">{t('information.cyclingHiking')}</h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                      <p className="font-semibold text-foreground mb-2">{t('information.randonnees')}</p>
                      <p className="body-text text-sm">{t('information.randonneesDescription')}</p>
                    </div>
                    <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                      <p className="font-semibold text-foreground mb-2">{t('information.ebikeTours')}</p>
                      <p className="body-text text-sm">{t('information.ebikeToursDescription')}</p>
                    </div>
                    <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                      <p className="font-semibold text-foreground mb-2">{t('information.mountainBiking')}</p>
                      <p className="body-text text-sm">{t('information.mountainBikingDescription')}</p>
                    </div>
                    <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                      <p className="font-semibold text-foreground mb-2">{t('information.vignobleTrail')}</p>
                      <p className="body-text text-sm">{t('information.vignobleTrailDescription')}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-heading text-xl text-foreground mb-4">{t('information.equestrianSports')}</h4>
                  <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                    <p className="font-semibold text-foreground mb-2">{t('information.equitation')}</p>
                    <p className="body-text text-sm">{t('information.equitationDescription')}</p>
                  </div>
                  <div className="p-4 bg-card/50 border border-border/30 rounded-lg mt-3">
                    <p className="font-semibold text-foreground mb-2">{t('information.tennisPetanque')}</p>
                    <p className="body-text text-sm">{t('information.tennisPetanqueDescription')}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-heading text-xl text-foreground mb-4">{t('information.waterSports')}</h4>
                  <p className="body-text text-sm mb-3">{t('information.waterSportsDescription')}</p>
                  <div className="space-y-2">
                    <p className="body-text text-sm"><span className="font-semibold">{t('information.voile')}</span> {t('information.voileDescription')}</p>
                    <p className="body-text text-sm"><span className="font-semibold">{t('information.plancheVoile')}</span> {t('information.plancheVoileDescription')}</p>
                    <p className="body-text text-sm"><span className="font-semibold">{t('information.standUpPaddle')}</span> {t('information.standUpPaddleDescription')}</p>
                    <p className="body-text text-sm"><span className="font-semibold">{t('information.canoeKayak')}</span> {t('information.canoeKayakDescription')}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-heading text-xl text-foreground mb-4">{t('information.wineCulture')}</h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                      <p className="font-semibold text-foreground mb-2">{t('information.degustation')}</p>
                      <p className="body-text text-sm">{t('information.degustationDescription')}</p>
                    </div>
                    <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                      <p className="font-semibold text-foreground mb-2">{t('information.excursions')}</p>
                      <p className="body-text text-sm">{t('information.excursionsDescription')}</p>
                    </div>
                    <div className="p-4 bg-card/50 border border-border/30 rounded-lg">
                      <p className="font-semibold text-foreground mb-2">{t('information.theatre')}</p>
                      <p className="body-text text-sm">{t('information.theatreDescription')}</p>
                    </div>
                  </div>
                  <p className="body-text text-sm mt-4 italic">
                    {t('information.tripatNote')}
                  </p>
                </div>
              </div>
            </section>

            {/* Must-See Attractions Section */}
            <section>
              <h3 className="font-heading text-2xl md:text-3xl text-foreground mb-6">{t('information.attractionsHeading')}</h3>
              <p className="body-text mb-6">
                {t('information.attractionsDescription')}
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left p-3 font-heading text-foreground">{t('information.destination')}</th>
                      <th className="text-left p-3 font-heading text-foreground">{t('information.highlights')}</th>
                      <th className="text-left p-3 font-heading text-foreground">{t('information.distanceTime')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    <tr>
                      <td className="p-3 font-semibold text-foreground">{t('information.pezenas')}</td>
                      <td className="p-3 body-text text-sm">{t('information.pezenasDescription')}</td>
                      <td className="p-3 body-text text-sm">{t('information.pezenasDistance')}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-foreground">{t('information.beziers')}</td>
                      <td className="p-3 body-text text-sm">{t('information.beziersDescription')}</td>
                      <td className="p-3 body-text text-sm">{t('information.beziersDistance')}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-foreground">{t('information.montpellier')}</td>
                      <td className="p-3 body-text text-sm">{t('information.montpellierDescription')}</td>
                      <td className="p-3 body-text text-sm">{t('information.montpellierDistance')}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-foreground">{t('information.carcassonne')}</td>
                      <td className="p-3 body-text text-sm">{t('information.carcassonneDescription')}</td>
                      <td className="p-3 body-text text-sm">{t('information.carcassonneDistance')}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-foreground">{t('information.nimes')}</td>
                      <td className="p-3 body-text text-sm">{t('information.nimesDescription')}</td>
                      <td className="p-3 body-text text-sm">{t('information.nimesDistance')}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-foreground">{t('information.capAgde')}</td>
                      <td className="p-3 body-text text-sm">{t('information.capAgdeDescription')}</td>
                      <td className="p-3 body-text text-sm">{t('information.capAgdeDistance')}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-foreground">{t('information.sete')}</td>
                      <td className="p-3 body-text text-sm">{t('information.seteDescription')}</td>
                      <td className="p-3 body-text text-sm">{t('information.seteDistance')}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-foreground">{t('information.marseillan')}</td>
                      <td className="p-3 body-text text-sm">{t('information.marseillanDescription')}</td>
                      <td className="p-3 body-text text-sm">{t('information.marseillanDistance')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="body-text text-sm mt-6">
                {t('information.attractionsNote')}
              </p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Availability Modal */}
      <Dialog open={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background border-border/50">
          <DialogHeader className="text-center">
            <DialogTitle className="text-3xl md:text-4xl font-heading text-foreground mb-2">
              {t('information.availabilityTitle')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t('information.availabilityDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8">
            <BookingCalendar
              startDate={new Date('2026-06-15')}
              endDate={new Date('2026-09-15')}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </main>
  );
}