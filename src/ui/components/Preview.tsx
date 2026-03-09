/**
 * Preview Component
 * 
 * Responsive iframe preview of screenshots and feature graphics.
 * Uses a dissolve technique to eliminate flickering on updates:
 * - Old frame stays fully visible (no fade out)
 * - New frame fades in on top
 * - Creates a smooth layered dissolve effect
 */

import { useState, useEffect, useRef, useCallback } from 'preact/hooks';

interface PreviewProps {
  url: string | null;
  type: 'screenshot' | 'feature-graphic';
  version: number;
}

// Smooth easing curve for natural feel
const TRANSITION = 'opacity 280ms cubic-bezier(0.4, 0, 0.2, 1)';

export function Preview({ url, type = 'screenshot', version }: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  
  // Dissolve state: track which iframe (A or B) is on top
  const [activeFrame, setActiveFrame] = useState<'A' | 'B'>('A');
  const [srcA, setSrcA] = useState<string | null>(null);
  const [srcB, setSrcB] = useState<string | null>(null);
  const [pendingFrame, setPendingFrame] = useState<'A' | 'B' | null>(null);
  const [showPending, setShowPending] = useState(false);
  
  // Track the current URL+version to detect changes
  const currentSrcRef = useRef<string | null>(null);

  // Calculate scale to fit container - use ResizeObserver for responsive updates
  useEffect(() => {
    if (!containerRef.current || !url) return;

    const calculateScale = () => {
      const container = containerRef.current;
      if (!container) return;

      // Get container dimensions
      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width - 40;
      const containerHeight = rect.height - 40;

      // Skip if container has no size yet
      if (containerWidth <= 0 || containerHeight <= 0) return;

      let contentWidth: number, contentHeight: number;
      if (type === 'feature-graphic') {
        contentWidth = 1024;
        contentHeight = 500;
      } else {
        contentWidth = 1242;
        contentHeight = 2688;
      }

      const scaleX = containerWidth / contentWidth;
      const scaleY = containerHeight / contentHeight;
      // Use whichever scale fits, no arbitrary cap
      const newScale = Math.min(scaleX, scaleY);
      setScale(Math.max(0.1, newScale)); // Ensure minimum visibility
    };

    // Calculate immediately and also after a short delay for layout settling
    calculateScale();
    const timeout = setTimeout(calculateScale, 100);

    // Recalculate on resize
    const observer = new ResizeObserver(calculateScale);
    observer.observe(containerRef.current);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [url, type]);

  // Handle URL/version changes - load into inactive frame
  useEffect(() => {
    if (!url) return;
    
    const newSrc = url + '?v=' + version + '&t=' + Date.now();
    
    // Initial load - just set the active frame
    if (currentSrcRef.current === null) {
      currentSrcRef.current = newSrc;
      if (activeFrame === 'A') {
        setSrcA(newSrc);
      } else {
        setSrcB(newSrc);
      }
      return;
    }
    
    // Subsequent updates - load into the inactive frame
    currentSrcRef.current = newSrc;
    const nextFrame = activeFrame === 'A' ? 'B' : 'A';
    setPendingFrame(nextFrame);
    setShowPending(false); // Start hidden
    
    if (nextFrame === 'A') {
      setSrcA(newSrc);
    } else {
      setSrcB(newSrc);
    }
  }, [version, url]);

  // Handle iframe load complete - fade in the new frame
  const handleFrameLoad = useCallback((frame: 'A' | 'B') => {
    if (pendingFrame === frame) {
      // Small delay to ensure the iframe content is painted
      requestAnimationFrame(() => {
        setShowPending(true); // Trigger fade-in
        // After transition completes, make this the active frame
        setTimeout(() => {
          setActiveFrame(frame);
          setPendingFrame(null);
          setShowPending(false);
        }, 300);
      });
    }
  }, [pendingFrame]);

  if (!url) {
    return (
      <div class="text-zinc-500">
        No preview available
      </div>
    );
  }

  const width = type === 'feature-graphic' ? 1024 : 1242;
  const height = type === 'feature-graphic' ? 500 : 2688;

  const iframeBaseStyle = {
    width: width + 'px',
    height: height + 'px',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  };

  // Determine visibility: active frame always visible, pending frame fades in
  const getFrameStyle = (frame: 'A' | 'B') => {
    const isActive = activeFrame === frame;
    const isPending = pendingFrame === frame;
    
    // Active frame: always fully visible at bottom
    if (isActive) {
      return {
        ...iframeBaseStyle,
        opacity: 1,
        zIndex: 1,
        pointerEvents: 'auto' as const,
      };
    }
    
    // Pending frame: fades in on top
    if (isPending) {
      return {
        ...iframeBaseStyle,
        opacity: showPending ? 1 : 0,
        zIndex: 2,
        transition: TRANSITION,
        pointerEvents: 'none' as const,
      };
    }
    
    // Inactive frame: hidden
    return {
      ...iframeBaseStyle,
      opacity: 0,
      zIndex: 0,
      pointerEvents: 'none' as const,
    };
  };

  return (
    <div
      ref={containerRef}
      class="w-full h-full flex items-center justify-center"
    >
      <div
        class="relative bg-black rounded-lg overflow-hidden shadow-2xl"
        style={{
          width: width * scale + 'px',
          height: height * scale + 'px',
        }}
      >
        {/* Frame A */}
        {srcA && (
          <iframe
            src={srcA}
            onLoad={() => handleFrameLoad('A')}
            class="preview-iframe absolute inset-0"
            style={getFrameStyle('A')}
          />
        )}
        
        {/* Frame B */}
        {srcB && (
          <iframe
            src={srcB}
            onLoad={() => handleFrameLoad('B')}
            class="preview-iframe absolute inset-0"
            style={getFrameStyle('B')}
          />
        )}
      </div>
    </div>
  );
}
