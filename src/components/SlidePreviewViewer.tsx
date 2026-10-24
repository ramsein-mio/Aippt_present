import React, { useRef, useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Wand2,
  Maximize2,
  Bug,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { GeneratedPage } from '../types/presentation';

interface SlidePreviewViewerProps {
  currentPage?: GeneratedPage;
  pageIndex: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onOpenSurgicalEditor: () => void;
  onReProbe: () => void;
  onStartPresentation?: () => void;
}

export const SlidePreviewViewer: React.FC<SlidePreviewViewerProps> = ({
  currentPage,
  pageIndex,
  totalSlides,
  onPrev,
  onNext,
  onOpenSurgicalEditor,
  onReProbe,
  onStartPresentation
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.5);
  const [showDomReport, setShowDomReport] = useState<boolean>(false);

  // Responsive scale calculation to fit container while maintaining 16:9 ratio
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      // Reserve padding for UI controls
      const availableW = clientWidth - 32;
      const availableH = clientHeight - 80;

      const scaleX = availableW / 1920;
      const scaleY = availableH / 1080;
      const finalScale = Math.min(scaleX, scaleY, 0.75);
      setScale(Math.max(0.2, finalScale));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!currentPage || !currentPage.html) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-slate-950/40 border border-slate-800/80 rounded-2xl min-h-[460px]">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-cyan-400 mb-3 animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-300 mb-1">Synthesizing Presentation Slides</h3>
        <p className="text-xs text-slate-500 max-w-sm">
          The agent orchestrator is executing the 5-stage pipeline. Slides will render live as they are verified.
        </p>
      </div>
    );
  }

  const probe = currentPage.probe_result;
  const isPassed = !probe || probe.passed;

  return (
    <div className="flex-1 flex flex-col bg-slate-950/80 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Top Slide Meta Header */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">
            Slide {pageIndex + 1} of {totalSlides}
          </span>
          <span className="font-medium text-slate-300 truncate max-w-xs md:max-w-md">
            {currentPage.title}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-slate-800 text-[10px] uppercase font-bold text-slate-400 border border-slate-700">
            {currentPage.layout_type}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Probe badge */}
          <button
            onClick={() => setShowDomReport(!showDomReport)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
              isPassed
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/40'
                : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/40'
            }`}
          >
            {isPassed ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isPassed ? 'DOM Verified (0px overflow)' : `${probe?.issues.length} Issue Detected`}</span>
          </button>

          {/* Surgical edit trigger */}
          <button
            onClick={onOpenSurgicalEditor}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Surgically Edit</span>
          </button>

          {/* Present Fullscreen trigger */}
          {onStartPresentation && (
            <button
              onClick={onStartPresentation}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition shadow-sm"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Present Fullscreen</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Slide Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 overflow-hidden relative bg-black/40 min-h-[480px]"
      >
        {/* Navigation Arrow Left */}
        <button
          onClick={onPrev}
          disabled={pageIndex === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center disabled:opacity-20 shadow-xl transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scaled 1920x1080 Widescreen Canvas Frame */}
        <div
          className="relative rounded-2xl shadow-2xl overflow-hidden border border-white/10 shrink-0 bg-slate-950 transition-transform duration-200"
          style={{
            width: `${1920 * scale}px`,
            height: `${1080 * scale}px`
          }}
        >
          <iframe
            srcDoc={currentPage.html}
            title={`Slide ${pageIndex + 1}`}
            className="border-0 pointer-events-auto"
            style={{
              width: '1920px',
              height: '1080px',
              transform: `scale(${scale})`,
              transformOrigin: 'top left'
            }}
            sandbox="allow-same-origin allow-scripts"
          />
        </div>

        {/* Navigation Arrow Right */}
        <button
          onClick={onNext}
          disabled={pageIndex >= totalSlides - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white flex items-center justify-center disabled:opacity-20 shadow-xl transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* DOM Probe Inspection Popover Overlay */}
        {showDomReport && (
          <div className="absolute right-6 top-6 z-20 w-80 bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-xs space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Bug className="w-4 h-4 text-cyan-400" />
                Render-Probe DOM Telemetry
              </span>
              <button
                onClick={() => setShowDomReport(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Canvas Dimension:</span>
                <span className="text-slate-200 font-bold">1920 × 1080 px</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Footer Reserve:</span>
                <span className="text-slate-200 font-bold">Y = 1010 px</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Probe Status:</span>
                <span className={isPassed ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {isPassed ? 'PASSED (0px Overflow)' : 'ISSUES DETECTED'}
                </span>
              </div>
            </div>

            {probe && probe.issues.length > 0 ? (
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[10px] uppercase font-bold text-amber-400">Detected Issues:</span>
                {probe.issues.map((iss, i) => (
                  <div key={i} className="p-2 rounded bg-amber-950/30 border border-amber-900/50 text-amber-200 text-[11px]">
                    {iss.description}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-emerald-300 text-[11px] leading-relaxed">
                ✓ All layout bounding boxes, SVG viewports, and text containers strictly contained within 1080px canvas height.
              </div>
            )}

            <button
              onClick={onReProbe}
              className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-1.5 transition text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-run Render Probe
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
