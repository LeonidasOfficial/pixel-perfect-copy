import { useLanguage } from '@/hooks/useLanguage';

export function Footer() {
  const { t } = useLanguage();
  
  return (
    <footer className="relative z-20 py-12 bg-background border-t border-border/20">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-heading text-xl text-foreground mb-2">La Maison Du Lavoir Vert</p>
            <p className="font-body text-sm text-foreground/50">{t('footer.tagline')}</p>
          </div>
          
          <div className="flex gap-8">
            <a href="#" className="font-body text-sm text-foreground/70 hover:text-accent transition-colors">
              {t('footer.privacy')}
            </a>
            <a href="#" className="font-body text-sm text-foreground/70 hover:text-accent transition-colors">
              {t('footer.terms')}
            </a>
            <a href="#" className="font-body text-sm text-foreground/70 hover:text-accent transition-colors">
              {t('footer.contact')}
            </a>
          </div>
          
          <p className="font-body text-sm text-foreground/40">
            © {new Date().getFullYear()} {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
