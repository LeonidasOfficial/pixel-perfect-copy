import { RoomPageLayout } from '@/components/RoomPageLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/locales';

export default function CaraibesRoom() {
  const { t, language } = useLanguage();
  
  const roomData = {
    title: 'Caraïbes',
    subtitle: 'La chambre',
    description: t('rooms.caraibes.description'),
    features: translations[language].rooms.caraibes.features,
    heroImage: '/images/Caraibes1.webp',
    images: [
      { src: '/images/Caraibes2.webp', alt: 'Caraïbes room interior' },
      { src: '/images/Fassade3.webp', alt: 'Caraïbes room exterior' },
      { src: '/images/Impres. Bad 2.webp', alt: 'Caraïbes room bathroom' },
    ],
  };

  return <RoomPageLayout {...roomData} />;
}