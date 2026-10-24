import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Grid,
  Printer,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';
import { GeneratedPage } from '../types/presentation';
import { useViewportScale } from '../hooks/useViewportScale';

interface PresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
  pages: Record<number, GeneratedPage>;
  totalCount: number;
  initialIndex?: number;
  onExportPdf?: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  isOpen,
  onClose,
  pages,
  totalCount,
  initialIndex = 0,
  onExportPdf
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isGridOpen, setIsGridOpen] = useState(false);
  const [showHud, setShowHud] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const hudTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);

  const { scale, isFullscreen, toggleFullscreen } = useViewportScale(containerRef, 1920, 1080);

  // Sync initialIndex
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  // Auto-hiding HUD timer (2.5 seconds of mouse inactivity)
  const resetHudTimer = useCallback(() => {
    setShowHud(true);
    if (hudTimerRef.current) {
      clearTimeout(hudTimerRef.current);
    }
    hudTimerRef.current = setTimeout(() => {
      setShowHud(false);
    }, 2500);
  }, []);

  const handleMouseMove = useCallback(() => {
    resetHudTimer();
  }, [resetHudTimer]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      resetHudTimer();

      if (isGridOpen) {
        if (e.key === 'Escape' || e.key === 'g' || e.key === 'G') {
          e.preventDefault();
          setIsGridOpen(false);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          setCurrentIndex((prev) => Math.min(totalCount - 1, prev + 1));
          break;
        case 'ArrowLeft':
        case 'Backspace':
        case 'PageUp':
          e.preventDefault();
          setCurrentIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'Home':
          e.preventDefault();
          setCurrentIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setCurrentIndex(totalCount - 1);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'g':
        case 'G':
          e.preventDefault();
          setIsGridOpen(true);
          break;
        case 'Escape':
          e.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isGridOpen, totalCount, onClose, toggleFullscreen, resetHudTimer]);

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    touchStartXRef.current = null;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left -> next
        setCurrentIndex((p) => Math.min(totalCount - 1, p + 1));
      } else {
        // Swipe right -> prev
        setCurrentIndex((p) => Math.max(0, p - 1));
      }
    }
  };

  if (!isOpen) return null;

  // Active buffer: preload current - 1, current, current + 1
  const bufferedIndices = [currentIndex - 1, currentIndex, currentIndex + 1].filter(
    (i) => i >= 0 && i < totalCount
  );

  const progressPercent = totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;
  const currentPage = pages[currentIndex];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
    >
      {/* Zero-Flicker Preloaded Iframe Stage */}
      <div
        className="relative bg-black flex items-center justify-center overflow-hidden shadow-2xl"
        style={{
          width: `${1920 * scale}px`,
          height: `${1080 * scale}px`
        }}
      >
        {bufferedIndices.map((slideIndex) => {
          const page = pages[slideIndex];
          const isCurrent = slideIndex === currentIndex;
          if (!page || !page.html) return null;

          return (
            <div
              key={slideIndex}
              className={`absolute inset-0 transition-opacity duration-150 ${
                isCurrent ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <iframe
                srcDoc={page.html}
                title={`Presentation Slide ${slideIndex + 1}`}
                className="border-0 pointer-events-none origin-top-left"
                style={{
                  width: '1920px',
                  height: '1080px',
                  transform: `scale(${scale})`
                }}
                sandbox="allow-same-origin"
              />
            </div>
          );
        })}
      </div>

      {/* Progress Bar (at the very bottom edge of screen) */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-slate-900 z-40">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Auto-Hiding Floating HUD Bar */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
          showHud ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl text-slate-300">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
            disabled={currentIndex === 0}
            title="Previous Slide (ArrowLeft)"
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Slide Counter */}
          <div className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono font-bold text-cyan-400">
            {String(currentIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentIndex((p) => Math.min(totalCount - 1, p + 1))}
            disabled={currentIndex >= totalCount - 1}
            title="Next Slide (ArrowRight / Space)"
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Grid Overview Button (G) */}
          <button
            onClick={() => setIsGridOpen(true)}
            title="Grid Overview (G)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition"
          >
            <Grid className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Grid (G)</span>
          </button>

          {/* PDF Export Button */}
          {onExportPdf && (
            <button
              onClick={onExportPdf}
              title="Print / Save to PDF"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          )}

          {/* Fullscreen Toggle (F) */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen (F)"
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close / Exit (Esc) */}
          <button
            onClick={onClose}
            title="Exit Presentation (Esc)"
            className="p-2 rounded-xl hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Grid Overview Overlay (G key) */}
      {isGridOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col p-6 animate-in fade-in duration-200 overflow-hidden">
          {/* Top Bar in Grid View */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Grid className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  Slide Grid Overview
                  <span className="text-[10px] bg-slate-800 text-cyan-300 px-2 py-0.5 rounded font-mono">
                    {totalCount} Slides
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Click any slide to jump directly into presentation mode
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsGridOpen(false)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Responsive CSS Grid of All N Slides */}
          <div className="flex-1 overflow-y-auto py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: totalCount }).map((_, idx) => {
              const p = pages[idx];
              const isSelected = idx === currentIndex;
              const thumbScale = 220 / 1920;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsGridOpen(false);
                  }}
                  className={`relative p-2 rounded-2xl border transition-all cursor-pointer group flex flex-col ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/50 shadow-xl shadow-cyan-500/20'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  {/* Thumbnail Scaled Iframe Frame */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-2">
                    {p && p.html ? (
                      <iframe
                        srcDoc={p.html}
                        title={`Grid Thumb ${idx + 1}`}
                        className="pointer-events-none border-0 origin-top-left"
                        style={{
                          width: '1920px',
                          height: '1080px',
                          transform: `scale(${thumbScale})`
                        }}
                        sandbox="allow-same-origin"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs">
                        Loading...
                      </div>
                    )}

                    {/* Active Check Icon */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Slide Info */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-cyan-400">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] font-medium text-slate-300 truncate max-w-[140px]">
                      {p?.title || `Slide ${idx + 1}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
