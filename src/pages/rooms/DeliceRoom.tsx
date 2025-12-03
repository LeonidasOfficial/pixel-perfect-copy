import { RoomPageLayout } from '@/components/RoomPageLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { translations } from '@/locales';

export default function DeliceRoom() {
  const { t, language } = useLanguage();
  
  const roomData = {
    title: 'Délice',
    subtitle: 'La chambre',
    description: t('rooms.delice.description'),
    features: translations[language].rooms.delice.features,
    heroImage: '/images/Delice.webp',
    images: [
      { src: '/images/Delice.webp', alt: 'Délice room interior' },
      { src: '/images/Delice2.webp', alt: 'Délice room details' },
      { src: '/images/Delice-3.webp', alt: 'Délice room bathroom' },
    ],
  };

  return <RoomPageLayout {...roomData} />;
}