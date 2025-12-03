import { RoomPageLayout } from '@/components/RoomPageLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/locales';

export default function MoulinRougeRoom() {
  const { t, language } = useLanguage();
  
  const roomData = {
    title: 'Moulin Rouge',
    subtitle: 'La chambre',
    description: t('rooms.moulinRouge.description'),
    features: translations[language].rooms.moulinRouge.features,
    heroImage: '/images/Moulin-Rouge-2.webp',
    images: [
      { src: '/images/Moulin-Rouge-2.webp', alt: 'Moulin Rouge room interior' },
      { src: '/images/Moulin-Rouge-3.webp', alt: 'Moulin Rouge room details' },
      { src: '/images/Moulin-Rouge-4.webp', alt: 'Moulin Rouge room bathroom' },
    ],
  };

  return <RoomPageLayout {...roomData} />;
}