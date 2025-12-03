import { useState, useEffect, RefObject } from 'react';

export function useScrollProgress(ref?: RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect();
        const elementHeight = ref.current.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calculate progress based on element position
        const start = windowHeight;
        const end = -elementHeight;
        const current = rect.top;
        
        const progress = Math.min(Math.max((start - current) / (start - end), 0), 1);
        setProgress(progress);
      } else {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(scrollTop / docHeight, 1);
        setProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref]);

  return progress;
}
