import { en } from './en';
import { fr } from './fr';
import { de } from './de';
import { Language } from '@/contexts/LanguageContext';

export const translations: Record<Language, typeof en> = {
  en,
  fr,
  de,
};

