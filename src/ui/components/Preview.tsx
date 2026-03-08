/**
 * Preview Component
 * 
 * Responsive iframe preview of screenshots and feature graphics.
 */

import { useState, useEffect, useRef } from 'preact/hooks';

interface PreviewProps {
  url: string | null;
  type: 'screenshot' | 'feature-graphic';
  version: number;
}

export function Preview({ url, type = 'screenshot', version }: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(0.3);

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

  // Refresh iframe when version changes (config was updated)
  useEffect(() => {
    if (iframeRef.current && url) {
      // Force reload by updating src with cache-busting timestamp
      iframeRef.current.src = url + '?v=' + version + '&t=' + Date.now();
    }
  }, [version, url]);

  if (!url) {
    return (
      <div class="text-zinc-500">
        No preview available
      </div>
    );
  }

  const width = type === 'feature-graphic' ? 1024 : 1242;
  const height = type === 'feature-graphic' ? 500 : 2688;

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
        <iframe
          ref={iframeRef}
          src={url + '?v=' + version + '&t=' + Date.now()}
          class="preview-iframe"
          style={{
            width: width + 'px',
            height: height + 'px',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        />
      </div>
    </div>
  );
}
