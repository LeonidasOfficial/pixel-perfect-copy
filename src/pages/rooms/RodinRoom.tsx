import { RoomPageLayout } from '@/components/RoomPageLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/locales';

export default function RodinRoom() {
  const { t, language } = useLanguage();
  
  const roomData = {
    title: 'Rodin',
    subtitle: 'La chambre',
    description: t('rooms.rodin.description'),
    features: translations[language].rooms.rodin.features,
    heroImage: '/images/rodin-room-1.webp',
    images: [
      { src: '/images/rodin-room-1.webp', alt: 'Rodin room - bedroom with two beds and nightstands' },
      { src: '/images/rodin-room-2.webp', alt: 'Rodin room - bedroom with antique wardrobe and Persian rug' },
      { src: '/images/rodin-room-3.webp', alt: 'Rodin room - bedroom with seating area and artwork' },
      { src: '/images/rodin-room-4.webp', alt: 'Rodin room - bedroom with internal window and modern furnishings' },
      { src: '/images/rodin-room-5.webp', alt: 'Rodin room - premium linens and towels detail' },
      { src: '/images/rodin-room-6.webp', alt: 'Rodin room - elegant still life with glassware' },
    ],
  };

  return <RoomPageLayout {...roomData} />;
}