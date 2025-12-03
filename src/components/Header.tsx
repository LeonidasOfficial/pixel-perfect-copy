import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '@/hooks/useLanguage';

const rooms = [
  { name: 'La chambre Rodin', path: '/rooms/rodin' },
  { name: 'La chambre Caraïbes', path: '/rooms/caraibes' },
  { name: 'La chambre Délice', path: '/rooms/delice' },
  { name: 'La chambre Moulin Rouge', path: '/rooms/moulin-rouge' },
];

export function Header() {
  const { t } = useLanguage();
  const [isRoomsOpen, setIsRoomsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const opacity = isVisible ? 1 : 0;
  const blur = isVisible ? 0 : 10;

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 transition-all duration-300"
      style={{ 
        opacity,
        filter: `blur(${blur}px)`,
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <nav className="flex items-center justify-between max-w-[1400px] mx-auto">
        {/* Logo */}
        <Link 
          to="/" 
          className="font-heading text-2xl md:text-3xl text-foreground hover:text-accent transition-colors duration-300"
        >
          Maison d'Hôtes
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8 md:gap-12">
          {/* Rooms Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setIsRoomsOpen(true)}
            onMouseLeave={() => setIsRoomsOpen(false)}
          >
            <button 
              className="flex items-center gap-2 font-body text-sm uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors duration-300"
            >
              {t('header.rooms')}
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-300 ${isRoomsOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            <AnimatePresence>
              {isRoomsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 min-w-[240px] bg-card/95 backdrop-blur-md border border-border/50 overflow-hidden"
                >
                  {rooms.map((room, index) => (
                    <Link
                      key={room.path}
                      to={room.path}
                      className="block px-6 py-4 font-body text-sm text-foreground hover:bg-accent/20 hover:text-accent transition-all duration-300 border-b border-border/30 last:border-b-0"
                    >
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {room.name}
                      </motion.span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Information Link */}
          <Link 
            to="/information"
            className="font-body text-sm uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors duration-300"
          >
            {t('header.information')}
          </Link>

          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}