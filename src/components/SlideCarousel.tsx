import React, { useRef } from 'react';
import { GeneratedPage } from '../types/presentation';
import { Check, Loader2, Sparkles } from 'lucide-react';

interface SlideCarouselProps {
  pages: Record<number, GeneratedPage>;
  totalCount: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}

export const SlideCarousel: React.FC<SlideCarouselProps> = ({
  pages,
  totalCount,
  activeIndex,
  onSelect
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Scale ratio: 160 / 1920 = 0.0833333
  const scale = 160 / 1920;

  return (
    <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <span>Live Slide Carousel</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">
            {Object.keys(pages).length}/{totalCount} Ready
          </span>
        </span>
        <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">
          Scaled 160×90 CSS Viewport (scale: 0.083)
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto pb-1 pt-0.5 scrollbar-thin"
      >
        {Array.from({ length: totalCount }).map((_, index) => {
          const page = pages[index];
          const isActive = activeIndex === index;
          const hasHtml = page && page.html;

          return (
            <div
              key={index}
              onClick={() => page && onSelect(index)}
              className={`relative shrink-0 rounded-xl transition-all cursor-pointer group ${
                isActive
                  ? 'ring-2 ring-cyan-400 scale-[1.03] shadow-lg shadow-cyan-500/20'
                  : 'hover:scale-[1.02] opacity-85 hover:opacity-100'
              }`}
            >
              {/* Scaled Thumbnail Frame */}
              <div className="relative w-[160px] h-[90px] rounded-lg overflow-hidden border border-slate-800 bg-slate-900 shadow-sm shrink-0">
                {hasHtml ? (
                  <iframe
                    srcDoc={page.html}
                    title={`Slide Thumbnail ${index + 1}`}
                    className="pointer-events-none border-0 origin-top-left"
                    style={{
                      width: '1920px',
                      height: '1080px',
                      transform: `scale(${scale})`
                    }}
                    sandbox="allow-same-origin"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/80 text-slate-600">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-600 mb-1" />
                    <span className="text-[10px] font-mono font-bold">QUEUED</span>
                  </div>
                )}

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition pointer-events-none" />

                {/* Status Badges */}
                {page && page.status === 'VISION_VERIFIED' && (
                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-[9px] font-bold flex items-center gap-0.5 shadow">
                    <Check className="w-2.5 h-2.5" />
                    <span>Vision</span>
                  </div>
                )}
                {page && page.status === 'DOM_FIXED' && (
                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/80 text-cyan-300 text-[9px] font-bold flex items-center gap-0.5 shadow">
                    <span>DOM</span>
                  </div>
                )}

                {/* Slide Number Badge */}
                <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-slate-950/85 text-[10px] font-mono font-bold text-slate-300 border border-slate-800">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Title preview under thumbnail */}
              <div className="w-[160px] truncate text-[10px] text-slate-400 mt-1 px-0.5 font-medium">
                {page?.title || `Slide ${index + 1}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
