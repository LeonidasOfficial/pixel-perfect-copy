import { useLanguageContext } from '@/contexts/LanguageContext';
import { translations } from '@/locales';

export function useLanguage() {
  const { language, setLanguage, t: contextT } = useLanguageContext();
  
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
  
  return { language, setLanguage, t };
}

