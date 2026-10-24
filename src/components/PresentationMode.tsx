import React, { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import { GeneratedPage } from '../types/presentation';

interface PresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
  pages: Record<number, GeneratedPage>;
  totalCount: number;
  initialIndex?: number;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  isOpen,
  onClose,
  pages,
  totalCount,
  initialIndex = 0
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.8);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.min(totalCount - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, totalCount, onClose]);

  // Viewport scale calculation
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scaleX = w / 1920;
      const scaleY = h / 1080;
      setScale(Math.min(scaleX, scaleY));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentPage = pages[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-6 right-6 z-30 flex items-center justify-between opacity-30 hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-full px-4 py-1.5 text-xs text-slate-300">
          <span className="font-mono font-bold text-cyan-400">
            {String(currentIndex + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
          </span>
          <span className="text-slate-500">•</span>
          <span className="truncate max-w-xs">{currentPage?.title}</span>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center shadow-2xl transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Slide Canvas */}
      <div
        ref={containerRef}
        className="relative bg-black flex items-center justify-center overflow-hidden shadow-2xl"
        style={{
          width: `${1920 * scale}px`,
          height: `${1080 * scale}px`
        }}
      >
        {currentPage && currentPage.html ? (
          <iframe
            srcDoc={currentPage.html}
            title={`Slide ${currentIndex + 1}`}
            className="border-0 pointer-events-none"
            style={{
              width: '1920px',
              height: '1080px',
              transform: `scale(${scale})`,
              transformOrigin: 'top left'
            }}
            sandbox="allow-same-origin"
          />
        ) : (
          <div className="text-slate-600 font-mono text-sm">Slide Loading...</div>
        )}
      </div>

      {/* Floating Navigation Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
        <button
          onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
          disabled={currentIndex === 0}
          className="w-11 h-11 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center disabled:opacity-20 shadow-xl"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentIndex((p) => Math.min(totalCount - 1, p + 1))}
          disabled={currentIndex >= totalCount - 1}
          className="w-11 h-11 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center disabled:opacity-20 shadow-xl"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
