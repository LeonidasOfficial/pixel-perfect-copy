import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  imageHeight?: string;
}

export function ParallaxImage({ src, alt, className = '', speed = 0.2, imageHeight = '130%' }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax movement
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [speed * -150, 0, speed * 100]);
  
  // Scale effect - starts zoomed out, scales to normal when in view
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.5, 1], [1.15, 1.05, 1, 1]);
  
  // Subtle rotation for dynamic feel
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [speed * -2, 0, speed * 1]);

  return (
    <div ref={ref} className={`overflow-hidden relative z-30 ${className}`}>
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      <motion.img
        src={src}
        alt={alt}
        className={`w-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          height: imageHeight,
          y, 
          scale,
          rotate
        }}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
      />
    </div>
  );
}
