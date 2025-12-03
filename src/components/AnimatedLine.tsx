import { useRef, useEffect, useState } from 'react';

export function AnimatedLine() {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathLengthRef = useRef<number>(0);
  const [pathHeight, setPathHeight] = useState(10000);

  // Get the scroll position where footer starts (where line should complete)
  // Use getBoundingClientRect for accurate position relative to document top
  const getFooterStartPosition = () => {
    // First try to find footer element
    const footer = document.querySelector('footer');
    if (footer) {
      const rect = footer.getBoundingClientRect();
      // Footer's top position relative to document top
      return rect.top + window.scrollY;
    }
    
    // Fallback: try to find content wrapper div and use its bottom
    const contentWrapper = document.querySelector('main > div.relative');
    if (contentWrapper) {
      const rect = contentWrapper.getBoundingClientRect();
      // Content wrapper's bottom position relative to document top
      return rect.bottom + window.scrollY;
    }
    
    // Last resort: use document scroll height
    return document.documentElement.scrollHeight;
  };

  useEffect(() => {
    // Update SVG and path height to match footer start position (not full document height)
    const updateHeight = () => {
      const footerStart = getFooterStartPosition();
      const minHeight = 10000;
      // Path should extend to footer start position, not beyond
      const calculatedHeight = Math.max(minHeight, footerStart);
      
      setPathHeight(calculatedHeight);
      
      if (svgRef.current) {
        svgRef.current.setAttribute('viewBox', `0 0 300 ${calculatedHeight}`);
      }
      
      // Recalculate path length after height update
      if (pathRef.current) {
        // Small delay to ensure DOM is updated
        requestAnimationFrame(() => {
          if (pathRef.current) {
            const length = pathRef.current.getTotalLength();
            if (length > 0) {
              pathLengthRef.current = length;
              pathRef.current.style.strokeDasharray = `${length}`;
              
              // Update position based on current scroll
              const scrollTop = window.scrollY;
              const footerStart = getFooterStartPosition();
              const windowHeight = window.innerHeight;
              
              // Calculate scrollable distance: from top to where footer comes into view
              const scrollableDistance = Math.max(0, footerStart - windowHeight);
              
              // Progress calculation
              const progress = scrollableDistance > 0 
                ? Math.min(Math.max(scrollTop / scrollableDistance, 0), 1) 
                : 0;
              
              // Set initial state: hidden at top (strokeDashoffset = pathLength)
              pathRef.current.style.strokeDashoffset = `${length * (1 - progress)}`;
            }
          }
        });
      }
    };

    // Direct scroll sync - updates immediately without React re-renders
    const handleScroll = () => {
      if (!pathRef.current || pathLengthRef.current === 0) return;

      const scrollTop = window.scrollY;
      const footerStart = getFooterStartPosition();
      const windowHeight = window.innerHeight;
      
      // Calculate scrollable distance: from top to where footer comes into view
      // Footer comes into view when scrollTop = footerStart - windowHeight
      // So scrollable distance = footerStart - windowHeight
      const scrollableDistance = Math.max(0, footerStart - windowHeight);
      
      // Progress calculation:
      // - scrollTop = 0 (at top) -> progress = 0 -> strokeDashoffset = pathLength (line hidden)
      // - scrollTop = scrollableDistance (footer visible) -> progress = 1 -> strokeDashoffset = 0 (line fully drawn)
      // - When scrolling up, scrollTop decreases, progress decreases, strokeDashoffset increases (line hides)
      const progress = scrollableDistance > 0 
        ? Math.min(Math.max(scrollTop / scrollableDistance, 0), 1) 
        : 0;
      
      // Direct DOM update - immediate, no React re-renders, zero lag
      // strokeDashoffset: pathLength (hidden) -> 0 (fully drawn)
      // This works both ways: scrolling down decreases offset (reveals), scrolling up increases offset (hides)
      const strokeDashoffset = pathLengthRef.current * (1 - progress);
      pathRef.current.style.strokeDashoffset = `${strokeDashoffset}`;
    };

    // Initial setup
    updateHeight();
    
    // Initial scroll position update - wait for path to be ready
    const initScroll = () => {
      if (pathRef.current && pathLengthRef.current > 0) {
        handleScroll();
      } else {
        requestAnimationFrame(initScroll);
      }
    };
    requestAnimationFrame(initScroll);
    
    // Listen to scroll events - immediate updates, no throttling
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Update height when content changes (e.g., images load)
    let resizeTimeout: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver(() => {
      // Debounce resize updates to prevent excessive recalculations
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateHeight();
        // Recalculate scroll position after height update
        requestAnimationFrame(() => {
          handleScroll();
        });
      }, 100);
    });
    
    resizeObserver.observe(document.body);
    
    // Also listen for window resize
    const handleResize = () => {
      updateHeight();
      requestAnimationFrame(() => {
        handleScroll();
      });
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Dramatic winding path: middle → left → right → middle with smooth curves
  // Path extends to match footer start position (content height)
  const trailPath = `
    M 150 0
    C 150 100, 50 200, 30 400
    C 10 600, 20 700, 50 900
    C 80 1100, 270 1300, 280 1500
    C 290 1700, 270 1800, 220 2000
    C 170 2200, 50 2400, 30 2600
    C 10 2800, 40 3000, 150 3200
    C 260 3400, 280 3500, 270 3700
    C 260 3900, 150 4100, 50 4300
    C -50 4500, 20 4700, 100 4900
    C 180 5100, 280 5300, 270 5500
    C 260 5700, 150 5900, 80 6100
    C 10 6300, 30 6500, 120 6700
    C 210 6900, 270 7100, 250 7300
    C 230 7500, 100 7700, 50 7900
    C 0 8100, 50 8300, 150 8500
    C 250 8700, 280 8900, 250 9100
    C 220 9300, 100 9500, 150 9700
    L 150 ${pathHeight}
  `;

  return (
    <svg
      ref={svgRef}
      className="fixed left-0 top-0 w-[300px] pointer-events-none z-10"
      style={{ height: '100%' }}
      viewBox={`0 0 300 ${pathHeight}`}
      preserveAspectRatio="xMidYMin slice"
    >
      <path
        ref={pathRef}
        d={trailPath}
        fill="none"
        stroke="hsl(var(--accent))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: pathLengthRef.current || 0,
          strokeDashoffset: pathLengthRef.current || 0,
          filter: 'drop-shadow(0 0 8px hsl(var(--accent) / 0.5))',
          transition: 'none',
          willChange: 'stroke-dashoffset'
        }}
      />
    </svg>
  );
}
