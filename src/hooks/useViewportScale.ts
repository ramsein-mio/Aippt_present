import { useState, useEffect, RefObject } from 'react';

export interface ViewportScaleResult {
  scale: number;
  containerWidth: number;
  containerHeight: number;
  scaledWidth: number;
  scaledHeight: number;
  isFullscreen: boolean;
  toggleFullscreen: () => Promise<void>;
}

/**
 * Dynamic Viewport Scaler hook for 1920x1080 fixed slide canvases.
 * Computes exact scale factor to fit any desktop, tablet, or mobile window
 * with strict letterbox/pillarbox alignment.
 */
export function useViewportScale(
  containerRef: RefObject<HTMLElement | null>,
  baseWidth = 1920,
  baseHeight = 1080,
  padding = 0
): ViewportScaleResult {
  const [scale, setScale] = useState<number>(0.5);
  const [containerWidth, setContainerWidth] = useState<number>(1920);
  const [containerHeight, setContainerHeight] = useState<number>(1080);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current || document.body;
      const w = Math.max(320, container.clientWidth - padding * 2);
      const h = Math.max(200, container.clientHeight - padding * 2);

      setContainerWidth(w);
      setContainerHeight(h);

      const scaleX = w / baseWidth;
      const scaleY = h / baseHeight;
      const calculatedScale = Math.min(scaleX, scaleY);
      setScale(calculatedScale > 0 ? calculatedScale : 0.5);
    };

    handleResize();

    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => handleResize());
      resizeObserver.observe(containerRef.current);
    }

    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setTimeout(handleResize, 50);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [containerRef, baseWidth, baseHeight, padding]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        const el = containerRef.current || document.documentElement;
        if (el.requestFullscreen) {
          await el.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request could not be fulfilled:', err);
    }
  };

  return {
    scale,
    containerWidth,
    containerHeight,
    scaledWidth: Math.round(baseWidth * scale),
    scaledHeight: Math.round(baseHeight * scale),
    isFullscreen,
    toggleFullscreen
  };
}
