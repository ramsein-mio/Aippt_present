import React from 'react';
import {
  Presentation,
  Play,
  Download,
  FileCode,
  Printer,
  Sparkles,
  Layers,
  Settings2,
  CheckCircle2
} from 'lucide-react';
import { VisualSystem } from '../types/presentation';
import { THEME_PRESETS } from '../services/templates';

interface NavbarProps {
  topic: string;
  theme: VisualSystem;
  onThemeChange: (theme: VisualSystem) => void;
  onStartPresentation: () => void;
  onOpenSettings: () => void;
  onOpenDeliveryReport: () => void;
  onDownloadHtmlDeck: () => void;
  onPrintPdf: () => void;
  onExportJson: () => void;
  totalSlides: number;
  isCompleted: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  topic,
  theme,
  onThemeChange,
  onStartPresentation,
  onOpenSettings,
  onOpenDeliveryReport,
  onDownloadHtmlDeck,
  onPrintPdf,
  onExportJson,
  totalSlides,
  isCompleted
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between z-20 shrink-0">
      {/* Brand & Topic */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
          <Presentation className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-white flex items-center gap-1.5 text-base">
              AIPPT <span className="text-cyan-400 font-extrabold">PRESENT</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
              Agentic v2.5
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate max-w-[260px] md:max-w-md font-medium">
            {topic || 'AI Presentation Generator & Self-Healing Engine'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme Picker */}
        <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1">
          {Object.values(THEME_PRESETS).map((t) => (
            <button
              key={t.theme_name}
              onClick={() => onThemeChange(t)}
              title={t.theme_name}
              className={`w-6 h-6 rounded-md transition-all flex items-center justify-center ${
                theme.theme_name === t.theme_name ? 'ring-2 ring-white scale-105' : 'opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: t.primary_bg, border: `1px solid ${t.accent_color}` }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.accent_color }} />
            </button>
          ))}
        </div>

        {/* Configure / New deck */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition"
        >
          <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Parameters</span>
        </button>

        {/* Delivery Report */}
        {isCompleted && (
          <button
            onClick={onOpenDeliveryReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 text-xs font-semibold border border-emerald-800/80 transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">QA Report</span>
          </button>
        )}

        {/* Export dropdown / buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onDownloadHtmlDeck}
            disabled={totalSlides === 0}
            title="Download Standalone HTML Deck"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 text-xs font-semibold border border-slate-800 transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">Download HTML</span>
          </button>

          <button
            onClick={onPrintPdf}
            disabled={totalSlides === 0}
            title="Print / Save to PDF"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 text-xs font-semibold border border-slate-800 transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden lg:inline">PDF</span>
          </button>

          <button
            onClick={onExportJson}
            disabled={totalSlides === 0}
            title="Export PresentationState JSON"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
          >
            <FileCode className="w-4 h-4" />
          </button>
        </div>

        {/* Fullscreen Presentation Play Button */}
        <button
          onClick={onStartPresentation}
          disabled={totalSlides === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition active:scale-95"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Present</span>
        </button>
      </div>
    </header>
  );
};
